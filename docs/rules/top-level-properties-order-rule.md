# Top-Level Properties Order Rule

Ensures that the top-level properties in the Docker Compose file follow a specific order. This rule enforces a
consistent structure for better readability and maintainability.

This rule is fixable. The linter can automatically reorder the top-level properties according to the predefined order
without altering their internal content.

- **Rule Name:** top-level-properties-order
- **Type:** warning
- **Category:** style
- **Severity:** major
- **Fixable:** true

## Problematic Code Example

```yaml
services:
  app:
    image: image
name: 'project-name'
x-beta: beta
x-alpha: alpha
networks:
  default:
    driver: bridge
```

## Correct Code Example

```yaml
x-alpha: alpha
x-beta: beta
name: 'project-name'
services:
  app:
    image: image
networks:
  default:
    driver: bridge
```

## Rule Details and Rationale

The `top-level-properties-order` rule enforces a specific order for the top-level properties in Docker Compose files to
ensure consistency, readability, and maintainability across projects. A well-structured Compose file allows developers
and operations teams to quickly find and understand configurations, which becomes increasingly important in larger or
collaborative environments.

The default top-level property order is as follows:

- `x-properties` - all properties prefixed with `x-`, in alphabetical order.
- `version`
- `name`
- `include`
- `services`
- `networks`
- `volumes`
- `secrets`
- `configs`

By applying this rule, developers ensure that configuration files remain easy to navigate and understand, improving
collaboration and reducing errors.

## Options

The top-level-properties-order rule allows customization through a single optional parameter that controls the order of
top-level properties:

### Custom Order

The `customOrder` option allows you to define a custom sequence for the top-level properties. If this option is not
provided, the default order is used.

If you need to change the order, you can customize it using the `customOrder` option. For example, if you want
`services` to come first and `networks` to come after `version`, you can define a custom order like this:

```json
{
  "rules": {
    "top-level-properties-order": [
      2,
      {
        "customOrder": [
          "x-properties",
          "services",
          "version",
          "networks",
          "name",
          "volumes",
          "secrets",
          "configs"
        ]
      }
    ]
  }
}
```

If certain top-level properties are not specified in the `customOrder`, they will follow the default order at the end of
the file.

## Known Limitations

Regardless of the `customOrder`, all properties that start with `x-` will always be sorted alphabetically. If
`x-properties` are not explicitly mentioned in the `customOrder`, they will still follow the default behavior of being
grouped together and sorted alphabetically.

## Version

This rule was introduced in [v1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Forum Discussion: Docker-compose.yml Best Practices](https://forums.docker.com/t/docker-compose-yml-best-practices/28995)
- [YAML Best Practices](https://www.yaml.info/learn/bestpractices.html)
