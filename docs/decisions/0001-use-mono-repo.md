---
# These are optional elements. Feel free to remove any of them.
status: accepted
date: 2023-04-19 when the decision was last updated 
---
# Use Monorepo

## Context and Problem Statement

The whole project is tightly coupled with all its main parts: scout, ui, and vscode extension; guinea-pig project is used to tests between scout and vscode extension. Each code should serve as a source of truth without duplications.

## Decision Drivers

* DRY principal

## Considered Options

* Monorepo
* Polyrepo with npm packages
* Git submodules
* Duplicate code

## Decision Outcome

Chosen option: "Monorepo", because it allows to re-use the source code from different places.

### Consequences

* Reuse code
* Even though it's a mono repo, these are not all coupled npm packages, therefore their versioning and deployment is separate
