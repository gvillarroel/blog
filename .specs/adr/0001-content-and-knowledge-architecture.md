# ADR 0001: Separate publishable posts from private expert knowledge

- Status: Accepted
- Date: 2026-08-01

## Context

The repository needs two related but different assets:

1. public technical posts that distill multiple sources into original Markdown; and
2. private, structured expert corpora that agents can consult while researching those
   posts.

The neighboring `../knowledge` repository contains two private book corpora and frozen
retrieval comparisons. The corpora cannot be redistributed. Their benchmarks also do
not identify one universally best retrieval family: software-architecture questions
favor Classical Fusion, while the data-science corpus favors Ensemble Fast.

The public site must be static, deploy through GitHub Pages, and render technical
diagrams without requiring a server.

## Decision

- Use Astro 7 static output and a typed `posts` content collection loaded from
  `src/content/posts/**/*.md`.
- Keep drafts in the collection for local preview, but remove them from production
  routes, the index, RSS, and sitemap.
- Keep a tracked expert catalog and consultation skill, while placing all corpora,
  extracted text, indexes, results, and the local `know` store under ignored paths.
- Materialize the expert folders as local Windows junctions to immutable bundles in
  `../knowledge`; do not duplicate private text into the repository.
- Register two local `know` keys and Television source definitions so the expert layer
  has a reproducible inventory.
- Query software engineering with Classical `fusion`, the best frozen route for that
  corpus (97.29% Recall@10, 92.58% nDCG@10).
- Query data science with Ensemble `fast`, the best frozen route for that corpus
  (99.17% Recall@10, 94.44% nDCG@10).
- Treat every retrieval score as discovery metadata. Posts may rely only on verified
  authoritative passages, identities, locators, and hashes.
- Render Mermaid, ECharts, and a bounded declarative D3 format in the browser from
  fenced Markdown. Render PlantUML to a sanitized, self-contained SVG during the build
  with the packaged PlantUML CLI and Java 17. Always preserve a readable source fallback.
- Deploy on pushes to `main` with the official Astro GitHub Pages action. Provide a
  separate local archive script for timestamped HTML snapshots.

## Consequences

- A clean clone can build the public blog without any private source material.
- Agents with the sibling knowledge checkout can bootstrap and query curated experts
  without changing or publishing those sources.
- Different expert domains retain their empirically stronger retrieval policy.
- PlantUML source stays local, but builds now require Java 17. Mermaid, ECharts, and D3
  remain lazy-loaded parts of the static site bundle.
- Advanced diagrams have their source preserved as a progressive-enhancement fallback,
  making rendering failures visible rather than silently dropping content.

## References

- [Astro content loader reference](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro Markdown plugins](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins)
- [Astro GitHub Pages action](https://github.com/withastro/action)
- Local benchmark: `../knowledge/evaluations/software-architecture-books/reports/all-route-comparison.md`
- Local benchmark: `../knowledge/evaluations/data-science-ai-ml-books/reports/all-route-comparison.md`
