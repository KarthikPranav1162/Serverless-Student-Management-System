import json
import os
import pymysql
import bcrypt
import jwt
import secrets
import datetime

DB_HOST = os.environ['DB_HOST']
DB_USER = os.environ['DB_USER']
DB_PASS = os.environ['DB_PASS']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']


def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )


def response(body, status=200):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": json.dumps(body, default=str)
    }


def lambda_handler(event, context):

    print("=" * 60)
    print("Student Auth Lambda Invoked")

    method = event["requestContext"]["http"]["method"]
    path = event["rawPath"]

    print(f"Method : {method}")
    print(f"Path   : {path}")

    raise Exception("Testing CloudWatch Alarm")

    if method == "OPTIONS":
        print("OPTIONS request")
        return response({"message": "ok"})

    # =========================
    # SIGNUP
    # =========================

    if path == "/auth/signup" and method == "POST":

        print("Signup request received")

        body = json.loads(event["body"])

        name = body.get("name")
        email = body.get("email")
        username = body.get("username")
        password = body.get("password")

        print(f"Signup email: {email}")

        if not all([name, email, username, password]):
            print("Signup failed - Missing required fields")
            return response({"message": "All fields required"}, 400)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM admins WHERE email=%s OR username=%s",
            (email, username)
        )

        if cursor.fetchone():
            conn.close()
            print("Signup failed - Email or username already exists")
            return response(
                {"message": "Email or username already exists"},
                409
            )

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO admins
            (full_name,email,username,password)
            VALUES (%s,%s,%s,%s)
            """,
            (name, email, username, hashed_password)
        )

        conn.commit()
        conn.close()

        print(f"Signup successful for {email}")

        return response({
            "message": "Account created successfully"
        })

    # =========================
    # LOGIN
    # =========================

    if path == "/auth/login" and method == "POST":

        print("Login request received")

        body = json.loads(event["body"])

        email_or_user = body.get(
            "emailOrUsername", ""
        ).strip().lower()

        password = body.get("password", "")

        print(f"Login user: {email_or_user}")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id,full_name,email,username,password
            FROM admins
            WHERE email=%s OR username=%s
            """,
            (email_or_user, email_or_user)
        )

        row = cursor.fetchone()
        conn.close()

        if not row:
            print("Login failed - User not found")
            return response(
                {"message": "Invalid credentials"},
                401
            )

        admin_id, full_name, email, username, stored_hash = row

        if not bcrypt.checkpw(
            password.encode("utf-8"),
            stored_hash.encode("utf-8")
        ):
            print(f"Login failed - Wrong password for {email}")
            return response(
                {"message": "Invalid credentials"},
                401
            )

        token = jwt.encode(
            {
                "id": admin_id,
                "username": username,
                "email": email,
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(hours=8)
            },
            JWT_SECRET,
            algorithm="HS256"
        )

        print(f"Login successful for {email}")

        return response({
            "token": token,
            "name": full_name,
            "email": email
        })

    # =========================
    # FORGOT PASSWORD
    # =========================

    if path == "/auth/forgot-password" and method == "POST":

        print("Forgot password request")

        body = json.loads(event["body"])
        email = body.get("email")

        print(f"Reset requested for {email}")

        conn = get_connection()
        cursor = conn.cursor()

        token = secrets.token_urlsafe(32)

        expiry = (
            datetime.datetime.utcnow()
            + datetime.timedelta(hours=1)
        )

        cursor.execute(
            """
            UPDATE admins
            SET reset_token=%s,
                reset_token_expiry=%s
            WHERE email=%s
            """,
            (token, expiry, email)
        )

        conn.commit()
        conn.close()

        print("Reset token generated")

        return response({
            "message": "Reset token generated",
            "token": token
        })

    # =========================
    # RESET PASSWORD
    # =========================

    if path == "/auth/reset-password" and method == "POST":

        print("Reset password request")

        body = json.loads(event["body"])

        token = body.get("token")
        new_password = body.get("password")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM admins
            WHERE reset_token=%s
            AND reset_token_expiry > NOW()
            """,
            (token,)
        )

        row = cursor.fetchone()

        if not row:
            conn.close()
            print("Password reset failed - Invalid or expired token")
            return response(
                {"message": "Invalid or expired token"},
                400
            )

        hashed_password = bcrypt.hashpw(
            new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cursor.execute(
            """
            UPDATE admins
            SET password=%s,
                reset_token=NULL,
                reset_token_expiry=NULL
            WHERE id=%s
            """,
            (hashed_password, row[0])
        )

        conn.commit()
        conn.close()

        print("Password reset successful")

        return response({
            "message": "Password reset successful"
        })

    print(f"Unknown route: {method} {path}")

    return response(
        {"message": "Route not found"},
        404
    )