# Control Your AI Mind Design

## Purpose

Build a public course and knowledge hub inside Huy Le Vu's personal website for economists and researchers who want to use AI agents as disciplined research operators, not as generic chatbots.

## Name

Primary name: **Control Your AI Mind**

Subtitle: **Agentic workflows for economists and research people**

The name keeps the original "control your AI mind" idea, is memorable, and leaves room for both conceptual teaching and tool-specific libraries.

## Scope

The first implementation is a static, data-driven microsite under `other/ai-mind/`. It should expose:

- A landing section that states the course promise.
- A course map organized around mindset, context, skills, memory, tools, and verification.
- A searchable skill/library surface for reusable agent patterns.
- A source atlas seeded from public docs, selected starred GitHub repositories, and the existing X repost dataset.
- A small set of operating principles grounded in Huy's economics workflow.

## Architecture

Use the repo's existing static-site pattern:

- `other/ai-mind/index.html` for semantic structure.
- `other/ai-mind/styles.css` for the page-specific design system.
- `other/ai-mind/data.js` for course modules, library records, source records, and principles.
- `other/ai-mind/app.js` for rendering, filters, and integration with `other/x-reposts/reposts-data.js`.

No build step is required.

## Design Direction

Visual thesis: quiet research lab console with editorial typography, thin dividers, open sections, and restrained cobalt/graphite accents.

The UI should avoid a generic SaaS card grid. Cards are acceptable only for repeated records and should remain compact. The first viewport should make the brand unmistakable and show the core knowledge map: Context, Skills, Memory, Tools, Verification, Research.

## Content Model

The content should treat mindset as the spine and tools as supporting modules. The course order is:

1. From chatbot to research operator.
2. Task contracts and delegation.
3. Context engineering for research.
4. Skills, plugins, and subagents.
5. Memory, wiki, and source layers.
6. Evidence-first economics workflow.
7. Verification loops.
8. Building a personal research agent OS.

Library records should include title, type, stage, tool family, audience, summary, url, and tags. Source records should include title, source type, status, credibility, workflow stage, url, and notes.

## Verification

Manual verification should confirm:

- The page loads from `/other/ai-mind/`.
- Search and filters update visible library and source records.
- Course module selection updates the module detail panel.
- X repost records are imported when `other/x-reposts/reposts-data.js` exists.
- Desktop and mobile layouts do not overflow.

