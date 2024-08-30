FROM node:20.17.0-alpine3.19

WORKDIR /dclint

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

WORKDIR /app

ENTRYPOINT ["node", "--no-warnings", "/dclint/bin/dclint.js"]

ARG BUILD_DATE="0000-00-00T00:00:00+0000"
ARG BUILD_VERSION="0.0.0"
ARG BUILD_REVISION="0000000"

LABEL \
  org.opencontainers.image.title="Docker Compose Linter" \
  org.opencontainers.image.description="A command-line tool for validating and enforcing best practices in Docker Compose files." \
  org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.authors="Sergey Kupletsky <s.kupletsky@gmail.com>" \
  org.opencontainers.image.url="https://github.com/zavoloklom/docker-compose-linter" \
  org.opencontainers.image.documentation="https://github.com/zavoloklom/docker-compose-linter" \
  org.opencontainers.image.source="https://github.com/zavoloklom/docker-compose-linter.git" \
  org.opencontainers.image.version="${BUILD_VERSION}" \
  org.opencontainers.image.revision="${BUILD_REVISION}" \
  org.opencontainers.image.vendor="Sergey Kupletsky" \
  org.opencontainers.image.licenses="MIT"
