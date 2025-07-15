# Rules Reference

DCLint categorizes rules into several categories to help you ensure that your Docker Compose files meet specific
standards.

In the tables below:

- 🔴 — Error. Indicates a critical issue. The exit code will be non-zero if this occurs.
- 🟡 — Warning. Indicates a non-critical issue. The exit code will remain zero.
- 🔧 — Auto-fixable. Issues reported by this rule are automatically fixable.
- ⚙️ — Configurable. Behavior of the rule can be adjusted using options.

## Style

These rules enforce consistency in formatting and structure to ensure that your Docker Compose files are easy to read
and maintain. They focus on best practices related to code style, such as proper ordering of fields and avoiding
unnecessary complexity.

| Name                                                                                               | Description                                                           |          |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| [No Quotes In Volumes](./rules/no-quotes-in-volumes-rule.md)                                       | Values in the `volumes` section should not be enclosed in quotes.     | 🟡 🔧    |
| [Service Dependencies Alphabetical Order](./rules/service-dependencies-alphabetical-order-rule.md) | Services in the `depends_on` section should be sorted alphabetically. | 🟡 🔧    |
| [Service Keys Order](./rules/service-keys-order-rule.md)                                           | Keys within each service should follow a specific order.              | 🟡 🔧 ⚙️ |
| [Service Ports Alphabetical Order](./rules/service-ports-alphabetical-order-rule.md)               | The list of ports in a service should be sorted alphabetically.       | 🟡 🔧    |
| [Services Alphabetical Order](./rules/services-alphabetical-order-rule.md)                         | Services should be sorted alphabetically.                             | 🟡 🔧    |
| [Top Level Properties Order](./rules/top-level-properties-order-rule.md)                           | Top-level properties should follow a specific order.                  | 🟡 🔧 ⚙️ |

## Security

Security rules focus on identifying potential vulnerabilities in your Docker Compose files. These rules help prevent
common security risks, such as exposing sensitive data or using unsafe configurations.

| Name                                                                                     | Description                                                                                                        |       |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----- |
| [No Duplicate Container Names](./rules/no-duplicate-container-names-rule.md)             | Container names must be unique to prevent conflicts and ensure proper container management.                        | 🔴    |
| [No Duplicate Exported Ports](./rules/no-duplicate-exported-ports-rule.md)               | Exported ports must be unique to avoid conflicts.                                                                  | 🔴    |
| [No Unbound Port Interfaces](./rules/no-unbound-port-interfaces-rule.md)                 | Exported ports must be bound to specific interfaces to avoid unintentional exposure.                               | 🔴    |
| [Service Container Name Regex](./rules/service-container-name-regex-rule.md)             | Container names must match the pattern `/^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/u` to comply with Docker naming conventions. | 🔴    |
| [Service Image Require Explicit Tag](./rules/service-image-require-explicit-tag-rule.md) | Services must use a specific image tag instead of "latest", "stable" or similar or no tag.                         | 🔴 ⚙️ |

## Best Practice

These rules enforce general Docker Compose best practices, guiding you towards configurations that are known to work
well. They help avoid pitfalls and ensure your configurations are reliable and maintainable.

| Name                                                                     | Description                                                          |          |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- | -------- |
| [No Build And Image](./rules/no-build-and-image-rule.md)                 | Each service must use either `build` or `image`, not both.           | 🔴 ⚙️    |
| [No Version Field](./rules/no-version-field-rule.md)                     | The `version` field must be absent in the configuration.             | 🔴 🔧    |
| [Require Project Name Field](./rules/require-project-name-field-rule.md) | The `name` field should be included in the configuration.            | 🟡       |
| [Require Quotes In Ports](./rules/require-quotes-in-ports-rule.md)       | Ports in `ports` and `expose` sections should be enclosed in quotes. | 🟡 🔧 ⚙️ |

## Performance

Performance rules are designed to optimize the runtime behavior of your Docker Compose setup. They identify
configurations that could negatively impact performance, such as inefficient resource usage or misconfigurations that
may lead to slower application performance.

| Name | Description |     |
| ---- | ----------- | --- |
|      |             |     |
