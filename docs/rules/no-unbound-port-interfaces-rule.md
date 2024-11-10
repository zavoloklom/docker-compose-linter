# No Unbound Port Interfaces Rule

When specifying ports for services in Docker Compose, it is recommended to explicitly set the host interface or IP
address to prevent accidental exposure to the network.

- **Rule Name**: no-unbound-port-interfaces
- **Type**: error
- **Category**: security
- **Severity**: major
- **Fixable**: no

## Problematic Code Example

```yaml
services:
  database:
    image: postgres
    ports:
      - "5432:5432"  # Exposed on all interfaces (0.0.0.0) by default
```

## Correct Code Example

```yaml
services:
  database:
    image: postgres
    ports:
      - "127.0.0.1:5432:5432"
```

## Rule Details and Rationale

This rule helps prevent accidental exposure of container ports to the local network. Without specifying a host interface
or IP address, services may unintentionally become accessible from outside, posing a security risk. It is recommended to
always set a `host_ip` to appropriately limit container access.

When Docker Compose ports are specified without a host IP address, the ports are bound to all network interfaces by
default (i.e., `0.0.0.0`). This means that any service running in a container is accessible from all IP addresses that
can reach the host machine. If the Docker setup is running on a server connected to the internet, any exposed ports
become open to the world, potentially exposing sensitive services or data.

Consider a Docker Compose setup for a development environment with the following configuration:

```yaml
services:
  database:
    image: postgres
    ports:
      - "5432:5432"  # Exposed on all interfaces (0.0.0.0) by default
  app:
    image: myapp
    depends_on:
      - database
    ports:
      - "80:80"  # Exposed on all interfaces (0.0.0.0) by default

```

Because both services are exposed on `0.0.0.0` (all network interfaces), any client with access to the network,
including the internet if this is a cloud-hosted server, can connect directly to these services without restriction.

**Unauthorized Access:** Attackers could scan the IP of the host machine and discover open ports (80 and 5432). They
might attempt brute-force attacks on the database or probe the application for vulnerabilities.

**Data Leakage:** If the PostgreSQL database doesn’t have proper authentication or is configured with weak credentials,
an attacker could gain direct access to the database, leading to data exfiltration or corruption.

**Service Disruption:** By connecting to open ports, attackers could flood services with requests, potentially causing a
denial-of-service (DoS) or exhausting resources for legitimate users.

If you need to keep services accessible only within Docker’s internal network for inter-container communication,
consider using [`expose`](https://docs.docker.com/reference/compose-file/services/#expose) instead of `ports` in your
Docker Compose configuration.

### Usage in Local Environments

If Docker Compose is used exclusively in a local environment (e.g., for development), explicitly specifying IP addresses
may seem redundant, as containers are isolated by default in a virtual network. However, for strict security adherence,
specifying an interface even in local networks can help avoid accidental network exposure. In these cases, consider
configuring the rule as a recommendation (a warning) to highlight potential risks but not enforce strict compliance.

If additional complexity hinders readability, you can add an exception to this rule for strictly local configurations to
skip IP interface checks in such cases.

## Version

This rule was introduced in Docker-Compose-Linter [1.1.0](https://github.com/zavoloklom/docker-compose-linter/releases).

## References

- [Docker Compose Ports Reference](https://docs.docker.com/compose/compose-file/#ports)
- [Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Docker Networks Explained](https://accesto.com/blog/docker-networks-explained-part-2/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
