# Service Keys Order Rule

Ensures that keys within each service in the Docker Compose file follow a specific order. This rule helps maintain
consistency and readability by organizing service definitions in a structured manner.

This rule is fixable. The linter can automatically reorder keys within each service according to the predefined order
without altering their internal content.

- **Rule Name:** service-keys-order
- **Type:** warning
- **Category:** style
- **Severity:** minor
- **Fixable:** true

## Problematic Code Example

```yaml
services:
  app:
    container_name: my_container
    image: image
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/data
    ports:
      - "8080:8080"
```

## Correct Code Example

```yaml
services:
  app:
    image: image
    container_name: my_container
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/data
    ports:
      - "8080:8080"
```

## Rule Details and Rationale

The properties in the Docker Compose file are organized into logical groups. This structure enhances readability,
maintainability, and clarity by following a logical flow from core service definitions to execution context.

This order and grouping of properties in the Docker Compose file create a structured, logical flow that enhances the
file’s readability and maintainability. By organizing properties from core definitions through to execution context, the
structure allows for quick comprehension and efficient management, adhering to best practices and facilitating
collaboration among developers and operations teams.

### Core Definitions

**Properties order:** `image`, `build`, `container_name`

These properties define what the service is, where it comes from, and how it is named. Placing them at the top provides
an immediate understanding of the service's fundamental characteristics, making it easier to identify and manage.

### Service Dependencies

**Properties order:** `depends_on`

This property specifies the relationships between services and the order in which they should start. Including it early
helps clarify the service dependencies and overall architecture, which is crucial for ensuring correct startup sequences
and inter-service communication.

### Data Management and Configuration

**Properties order:** `volumes`, `volumes_from`, `configs`, `secrets`

These properties handle data persistence, sharing, configuration management, and sensitive information like secrets.
Grouping them together provides a clear overview of how the service interacts with its data and configuration resources,
which is essential for ensuring data integrity and secure operations.

### Environment Configuration

**Properties order:** `environment`, `env_file`

Environment variables and external files that define the service’s operating environment are crucial for configuring its
behavior. Grouping these properties together ensures that all environment-related configurations are easily accessible,
making it simpler to adjust the service’s runtime environment.

### Networking

**Properties order:** `ports`, `networks`, `network_mode`, `extra_hosts`

These properties define how the service communicates within the Docker network and with the outside world. Grouping
networking-related configurations together helps to clearly understand and manage the service’s connectivity, ensuring
proper interaction with other services and external clients.

### Runtime Behavior

**Properties order:** `command`, `entrypoint`, `working_dir`, `restart`, `healthcheck`

These properties dictate how the service runs, including the commands it executes, the working directory, restart
policies, and health checks. Placing these properties together creates a clear section focused on the service’s runtime
behavior, which is vital for ensuring that the service starts, runs, and maintains its operation as expected.

### Operational Metadata

**Properties:** `logging`, `labels`, `profiles`

Metadata and logging configurations are important for monitoring, categorizing, and managing the service, but they are
secondary to its core operation. By grouping them near the end, the focus remains on the services functionality, while
still keeping operational details easily accessible for management purposes.

### Security and Execution Context

**Properties:** `user`, `isolation`

These properties define the security context and isolation levels under which the service runs. They are crucial for
maintaining security and proper resource management but are more specific details that logically follow after the
service’s general operation has been defined.

## Options

The service-keys-order rule allows customization of how the keys within each service are ordered. The rule provides two
key options to control the order of groups and the keys within those groups:

- `groupOrder` (optional): Specifies the order of the logical groups within each service. If not provided, the default
  group order is used.
- `groups` (optional): Allows specifying custom key sets for each group. If not provided, the default key sets are used
  for each group.

These options allow users to control both the order of the groups (e.g., ensuring networking configurations appear
before environment variables) and the specific keys within those groups.

### Default Behavior

If no options are provided, the rule will follow the default group order and default key sets. The predefined order
ensures logical grouping of properties in the structure in the following structure:

#### Default Group Order

1. [Core Definitions](#core-definitions)
2. [Service Dependencies](#service-dependencies)
3. [Data Management and Configuration](#data-management-and-configuration)
4. [Environment Configuration](#environment-configuration)
5. [Networking](#networking)
6. [Runtime Behavior](#runtime-behavior)
7. [Operational Metadata](#operational-metadata)
8. [Security and Execution Context](#security-and-execution-context)
9. Other: Any keys not belonging to the above categories

The linter will check for key order within these groups and reorganize them accordingly if they are out of order.

### Customizing Group Order

The `groupOrder` option allows you to define a custom sequence of groups within each service. For example, if you want
to have `Networking` appear before `Data Management and Configuration`, you can specify that explicitly:

```json
{
  "rules": {
    "service-keys-order": [
      1,
      {
        "groupOrder": [
          "Core Definitions",
          "Service Dependencies",
          "Networking",
          "Data Management and Configuration",
          "Environment Configuration",
          "Runtime Behavior",
          "Operational Metadata",
          "Security and Execution Context"
        ]
      }
    ]
  }
}
```

In this case, the linter will check and enforce the specified order of groups when reordering service keys.

### Customizing Keys within Groups

The `groups` option allows you to define custom sets of keys for each group. If you need to add new keys or redefine the
default set of keys for a particular group, you can do so using the groups option. For example, if you have additional
custom configurations under `Environment Configuration` and `Networking`, you can include them as follows:

```json
{
  "rules": {
    "service-keys-order": [
      1,
      {
        "groups": {
          "Environment Configuration": [
            "env_file",
            "environment"
          ],
          "Networking": [
            "ports",
            "networks",
            "network_mode",
            "hostnames",
            "extra_hosts"
          ]
        }
      }
    ]
  }
}
```

In this case, the `Environment Configuration` group will now change default order of keys `env_file` and `environment`,
and the `Networking` group will look for `hostnames` in addition to the default keys like `ports` and `networks`.

If certain groups are not specified in the `groups` option, the default key order for those groups will be used.

### Example with Both `groupOrder` and `groups`

```json
{
   "rules": {
      "service-keys-order": [
         1,
         {
            "groupOrder": [
               "Core Definitions",
               "Service Dependencies",
               "Networking",
               "Data Management and Configuration",
               "Environment Configuration",
               "Runtime Behavior",
               "Operational Metadata",
               "Security and Execution Context"
            ],
            "groups": {
               "Environment Configuration": [
                  "env_file",
                  "environment"
               ],
               "Networking": [
                  "ports",
                  "networks",
                  "network_mode",
                  "hostnames",
                  "extra_hosts"
               ]
            }
         }
      ]
   }
}
```

## Version

This rule was introduced in [v1.0.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Forum Discussion: Docker-compose.yml Best Practices](https://forums.docker.com/t/docker-compose-yml-best-practices/28995)
- [Services top-level elements](https://docs.docker.com/reference/compose-file/services/)
- [YAML Best Practices](https://www.yaml.info/learn/bestpractices.html)
