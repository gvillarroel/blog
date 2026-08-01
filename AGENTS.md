# Overview
This repository stores technical blog content and supporting assets.

## Documentation Rules
- Write documentation in English.
- Include references when they add useful context or attribution.

## Knowledge Workflow
- Read `knowledge/catalog.json` before researching a post.
- Use `.agents/skills/consult-expert-knowledge/SKILL.md` for software-engineering and data-science research.
- Treat `knowledge/expert-sources/` and `knowledge/.store/` as immutable, private, ignored inputs.
- Never commit, publish, attach, or copy private corpus text into a tracked path.
- Retrieval rankings are discovery signals; verify claims against returned authoritative text, identities, locators, and hashes.

## Content Workflow
- Store posts as Markdown under `src/content/posts/`.
- Keep incomplete or unverified work marked `draft: true`.
- Synthesize multiple sources, preserve disagreements, and verify time-sensitive claims against current primary sources.
- Run `npm run validate` before publishing.

## Decision Records
- Record durable technical or workflow decisions as ADRs under `.specs/adr/*.md`.
- Read existing ADRs before changing a previously chosen technical direction.

## Update Access Scope

- Writable project root: `C:\Users\villa\dev\blog`.
- Agents may create, modify, move, or delete files only inside this root and its descendants when the task requires it.
- Treat paths outside this root as read-only unless the user explicitly authorizes a broader scope.
- A reference to another repository or shared tool does not grant write access to it.

## Output

- Blogs will be deployed via github pages using astro latest version via static content
- A new version also will be stored as html in `C:\Users\villa\projects\blog\$TIMESTAMP`
- final version should try to ensure correct display of diagrams (mermaid, d3, echart, plantuml and so)

## Constrains

- Use internal skills to polish everything before pusblish it
