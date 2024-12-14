# Service Image Require Explicit Tag Rule

Ensures that services in Docker Compose files use a specific image tag instead of latest, stable, or no tag at all.
Using concrete versions reduces the risk of unpredictable behavior when pulling images.

This rule is not fixable, as the linter cannot determine the correct version tag to use.

- **Rule Name:** service-image-require-explicit-tag
- **Type:** error
- **Category:** security
- **Severity:** major
- **Fixable:** false

## Problematic Code Example

```yaml
services:
  web:
    image: nginx
```

```yaml
services:
  web:
    image: nginx:latest
```

```yaml
services:
  web:
    image: nginx:stable
```

## Correct Code Example

```yaml
services:
  web:
    image: nginx:1.21.0
```

## Rule Details and Rationale

Using the latest or stable tag, or no tag at all, may lead to unpredictable behavior because the actual image version
can change over time. It is recommended to specify an exact version to ensure consistency and reliability.

## Options

The `service-image-require-explicit-tag` rule supports an optional `prohibitedTags` parameter that allows users to
customize which image tags should be flagged as problematic. If not provided, the default prohibited tags are:

- `latest`
- `stable`
- `edge`
- `test`
- `nightly`
- `dev`
- `beta`
- `canary`

### Example Usage with Custom prohibitedTags

You can specify custom tags that should be prohibited **instead** of the default ones by passing them into the rule
constructor as follows:

```json
{
  "rules": {
    "service-image-require-explicit-tag": [
      1,
      {
        "prohibitedTags": [
          "unstable",
          "preview"
        ]
      }
    ]
  }
}
```

In this example, the rule will flag any service that uses the tags `unstable` or `preview`. If a service uses one of
these tags, it will trigger a warning message, instructing to specify a concrete version tag instead.

If you provide a `prohibitedTags` option, only the tags listed in the `prohibitedTags` array will be checked.

## Version

This rule was introduced in [v1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Reference](https://docs.docker.com/reference/compose-file/services/#image)
- [What's Wrong With The Docker :latest Tag?](https://vsupalov.com/docker-latest-tag/)
