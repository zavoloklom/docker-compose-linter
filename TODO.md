# TODO

This section outlines tasks and improvements to enhance the linter's functionality and efficiency. Each task helps
ensure better code quality, readability, and maintainability.

## Add New Rules from KICS

[Link to all rules](https://docs.kics.io/latest/queries/dockercompose-queries/)

### Docker Socket Mounted In Container

### Volume Has Sensitive Host Directory

### Volume Mounted In Multiple Containers

### No New Privileges Not Set

### Privileged Containers Enabled

### Healthcheck Not Set

### Cgroup Not Default

### Restart Policy On Failure Not Set To 5

### Container Traffic Not Bound To Host Interface

### Privileged Ports Mapped In Container

### Container Capabilities Unrestricted

### Default Seccomp Profile Disabled

### Host Namespace is Shared

### Memory Not Limited

### Pids Limit Not Set

### Security Opt Not Set

### Shared Host IPC Namespace

### Shared Host Network Namespace

### Shared Host User Namespace

### Cpus Not Limited

### Shared Volumes Between Containers




## Add New Rules

### Alphabetical Sorting of Environment Variables

- Category: style
- Severity: info
- Description: Environment variables within a service should be sorted alphabetically to improve readability.
- Fixable: Yes

### Volumes Alphabetical Order Rule

- Category: style
- Severity: info
- Description: Volumes in the volumes section should be sorted alphabetically to improve readability and
  maintainability.
- Fixable: Yes

```yaml
# Wrong
volumes:
  data_volume:
  log_volume:
```

```yaml
# Correct
volumes:
  log_volume:
  data_volume:
```

### Alphabetical Sorting of Networks

- Category: style
- Severity: info
- Description: Networks in the networks section should be alphabetically sorted for easier management and readability.
- Fixable: Yes

```yaml
# Wrong
networks:
  backend:
  frontend:
```

```yaml
# Correct
networks:
  frontend:
  backend:
```

### Single Quotes for String Values

- Category: best-practice
- Severity: warning
- Description: It is recommended to use single quotes (') for string values to maintain consistency and avoid errors
  when processing YAML.
- Fixable: Yes

```yaml
# Wrong
services:
  web:
    image: "nginx"
```

```yaml
# Correct
services:
  web:
    image: 'nginx'
```

### Consistent Key Style

- Category: best-practice
- Severity: warning
- Description: All keys in the YAML file should use the same style—either with quotes or without. This helps avoid
  inconsistencies and errors.

```yaml
# Wrong
services:
  "web":
    image: nginx
```

```yaml
# Correct
services:
  web:
    image: nginx
```

### Empty Lines Between Services

- Category: style
- Severity: info
- Description: It is recommended to leave empty lines between service definitions to improve readability.
- Fixable: Yes

### Empty Lines Between Configuration Sections

- Category: style
- Severity: info
- Description: Leave an empty line between major configuration sections (e.g., services, networks, volumes) to improve
  readability.
- Fixable: Yes

```yaml
# Wrong
services:
  web:
    image: nginx
networks:
  webnet:
```

```yaml
# Correct
services:
  web:
    image: nginx

networks:
  webnet:
```

### Port Mapping Format

- Category: best-practice
- Severity: warning
- Description: Ports should be specified in the host:container format to ensure clarity and prevent port mapping issues.
- Fixable: yes

```yaml
# Wrong
services:
  web:
    image: nginx
    ports:
      - "80"
```

```yaml
# Correct
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

### Explicit Format for Environment Variables

- Category: best-practice
- Severity: warning
- Description: It is recommended to use an explicit format for environment variables (e.g., KEY=value) to avoid
  ambiguity and errors.
- Fixable: Yes

```yaml
# Wrong
services:
  web:
    image: nginx
    environment:
      - KEY: value
```

```yaml
# Correct
services:
  web:
    image: nginx
    environment:
      - KEY=value
```

### Minimize Privileges

- Category: security
- Severity: error
- Description: Services should not run with elevated privileges unless necessary. This improves container security.
- Fixable: No

```yaml
# Wrong
services:
  web:
    image: nginx
    privileged: true
```

```yaml
# Correct
services:
  web:
    image: nginx
    privileged: false
```

### Minimize the Number of Privileged Containers

- Severity: error
- Description: The number of privileged containers should be minimized to enhance security.
- Fixable: No

### Use of Environment Variables

- Category: best practice
- Severity: warning
- Description: It's preferable to use environment variables for sensitive data and configuration to avoid hardcoding
  them in the configuration file.
- Fixable: No

```yaml
# Wrong
services:
  web:
    image: nginx
    environment:
      - SECRET_KEY=hardcoded_secret
```

```yaml
# Correct
services:
  web:
    image: nginx
    env_file:
      - .env
```

### Limit Container Restarts

- Category: performance
- Severity: warning
- Description: The container restart policy should be explicitly defined and align with the application's needs.

### Ensure Each Service Uses a healthcheck

- Category: performance
- Severity: warning
- Description: Using healthcheck ensures that services are running correctly and can trigger actions if problems are
  detected.
- Fixable: No

<https://medium.com/geekculture/how-to-successfully-implement-a-healthcheck-in-docker-compose-efced60bc08e>

### Specify Timeouts for healthcheck

- Category: performance
- Severity: warning
- Description: It's recommended to set timeouts for container healthcheck to avoid hanging services in case of failures.

```yaml
# Wrong
services:
  web:
    image: nginx
```

```yaml
# Correct
services:
  web:
    image: nginx
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost" ]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Avoid Hardcoded Paths in volumes

- Category: best practice
- Severity: warning
- Description: Avoid using hardcoded paths in volumes. Use environment variables or relative paths to improve
  portability.

```yaml
# Wrong
services:
  web:
    image: nginx
    volumes:
      - /absolute/path:/container/path
```

```yaml
# Correct
services:
  web:
    image: nginx
    volumes:
      - ./relative/path:/container/path
```

### Use Multi-Layered Secrets

- Category: security
- Severity: warning
- Description: Use Docker's built-in secret management (e.g., secrets) to securely handle sensitive data within
  containers.

```yaml
# Wrong
services:
  web:
    image: nginx
    environment:
      - SECRET_KEY=mysecretkey
```

```yaml
# Correct
services:
  web:
    image: nginx
    secrets:
      - secret_key

secrets:
  secret_key:
    file: ./secret_key.txt
```

### Empty Line at the End of the File (not sure)

- Category: style
- Severity: info
- Description: Each Docker Compose file should end with an empty line for better compatibility with various tools and
  version control systems.

### Indentation Should Be Set to 2 Spaces (not sure)

- Category: style
- Severity: info
- Description: It is recommended to use 2-space indentation for better readability and consistency in the configuration.
