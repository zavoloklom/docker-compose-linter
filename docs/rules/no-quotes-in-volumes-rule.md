# No Quotes in Volumes Rule

Ensures that the values in the `volumes` section of services in the Docker Compose file are not enclosed in quotes.
Quoted paths can cause unexpected behavior in Docker, so this rule enforces that they are written without quotes.

This rule is fixable. The linter can automatically remove the quotes from volume paths without altering the paths
themselves.

- **Rule Name:** no-quotes-in-volumes
- **Type:** warning
- **Category:** style
- **Severity:** info
- **Fixable:** true

## Problematic code example

```yaml
services:
  foo:
    image: image
    volumes:
      - "/data:/app/data"
      - "logs:/app/logs"
```

## Correct code example

```yaml
services:
  foo:
    image: image
    volumes:
      - /data:/app/data
      - logs:/app/logs
```

## Rule Details and Rationale

This rule ensures that the volume paths specified in the `volumes` section of services are not enclosed in quotes. Using
quotes around paths can lead to unintended behavior in Docker, such as incorrect mounting or path interpretation. By
enforcing this rule, we ensure a more reliable and consistent configuration.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Volumes top-level element](https://docs.docker.com/reference/compose-file/volumes/)
