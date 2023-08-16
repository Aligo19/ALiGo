#!/bin/bash
set -e

host="api"
port=3001
timeout=30

until nc -z $host $port; do
  echo "Waiting for NestJS to be ready..."
  sleep 1
done

echo "NestJS is ready! Starting Front..."
exec npm start
