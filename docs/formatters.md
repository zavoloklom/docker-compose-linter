# Formatters Reference

DCLint comes with several built-in formatters to control the appearance of the linting results, and supports third-party
formatters as well.

You can specify a formatter using the `--format` or `-f` flag in the CLI. For example, `--format json` uses the json
formatter.

List of built-in formatters:

- json
- compact
- stylish (default)
- junit
- codeclimate (also compatible with Gitlab CI)

## Custom Formatters

Custom formatters let you display linting results in a format that best fits your needs, whether that’s in a specific
file format, a certain display style, or a format optimized for a particular tool.

### Creating a Custom Formatter

Each formatter is a function that receives a [LintResult](../src/linter/linter.types.ts) array as argument and returns a
string. For example, the following is how the built-in JSON formatter is implemented:

```ts
export default function jsonFormatter(results: LintResult[]): string {
    return JSON.stringify(results, null, 2);
}
```

To run ESLint with this formatter, you can use the `-f` (or `--format`) command line flag. You must begin the path to a
locally defined custom formatter with a period (`.`), such as `./my-awesome-formatter.js` or
`../formatters/my-awesome-formatter.ts`.

```shell
dclint -f ./my-awesome-formatter.js .
```

### Packaging a Custom Formatter

Custom formatters can be distributed through npm packages. To do so, create an npm package with a name in the format
`dclint-formatter-*`, where `*` is the name of your formatter (such as `dclint-formatter-awesome`). Projects should then
install the package and use the custom formatter with the `-f` (or `--format`) flag like this:

```shell
dclint -f dclint-formatter-awesome .
```
