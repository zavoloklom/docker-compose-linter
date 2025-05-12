# Command Line Interface Reference

The Command Line Interface (CLI) lets you execute linting from the terminal.

## Run the CLI

DCLint requires Node.js for installation. Follow the instructions in the Getting Started Guide to install DCLint.

Most users use npx to run DCLint on the command line like this:

```shell
npx dclint [options] [file|dir]
```

Such as:

```shell
# Run on two files
npx dclint docker-compose.yml docker-compose.override.yml

# Run on folder
npx dclint compose-configs

# Run on file and folder
npx dclint docker-compose.yml compose-configs
```

## Overriding Config

Command-line options always take precedence over values defined in the configuration file.

For example, rules disabled via `--disable-rule` will override any settings for those rules in the config.

## CLI Options

You can view all the CLI options by running `npx dclint -h`.

Below is a detailed explanation of each CLI option available in DCLint.

### `-v, --version`

- **Description**: Displays the current version of the DCLint tool.
- **Type**: `boolean`
- **Default**: `false`
- **Use Case**: This option is helpful when you want to check which version of DCLint is installed.

### `-r, --recursive`

- **Description**: Recursively searches directories for Docker Compose files.
- **Type**: `boolean`
- **Default**: `false`
- **Use Case**: This option is useful when you want to lint multiple Docker Compose files in a directory and its
  subdirectories without specifying each file individually.

### `--fix`

- **Description**: Automatically fixes problems in the Docker Compose files.
- **Type**: `boolean`
- **Default**: `false`
- **Use Case**: Use this option to apply automatic fixes to linting issues. This is ideal when you want to clean up
  files without manually editing them.

### `--fix-dry-run`

- **Description**: Simulates the automatic fixing of problems without actually saving the changes.
- **Type**: `boolean`
- **Default**: `false`
- **Use Case**: This is useful when you want to preview what changes would be made by the `--fix` option, allowing you
  to check fixes before committing them to files.

### `-f, --formatter`

- **Description**: Specifies the output format for the linting results.
- **Type**: `string`
- **Default**: `"stylish"`
- **Use Case**: Choose a different formatter for the output, such as `json`, to make the results easier to parse by
  other tools or to fit specific formatting needs. For more information about available formatters please read
  [Formatters Reference](./formatters.md).

### `-c, --config`

- **Description**: Provides the path to a custom configuration file.
- **Type**: `string`
- **Use Case**: Use this option if you have a custom configuration file and want DCLint to follow those settings instead
  of the default ones. For more information about config options please read [README](../README.md#configuration).

### `-q, --quiet`

- **Description**: Limits the output to errors only, hiding warnings.
- **Type**: `boolean`
- **Default**: `false`
- **Use Case**: This option is helpful when you only care about critical issues (errors) and want to suppress warnings
  from the output.

### `--max-warnings`

- **Description**: Specifies the maximum number of allowed warnings before triggering a nonzero exit code. If the number
  of warnings exceeds this limit, the command exits with a failure status. Note that any errors will also cause a
  nonzero exit code, regardless of this setting.
- **Type**: `number`
- **Default**: `-1` (disables warning limit)
- **Use Case**: This option is useful for enforcing a stricter threshold on warnings. It can be applied when you want to
  fail the command only if warnings reach a certain level, allowing for flexibility in handling non-critical issues.

### `-o, --output-file`

- **Description**: Specifies a file to write the linting report to.
- **Type**: `string`
- **Use Case**: This option is useful when you want to save the linting results to a file instead of printing them
  directly to the console.

### `--color`

- **Description**: Forces the enabling or disabling of color output.
- **Type**: `boolean`
- **Default**: `true`
- **Use Case**: If you want to ensure that color is used (or not used) in the CLI output, you can enable or disable it
  with this flag.

### `--no-color`

- **Description**: Disables color output explicitly.
- **Type**: `boolean`
- **Use Case**: Use this option if you want to avoid colored output in situations like logging the results to a file
  where color codes would be disruptive.

### `--debug`

- **Description**: Outputs debugging information to the console.
- **Type**: `boolean`
- **Default**: `undefined`
- **Use Case**: This option is useful for troubleshooting or getting more detailed insights into how the linter is
  operating.

### `-e, --exclude`

- **Description**: Excludes specific files or directories from being checked.
- **Type**: `array`
- **Default**: `[]`
- **Use Case**: This option is useful when you want to skip certain files or directories during linting, for example, if
  you have files that don’t need to be checked.

### `--disable-rule`

- **Description**: Skips the execution of specific rules.
- **Type**: `array`
- **Default**: `[]`
- **Use Case**: Useful when you want to exclude certain rules from the linting process, for example, to bypass checks
  that are not relevant to your project or workflow.

### `--help`

- **Description**: Displays help information about the available CLI options.
- **Type**: `boolean`
- **Use Case**: Use this when you need a quick reference for all available commands and options in DCLint.
