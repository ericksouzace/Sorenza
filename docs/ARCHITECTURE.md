# Sorenza Desktop — Target Architecture

## Why the product moved from extension-first to app-first

A VS Code extension is excellent for workspace-local operations, but it is a poor boundary for the complete Sorenza product: cross-project mission history, Skills, agent orchestration, evidence bundles, cost governance, authentication, market modules and organization-level policy all outgrow a sidebar.

The extension may later return as an optional companion bridge. The desktop application owns the product experience and orchestration.

## Million-angle review matrix

The v0.3 redesign was checked through a combinatorial review model rather than pretending to manually enumerate one million unrelated bullets:

- 25 engineering/product domains;
- 10 failure modes;
- 10 mission lifecycle stages;
- 10 scale tiers;
- 4 environment trust levels;
- 10 UX/accessibility states.

25 × 10 × 10 × 10 × 4 × 10 = **1,000,000 review intersections**.

The matrix is used to discover classes of risk and opportunity. Duplicate findings are consolidated into architecture decisions.

## Core boundaries

### 1. Renderer

Responsibilities:

- mission composition;
- progressive disclosure;
- approvals;
- project selection;
- Skills/Agents/Evidence visualization.

Must never own:

- arbitrary shell execution;
- raw secrets;
- final policy decisions;
- PASS authority.

### 2. Tauri shell

Responsibilities:

- native window lifecycle;
- secure secret vault integration;
- narrow OS integration;
- typed connector commands;
- updater/signing in production.

The shell exposes only commands explicitly needed by the UI.

### 3. Mission Core

Pure/domain-first components:

- `MissionContract`;
- mission state machine;
- `TrustKernel`;
- budgets;
- approvals;
- Evidence Gate;
- promotion rules.

The Core must be testable without Tauri, OpenAI or GitHub.

### 4. Agent Runtime

Provider-neutral port with OpenAI as the first adapter.

Two candidate patterns exist in source:

- OpenAI Sandbox Agent for repository-backed sandbox work;
- function-tool agent for a Codespaces candidate workspace.

The runtime is allowed to produce a **candidate completion report** only.

### 5. Codespaces Connector

Current source uses GitHub CLI as the first connector implementation.

The connector intentionally avoids exposing a generic `run(command)` API to the AI. It offers typed operations and fixed quality gates.

### 6. Evidence Plane

Every acceptance criterion requires evidence.

Expected evidence sources:

- typecheck;
- lint;
- tests;
- build;
- browser assertions;
- visual regression;
- accessibility;
- performance budgets;
- security checks;
- human acceptance for inherently subjective criteria.

### 7. Verified Promotion

The primary project is not the AI's scratchpad.

Target promotion flow:

1. candidate workspace;
2. final diff;
3. independent gates;
4. evidence bundle;
5. approval when policy requires it;
6. atomic/signed promotion;
7. post-promotion smoke check.

## Multiagent policy

Atlas, Forge, Sentinel and Prism are not decorative personas.

- **Atlas:** decomposes and coordinates; cannot approve final evidence.
- **Forge:** edits implementation; cannot edit policy/evidence code during a mission.
- **Sentinel:** security review; cannot lift hard safety ceilings.
- **Prism:** UX/design/a11y review; subjective judgment never becomes machine PASS by itself.

Multiagent mode should only become default if benchmarked results beat the single-agent baseline on verified success per cost.

## Skills

A Skill is a versioned capability package, not a saved prompt.

Required fields:

- manifest ID/version;
- instructions;
- declared capabilities;
- requested permissions;
- quality gates;
- compatibility range;
- test fixtures/evals;
- provenance/signature for distribution.

Skill instructions are always lower authority than Sorenza policy.

## Long-term control plane

When usage justifies it, a cloud control plane can add:

- organization policies;
- encrypted sync;
- mission history;
- billing/cost budgets;
- remote workers;
- benchmark orchestration;
- Skills registry.

The desktop app should continue to work in a privacy-oriented local mode.
