# Service Dependencies Alphabetical Order Rule

Ensures that the list of services within depends_on is sorted alphabetically. This rule promotes consistency and
readability by maintaining a predictable order for service dependencies.

This rule is fixable. The linter can automatically reorder the list of services in depends_on without altering their
internal content.

- **Rule Name:** service-dependencies-alphabetical-order
- **Type:** warning
- **Category:** style
- **Severity:** info
- **Fixable:** true

## Problematic code example

```yaml
services:
  web:
    image: image
    depends_on:
      - redis
      - db
```

```yaml
services:
  web:
    image: nginx
    depends_on:
      redis:
        condition: service_started
      db:
        condition: service_healthy
        restart: true
```

## Correct code example

```yaml
services:
  web:
    image: nginx
    depends_on:
      - db
      - redis
```

```yaml
services:
  web:
    image: nginx
    depends_on:
      db:
        condition: service_healthy
        restart: true
      redis:
        condition: service_started
```

## Rule Details and Rationale

Sorting the list of services within `depends_on` alphabetically enhances readability and predictability, making it
easier to manage service dependencies. By maintaining a consistent order, developers can avoid confusion when working on
large configurations.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Forum Discussion: Docker-compose.yml Best Practices](https://forums.docker.com/t/docker-compose-yml-best-practices/28995)
- [Docker Compose Reference](https://docs.docker.com/reference/compose-file/services/#depends_on)
