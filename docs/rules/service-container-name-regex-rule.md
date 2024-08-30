# Service Container Name Regex Rule

Container names in Docker Compose must match the regular expression pattern `[a-zA-Z0-9][a-zA-Z0-9_.-]+` to avoid
invalid names and ensure compliance with Docker naming conventions.

- **Rule Name:** service-container-name-regex
- **Type:** error
- **Category:** security
- **Severity:** critical
- **Fixable:** false

## Problematic Code Example

```yaml
services:
  web:
    image: image
    container_name: "my-app@123"
```

## Correct Code Example

```yaml
services:
  web:
    image: image
    container_name: "my-app-123"
```

## Rule Details and Rationale

This rule ensures that container names in Docker Compose follow the required format defined by the regular
expression `[a-zA-Z0-9][a-zA-Z0-9_.-]+`. If a container name contains invalid characters, it can lead to errors when
Docker tries to run the services. This rule identifies invalid names and prevents configuration errors.

Container names should only consist of letters, numbers, underscores (`_`), hyphens (`-`), and periods (`.`). Any other
characters, such as `@`, make the configuration invalid. This rule prevents such issues by ensuring that all container
names are properly formatted according to Docker's naming conventions.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Container Name Specification](https://docs.docker.com/reference/compose-file/services/#container_name)
