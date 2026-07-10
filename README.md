# LLM Release Timeline

An interactive timeline of LLM model releases from OpenAI, Anthropic, Google, Meta, and the wider AI industry (Chinese labs, other US labs, and rest-of-world labs), grouped by provider and plotted from November 2022 to today.

Hover a node for a quick summary; click it to see full details — version, release type, modalities, context window, pricing, benchmarks, and related models.

## Data

Model data lives in `src/data/models.js`, sourced via web research and best-effort verified. The dataset's freshness cutoff is tracked by `DATA_AS_OF` in `src/data/providers.js` — bump that constant whenever `models.js` is refreshed with newer releases.

## Development

```
npm install
npm run dev
npm run build
```
