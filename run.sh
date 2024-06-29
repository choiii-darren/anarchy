#!/bin/bash

# Initial Setup Script 

FILE=.env
if test -f "$FILE"; then
    echo "$FILE found."
else 
    echo "Halting, $FILE not found."
    exit
fi

echo Building Images
docker-compose -f docker-dev.yml build 

echo Starting Containers 
docker-compose -f docker-dev.yml up -d

# Wait for app to be up
until nc -z localhost 8000
do
    echo "waiting for app container..."
    sleep 0.5
done

# Wait for db to be up
until nc -z localhost 5432
do
    echo "waiting for db container..."
    sleep 0.5
done

# echo Creating Tables
# docker exec django-anarchy python3 django/scripts/createTables.py

# echo Adding prod data 
# docker exec django-anarchy python3 -m django.scripts.add_prod_data

