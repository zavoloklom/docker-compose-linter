# Contribution Guidelines

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating
in this project you agree to abide by its causes.

## Prerequisites

Before making contributions, ensure the following:

- Your local development environment matches the project's requirements for versions of node.js, npm, and any other
  necessary tools.
- You have thoroughly read the project documentation to best understand its features and functionalities.

## Contribution Process

1. **Fork and Clone**: Fork this project on GitHub and clone your fork locally.
2. **Create a Branch**: Create a new branch in your local repository. This keeps your changes organized and separate
   from the main project.
3. **Development**: Make your changes in your branch. Here are a few things to keep in mind:
    - **No Lint Errors**: Ensure your code changes adhere to the project's linting rules and do not introduce new lint
      errors.
    - **Testing**: All changes must be accompanied by passing tests. Add new tests if you are adding functionality or
      fix existing tests if you are changing code.
    - **Conventional Commits**: Commit your changes using
      the [Conventional Commits](https://www.conventionalcommits.org) format. This standardization helps automate the
      version management and changelog generation.

## How to Add a New Rule

This guide will walk you through the steps required to add a new linting rule (check) to the Docker Compose Linter.
Please follow the steps carefully to ensure consistency and maintainability of the project.

### Create a New Rule File

1. Navigate to the `src/rules/` directory.
2. Create a new `.ts` file with a descriptive name for your rule. Name it something like `new-check-rule.ts`
   with `-rule` at the end.

### Implement the Rule and Write Your Logic

Your rule should implement the `LintRule` interface from [linter.types.ts](./src/linter/linter.types.ts).

Implement the logic that validates if the Docker Compose file violates the rule in `check` method. Use the
`LintContext` to access the content, and return an array of `LintMessage` objects with information about any violations.

If the rule is fixable, implement the logic to return the fixed content of the file in `fix` method. If the rule isn't
fixable, this method can return the content unchanged.

### Add Unit Tests

1. Navigate to the `tests/rules/` directory.
2. Create a test file for your new rule. For example, `new-check-rule.test.ts`.
3. Write unit tests to cover both the `check` and `fix` methods.

### Update Documentation

1. Go to the `docs/rules/` folder.
2. Create a markdown file describing your new rule (for example `new-check-rule.md`) based
   on [template](./docs/rules/__TEMPLATE__.md)

## Build Docker File Locally

```shell
docker build --file Dockerfile . --tag zavoloklom/dclint:dev \
      --pull \
      --build-arg BUILD_DATE="$(date +%Y-%m-%dT%T%z)" \
      --build-arg BUILD_VERSION=$(awk -F\" '/"version":/ {print $4}' package.json) \
      --build-arg BUILD_REVISION="$(git rev-parse --short HEAD)"
```

To run this file you need:

```shell
docker run --rm -i -v ${PWD}:/app zavoloklom/dclint:dev .
```

## How to Update Compose Schema

Updating the Docker Compose schema ensures that the linter remains compatible with the latest versions of Docker
Compose. This is essential because new fields or changes in the schema may affect how configurations are interpreted and
validated.

### Run the Schema Update Script

In the root of the project, run the following command:

```shell
npm run update-compose-schema
```

This script (`./scripts/download-compose-schema.cjs`) will download the latest version of the Docker Compose schema from
the official Compose-Spec repository and update the relevant file in the project.

### Verify the Update

You can do this by running the linter on a Docker Compose file:

```shell
npm run debug
```

If no errors occur, and the linter correctly identifies new fields or deprecated ones, then the schema has been updated
successfully.

After updating the schema, it's also important to run the project's unit tests to confirm that nothing was broken by the
schema update:

```shell
npm run test
```

## Submitting Changes

After you've made your changes:

1. **Run Linters and Tests**: Before submitting your changes, run the linters and tests to ensure everything is in
   order.
2. **Push to GitHub**: Push your changes to your fork on GitHub.
3. **Create a Merge Request**: Open a merge request from your fork/branch to the main repository on GitHub. Provide a
   clear and detailed description of your changes and why they are necessary.
4. **Code Review**: Once your merge request is opened, it will be reviewed by other contributors. Be open to feedback
   and willing to make further adjustments based on the discussions.
5. **Merge**: If your merge request passes the review, it will be merged into the main codebase.

## After Your Contribution

Once your contribution is merged, it will become part of the project.
I appreciate your hard work and contribution to making this tool better.
Also, I encourage you to continue participating in the project and joining in discussions and future enhancements.

**Thank you for contributing!**
