#!/usr/bin/env bash
set -e

for dir in packages/create-webpack-starter/templates/*/files; do
  echo "Installing dependencies in $dir"
  (cd "$dir" && npm install)
done
