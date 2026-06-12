# AI Mind Simulator Lab

## Product Decision

AI Mind Studio becomes a course-linked simulation lab. It is not a collection of unrelated demos. Every mission must teach one or more course modules, expose an agent failure mode, require a human control decision, and end with a reusable artifact.

## Information Architecture

- `/other/ai-mind/studio/`: mission deck and course map.
- `/other/ai-mind/studio/research-data/`: the existing flagship labor-research simulator.
- `/other/ai-mind/studio/simulator.html?mission=<id>`: shared engine for additional missions.
- `scenarios.js`: mission contracts, checkpoints, consequences, scoring, course links, and take-home templates.

## Initial Mission Deck

### Research Data: Wage Memo

- Course: Parts 01, 02, and 06.
- Skills: task contracts, permissions, merge audit, weights, clustering, citation checks.
- Artifact: empirical task contract and verification plan.

### Writing: Evidence-Locked Policy Brief

- Course: Parts 01, 04, 06, and 12.
- Skills: claim-evidence boundaries, outline approval, citation tracing, causal-language control.
- Artifact: writing contract and claim-evidence matrix.

### Project Operations: 9AM Fieldwork Control Room

- Course: Parts 05, 07, and 08.
- Skills: connector permissions, QA triage, owner/deadline assignment, escalation and stop rules.
- Artifact: daily operations runbook and escalation matrix.

### Large Data: Fifty Million Rows

- Course: Parts 02, 06, 08, and 09.
- Skills: schema-first planning, chunking, checkpointing, validation samples, resource limits.
- Artifact: large-data execution contract and QA checklist.

## Shared Interaction Model

Each shared-engine mission contains:

1. A briefing with course links and a clear simulated-data disclosure.
2. Four decision checkpoints with a fast/hands-off and controlled option.
3. A visible operational consequence after each choice.
4. A final control score and risk ledger.
5. Two copyable Markdown artifacts.

## Acceptance Criteria

- All four missions are reachable from the Studio hub.
- Mission cards identify relevant course modules and learning outcomes.
- Writing, Project Operations, and Large Data run to completion in Vietnamese and English.
- Every mission produces a score, risk ledger, debrief, and take-home templates.
- Existing Research Data simulator behavior remains intact at its new route.
- Desktop and 390px mobile layouts have no horizontal overflow or runtime errors.
