# No Duplicate Exported Ports Rule

Ensures that each service in a Docker Compose configuration exports unique ports. Duplicate exported ports across
services can lead to port conflicts and unexpected network behavior, making the configuration invalid.

This rule is not fixable, as it requires user intervention to resolve port conflicts.

- **Rule Name:** no-duplicate-exported-ports
- **Type:** error
- **Category:** security
- **Severity:** critical
- **Fixable:** false

## Problematic Code Example

```yaml
services:
  web:
    image: image
    ports:
      - "8080:80"
  db:
    image: image
    ports:
      - "8080:80"

```

## Correct Code Example

```yaml
services:
  web:
    image: image
    ports:
      - "8080:80"
  db:
    image: image
    ports:
      - "8081:80"

```

## Rule Details and Rationale

The `ports` directive in Docker Compose defines which ports on the host machine are exposed and mapped to the
container's
internal ports. If two services attempt to export the same host port, Docker Compose will fail to start, as it cannot
bind multiple services to the same port on the host. This makes the configuration invalid, and the issue must be
resolved manually before containers can be started.

Duplicate `ports` can often be the result of simple typographical errors. By catching these issues early during linting,
developers can avoid debugging complex port conflicts and ensure their Compose configurations are valid before
attempting to run them.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Ports Specification](https://docs.docker.com/reference/compose-file/services/#ports)
- [Forum Discussion: How to deal with duplicate ports best?](https://forums.docker.com/t/new-to-docker-how-to-deal-with-duplicate-ports-best/135681)