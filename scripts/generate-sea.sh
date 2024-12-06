#!/bin/sh

# Checking that the path to the generation file is passed as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_generation_file>"
  exit 1
fi

GENERATION_PATH="$1"

# Generate binary
rm -rf "$GENERATION_PATH" && rm -rf sea-prep.blob && \
mkdir -p "$(dirname "$GENERATION_PATH")" && \
node --experimental-sea-config sea-config.json && \
cp "$(command -v node)" "$GENERATION_PATH" && \
npx -y postject "$GENERATION_PATH" NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
