# No Build and Image Rule

Ensures that each service in a Docker Compose configuration uses either build or image, but not both. Using both
directives can cause ambiguity and unpredictable behavior during container creation.

This rule is not fixable, as it requires user intervention to decide whether to keep build or image.

- **Rule Name:** no-build-and-image
- **Type:** error
- **Category:** best-practice
- **Severity:** major
- **Fixable:** false

## Problematic Code Example

```yaml
services:
  web:
    build: .
    image: image
```

## Correct Code Example

```yaml
services:
  web:
    build: .
```

or

```yaml
services:
  web:
    image: image
```

## Rule Details and Rationale

The `build` and `image` directives in Docker Compose represent two different approaches to service configuration:

- `build` specifies that the service should be built from a Dockerfile in the specified directory.
- `image` specifies that the service should use a pre-built image from a registry.

When Compose is confronted with both a build subsection for a service and an image attribute, it follows the rules
defined by the `pull_policy` attribute.

If `pull_policy` is missing from the service definition, Compose attempts to pull the image first and then builds from
source if the image isn't found in the registry or platform cache.

Using both directives for the same service can lead to ambiguity and unexpected behavior during the build and deployment
process. Therefore, this rule enforces that each service should only use one of these directives.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Build Specification](https://docs.docker.com/reference/compose-file/build/)
- [Forum Discussion: Use build and image at the same time](https://forums.docker.com/t/use-build-and-image-at-the-same-time/126507/4)
