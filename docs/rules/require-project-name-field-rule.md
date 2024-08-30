# Require Project Name Field Rule

The "name" field should be present in the Docker Compose file. This rule enforces best practices by ensuring that the
"name" field is included, helping to maintain clarity and organization in Docker Compose projects.

- **Rule Name:** require-project-name-field
- **Type:** warning
- **Category:** best-practice
- **Severity:** minor
- **Fixable:** false

## Problematic code example

```yml
services:
  foo:
    image: image
    command: echo "I'm running ${COMPOSE_PROJECT_NAME}"
```

## Correct code example

```yml
name: myapp

services:
  foo:
    image: image
    command: echo "I'm running ${COMPOSE_PROJECT_NAME}"
```

## Rule Details and Rationale

The "name" field in a Docker Compose file specifies the project name and helps distinguish between different projects,
especially when multiple projects are being managed on the same Docker host. Including the "name" field can prevent
accidental conflicts and improve the organization of your Docker environment.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Project Name](https://docs.docker.com/reference/compose-file/version-and-name/#name-top-level-element)
- [How to specify a project name](https://docs.docker.com/compose/project-name/)
