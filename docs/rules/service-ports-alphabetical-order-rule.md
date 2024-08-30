# Service Ports Alphabetical Order Rule

Ensures that the list of ports within a service is sorted alphabetically. This rule promotes consistency and readability
by maintaining a predictable order for the ports.

This rule is fixable. The linter can automatically reorder the list of ports without altering the internal content.

- **Rule Name:** service-ports-alphabetical-order
- **Type:** warning
- **Category:** style
- **Severity:** info
- **Fixable:** true

## Problematic Code Example

```yaml
services:
  web:
    image: nginx
    ports:
      - '81'
      - "79"
      - 80:80
      - 8080:8080
      - 1001:443
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
```

## Correct Code Example

```yaml
services:
  web:
    image: nginx
    ports:
      - "79"
      - 80:80
      - '81'
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
      - 1001:443
      - 8080:8080
```

## Rule Details and Rationale

Alphabetically sorting the list of ports within each service enhances readability, making it easier to quickly verify
and manage port configurations. By maintaining a consistent order, developers can avoid confusion when working on large
configurations.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Forum Discussion: Docker-compose.yml Best Practices](https://forums.docker.com/t/docker-compose-yml-best-practices/28995)
- [Docker Compose Reference](https://docs.docker.com/reference/compose-file/services/#ports)
