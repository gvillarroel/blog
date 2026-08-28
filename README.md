# Technical Notes

An Astro technical blog that turns evidence-based research into public Markdown posts with Mermaid, D3, ECharts, and PlantUML diagrams. Private expert corpora are inputs to research and never part of the published website.

Keep unfinished posts marked `draft: true`. Publishing requires content review as well as a successful build.

## Get started

Requires Node.js 24 or later and Java 17 or later for local PlantUML rendering.

```sh
npm ci
npm run dev
```

## Documentation

- [Documentation index](docs/README.md)
- [Usage and operations](docs/getting-started.md)
- [Repository layout and validation](docs/repository-guide.md)
- [Research and private-source workflow](knowledge/README.md)
- [Architecture decisions](.specs/adr/)
- [AGENTS.md](AGENTS.md)
