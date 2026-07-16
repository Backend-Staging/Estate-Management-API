#!/bin/sh
set -e
# The named volume client_next_dev:/app/.next is created root-owned. Next (user nextjs) needs write access.
mkdir -p /app/.next
chown -R nextjs:nodejs /app/.next
exec su-exec nextjs:nodejs "$@"
