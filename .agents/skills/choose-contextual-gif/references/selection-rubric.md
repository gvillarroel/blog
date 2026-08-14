# Contextual GIF Selection Rubric

## Contents

1. Decision model
2. Hard gates
3. Ranking rubric
4. Popularity and freshness
5. Live verification
6. Downloading and provenance
7. Bias, culture, and accessibility
8. Catalog maintenance
9. Sources

## Decision model

Select a GIF as a response that continues the conversation. Do not merely retrieve an animation depicting nouns from the input. First identify the dialog act, then the emotional stance, then the visual realization.

Use this brief:

| Dimension | Questions |
|---|---|
| Function | Acknowledge, celebrate, encourage, reject, wait, signal work, express confusion, or invite spectatorship? |
| Stance | Sincere, playful, dry, sarcastic, self-deprecating, chaotic, or comforting? |
| Target | Is the reaction aimed at the sender, the event, oneself, a third party, or the situation? |
| Relationship | Friend, peer, manager, report, client, public audience, or unknown? |
| Stakes | Trivial, routine work, emotionally meaningful, or high-stakes? |
| Shared culture | Will the recipient recognize the source and its conventional meaning? |
| Constraints | Locale, rating, people/no-people preference, accessibility, recency, iconicity? |

The same message can support several valid GIFs. Prefer a candidate whose visible action and caption both support the intended interpretation. If the caption and visual action pull in different directions, penalize ambiguity.

## Hard gates

Choose no GIF when any of these apply:

- grief, death, trauma, serious illness, self-harm, violence, abuse, or harassment;
- layoffs, firing, disciplinary action, legal notice, safety incident, or emergency response;
- an apology where humor could minimize actual harm;
- a vulnerable disclosure or a request for concrete help;
- a power imbalance combined with mockery, sarcasm, anger, or rejection;
- an unknown audience where the GIF relies on sexual, political, identity-based, or culturally narrow context;
- an inaccessible delivery surface when no meaningful alt text can accompany the GIF.

Use a short plain-text acknowledgement instead. A GIF is optional even in low-stakes contexts; silence or text can be the better reply.

## Ranking rubric

Score only after passing the hard gate.

| Signal | Weight | Interpretation |
|---|---:|---|
| Dialog-function match | 10 | The GIF performs the intended conversational act. |
| Stance and emotion match | 7 | The GIF's emotional transition matches the intended tone. |
| Recipient and channel fit | 6 | The reference and intensity fit the relationship and platform. |
| Visual/caption agreement | 5 | Visible action and on-screen text support the same reading. |
| Safety and rating fit | 5 | The item stays within the requested content ceiling. |
| Cultural legibility | 3 | The recipient is likely to recognize the convention or can interpret it literally. |
| Freshness or iconicity | 0–3 | Apply only when the user values it; never let it override context. |
| Novelty/diversity | 0–2 | Reward a fresh but still legible choice and avoid repeating the same person or franchise. |
| Ambiguity or stereotype risk | −10–0 | Penalize unclear targets, identity caricatures, and decontextualized emotional performance. |

Frequency alone is not a quality score. Wang and Jurgens found no correlation between how often a GIF was used by their reply models and its mean reception; contextual appropriateness explained substantial variance. Their multimodal model also outperformed tag-only and image-text baselines, supporting inspection of both image content and caption rather than keyword matching alone.

## Popularity and freshness

Keep these evidence classes distinct:

- `current-snapshot`: present in a live trending feed observed within 30 days. This is volatile and platform-specific.
- `context-rank`: near the top of one exact provider search query on a recorded date. It says nothing about global use.
- `annual-platform`: included in a provider's annual editorial or metrics-informed collection.
- `historical-canon`: documented as frequently deployed and conventionally understood by a community or cultural institution.
- `catalog-fit`: curated for semantic coverage without a popularity claim.

Do not merge ranks across GIPHY, Reddit, Slack, Discord, X, or other platforms. Their populations, algorithms, regions, and product integrations differ. A live GIPHY result should be described as “ranked first for `popcorn` on GIPHY, observed 2026-08-13,” not “the internet's most-used GIF.”

## Live verification

For a current request:

1. Check the catalog's `updated_at` and evidence date.
2. Use GIPHY's official Trending or Search API when `GIPHY_API_KEY` is available. Pass the exact user query, `lang`, `country_code`, and the requested `rating`; preserve provider attribution.
3. Without an API key, inspect the public canonical search or trending page and record the observation date. Treat page ordering as a snapshot, not a durable API contract.
4. Open the chosen permalink. Verify title, visible action, on-screen text, rating when available, creator attribution, and that the page still resolves.
5. Prefer a second source for a global or multi-platform popularity claim. If no comparable metric exists, narrow the claim.

Do not build new automation against the Tenor API. Google retired third-party Tenor API integrations on June 30, 2026, although Tenor content remains available in Google-owned products.

## Downloading and provenance

- Download only after an explicit request and a rights check for the intended use.
- Prefer GIPHY's Get GIF by ID endpoint and select the requested rendition from its GIF object. Read the key from `GIPHY_API_KEY`; never place it in a command or log.
- Use public-page metadata only as a catalog-bound fallback when no key is available. Do not treat its HTML structure or media URL as a stable API contract.
- Restrict redirects to HTTPS GIPHY hosts. Enforce the rating ceiling, a byte limit, `image/gif` content when declared, and a `GIF87a` or `GIF89a` file signature.
- Write atomically, refuse implicit overwrite, and keep the provenance sidecar. Do not commit downloaded binaries unless the repository's purpose and the user's rights clearly call for it.

## Bias, culture, and accessibility

- Avoid using a person's race, gender, disability, body, age, accent, or distress as the joke.
- Watch for “digital blackface” and related patterns where images of marginalized people are repeatedly selected to perform exaggerated emotion for others. Prefer an animal, animation, object, or self-referential alternative when identity is not relevant.
- Do not assume irony transfers across cultures. Choose a literal visual action for an unknown or multilingual audience.
- Describe the action, expression, scene change, and on-screen text in alt text. Do not write only “funny GIF” or repeat the filename.
- Avoid fast flashing or visually overwhelming loops when the surface or audience raises accessibility concerns.
- Prefer `g` for work and unknown audiences. Allow `pg` only when the exact content has been inspected and the relationship supports it.
- Attribute a verified creator or source where the provider exposes one. For GIPHY API integrations, display “Powered By GIPHY” and follow the API terms.

## Catalog maintenance

1. Add stable provider permalinks, never time-limited media rendition URLs.
2. Record the exact query, rank, region, and observation date for current or context-ranked evidence.
3. Re-check `current-snapshot` records every 30 days. Downgrade stale records to `catalog-fit` unless a durable annual or historical signal also exists.
4. Keep iconic items only when their meaning remains legible. Add a cultural note if the source is often misidentified or has acquired a new meaning.
5. Keep multiple visual realizations for common functions so the selector can avoid repetition and identity concentration.
6. Run `python scripts/select_gif.py --validate` and `python scripts/test_select_gif.py`.

## Sources

- [Wang and Jurgens, “An animated picture says at least a thousand words”](https://aclanthology.org/2021.findings-emnlp.276/) - 1.56 million text-GIF conversation turns; multimodal response selection, contextual reception, and safety/bias analysis.
- [Museum of the Moving Image, “The Reaction GIF: Moving Image as Gesture”](https://movingimage.org/archived-events/the-reaction-gif-moving-image-as-gesture/) - a community-informed historical canon of 37 frequently deployed reaction GIFs and their understood translations.
- [GIPHY API endpoints](https://developers.giphy.com/docs/api/endpoint/) - official Trending, Search, Translate, rating, locale, and canonical-object behavior.
- [GIPHY developer guidance](https://developers.giphy.com/docs/) - API attribution, creator attribution, alt text, analytics, and rendition guidance.
- [GIPHY API terms](https://support.giphy.com/hc/en-us/articles/360028134111-GIPHY-API-Terms-of-Service) - provider terms, application identification, and Powered by GIPHY requirements.
- [GIPHY content ratings](https://developers.giphy.com/docs/optional-settings/) - definitions for G, PG, PG-13, and R filtering.
- [GIPHY Year in Review](https://giphy.com/yearinreview) - platform-specific annual collections; do not interpret them as universal internet rankings.
- [Google Tenor API retirement FAQ](https://support.google.com/tenor/answer/10455265?hl=en) - January 13, 2026 registration cutoff and June 30, 2026 retirement of third-party API integrations.
- [Jang, Song, and Kim, “On the Virality of Animated GIFs on Tumblr”](https://arxiv.org/abs/2108.07894) - platform-scale evidence that GIF discovery, recurrence, and virality are shaped by platform behavior and tagging.
