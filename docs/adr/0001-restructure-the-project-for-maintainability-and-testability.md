---
status: "accepted"
date: 2025-08-05
decision-makers: "@zavoloklom"
consulted: "@sw1tchdev"
informed: none
---

# Restructure the Project for Maintainability and Testability

## Context and Problem Statement

The project has grown organically without a clear structural or architectural model. Over time, modules, helpers, and
abstractions have accumulated in an ad hoc manner, leading to an increasingly fragmented and ambiguous codebase.

Notable issues include:

- Core logic, utilities, and domain-specific modules are intermingled without clear boundaries.
- Functional helpers and class-based abstractions coexist in the same locations, often without clear rationale.
- The `utils/` folder in particular has become a dumping ground for unrelated logic.
- Cross-cutting concerns and implicit dependencies create hidden couplings between modules.
- File organization does not reflect conceptual responsibilities or architectural layers.
- Writing unit tests is harder than necessary — especially when mocking or isolating behavior.

The need for structural refactoring has become pressing: upcoming feature work includes support for new linting rules
and a mechanism for users to define custom rules. These enhancements require clearer module boundaries and greater
extensibility, which are not feasible under the current structure.

Without restructuring, continued development risks compounding complexity and introducing avoidable regressions.

Originally, text was passed directly into the rules and parsed within them. This approach was chosen to reduce
dependency on the parsing library, since it was assumed that conversion to an AST would not be required in all cases.
Concerns existed regarding whether re-saving would preserve formatting. Issue #136 confirmed that this could lead to
problems. After the fix and in the absence of further reports, re-saving can now be considered safe. Centralizing the
parsing at a higher level and performing it only once provides a clear performance benefit.

How should the project structure be refactored to improve clarity, testability, and alignment with best practices?

## Decision Drivers

- **Code discoverability and clarity**  
  The structure should allow developers to easily locate relevant functionality and understand code ownership and
  responsibilities.

- **Testability and modularity**  
  The new architecture should promote loose coupling and clearly defined boundaries, facilitating mocking and unit
  testing.

- **Consistency and maintainability**  
  The project should adopt a consistent architectural style and file organization that enables long-term
  maintainability.

- **Extensibility**  
  It should be easy to introduce new features or internal components without triggering widespread refactoring.

- **Replaceability of external dependencies**  
  The system should isolate third-party libraries and services in a way that allows them to be replaced with minimal
  effort.

- **Alignment with best practices**  
  The chosen structure should follow widely accepted patterns in the TypeScript ecosystem to improve onboarding and
  community alignment.

## Considered Options

### Functional (Capability-Oriented) Modularization

This approach organizes the project by capabilities or functional domains, rather than by architectural layers. Each
top-level directory encapsulates a complete area of concern, including its logic, interfaces, and supporting utilities.

#### Proposed Structure

```text
src/
├── cli/                  # CLI entrypoint, argument parsing, triggering lint/fix
├── linter/               # Core orchestration logic (DCLinter), runs rules and formatters
├── rules/                # Built-in rules, Rule contract, rule loader and metadata
│   └── core/
│   │   ├── no-duplicate-ports.ts
│   │   ├── ...
│   ├── rules.types.ts
│   └── rules-loader.ts
│   └── utils/
│   │   ├── service-ports-parser.ts
├── formatters/           # Built-in formatters, formatter contract, loader, registry
│   ├── stylish.ts
│   ├── json.ts
│   ├── formatter.types.ts
│   └── formatter-loader.ts
│   └── utils/
│   │   ├── escape-xml.ts
├── config/               # Configuration parsing and schema validation
│   ├── config-loader.ts
│   └── config.types.ts
├── compose/              # Docker Compose parsing and schema validation
│   ├── parser.ts
│   └── validator.ts
├── logger/               # Logger interface and implementation
│   ├── logger.ts
│   └── logger.types.ts
├── utils/                # Generic stateless helpers
│   ├── comments-handler.ts
│   └── ...
└── errors/               # Custom error classes
```

#### Key Characteristics

Each capability owns its contracts and infrastructure (e.g., `rules/` includes `rules-loader.ts`, types, and rule
definitions).

The `linter/` module acts as the orchestrator, importing only what it needs from each capability (rules, formatters,
config, etc.).

Promotes local reasoning: developers working on one area (e.g., formatters) stay within one module.

Easily supports future modularization (e.g., publishing `@dclint/rules-core`, `@dclint/formatter-json` as separate
packages).

### Option: Clean Architecture

This option applies a Clean Architecture structure with strict layering and dependency direction. It introduces a clear
separation of responsibilities across `domain`, `application`, `infrastructure`, and `presentation` layers. A dedicated
facade class (`DCLinter`) is provided as the main entry point for external usage (library consumers).

#### Proposed Structure

```text
src/
├── main.ts                         # Composition root (entry for CLI or Lib)
├── presentation/
│   └── cli/                        # CLI adapter (arg parsing, stdout)
│       ├── cli.ts
├── application/                    # Application layer (use cases and facade)
│   ├── ports/                      # Ports: interfaces for infra
│   │   ├── formatter.ts
│   │   ├── logger.ts
│   │   ├── file-finder.ts
│   │   ├── compose-validator.ts
│   │   └── config-loader.ts
│   ├── use-cases/
│   │   ├── lint-runner.ts
│   │   ├── fix-runner.ts
│   ├── facade/
│   │   └── DCLinter.ts             # Public API for library consumers
├── domain/                         # Business rules and contracts
│   ├── models/                     # Core data types: LintContext, LintResult
│   │   ├── rule.ts
│   │   ├── lint-context.ts
│   │   ├── lint-result.ts
│   │   └── rule-meta.ts
│   └── services/                   # Domain logic helpers (e.g. rule-utils)
│       └── rule-utils.ts
├── infrastructure/                 # Adapters and concrete implementations
│   ├── rules/
│   ├── formatters/
│   ├── config-loader/
│   ├── rules-loader/
│   ├── formatter-loader/
├── shared/                         # Stateless helpers, utilities
├── errors/                         # Domain-specific error types
```

#### Key Characteristics

- **Domain independence**: All core logic is isolated in `domain/`, which has no dependencies on infrastructure or
  framework code.
- **Application orchestration**: The `application/` layer implements all use cases (lint, fix) and serves as the glue
  between domain and infrastructure.
- **Single public entry point**: `DCLinter` acts as a library-facing API, encapsulating the complexity of internal
  orchestration.
- **CLI adapter isolation**: CLI-specific logic is fully contained in the `presentation/cli` layer.
- **No runtime plugin system**: Built-in rules and formatters are placed in `infrastructure/` as implementations of
  domain contracts.
- **Extension-ready**: Future support for custom rules/formatters can be handled via extending the loaders without
  compromising architecture.

## Decision Outcome

Chosen option: **Clean Architecture** (with minor adjustments).

This option was selected because it aligns with the most critical decision drivers: testability, maintainability, and
extensibility. While it introduces additional structural overhead compared to functional modularization, the long-term
benefits in clarity and isolation of concerns outweigh the slower iteration speed.

As part of this decision:

- The final project structure will slightly differ from the proposed layout to improve readability, while fully
  preserving all layer boundaries and dependency rules.
- The `YamlComposeDocument` implementation will only be extended with common functions frequently used in rules. Direct
  usage of the YAML library within rules remains permitted for now. A future migration to a full adapter approach (
  removing YAML usage from rules entirely) is acknowledged but not required at this stage.

### Confirmation

- Implementation merged into codebase.
- The new architecture is documented in `/docs/product/architechture.md`.
- All unit and integration tests are passing in CI.
- Benchmarks confirm no performance regression compared to the previous versions.

## Pros and Cons of the Options

### Option 1: Functional (Capability-Oriented) Modularization

#### Good

- Promotes **discoverability and clarity** by organizing code around capabilities (e.g. `rules/`, `formatters/`).
- Encourages **modularity** through localized logic, reducing the scope of change for small enhancements.
- Supports **extensibility** by enabling drop-in additions of new rule types or formatters with minimal ceremony.
- Fast to iterate — minimal overhead in adding features or utilities.

#### Bad

- **Testability suffers** when logic and dependencies are co-located; mocking file I/O or logger calls becomes entangled
  with core logic.
- Lack of separation between pure business logic and orchestration makes **maintenance harder** over time.
- Risks **inconsistency** between modules (some object-oriented, some functional).

#### Neutral

- Works well in small, fast-moving projects, but becomes fragile with growth.

### Option 2: Clean Architecture

#### Good

- Strict separation improves **testability and modularity** — core logic has no infrastructure dependencies.
- **Replaceability of external dependencies** is explicit: all adapters are swappable at the infrastructure layer.
- **Clarity of responsibility**: domain, use cases, and I/O are distinct, supporting long-term maintainability.
- Aligns with **best practices** in architectural layering; easy to onboard experienced developers.

#### Bad

- Slower to evolve if discipline is maintained — each addition may require edits in contracts, adapters, and loaders.
- **Extensibility requires structural awareness** — contributors need to understand the architecture to integrate
  correctly.

#### Neutral

- `DCLinter` facade offers a clean API, but isn't a strict architectural necessity — more a convenience layer.

### Option 3: Do Nothing

#### Good

- No cost in terms of refactoring, migration, or relearning the structure.
- Contributors are already familiar with the layout and working patterns.

#### Bad

- Poor **testability** due to tight coupling of logic, dependencies, and side effects.
- Low **modularity** — helpers and business logic are not cleanly separated.
- Hard to maintain or extend without introducing regressions.
- No clear path for **external rule or formatter integration**.

#### Neutral

- Viable only for short-term, maintenance-only scenarios.

## More Information

- Martin Fowler — [Software Architecture Guide](https://martinfowler.com/architecture/)
- Robert C. Martin — _Clean Architecture: A Craftsman’s Guide to Software Structure and Design_ (2017)
- Alistair Cockburn — [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- Uncle Bob — [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- ThoughtWorks Technology Radar —
  [Capability-Oriented Architecture](https://www.thoughtworks.com/radar/techniques/capability-oriented-architecture)
- Khalil Stemmler -
  [Clean Architecture with TypeScript](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/)
- vFunction Blog -
  [Developing modular software: Top strategies and best practices](https://vfunction.com/blog/modular-software/)
- [Functional Core, Imperative Shell](https://github.com/kbilsted/Functional-core-imperative-shell/)
