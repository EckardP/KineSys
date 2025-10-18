#!/bin/bash
# setup-database.sh

set -e

echo "Waiting for SQL Server to be ready..."
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" &> /dev/null
do
  echo "Waiting for SQL Server..."
  sleep 2
done

echo "SQL Server is ready. Creating database..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -Q "
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '$DB_NAME')
BEGIN
    CREATE DATABASE [$DB_NAME]
    PRINT 'Database $DB_NAME created successfully'
END
ELSE
    PRINT 'Database $DB_NAME already exists'
"

echo "Database setup completed successfully"
