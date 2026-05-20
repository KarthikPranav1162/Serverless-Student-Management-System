# Serverless Student Management System
A serverless student management system built using AWS Lambda, API Gateway, S3, and Aurora MySQL.
## AWS Services Used

- AWS Lambda
- API Gateway
- Amazon S3
- Amazon Aurora MySQL
- IAM
- CloudWatch

## Features

- Admin authentication using JWT
- Password hashing using bcrypt
- Student CRUD operations
- Serverless backend architecture
- Static frontend hosting with S3

## Architecture
Frontend (S3)
    ↓
API Gateway
    ↓
AWS Lambda
    ↓
Aurora MySQL

## Project Structure

serverless_project/
├── api-gateway/
├── database/
├── student-lambda/
├── student-manager/
├── .gitignore
└── README.md