#!/bin/bash

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 30s

echo "Creating database if it doesn't exist..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -Q "
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '$DB_NAME')
BEGIN
    CREATE DATABASE [$DB_NAME]
    PRINT 'Database $DB_NAME created successfully'
END
ELSE
    PRINT 'Database $DB_NAME already exists'
"

echo "Database initialization completed"
