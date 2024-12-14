# Require Quotes in Ports Rule

Ensures that the port values in the `ports` and `expose` sections of services in the Docker Compose file are enclosed in
quotes. Using quotes around port numbers can prevent YAML parsing issues and ensure that the ports are interpreted
correctly.

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
    expose:
      - 3000
```

## Correct code example (Single Quotes)

```yaml
services:
  foo:
    image: image
    ports:
      - '80:80'
      - '443:443'
    expose:
      - '3000'
```

## Correct code example (Double Quotes)

```yaml
services:
  foo:
    image: image
    ports:
      - "80:80"
      - "443:443"
    expose:
      - "3000"
```

## Rule Details and Rationale

This rule ensures that the port numbers specified in the `ports` and `expose` sections of services are enclosed in
quotes. Quoting ports helps avoid potential issues with YAML parsing, where unquoted numbers might be misinterpreted or
cause unexpected behavior. By enforcing this rule, we ensure that the configuration is more robust and consistent.

When mapping ports in the `HOST:CONTAINER` format, you may experience erroneous results when using a container port
lower than 60, because YAML parses numbers in the format `xx:yy` as a [base-60 value](https://yaml.org/type/float.html).
For this reason, we recommend always explicitly specifying your port mappings as strings.

Although the expose section in Docker Compose does not suffer from the same YAML parsing vulnerabilities as the ports
section, it is still recommended to enclose exposed ports in quotes. Consistently using quotes across both `ports` and
`expose` sections creates a uniform configuration style, making the file easier to read and maintain.

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

This rule was introduced in [v1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

Handling `expose` section is added in [2.0.0](https://github.com/zavoloklom/docker-compose-linter/releases)

## References

- [Stackoverflow Discussion: Quotes on docker-compose.yml ports](https://stackoverflow.com/questions/58810789/quotes-on-docker-compose-yml-ports-make-any-difference)
- [Compose File Reference: Ports](https://docker-docs.uclv.cu/compose/compose-file/#ports)
- [Compose File Reference: Expose](https://docs.docker.com/reference/compose-file/services/#expose)
- [Awesome Compose Examples](https://github.com/docker/awesome-compose)
