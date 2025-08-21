---
status: "accepted"
date: 2025-08-21
decision-makers: "@zavoloklom"
consulted: none
informed: none
---

# Declarative Style for Linter Issue Messages

## Context and Problem Statement

Linter issue messages in the current implementation are inconsistent in tone and structure. Some are phrased as
commands, others as descriptions, and others mix both styles. This inconsistency makes diagnostics harder to read, less
predictable for users, and more difficult for contributors to maintain.

We need to adopt a single, consistent style that is clear, easy to read in a terminal, and aligned with practices
established in other popular linters. This ADR evaluates candidate styles and records the decision to standardize on the
declarative, state-first style.

Examples of current mixed-style messages:

```text
Service "${context.serviceName}" is using both "build" and "image". Use one of them, but not both.
Quotes should not be used in service "${context.serviceName}" in volume "${context.volume}".
Service "${context.serviceName}" exports container port "${context.containerPort}" as "${context.hostPort}" without a host interface.
The "version" field should not be present.
```

## Decision Drivers

- **Consistency** — one recognizable pattern across all rules and contributors.
- **Usability and readability** — messages are quick to read and understand in a terminal.
- **Best practices for similar tools** — align with conventions users expect from other linters.
- **Minimal code changes** — adopting the style should not require significant refactoring of the codebase.

## Considered Options

### Imperative

Direct instruction phrased as a command ("Do X / Don't do Y"). Works well when there is a single, clear remediation
step.

#### Examples

```text
Use either build or image in service "${context.serviceName}", not both.
Remove quotes from volume "${context.volume}" in service "${context.serviceName}".
Specify a host interface when publishing port "${context.containerPort}" as "${context.hostPort}" in service "${context.serviceName}".
Remove the top-level property "version".
```

### Declarative (diagnostic / state-first)

State the observed condition or mismatch first ("Unexpected…/Missing…/Invalid…"). Emphasizes facts and keeps the primary
line concise.

#### Examples

```text
Unexpected simultaneous use of build and image in service "${context.serviceName}".
Unexpected duplicate container name "${context.containerName}" in service "${context.serviceName}" (conflicts with service "${context.conflictingService}").
Unexpected quotes in volume "${context.volume}" in service "${context.serviceName}".
Expected host interface when publishing port "${context.containerPort}" as "${context.hostPort}" in service "${context.serviceName}".
Unexpected "version" field.
```

### Normative (prescriptive / requirement-first)

Expresses obligation using RFC 2119/BCP 14 terms (MUST/SHOULD/MAY). Appropriate when enforcing a published policy/spec
where the obligation level itself is part of the rule's contract.

#### Examples

```text
Service "${context.serviceName}" MUST NOT set both build and image.
Service "${context.serviceName}" MUST use a unique container name. Duplicate name "${context.containerName}" conflicts with service "${context.conflictingService}".
Service "${context.serviceName}" MUST specify a host interface when publishing port "${context.containerPort}" as "${context.hostPort}".
Document SHOULD NOT contain top-level property "version".
```

## Decision Outcome

**Chosen option:** Declarative (diagnostic / state-first).

**Because:**

- **Ecosystem fit & familiarity:** this is the most common pattern in other linters; users recognize it instantly.
- **Visual cleanliness & scanability:** a short, factual line is easiest to scan and grep in console output.
- **Separation of concerns:** the diagnostic line describes the state only; severity stays in metadata and remains
  override-safe.
- **Extensibility:** suggestions can be attached separately (imperative tone) without changing the diagnostic itself.

Follow Google’s guidance for tone and grammar.

**How other tones are used:**

- **Normative →** `rule.meta.description` only. Short, human-readable statement of the rule’s intent (MUST/SHOULD) for
  docs and help output; not for diagnostics.
- **Imperative →** `LintIssue.suggestion` (when applicable, e.g., in a VS Code extension).

## Consequences

- **Positive:** A single, understandable style makes it easier to author new rules and onboard new contributors.
- **Positive:** We can add a test to enforce conformance to the chosen template, improving consistency over time.
- **Negative:** External scripts that parse older, non-standardized messages may break and must be updated to the new
  template.

### Confirmation

Recorded in the documentation, rule templates, and contributor guide.

## Pros and Cons of the Options

### Option 1: Imperative

- **Good:** highly actionable.
- **Good:** good for auto-fix suggestions and quick remediation.
- **Good:** consistent with Google’s “tell the user what to do next”.
- **Bad:** without strict templates, authors diverge in command style and level of detail.
- **Bad:** can read abrupt/blamey when context is unclear.
- **Bad:** weaker for stating complex states or invariants.

### Option 2: Declarative

- **Good:** quick to read; the user sees the fact first.
- **Good:** very uniform and easy to enforce with a small set of lead-in tokens.
- **Good:** aligns with common linter conventions (state-first diagnostics).
- **Bad:** without an explicit fix hint, some users still have to infer the remedy.

### Option 3: Normative

- **Good:** clear obligation level.
- **Good:** unambiguous when tied to policy/spec.
- **Good:** interoperable with BCP 14 semantics.
- **Bad:** MUST/SHOULD/MAY implicitly encode severity (error/warn/info), but severity is separate, user-overrideable
  metadata; if severity changes, the wording becomes misleading or must change with it.
- **Bad:** uppercase keywords can feel heavy-handed in day-to-day diagnostics; can distract from the concrete fix.
- **Bad:** most mainstream linters communicate severity via metadata, not message wording; mixing the two creates drift.

### Option 4: Do Nothing

- **Good:** zero migration cost.
- **Bad:** inconsistent UX.
- **Bad:** violates guidance favoring clarity and consistency.

## More Information

- [Writing Helpful Error Messages by Google](https://developers.google.com/tech-writing/error-messages/)
- [Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- [Stylelint Developer Guide: Writing rules](https://stylelint.io/developer-guide/rules/)
- [Eslint discussion about messages](https://github.com/eslint/eslint/issues/14914)
- [RFC 2119 + RFC 8174 (BCP 14)](https://datatracker.ietf.org/doc/html/rfc2119)
