FROM node:20.18-alpine3.21 AS builder

WORKDIR /dclint

COPY package*.json ./
RUN npm ci

COPY . .

# SEA Builder
RUN npm run build:pkg && ./scripts/generate-sea.sh /bin/dclint

# Collect platform-specific dependencies
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN mkdir -p /dependencies/lib /dependencies/usr/lib && \
    ldd /bin/dclint | awk '{print $3}' | grep -vE '^$' | while read -r lib; do \
        if [ -f "$lib" ]; then \
            if [ "${lib#/usr/lib/}" != "$lib" ]; then \
                cp "$lib" /dependencies/usr/lib/; \
            elif [ "${lib#/lib/}" != "$lib" ]; then \
                cp "$lib" /dependencies/lib/; \
            fi; \
        fi; \
    done

FROM alpine:3.21 AS alpine-version

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

# Copy dependencies
COPY --from=builder /dependencies/lib /lib
COPY --from=builder /dependencies/usr/lib /usr/lib

# Copy dclint
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
