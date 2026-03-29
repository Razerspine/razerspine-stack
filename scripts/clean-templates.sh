#!/usr/bin/env bash
set -e

find packages/create/templates -type d \( -name "node_modules" -o -name "dist" \) -prune -exec rm -rf '{}' +
find packages/create/templates -type f -name "package-lock.json" -delete

echo "Templates cleaned"
