import json
import os
import pymysql
import jwt

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


def verify_token(event):

    auth = event.get("headers", {}).get("authorization", "") \
           or event.get("headers", {}).get("Authorization", "")

    if not auth.startswith("Bearer "):
        print("Authorization header missing")
        return None

    token = auth[7:]

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )
        print(f"Token verified for user: {payload.get('username')}")
        return payload

    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        return None


def lambda_handler(event, context):

    print("=" * 60)
    print("Student CRUD Lambda Invoked")

    method = event["requestContext"]["http"]["method"]
    path = event.get("rawPath", "")

    print(f"Method : {method}")
    print(f"Path   : {path}")

    payload = verify_token(event)

    if not payload:
        print("Unauthorized request")
        return response(
            {"message": "Unauthorized"},
            401
        )

    conn = get_connection()
    cursor = conn.cursor()

    # ==================================================
    # GET STUDENTS
    # ==================================================

    if method == "GET":

        print("Fetching all students...")

        cursor.execute("""
            SELECT studentId,name,dob,course,email,
                   contact,state,city,joiningDate,address
            FROM students
        """)

        rows = cursor.fetchall()

        students = []

        for row in rows:
            students.append({
                "studentId": row[0],
                "name": row[1],
                "dob": str(row[2]) if row[2] else "",
                "course": row[3],
                "email": row[4],
                "contact": row[5],
                "state": row[6],
                "city": row[7],
                "joiningDate": str(row[8]) if row[8] else "",
                "address": row[9]
            })

        print(f"Students fetched successfully. Count = {len(students)}")

        conn.close()

        return response(students)

    # ==================================================
    # ADD STUDENT
    # ==================================================

    elif method == "POST":

        body = json.loads(event["body"])

        print(f"Adding student: {body['studentId']} - {body['name']}")

        cursor.execute("""
            INSERT INTO students
            (studentId,name,dob,course,email,
             contact,state,city,joiningDate,address)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            body["studentId"],
            body["name"],
            body["dob"],
            body["course"],
            body["email"],
            body["contact"],
            body["state"],
            body["city"],
            body["joiningDate"],
            body["address"]
        ))

        conn.commit()

        print("Student inserted into database successfully")

        conn.close()

        return response({"message": "Student added"})

    # ==================================================
    # UPDATE STUDENT
    # ==================================================

    elif method == "PUT":

        body = json.loads(event["body"])

        print(f"Updating student: {body['studentId']}")

        cursor.execute("""
            UPDATE students
            SET name=%s,
                dob=%s,
                course=%s,
                email=%s,
                contact=%s,
                state=%s,
                city=%s,
                joiningDate=%s,
                address=%s
            WHERE studentId=%s
        """, (
            body["name"],
            body["dob"],
            body["course"],
            body["email"],
            body["contact"],
            body["state"],
            body["city"],
            body["joiningDate"],
            body["address"],
            body["studentId"]
        ))

        conn.commit()

        print(f"Student updated successfully: {body['studentId']}")

        conn.close()

        return response({"message": "Student updated"})

    # ==================================================
    # DELETE STUDENT
    # ==================================================

    elif method == "DELETE":

        body = json.loads(event["body"])

        print(f"Deleting student: {body['studentId']}")

        cursor.execute(
            "DELETE FROM students WHERE studentId=%s",
            (body["studentId"],)
        )

        conn.commit()

        print(f"Student deleted successfully: {body['studentId']}")

        conn.close()

        return response({"message": "Student deleted"})

    print(f"Unsupported HTTP Method: {method}")

    conn.close()

    return response({"message": "Unsupported method"}, 405)