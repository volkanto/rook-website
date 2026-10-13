# Product claim verification

Verified against Rook Lite **1.6.0**, commit [`19834729d368fa3a5aca04345fd28101b79d0790`](https://github.com/volkanto/rook-lite/tree/19834729d368fa3a5aca04345fd28101b79d0790). The reference checkout was outside the marketing repository, at `/tmp/rook-lite`. No product source was modified.

| Site claim | Source and runtime evidence |
| --- | --- |
| No account required; notes remain in browser | `src/db.ts` uses IndexedDB; daily screen opens directly. Real demo notes imported and displayed without authentication. |
| Markdown, tags, and checkboxes | `src/markdown.ts`, `src/services.ts`, active `editorMarkup` and note rendering in `src/main.ts`. Screens show real Markdown, extracted tags, and tasks. |
| Dedicated Tasks view | `/todos`, `renderTodos` in `src/main.ts`; captured actual grouped tasks from the same imported notes. |
| Weekly, monthly, custom-range summaries | `renderSummariesV2` permits these three period types. Generated weekly summary reports 10 source entries; stored summary uses the rule-based engine. No annual UI claim. |
| Rule-based summaries; editable result | `src/summaries.ts` and `renderSummariesV2`; real Generate action and editing control. No AI inference was used. |
| Ollama is currently disabled | `renderSummariesV2` sets `isOllamaEnabled = false`; Settings local AI toggle and controls are disabled. README's broader AI claims are not presented as active features. |
| Five templates | `src/templates.ts` predefined Daily Standup, Meeting Notes, Daily Reflection, Task Checklist, Project Sprint; active template menu captured. |
| Search and command palette | `src/command-palette/`; real Ctrl+K palette captured with recent demo notes and commands. |
| Light/dark themes, English/Turkish | `src/locales/en.ts`, `src/locales/tr.ts`, theme handling in `src/main.ts`; both theme screenshots from same isolated demo profile. Marketing language switch changes all page copy, metadata, and accessibility labels; screenshot language is explicitly stated. |
| Markdown ZIP / directory export and JSON backup | `src/data.ts` and Settings → Data. Actual JSON v1 import used for demo setup; export and backup controls captured. Directory export is qualified as browser-dependent. |
| No automatic sync or remote note database | IndexedDB repositories and README architecture. Same browser profile and site origin limitation disclosed. |
| Offline after initial caching | Production `public/sw.js` and service-worker registration; `scripts/verify-product.mjs` tested controlled offline reload, writing, save, and read after reload. See `product-offline-check.json`. First visits and cleared/missing caches are qualified. |
| Product analytics default off | `src/analytics/analytics.ts`, README privacy section, and active privacy settings. Opt-in aggregate feature counters are distinguished from note content and from a zero-network-request claim. |
| Free, independently developed, Apache 2.0 | Product README, package manifest and LICENSE. No paid edition, user counts, reviews, customer logos or stars invented. |

All marketing screenshots use ten synthetic notes spanning 5–9 October 2026. The weekly summary was generated from those same notes by the application. The original retina captures and provenance manifest are retained; no AI-generated UI is used.

## Limits

Requests to `rooknotes.com` and `lite.rooknotes.com` returned proxy CONNECT 403. Consequently the live deployment, live offline behavior, and external app CTA responses could not be checked. The CTA uses the documented production URL; GitHub source access succeeded with existing platform authentication.

Comparison is between broad tool categories with “typically”/“varies” qualifiers, not named competitors. Local knowledge-base tools' local storage and Markdown support is acknowledged. No pricing, security, performance, encryption, zero-analytics or loss-proof superiority claim is made. No unsupported support/help/privacy page is linked.
