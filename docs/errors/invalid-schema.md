# Invalid Schema Rule

Ensures that the YAML content conforms to the specified JSON schema. This rule validates the structure and content of
your Docker Compose file against the defined schema, ensuring that it follows the expected format.

- **Rule Name:** invalid-schema
- **Type:** error
- **Category:** style
- **Severity:** critical
- **Fixable:** false

## Rule Details and Rationale

This rule validates your Docker Compose file against the JSON schema defined
in [compose.schema.json](../../schemas/compose.schema.json). This ensures that the structure and content of the file
adhere to the expected standards, reducing the likelihood of errors when running Docker Compose.

By validating the file against a schema, you can catch issues early in the development process, leading to more stable
and predictable deployments.

## Known Limitations

This rule requires that the `compose.schema.json` schema is up-to-date with the latest Docker Compose specifications.
However, the schema is not updated automatically. This means that if the schema is outdated, it may fail to recognize
newer Docker Compose features, potentially causing false positives during validation.

To keep the schema current, you can manually update it and contribute to the project by following
the [instructions in the contribution guidelines](../../CONTRIBUTING.md#how-to-update-compose-schema).

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Compose file specification](https://github.com/compose-spec/compose-spec/blob/main/00-overview.md)
- [Docker Compose File Schema](https://github.com/compose-spec/compose-spec/blob/main/schema/compose-spec.json)
- [JSON Schema Validation](https://ajv.js.org/)
