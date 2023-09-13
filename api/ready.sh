#!/bin/bash
set -e

host="postgres"
port=5432
timeout=30

until nc -z $host $port; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 1
done

echo "PostgreSQL is ready! Starting API..."
exec npm start
