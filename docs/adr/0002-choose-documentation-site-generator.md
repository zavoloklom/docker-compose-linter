---
status: "proposed"
date: 2025-08-05
decision-makers: @zavoloklom
consulted: none
informed: none
---

# Choose a Documentation Site Generator

## Context and Problem Statement

As the project continues to grow in scope and complexity, the volume of documentation in Markdown files is increasing.
Currently, documentation exists only as raw `.md` files within the repository, which makes it harder to navigate,
search, and consume — especially for users unfamiliar with the codebase structure.

The lack of a structured, user-friendly documentation site creates friction for onboarding new users and contributors.
It also limits the project's visibility and makes it harder to showcase capabilities, guides, and advanced usage
scenarios in a polished and interactive way.

To support adoption, outreach, and long-term maintainability, the project requires a proper documentation website that
is easy to maintain, pleasant to use, and extensible enough to accommodate advanced needs.

## Decision Drivers

- Ability to support full-text search
- Support for dark mode for accessibility and visual comfort
- Capability to embed interactive components (e.g., charts, diagrams)
- Ability to integrate a web-based playground (TypeScript-based)
- Option to monetize via Google AdSense or similar
- Markdown-based authoring with minimal contributor friction
- Low maintenance overhead and reasonable customization effort
- Open-source friendliness and active community

## Considered Options

- Docusaurus
- GitBook
- GitHub Wiki
- GitHub Markdown rendering (status quo)
- Astro
- VitePress
- Next.js / custom React site
- ReadMe.com

## Decision Outcome

<!--
Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision
driver | which resolves force {force} | … | comes out best (see below)}.
-->

### Confirmation

<!--
{Describe how the implementation of/compliance with the ADR can/will be confirmed. Are the design that was decided for
and its implementation in line with the decision made? E.g., a design/code review or a test with a library such as
ArchUnit can help validate this. Not that although we classify this element as optional, it is included in many ADRs.}
-->

## Pros and Cons of the Options

### Docusaurus

- Good: Full-text search via Algolia by default
- Good: Built-in dark mode support
- Good: MDX support allows embedding React components and playgrounds
- Good: Popular in OSS community; active ecosystem
- Good: Easy integration with Google AdSense
- Neutral: Requires light React knowledge to extend
- Bad: Build size and performance may need tuning for large docs

### GitBook

- Good: Clean UI, SaaS-based, minimal maintenance
- Good: Great onboarding for non-technical contributors
- Good: Search and theming built-in
- Bad: Limited extensibility — no custom JS or embedded ads on free tier
- Bad: Lock-in to hosted service and GitBook editor for advanced features
- Bad: Embedding interactive playgrounds is non-trivial

### Astro

- Good: High performance and flexible component model
- Good: Markdown/MDX support, any frontend framework usable
- Good: Playground and chart embedding possible
- Good: Can be deployed anywhere
- Neutral: Slightly more complex setup than Docusaurus/VitePress
- Bad: Requires custom work for search and ad integration

### VitePress

- Good: Simple, fast, clean setup
- Good: Dark mode, good DX
- Good: Markdown-first with some Vue extensibility
- Bad: Vue-specific — embedding React playground may require workarounds
- Bad: No built-in search unless self-configured
- Bad: Ad integration not straightforward

### Next.js / Custom React site

- Good: Maximal control — anything is possible
- Good: React-based playground and ads trivial to integrate
- Bad: High maintenance cost
- Bad: Overkill for documentation-only needs

### ReadMe.com

- Good: Full SaaS, polished UI, analytics, API playgrounds
- Good: Strong search, contributor tools
- Bad: Expensive and proprietary
- Bad: Ads and custom components not supported
- Bad: Markdown sync and version control limited

### GitHub Wiki

- Good: Zero setup, versioned with code
- Good: Familiar for GitHub users
- Bad: No full-text search
- Bad: No theming, customization, or interactivity
- Bad: Not suitable for user-facing documentation

### GitHub Markdown rendering (status quo)

- Good: Minimal effort and friction
- Good: Contributors can edit Markdown inline
- Bad: No search, no navigation, no theming
- Bad: Poor user experience for documentation discovery
- Bad: No support for interactivity or ads

## More Information

<!--
{You might want to provide additional evidence/confidence for the decision outcome here and/or document the team
agreement on the decision and/or define when/how this decision the decision should be realized and if/when it should be
re-visited. Links to other decisions and resources might appear here as well.}
-->
