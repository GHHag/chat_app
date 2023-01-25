#!/bin/bash

echo "postgresql user:"
read pg_user
echo "postgresql - $pg_user password:"
read pg_password
echo "postgresql port:"
read pg_port
echo "superadmin username:"
read superadmin_username
echo "superadmin password:"
read superadmin_password
echo ""
echo "Confirm credentials"
echo "postgresql user: " $pg_user
echo "postgresql " $pg_user " password: " $pg_password
echo "postgresql port: " $pg_port
echo "superadmin username: " $superadmin_username
echo "superadmin password: " $superadmin_password
echo "Press enter to proceed"
read proceed

PGPASSWORD=$pg_password psql -U $pg_user -f backend/db/chat_app.sql

cd backend
npm install
node server/server.js &

cd ../frontend
npm install
npm run dev &

curl -X POST -H "Content-Type: application/json" -d '{"username": "'$superadmin_username'", "password": "'$superadmin_password'"}' http://localhost:8000/api/user/register
PGPASSWORD=$pg_password psql -U $pg_user -d chat_app -c "UPDATE users SET user_role = 'superadmin' WHERE username = '"$superadmin_username"'"
