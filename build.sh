#!/bin/bash

echo "postgresql user:"
read pg_user
echo "postgresql - $pg_user password:"
read pg_password
echo "postgresql port:"
read pg_port

echo ""
echo $pg_user
echo $pg_password
echo $pg_port
echo "Press enter to proceed"

PGPASSWORD=$pg_password psql -U $pg_user
\i backend/db/chat_app.sql

cd backend
node server/server.js &

cd ../frontend
npm run dev