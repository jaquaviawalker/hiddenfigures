#!/bin/bash

# PostgreSQL connection parameters
PG_HOST="localhost"
PG_PORT="5432"
PG_USER="postgres"
PG_PASSWORD="postgres"
DB_NAME="hiddenfigures_test"

# Create test database if it doesn't exist
echo "Checking if test database exists..."
if ! PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Creating test database: $DB_NAME"
    PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c "CREATE DATABASE $DB_NAME;"
    echo "Test database created successfully"
else
    echo "Test database already exists"
fi

# Run integration tests
echo "Running integration tests..."
npm run test:integration
