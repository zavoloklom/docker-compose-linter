# No Duplicate Container Names Rule

Container names in Docker Compose must be unique to prevent conflicts and ensure proper container management.
Duplicating container names makes the configuration invalid, and Docker Compose will not be able to start any containers
if this occurs.

This rule is not fixable automatically, as it requires user intervention to resolve the conflict by specifying unique
container names for each service.

- **Rule Name:** no-duplicate-container-names
- **Type:** error
- **Category:** security
- **Severity:** critical
- **Fixable:** false

## Problematic Code Example

```yaml
services:
  web:
    image: image
    container_name: my_container
  db:
    image: image
    container_name: my_container
```

## Correct Code Example

```yaml
services:
  web:
    image: image
    container_name: web_container
  db:
    image: image
    container_name: db_container

```

## Rule Details and Rationale

When `container_name` is specified in Docker Compose, it assigns a custom name to the container, which can override the
default naming scheme. While this can be useful for easily identifying containers, duplicate names can cause Docker
Compose to fail to start services, leading to a non-functional configuration.

This rule ensures that container names across services are unique to prevent conflicts in the Docker networking layer,
which can disrupt the container management process and network connections.

## Version

This rule was introduced in [v1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Container Name Specification](https://docs.docker.com/reference/compose-file/services/#container_name)
- [The Importance of Naming Docker Containers](https://thelinuxcode.com/how-to-name-rename-docker-containers/)
