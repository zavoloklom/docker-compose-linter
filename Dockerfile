FROM node:20.18.0-alpine3.19 AS builder

WORKDIR /dclint

COPY package*.json ./
RUN npm ci

COPY . .

# SEA Builder
RUN npm run build:pkg && ./scripts/generate-sea.sh /bin/dclint

FROM alpine:3.19 AS alpine-version

ENV NODE_NO_WARNINGS=1

RUN apk update && apk upgrade && \
    apk add --no-cache \
    libstdc++=~13.2 \
    && rm -rf /tmp/* /var/cache/apk/*

COPY --from=builder /bin/dclint /bin/dclint

WORKDIR /app

ENTRYPOINT ["/bin/dclint"]

ARG BUILD_DATE="0000-00-00T00:00:00+0000"
ARG BUILD_VERSION="0.0.0"
ARG BUILD_REVISION="0000000"

LABEL \
  org.opencontainers.image.title="Docker Compose Linter (Alpine)" \
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

FROM scratch AS scratch-version

ENV NODE_NO_WARNINGS=1

COPY --from=builder "/usr/lib/libstdc++.so.6" "/usr/lib/libstdc++.so.6"
COPY --from=builder /usr/lib/libgcc_s.so.1 /usr/lib/libgcc_s.so.1
COPY --from=builder /lib/ld-musl-aarch64.so.1 /lib/ld-musl-aarch64.so.1
COPY --from=builder /lib/libc.musl-aarch64.so.1 /lib/libc.musl-aarch64.so.1

COPY --from=builder /bin/dclint /bin/dclint

WORKDIR /app

ENTRYPOINT ["/bin/dclint"]

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
