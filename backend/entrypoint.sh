#!/bin/sh

echo "Running Prisma migrate dev..."

npx prisma migrate dev --name auto-migrate

echo "Starting backend"

node dist/main.js