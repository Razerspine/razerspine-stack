#!/usr/bin/env bash
set -e

echo "Building and previewing all templates..."

BASE_PORT=5000
PORT=$BASE_PORT

PIDS=()

for dir in packages/create-app/templates/*/files; do
  echo "▶ Building $dir"
  (cd "$dir" && npm run build)

  echo "▶ Starting preview in $dir on port $PORT"
  (
    cd "$dir"
    npx http-server dist --port $PORT -o -P http://localhost:$PORT/index.html?
  ) &

  PIDS+=($!)
  PORT=$((PORT + 1))
done

trap "echo 'Stopping all previews...'; kill ${PIDS[*]}; exit 0" SIGINT

wait
