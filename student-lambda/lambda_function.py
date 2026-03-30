import json
import os
import pymysql
import bcrypt
import jwt
import secrets
import datetime

DB_HOST    = os.environ['DB_HOST']
DB_USER    = os.environ['DB_USER']
DB_PASS    = os.environ['DB_PASS']
DB_NAME    = os.environ['DB_NAME']
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-this-secret-key') 

def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        connect_timeout=5
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

def verify_token(event):
    """Extract and verify JWT from Authorization header. Returns payload or None."""
    auth = event.get("headers", {}).get("authorization", "") or \
           event.get("headers", {}).get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:]
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return "expired"
    except Exception:
        return None


#  MAIN HANDLER

def lambda_handler(event, context):

    method   = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    raw_path = event.get("rawPath", "")

    # ── OPTIONS preflight ──
    if method == "OPTIONS":
        return response({"message": "ok"})

    #  AUTH ROUTES  (/auth/*)

    if raw_path.startswith("/auth"):

        # ── POST /auth/signup ──
        if raw_path == "/auth/signup" and method == "POST":
            try:
                body     = json.loads(event["body"])
                name     = body.get("name", "").strip()
                email    = body.get("email", "").strip().lower()
                username = body.get("username", "").strip().lower()
                password = body.get("password", "")

                if not all([name, email, username, password]):
                    return response({"message": "All fields are required."}, 400)
                if len(password) < 8:
                    return response({"message": "Password must be at least 8 characters."}, 400)

                # Hash password
                hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

                conn   = get_connection()
                cursor = conn.cursor()

                # Check duplicate email or username
                cursor.execute(
                    "SELECT id FROM admins WHERE email=%s OR username=%s",
                    (email, username)
                )
                if cursor.fetchone():
                    conn.close()
                    return response({"message": "Email or username already exists."}, 409)

                cursor.execute(
                    "INSERT INTO admins (full_name, email, username, password) VALUES (%s,%s,%s,%s)",
                    (name, email, username, hashed)
                )
                conn.commit()
                conn.close()
                return response({"success": True, "message": "Account created successfully!"})

            except Exception as e:
                return response({"error": str(e)}, 500)

        # POST /auth/login

        elif raw_path == "/auth/login" and method == "POST":
            try:
                body          = json.loads(event["body"])
                email_or_user = body.get("emailOrUsername", "").strip().lower()
                password      = body.get("password", "")

                if not email_or_user or not password:
                    return response({"message": "Email/username and password are required."}, 400)

                conn   = get_connection()
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, full_name, email, username, password FROM admins WHERE email=%s OR username=%s",
                    (email_or_user, email_or_user)
                )
                row = cursor.fetchone()
                conn.close()

                if not row:
                    return response({"message": "Invalid credentials. Please try again."}, 401)

                admin_id, full_name, email, username, stored_hash = row

                # Verify password against bcrypt hash
                if not bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
                    return response({"message": "Invalid credentials. Please try again."}, 401)

                # Generate JWT token (expires in 8 hours)
                token = jwt.encode(
                    {
                        "id":       admin_id,
                        "username": username,
                        "email":    email,
                        "exp":      datetime.datetime.utcnow() + datetime.timedelta(hours=8)
                    },
                    JWT_SECRET,
                    algorithm="HS256"
                )

                return response({
                    "token": token,
                    "name":  full_name,
                    "email": email
                })

            except Exception as e:
                return response({"error": str(e)}, 500)

        #  POST /auth/forgot-password 
        elif raw_path == "/auth/forgot-password" and method == "POST":
            try:
                body  = json.loads(event["body"])
                email = body.get("email", "").strip().lower()

                if not email:
                    return response({"message": "Email is required."}, 400)

                conn   = get_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM admins WHERE email=%s", (email,))
                row = cursor.fetchone()

                # Always return success (don't reveal if email exists — security best practice)
                if not row:
                    conn.close()
                    return response({"success": True, "message": "If this email is registered, a reset link has been sent."})

                # Generate a secure reset token (expires in 1 hour)
                reset_token  = secrets.token_urlsafe(32)
                token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

                cursor.execute(
                    "UPDATE admins SET reset_token=%s, reset_token_expiry=%s WHERE email=%s",
                    (reset_token, token_expiry, email)
                )
                conn.commit()
                conn.close()

                return response({
                    "success": True,
                    "message": "If this email is registered, a reset link has been sent.",
                    # Remove the line below once SES email is configured:
                    "dev_reset_token": reset_token
                })

            except Exception as e:
                return response({"error": str(e)}, 500)

        # POST /auth/reset-password
        elif raw_path == "/auth/reset-password" and method == "POST":
            try:
                body        = json.loads(event["body"])
                reset_token = body.get("token", "")
                new_password = body.get("password", "")

                if not reset_token or not new_password:
                    return response({"message": "Token and new password are required."}, 400)
                if len(new_password) < 8:
                    return response({"message": "Password must be at least 8 characters."}, 400)

                conn   = get_connection()
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, reset_token_expiry FROM admins WHERE reset_token=%s",
                    (reset_token,)
                )
                row = cursor.fetchone()

                if not row:
                    conn.close()
                    return response({"message": "Invalid or expired reset link."}, 400)

                admin_id, expiry = row

                # Check token expiry
                if datetime.datetime.utcnow() > expiry:
                    conn.close()
                    return response({"message": "Reset link has expired. Please request a new one."}, 400)

                # Hash new password and clear reset token
                new_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
                cursor.execute(
                    "UPDATE admins SET password=%s, reset_token=NULL, reset_token_expiry=NULL WHERE id=%s",
                    (new_hash, admin_id)
                )
                conn.commit()
                conn.close()

                return response({"success": True, "message": "Password updated successfully!"})

            except Exception as e:
                return response({"error": str(e)}, 500)

        else:
            return response({"message": "Not Found"}, 404)

    #  STUDENTS ROUTES  (/students)

    #payload = verify_token(event)
    #if payload == "expired":
     #   return response({"message": "Session expired. Please sign in again."}, 401)
    #if not payload:
     #   return response({"message": "Unauthorized. Please sign in."}, 401)

    try:
        conn   = get_connection()
        cursor = conn.cursor()

        # ── GET ──
        if method == "GET":
            cursor.execute("""
                SELECT studentId,name,dob,course,email,contact,state,city,joiningDate,address
                FROM students
            """)
            rows = cursor.fetchall()
            students = []
            for row in rows:
                students.append({
                    "studentId":   row[0],
                    "name":        row[1],
                    "dob":         str(row[2]) if row[2] else "",
                    "course":      row[3],
                    "email":       row[4],
                    "contact":     row[5],
                    "state":       row[6],
                    "city":        row[7],
                    "joiningDate": str(row[8]) if row[8] else "",
                    "address":     row[9] if len(row) > 9 and row[9] else ""
                })
            conn.close()
            return response(students)

        # POST
        elif method == "POST":
            body       = json.loads(event["body"])
            student_id = body.get("studentId")
            cursor.execute("""
                INSERT INTO students
                (studentId,name,dob,course,email,contact,state,city,joiningDate,address)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                student_id, body.get("name"), body.get("dob"), body.get("course"),
                body.get("email"), body.get("contact"), body.get("state"),
                body.get("city"), body.get("joiningDate"), body.get("address")
            ))
            conn.commit()
            conn.close()
            return response({"message": "Student added", "studentId": student_id})

        # PUT
        elif method == "PUT":
            body = json.loads(event["body"])
            cursor.execute("""
                UPDATE students
                SET name=%s, dob=%s, course=%s, email=%s, contact=%s,
                    state=%s, city=%s, joiningDate=%s, address=%s
                WHERE studentId=%s
            """, (
                body.get("name"), body.get("dob"), body.get("course"),
                body.get("email"), body.get("contact"), body.get("state"),
                body.get("city"), body.get("joiningDate"), body.get("address"),
                body.get("studentId")
            ))
            conn.commit()
            conn.close()
            return response({"message": "Student updated"})

        # DELETE
        elif method == "DELETE":
            body = json.loads(event["body"])
            cursor.execute("DELETE FROM students WHERE studentId=%s", (body.get("studentId"),))
            conn.commit()
            conn.close()
            return response({"message": "Student deleted"})

        else:
            conn.close()
            return response({"message": "Unsupported method"}, 405)

    except Exception as e:
        return response({"error": str(e)}, 500)