# Invalid YAML Rule

This rule checks for the basic validity of the YAML file structure. It ensures that the file is correctly formatted and
can be properly parsed by YAML parsers. If the file contains syntax errors or other issues that prevent it from being
parsed, this rule will raise an error.

- **Rule Name:** invalid-yaml
- **Type:** error
- **Category:** style
- **Severity:** critical
- **Fixable:** false

## Rule Details and Rationale

YAML is a human-readable data serialization standard that is commonly used for configuration files. However, YAML is
sensitive to formatting, such as indentation and proper use of quotes. If a YAML file is not correctly formatted, it can
lead to errors when trying to parse the file, which may result in unexpected behavior or failure to load the
configuration.

This rule ensures that the YAML file is valid and can be parsed without errors. By catching these issues early, you can
avoid runtime errors and ensure that your configuration is correct and reliable.

This rule is essential for all projects that use YAML files, as it ensures the basic integrity of your configuration.
There are no typical scenarios where you would want to disable this rule, as valid YAML syntax is a fundamental
requirement for YAML files to function correctly.

## Known Limitations

This rule only checks for the syntactical correctness of the YAML file. It does not verify the content against any
specific schema or enforce any specific structure beyond basic YAML syntax.
Additionally, the validation relies on the [yaml](https://github.com/eemeli/yaml) library, and if the library fails to
catch certain errors or inconsistencies in the YAML structure, those issues will not be flagged by this rule either.

## Version

This rule was introduced in Docker-Compose-Linter [1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [YAML Specification](https://yaml.org/spec/)
- [YAML Best Practices](https://yaml.org/faq.html)
