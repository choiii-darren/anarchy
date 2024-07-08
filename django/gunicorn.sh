#!/bin/sh
gunicorn django.main:django -b 0.0.0.0:$PORT