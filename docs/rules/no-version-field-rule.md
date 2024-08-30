# No Version Field Rule

The "version" field should not be present in the Docker Compose file. This rule enforces best practices by ensuring that
the "version" field is removed, promoting consistency and modern practices in Docker Compose configurations.

- **Rule Name:** no-version-field
- **Type:** error
- **Category:** best-practice
- **Severity:** minor
- **Fixable:** true

## Problematic code example

```yml
version: '3.8'
services:
  web:
    image: image
```

## Correct code example

```yml
services:
  web:
    image: image
```

## Rule Details and Rationale

The "version" field was required in older versions of Docker Compose to specify the version of the Compose file format
being used. However, as Docker Compose evolved, the need for explicitly defining the "version" field has been deprecated
in favor of automatically determining the version based on the features used in the Compose file.

By removing the "version" field, this rule helps to avoid potential confusion and errors related to versioning and
encourages the use of up-to-date practices. This also simplifies the configuration, making the files cleaner and easier
to maintain.

## When Not To Use It

This rule assumes that the Docker Compose files are compatible with the latest version of Docker Compose, which no
longer requires the "version" field. If you are working with older versions of Docker Compose that still require the
"version" field, this rule may not be appropriate.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Versioning](https://docs.docker.com/compose/compose-file/compose-versioning/)
- [Best Practices for Docker Compose](https://docs.docker.com/compose/best-practices/)
