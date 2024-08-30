# Require Quotes in Ports Rule

Ensures that the port values in the `ports` section of services in the Docker Compose file are enclosed in quotes.
Using quotes around port numbers can prevent YAML parsing issues and ensure that the ports are interpreted correctly.

This rule is fixable. The linter can automatically add the required quotes around port numbers without altering the
ports themselves. The type of quotes (single or double) can be configured via the `quoteType` option.

- **Rule Name:** require-quotes-in-ports
- **Type:** warning
- **Category:** best-practice
- **Severity:** minor
- **Fixable:** true

## Problematic code example

```yaml
services:
  foo:
    image: image
    ports:
      - 80:80
      - 443:443
```

## Correct code example (Single Quotes)

```yaml
services:
  foo:
    image: image
    ports:
      - '80:80'
      - '443:443'
```

## Correct code example (Double Quotes)

```yaml
services:
  foo:
    image: image
    ports:
      - "80:80"
      - "443:443"
```

## Rule Details and Rationale

This rule ensures that the port numbers specified in the `ports` section of services are enclosed in quotes. Quoting
ports helps avoid potential issues with YAML parsing, where unquoted numbers might be misinterpreted or cause
unexpected behavior. By enforcing this rule, we ensure that the configuration is more robust and consistent.

When mapping ports in the `HOST:CONTAINER` format, you may experience erroneous results when using a container port
lower than 60, because YAML parses numbers in the format `xx:yy` as a base-60 value. For this reason, we recommend
always explicitly specifying your port mappings as strings.

## Options

The rule takes one string option, `quoteType`, to specify the type of quotes around port mappings:

- `single`
- `double`

By default, the rule enforces the use of single quotes.

### Example

If you want to enforce the use of double quotes around port mappings you can do it like this:

```json
{
  "rules": {
    "require-quotes-in-ports": [
      1,
      {
        "quoteType": "double"
      }
    ]
  }
}
```

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Stackoverflow Discussion: Quotes on docker-compose.yml ports](https://stackoverflow.com/questions/58810789/quotes-on-docker-compose-yml-ports-make-any-difference)
- [Compose file reference](https://docker-docs.uclv.cu/compose/compose-file/#ports)
- [Awesome Compose Examples](https://github.com/docker/awesome-compose)
