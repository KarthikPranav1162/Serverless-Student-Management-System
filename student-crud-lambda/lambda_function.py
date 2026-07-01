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
            return None

        token = auth[7:]

        try:
            return jwt.decode(
                token,
                JWT_SECRET,
                algorithms=["HS256"]
            )
        except:
            return None

def lambda_handler(event, context):

    payload = verify_token(event)

    if not payload:
        return response(
            {"message": "Unauthorized"},
            401
        )

    method = event["requestContext"]["http"]["method"]

    conn = get_connection()
    cursor = conn.cursor()

    # GET STUDENTS
    if method == "GET":

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

        conn.close()
        return response(students)

    # ADD STUDENT
    elif method == "POST":

        body = json.loads(event["body"])

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
        conn.close()

        return response({"message": "Student added"})

    # UPDATE STUDENT
    elif method == "PUT":

        body = json.loads(event["body"])

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
        conn.close()

        return response({"message": "Student updated"})

    # DELETE STUDENT
    elif method == "DELETE":

        body = json.loads(event["body"])

        cursor.execute(
            "DELETE FROM students WHERE studentId=%s",
            (body["studentId"],)
        )

        conn.commit()
        conn.close()

        return response({"message": "Student deleted"})

    return response({"message": "Unsupported method"}, 405)