---
name: consult-expert-knowledge
description: Consult the blog's two local private expert corpora for evidence-grounded software-engineering or data-science research before drafting a post.
---

# Consult expert knowledge

Use this skill when researching a blog post in software engineering, data science, AI,
or machine learning.

## Boundary

- Read `knowledge/catalog.json` before choosing a corpus or retrieval policy.
- Run `scripts/bootstrap-knowledge.ps1` when the local expert folders are absent.
- Treat `.know/` as the project-local domain registry. Use `know list keys` and
  `know list sources --key <DOMAIN>` to inspect it after bootstrap.
- Treat `knowledge/expert-sources/` as immutable private input. Never edit, copy into a
  tracked path, commit, publish, or attach its contents.
- Use `scripts/query-expert.ps1`; do not bypass its domain-specific policy.
- Treat scores, topics, associations, entities, and graph edges as discovery signals.
  Only authoritative returned text at a verified locator can support a factual claim.

## Workflow

1. Turn the post question into a complete, specific retrieval query.
2. Run one query against the most relevant domain; use both only for a real cross-domain
   question.
3. Review the result identities, paths, locators, and hashes.
4. Open only the most relevant authoritative passages and verify every planned claim.
5. Retrieve again only for a missing facet, contrary evidence, or a named comparison.
6. Record source identity and locator in research notes, then synthesize in original
   language with calibrated uncertainty.
7. Verify time-sensitive claims against current primary sources before publication.

## Commands

```powershell
./scripts/query-expert.ps1 -Domain software-engineering -Query "FULL QUESTION" -TopK 10
./scripts/query-expert.ps1 -Domain data-science -Query "FULL QUESTION" -TopK 10
```

For a newly materialized or changed immutable bundle:

```powershell
./scripts/query-expert.ps1 -Domain software-engineering -Inspect -DeepValidation
./scripts/query-expert.ps1 -Domain data-science -Inspect -DeepValidation
```

Stop on any validation, digest, identity, path, locator, provider, or policy failure.
