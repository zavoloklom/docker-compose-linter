#!/bin/sh

# Проверка, что путь к файлу генерации передан как аргумент
if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_generation_file>"
  exit 1
fi

GENERATION_PATH="$1"

# Выполнение команд
rm -rf "$GENERATION_PATH" && rm -rf sea-prep.blob && \
node --experimental-sea-config sea-config.json && \
cp "$(command -v node)" "$GENERATION_PATH" && \
npx -y postject "$GENERATION_PATH" NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
