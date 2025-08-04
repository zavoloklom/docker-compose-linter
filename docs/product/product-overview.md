# Product Overview

This document defines the product vision, goals, scope, and intended use of DCLint.
It serves as a reference for contributors, maintainers, and users to understand what the project is, what problems it
aims to solve, what it prioritizes, and where it’s heading.

It is intended to:

- Guide decision-making around new features, contributions, and architectural changes.
- Help new maintainers or contributors onboard quickly and align with the product direction.
- Clearly communicate the boundaries and expectations of the tool, both functional and non-functional.

## Overview

DCLint is a command-line utility that statically analyzes `docker-compose.yml` files to enforce best practices, catch
common misconfigurations, and improve consistency across teams — helping prevent runtime errors and simplify DevOps
workflows.

## Problem Statement

[Docker Compose](https://docs.docker.com/compose/) is a widely used tool for defining and running multi-container
applications. However, Compose files are
often written manually, which makes them prone to configuration errors, anti-patterns, and inconsistent structure across
teams and environments. Many of these issues are only discovered at runtime, leading to avoidable downtime, failed
deployments, or unstable development workflows.

Despite the prevalence of Compose, there are limited options to enforce consistency, catch
common issues early, or align on shared standards for Compose configuration.

Common pain points include:

- Misconfigurations (e.g., incorrect port definitions).
- Anti-patterns (e.g., use of `latest` tags, implicit host networking).
- Errors detected only during deployment or container startup.
- Fragmented conventions and lack of shared rule enforcement.

## Target Audience

DCLint is designed primarily for the following roles:

- **Developers**  
  Want to run DCLint locally to validate and auto-fix their Docker Compose files during development.
- **DevOps Engineers**  
  Need to catch misconfigurations early in the CI/CD pipeline to avoid runtime failures and reduce debugging effort.
- **CI/CD Engineers**  
  Integrate DCLint into automated workflows and rely on output to fail builds on lint errors.
- **Security Engineers**
  Use DCLint to detect insecure patterns in Compose files and enforce security policies in infrastructure-as-code
  pipelines.
- **Team Leads / Tech Leads**  
  Want to enforce team-wide conventions across multiple repositories via configurable rule sets.
- **OSS Integrators / Tool Builders**  
  Consume machine-readable output (e.g., JSON) to plug DCLint into broader QA or auditing pipelines.

## Vision

Establish DCLint as the standard tool for linting Docker Compose files — as Hadolint is for Dockerfiles or ESLint for
JavaScript.

Build and maintain an open, trustworthy, and actively supported OSS project — following best practices in
transparency, community engagement, responsible security, and long-term sustainability.

## Goals and Objectives

### Core Purpose

- Detect common misconfigurations, anti-patterns, and bad practices in Compose files.
- Provide safe auto-fix and formatting capabilities to ensure consistent, maintainable Compose files.

### Developer Experience

- Provide an easy-to-use, zero-configuration CLI tool that can be installed via common distribution channels (e.g., npm,
  Docker, binary releases).
- Follow CLI UX best practices for help, error reporting, and consistency.
- Offer clear, accessible documentation that helps users get started quickly and use the tool effectively.

### Workflow Integration

- Provide integration with popular CI/CD systems (e.g., GitHub Actions, GitLab CI).
- Provide integration with popular IDEs (e.g., VSCode) to surface linting feedback in real time during editing.
- Support usage in developer automation tools (e.g., pre-commit).

### Extensibility

- Allow per-project configuration, enabling teams to define and enforce their own Compose standards.
- Support custom rules and output formatters through a plugin-friendly architecture.

## Non-Functional Requirements

- Should execute in under 500ms on typical Compose files.
- Should not require Docker to be installed.
- Should have minimal runtime and installation dependencies.
- Should operate fully offline.

## Out of Scope

DCLint explicitly limits its scope to static analysis of Docker Compose files. It does not attempt to replace existing
tools or address unrelated use cases:

- **Validation of Dockerfiles** — use [Hadolint](https://github.com/hadolint/hadolint) for this purpose.
- **Validation of Kubernetes, Helm, or other IaC manifests** — DCLint is focused exclusively on `docker-compose.yml`.
- **Runtime or dynamic validation** — the tool does not pull images, resolve registries, or inspect live environments.
- **Replacing `docker-compose config`** — DCLint does not handle variable resolution or full config rendering.
- **Execution or deployment** — DCLint performs only static analysis; it does not run, simulate, or provision any
  services.

## Key Metrics

- **Adoption**: growth in npm installs, Docker pulls, GitHub stars/forks.
- **Usage in CI/CD**: inclusion in GitHub Actions, GitLab CI, pre-commit hooks.
- **Velocity**: time to close issues and merge PRs; contributor activity.
- **Stability**: rule behavior consistency across versions; low frequency of regressions.
- **Ecosystem integration**: presence in curated lists, blog posts, other OSS tools.

## Related Documents

- [`README.md`](../../README.md) — usage, installation, rule list.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — guidelines for contributors.
- [`CHANGELOG.md`](../../CHANGELOG.md) — version history.
- [`ADR/`](../adr) — architectural decisions.
