---
status: "accepted"
date: 2025-08-04
decision-makers: "@zavoloklom"
consulted: none
informed: none
---

# Use Markdown Architectural Decision Records

## Context and Problem Statement

The project has been under active development for nearly a year. As the project evolves and its architecture grows more
complex, key technical decisions are made regularly — often with significant impact on maintainability, scalability, or
contributor workflows.

Currently, these decisions are rarely recorded in a structured way. Context, rationale, and trade-offs often remain
implicit, buried in pull requests, chat threads, or maintainer memory.

To support long-term sustainability and encourage external contributions, the project needs a lightweight and accessible
way to document architectural reasoning. Such a system should lower the barrier to entry for new contributors, improve
transparency, and foster trust in the project's technical direction.

## Decision Drivers

- Need to preserve context for long-lived or complex technical decisions
- Desire to improve project transparency and contributor onboarding
- Avoid tool lock-in or external service dependency

## Considered Options

- Use MADR (Markdown Architectural Decision Records)
- Write decisions as public articles (e.g., Medium, Dev.to)
- Rely on issues and PR descriptions only

## Decision Outcome

Chosen option: "Use MADR", because it best balances clarity, ease of maintenance, and low overhead, while keeping the
decision history close to the codebase in a readable format.

### Confirmation

ADR files will be stored in the `/docs/adr/` folder in the repository and versioned along with the codebase. During code
reviews, new architectural decisions must include a corresponding ADR, when applicable. Periodic review (e.g., once per
release) will ensure ADRs remain relevant.

## Pros and Cons of the Options

### Use MADR (Markdown Architectural Decision Records)

- Good, because it's Markdown-based and works well with version control and static site generators
- Good, because it keeps decisions close to the code
- Good, because it's lightweight, easy to adopt, and doesn't require external tools
- Neutral, because maintaining consistency requires some discipline
- Neutral, because it lacks enforcement like CI checks

### Write decisions as public articles (e.g., Medium, Dev.to)

- Good, because it allows sharing reasoning and process with the broader community
- Good, because platforms offer rich formatting and visibility
- Bad, because the content is decoupled from the codebase
- Bad, because updates are harder to track and version over time
- Bad, because contributors need to consult an external site to understand decisions

### Rely on issues and PR descriptions only

- Good, because it requires no additional setup or tooling
- Neutral, because some context naturally lives in PRs anyway
- Bad, because reasoning is fragmented and hard to find later
- Bad, because issue trackers are not designed for structured decision records
- Bad, because PRs may get squashed or lost in noise over time

## More Information

### Choice of MADR Template Version

MADR offers several template versions. I evaluated the following:

- **v1.0.0** — too minimal, lacks metadata support and structure for consequences, confirmation, or alternatives.
- **v2.1.2** — more complete and have great utils like [Log4brains](https://github.com/thomvaill/log4brains) and
  [MADR Tools](https://github.com/nioe/madr-tools), but it's not necessary in that case.
- **v4.0.0** — provides good structure with optional sections, clean Markdown output, and better readability out of the
  box.

I chose **version 4.0.0** as the default for this project. It provides the right balance between clarity and flexibility
without overcomplicating the writing process.

### Links

- [MADR GitHub](https://adr.github.io/madr/) 4.0.0 – The Markdown Architectural Decision Records
- [The Markdown ADR (MADR) Template Explained and Distilled](https://medium.com/olzzio/the-markdown-adr-madr-template-explained-and-distilled-b67603ec95bb)
- [Michael Nygard's template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) – The first
  incarnation of the term "ADR"
- [Sustainable Architectural Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions) – The
  Y-Statements
- Other templates listed at
  [joelparkerhenderson/architecture_decision_record](https://github.com/joelparkerhenderson/architecture_decision_record)
