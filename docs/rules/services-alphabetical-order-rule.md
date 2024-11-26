# Services Alphabetical Order Rule

Ensures that the services in the Docker Compose file are listed in alphabetical order. This rule helps maintain
consistency and readability in the configuration by enforcing a predictable order for services.

This rule is fixable. The linter can automatically reorder services in alphabetical order without altering their
internal structure or content.

- **Rule Name:** services-alphabetical-order
- **Type:** warning
- **Category:** style
- **Severity:** minor
- **Fixable:** true

## Problematic code example

```yml
services:
  d_service:
    image: image
  c_service:
    image: image
  b_service:
    image: image
  a_service:
    image: image
```

## Correct code example

```yml
services:
  a_service:
    image: image
  b_service:
    image: image
  c_service:
    image: image
  d_service:
    image: image
```

## Rule Details and Rationale

This rule ensures that services in the Docker Compose file are listed in alphabetical order. Consistent ordering of
services improves readability and maintainability, especially in larger projects. It allows team members to quickly
locate and manage services within the configuration file.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Forum Discussion: Docker-compose.yml Best Practices](https://forums.docker.com/t/docker-compose-yml-best-practices/28995)
- [YAML Best Practices](https://www.yaml.info/learn/bestpractices.html)
