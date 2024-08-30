# Rules Reference

DCLint categorizes its rules into several categories to help you ensure that your Docker Compose files meet specific
standards.

## Style

These rules enforce consistency in formatting and structure to ensure that your Docker Compose files are easy to read
and maintain. They focus on best practices related to code style, such as proper ordering of fields and avoiding
unnecessary complexity.

- [Volumes No Quotes Rule](./rules/no-quotes-in-volumes-rule.md)
- [Service Dependencies Alphabetical Order Rule](./rules/service-dependencies-alphabetical-order-rule.md)
- [Service Keys Order Rule](./rules/service-keys-order-rule.md)
- [Service Ports Alphabetical Order Rule](./rules/service-ports-alphabetical-order-rule.md)
- [Services Alphabetical Order Rule](./rules/services-alphabetical-order-rule.md)
- [Top-Level Properties Order Rule](./rules/top-level-properties-order-rule.md)

## Security

Security rules focus on identifying potential vulnerabilities in your Docker Compose files. These rules help prevent
common security risks, such as exposing sensitive data or using unsafe configurations.

- [No Duplicate Container Names Rule](./rules/no-duplicate-container-names-rule.md)
- [No Duplicate Exported Ports Rule](./rules/no-duplicate-exported-ports-rule.md)
- [Service Container Name Regex Rule](./rules/service-container-name-regex-rule.md)
- [Service Image Require Explicit Tag Rule](./rules/service-image-require-explicit-tag-rule.md)

## Best Practice

These rules enforce general Docker Compose best practices, guiding you towards configurations that are known to work
well. They help avoid pitfalls and ensure your configurations are reliable and maintainable.

- [No Build and Image Rule](./rules/no-build-and-image-rule.md)
- [No Version Field Rule](./rules/no-version-field-rule.md)
- [Required Project Name Field Rule](./rules/require-project-name-field-rule.md)
- [Require Quotes in Ports Rule](./rules/require-quotes-in-ports-rule.md)

## Performance

Performance rules are designed to optimize the runtime behavior of your Docker Compose setup. They identify
configurations that could negatively impact performance, such as inefficient resource usage or misconfigurations that
may lead to slower application performance.
