#!/bin/bash

set -o errexit

set -o pipefail

set -o nounset

python manage.py migrate --no-input
python manage.py collectstatic --no-input

# Reliable reload inside Docker Desktop bind mounts: watch Django project paths only.
# Django's built-in reload often misses FS events → watchfiles (--noreload avoids double-watch).
exec watchfiles \
  "python manage.py runserver --noreload 0.0.0.0:8000" \
  /app/config /app/core_apps /app/manage.py