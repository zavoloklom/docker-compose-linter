# Using Configuration Comments

Disabling linting rules via comments should be done cautiously and only when there is a clear, valid reason. It should
**not** be the default approach for resolving linting issues, as overuse can lead to poor code quality. Whenever a rule
is disabled, it's important to provide a comment explaining why this is being done in that specific situation. If a
disable comment is added as a **temporary measure**, make sure the underlying issue is addressed later and a follow-up
task is created.

**Configuration files** should be preferred over inline disables whenever possible, as they allow for consistent rule
management across the project.

## Disabling Rules

### Disabling All Rules for the Entire File

To **disable all linting rules** for the entire file, add the following comment at the **top** of the file:

```yaml
# dclint disable-file
```

This will disable **all rules** for the entire file. Use this only when it is absolutely necessary.

### Disabling Specific Rules for the Entire File

To **disable specific rules** for the entire file, add the following comment at the **top** of the file:

```yaml
# dclint disable
```

This will disable **all rules** in the file. Alternatively, you can specify specific rules like this:

```yaml
# dclint disable rule-name
```

You can also disable multiple specific rules:

```yaml
# dclint disable rule-name another-rule-name
```

### Disabling Rules for Specific Lines

**Note**: `disable-line` **only affects linting**, and **does not work with auto-fix**. Auto-fix is not applied to lines
where `disable-line` is used.

To **disable linting rules for a specific line**, use the `disable-line` comment. This can be added in two ways - on the
same or previous line:

- **Disable all rules for a line**:

  ```yaml
  services:
    service-a:
      image: nginx  # dclint disable-line
    service-b:
      # dclint disable-line
      image: nginx
  ```

- **Disable a specific rule for a line**:

  ```yaml
  services:
    service-a:
      image: nginx  # dclint disable-line rule-name
    service-b:
      # dclint disable-line rule-name
      image: nginx
  ```

- **Disable multiple specific rules for a line**:

  ```yaml
  services:
    service-a:
      image: nginx  # dclint disable-line rule-name another-rule-name
    service-b:
      # dclint disable-line rule-name another-rule-name
      image: nginx
  ```

### **Important Notes**

- **Auto-Fix Limitation**: The `# dclint disable-line` comment will **not** affect auto-fix operations. It only disables
  linting for the specified line but does not prevent automatic fixes from being applied.
- **`# dclint disable-file` vs. `# dclint disable`**: The `# dclint disable-file` comment disables **all rules** for the
  entire file, and it works **faster** than `# dclint disable`, which disables rules one by one. Use
  `# dclint disable-file` when you need to quickly disable all rules across the file.

### **Summary of Commands**

| Command                               | Description                                             | Affects Linting    | Affects Auto-Fix   |
| ------------------------------------- | ------------------------------------------------------- | ------------------ | ------------------ |
| `# dclint disable-file`               | Disables all linting rules for the entire file.         | :white_check_mark: | :white_check_mark: |
| `# dclint disable`                    | Disables all linting rules for the entire file.         | :white_check_mark: | :white_check_mark: |
| `# dclint disable rule-name`          | Disables a specific rule for the entire file.           | :white_check_mark: | :white_check_mark: |
| `# dclint disable rule-name ...`      | Disables multiple specific rules for the entire file.   | :white_check_mark: | :white_check_mark: |
| `# dclint disable-line`               | Disables all linting rules for the specific line.       | :white_check_mark: | :x:                |
| `# dclint disable-line rule-name`     | Disables a specific rule for the specific line.         | :white_check_mark: | :x:                |
| `# dclint disable-line rule-name ...` | Disables multiple specific rules for the specific line. | :white_check_mark: | :x:                |
