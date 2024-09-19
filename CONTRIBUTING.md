# Contribution Guidelines

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating
in this project you agree to abide by its terms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Contribution Process](#contribution-process)
   - [1. Fork and Clone](#1-fork-and-clone)
   - [2. Create a Branch](#2-create-a-branch)
   - [3. Development](#3-development)
   - [4. Verify Everything](#4-verify-everything)
   - [5. Push Changes](#5-push-changes)
   - [6. Create a Pull Request](#6-create-a-pull-request)
   - [7. Code Review](#7-code-review)
   - [8. Merge](#8-merge)
3. [Commit Message Conventions](#commit-message-conventions)
4. [How to Add a New Rule](#how-to-add-a-new-rule)
5. [How to Build the Project](#how-to-build-the-project)
6. [How to Build SEA](#how-to-build-sea)
7. [How to Build Docker Locally](#how-to-build-docker-locally)
8. [How to Update Compose Schema](#how-to-update-compose-schema)

## Prerequisites

Before making contributions, ensure the following:

- Your local development environment matches the project's requirements for versions of node.js, npm, and any other
  necessary tools.
- You have thoroughly read the project documentation to best understand its features and functionalities.

## Contribution Process

### 1. Fork and Clone

- **Fork**: Navigate to the repository on GitHub and click the "Fork" button to create a copy of the repository in your
  own GitHub account.
- **Clone**: Clone your forked repository to your local machine using the following command:

  ```bash
  git clone https://github.com/<your-username>/docker-compose-linter.git
  ```

- Change into the project directory:

  ```bash
  cd docker-compose-linter
  ```

### 2. Create a Branch

- Create a new branch to work on your changes. Use a descriptive name for the branch, such as `feature/add-new-rule` or
  `fix/linting-error`:

  ```bash
  git checkout -b <branch-name>
  ```

### 3. Development

Make your changes in the newly created branch. Follow these steps to ensure quality and consistency:

#### No Lint Errors

- Check your code against the project's linting rules to ensure consistency:

  ```bash
  npm run lint
  ```

- If linting errors are reported, fix them before proceeding. You can also use the following command to auto-fix issues:

  ```bash
  # eslint
  npm run eslint:fix

  # md files
  npm run docs:fix
  ```

#### Testing

- All code changes must pass existing tests. If you are adding new functionality, ensure you write appropriate tests to
  validate it.
- To run all tests:

  ```bash
  npm run test
  ```

- If a test fails, resolve the issue before proceeding. For new features or bug fixes, include corresponding test cases.

#### Commit Convention

- Commit messages must follow our [Commit Message Conventions](#commit-message-conventions). This ensures clear and
  meaningful commit history.
- Examples:
  - For a bug fix: `fix: resolve crash when parsing invalid YAML`
  - For a new feature: `feat: add support for custom validation schemas`
- Use the following command to commit your changes:

  ```bash
  git commit -m "<type>: <message>"
  ```

#### Documentation Updates

- If your changes impact the documentation (e.g., adding a new rule or updating an existing feature), ensure you update
  the relevant files in the `docs` folder.
- Validate your changes with `npm run docs:check` to ensure there are no issues.

### 4. Verify Everything

Before submitting your changes:

- **Run all tests**: Verify that your changes have not introduced any test failures.

  ```bash
  npm run test
  ```

- **Build the project**: Ensure that the project builds successfully to verify that no issues have been introduced in
  the build process:

  ```bash
  npm run build
  ```

  For more details on the build process and available configurations, refer to the
  [How to Build the Project](#how-to-build-the-project) section.

- **Confirm functionality**: Ensure that your changes (e.g., new rules, fixes) work as intended using the linter.

### 5. Push Changes

Push your branch to your forked repository:

```bash
git push origin <branch-name>
```

### 6. Create a Pull Request

- Navigate to the original repository on GitHub and click the "Compare & Pull Request" button for your branch.
- Provide a clear and detailed description of your changes in the pull request.

### 7. Code Review

- Once your pull request is submitted, it will undergo a review process.
- Be open to feedback and make adjustments as needed. Push updates to your branch, and they will automatically appear in
  the pull request.

### 8. Merge

- After your pull request has been approved and all checks have passed, it will be merged into the main repository.

Once your contribution is merged, it will become part of the project. I appreciate your hard work and contribution to
making this tool better. Also, I encourage you to continue participating in the project and joining in discussions and
future enhancements.

## Commit Message Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org) message conventions defined by
[@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional),
with some specific adjustments to suit our needs. This standardization helps automate the version management and
changelog generation.

The commit message rules are defined in the [.commitlintrc.cjs](./.commitlintrc.cjs) file, which you can refer to for
detailed guidelines.

Below are the details of the allowed commit types and their corresponding effects on versioning.

### Commit Types

| Type       | Description                                                                   | Version Impact                    |
| ---------- | ----------------------------------------------------------------------------- | --------------------------------- |
| `rule`     | Introduces a new rule.                                                        | Major                             |
| `feat`     | Adds a new feature.                                                           | Minor                             |
| `fix`      | Fixes a bug.                                                                  | Patch                             |
| `refactor` | Code changes that neither fix a bug nor add a feature (including formatting). | None                              |
| `perf`     | Changes that improve performance.                                             | Patch                             |
| `test`     | Adds or modifies tests.                                                       | None                              |
| `deps`     | Updates dependencies.                                                         | Patch / None for dev-dependencies |
| `docs`     | Documentation only changes.                                                   | None                              |
| `ci`       | Changes to CI/CD configurations.                                              | None                              |
| `chore`    | Other changes that don't modify source or test files.                         | None                              |
| `revert`   | Reverts a commit.                                                             | Patch                             |
| `release`  | Release-specific metadata updates. **Reserved for CI/CD.**                    | None                              |

> **Note:** The `rule` type is unique to this project and always results in a major version bump to reflect its
> importance. See [community discussion](https://github.com/zavoloklom/docker-compose-linter/discussions/60) about it.

### Commit Linter

A `commit-msg` hook is configured to automatically check commit messages with the defined rules.

Additionally, you can manually validate all commits in your branch using the following command:

```shell
npm run commitlint
```

## How to Add a New Rule

This guide will walk you through the steps required to add a new linting rule (check) to the Docker Compose Linter.
Please follow the steps carefully to ensure consistency and maintainability of the project.

### Create a New Rule File

1. Navigate to the `src/rules/` directory.
2. Create a new `.ts` file with a descriptive name for your rule. Name it something like `new-check-rule.ts` with
   `-rule` at the end.

### Implement the Rule and Write Your Logic

Your rule should implement the `LintRule` interface from [linter.types.ts](./src/linter/linter.types.ts).

Implement the logic that validates if the Docker Compose file violates the rule in `check` method. Use the `LintContext`
to access the content, and return an array of `LintMessage` objects with information about any violations.

If the rule is fixable, implement the logic to return the fixed content of the file in `fix` method. If the rule isn't
fixable, this method can return the content unchanged.

### Add Unit Tests

1. Navigate to the `tests/rules/` directory.
2. Create a test file for your new rule. For example, `new-check-rule.test.ts`.
3. Write unit tests to cover both the `check` and `fix` methods.

### Update Documentation

1. Go to the `docs/rules/` folder.
2. Create a markdown file describing your new rule (for example `new-check-rule.md`) based on
   [template](./docs/rules/__TEMPLATE__.md)
3. Run `npm run docs:check` to validate documentation.
4. Use the `npm run docs:update` script to automatically update the documentation for the rule from the source.
5. If there are formatting issues, run `npm run docs:fix` to automatically resolve them.

## How to Build the Project

The project has several Rollup configurations designed for specific build outputs. You can use the provided npm scripts
to build each configuration individually or all at once.

1. **CLI Build (`rollup.config.cli.js`)**

   This configuration builds the CLI, producing a minified CommonJS file (`bin/dclint.cjs`) for command-line use. The
   minification keeps the output compact for efficient distribution.

   **How to Run:**

   ```shell
   npm run build:cli
   ```

2. **PKG Build for SEA (`rollup.config.pkg.js`)**

   This configuration bundles the entire project, including dependencies, into a single file (`pkg/dclint.cjs`). It is
   useful for creating a Single Executable Application (SEA) with Node.js, as all dependencies are embedded in the
   output.

   **How to Run:**

   ```shell
   npm run build:pkg
   ```

3. **Library Build (`rollup.config.lib.js`)**

   This configuration generates the main library with outputs in both CommonJS and ESM formats, along with TypeScript
   declaration files. This is ideal for distributing the library to be used in various module systems.

   **How to Run:**

   ```shell
   npm run build:lib
   ```

Each configuration has its specific purpose, helping you generate optimized builds for different parts of the project.
Use the `pkg` build when you need to create a single executable, the `cli` build for compact CLI usage, and the `lib`
build for general library distribution. To run all builds at once, use:

```shell
npm run build
```

## How to Build SEA

Single Executable Applications (SEA) allow you to bundle your Node.js application into a single executable file. This
approach is especially useful for distributing CLI tools, as it removes the need for users to install Node.js or other
dependencies. In this project, the `pkg` build configuration is designed specifically for SEA, bundling all dependencies
into a single file.

### MacOS

The following commands are specific to macOS for building a SEA.

```shell
# Create package build
npm run build:pkg

# Clean previous build artifacts
rm -rf dclint sea-prep.blob

# Generate SEA Blob using the Node.js SEA configuration file
node --experimental-sea-config sea-config.json

# Copy the Node.js binary to create the executable
cp $(command -v node) dclint

# Remove signature to run on macOS
codesign --remove-signature dclint

# Inject SEA Blob into the executable using postject
sudo npx postject dclint NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA

# Sign the executable to allow it to run on macOS
codesign --sign - dclint
```

### Linux

```shell
# Create package build
npm run build:pkg

# Clean previous build artifacts
rm -rf dclint sea-prep.blob

# Generate SEA Blob using the Node.js SEA configuration file
node --experimental-sea-config sea-config.json

# Copy the Node.js binary to create the executable
cp $(command -v node) dclint

# Inject SEA Blob into the executable using postject
npx postject dclint NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
```

Also, you can use Docker to compile it:

```bash
docker run --rm -v "$PWD":/app -w /app node:20.18.0-alpine ./scripts/generate-sea.sh ./pkg/dclint-alpine
docker run --rm -v "$PWD":/app -w /app node:20.18.0-bullseye ./scripts/generate-sea.sh ./pkg/dclint-bullseye
```

After running these commands, you will have a standalone `dclint` executable, ready for distribution and use. This SEA
version simplifies deployment, allowing users to run the CLI tool without any external dependencies.

To verify that everything is working correctly, run the following command:

```shell
./dclint ./tests/mocks/docker-compose.yml -c ./tests/mocks/.dclintrc
./dclint -v
```

To suppress the experimental feature warning:

```text
(node:99747) ExperimentalWarning: Single executable application is an experimental feature and might change at any time
(Use `dclint --trace-warnings ...` to show where the warning was created)
```

set the environment variable `NODE_NO_WARNINGS=1`:

```bash
NODE_NO_WARNINGS=1 ./dclint ./tests/mocks/docker-compose.yml -c ./tests/mocks/.dclintrc
```

Note that this SEA still need some dependencies to run:

```text
For Ubuntu
ldd /bin/dclint
    linux-vdso.so.1
    libdl.so.2 => /lib/aarch64-linux-gnu/libdl.so.2
    libstdc++.so.6 => /usr/lib/aarch64-linux-gnu/libstdc++.so.6
    libm.so.6 => /lib/aarch64-linux-gnu/libm.so.6
    libgcc_s.so.1 => /lib/aarch64-linux-gnu/libgcc_s.so.1
    libpthread.so.0 => /lib/aarch64-linux-gnu/libpthread.so.0
    libc.so.6 => /lib/aarch64-linux-gnu/libc.so.6
    /lib/ld-linux-aarch64.so.1
```

```text
For Alpine
ldd /bin/dclint
    /lib/ld-musl-aarch64.so.1
    libstdc++.so.6 => /usr/lib/libstdc++.so.6
    libc.musl-aarch64.so.1 => /lib/ld-musl-aarch64.so.1
    libgcc_s.so.1 => /usr/lib/libgcc_s.so.1
```

## How to Build Docker Locally

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

If no errors occur during execution, and the linter correctly identifies all errors and warnings, then the schema has
been updated successfully.

After updating the schema, it's also important to run the project's unit tests to confirm that nothing was broken by the
schema update:

```shell
npm run test
```
