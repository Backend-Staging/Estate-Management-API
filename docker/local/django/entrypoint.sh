#!/bin/bash

set -o errexit

set -o pipefail

set -o nounset


python << END
import sys
import time
import psycopg2

# Back off on every failed attempt (previously the first 30s had no sleep → CPU/tight loop + log spam)
suggest_unrecoverable_after = 30
start = time.time()
attempts = 0
while True:
  try:
      psycopg2.connect(
        dbname="${POSTGRES_DB}",
        user="${POSTGRES_USER}",
        password="${POSTGRES_PASSWORD}",
        host="${POSTGRES_HOST}",
        port="${POSTGRES_PORT}"
      )
      break
  except psycopg2.OperationalError as error:
      attempts += 1
      if attempts == 1 or attempts % 5 == 0:
          sys.stderr.write("Waiting for PostgreSQL to become available... ({})\n".format(attempts))
      if time.time() - start > suggest_unrecoverable_after:
        sys.stderr.write(
          "  Still waiting; last error: {!s}\n".format(error)
        )
      time.sleep(1)
END

>&2 echo "PostgreSQL is available"

exec "$@"