# Brand tokens and components

The site uses a quiet neutral palette, system fonts served by the browser, a blue primary action, and restrained green for local-first/supporting details. It uses the original product mascot rather than creating a new one.

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#F7F7F8` | Page/product section background |
| `--color-surface` | `#FFFFFF` | Cards, header, content |
| `--color-text` | `#191919` | Main text |
| `--color-secondary` | `#5A5A5A` | Body/supporting text |
| `--color-brand` | `#2563EB` | CTA, links, focus |
| `--color-green` | `#247C5B` | Supporting local-first accents; darker than the brief's starting green for text contrast |
| `--color-green-soft` | `#EDF5F0` | Closing CTA section |
| `--color-dark` | `#191D24` | Controlled privacy surface |
| `--radius` | `16px` | Feature cards |

Desktop headings scale up to 80px, mobile hero headings to 38–52px depending on viewport, and section headings to 34–52px. Body sizes are 17–19px for primary copy; supporting card and FAQ copy is 14–16px. Main content is capped at 1200px. Sections use 66–108px vertical rhythm. At 390px, mobile text stays readable, comparison rows become definition-list cards, and image dialogs support independent horizontal scrolling for a readable close-up.

Reusable components: `Icon.astro` (local accessible decorative icons), `Screenshot.astro` (dimensioned images with enlargement), and `Site.astro` (same content structure for both languages). Buttons, cards, section headings, tabs, navigation, comparison cards, native FAQ disclosures and the native modal share CSS tokens.

No external fonts, analytics, remote embeds, autoplay video, scroll hijacking, neon surfaces or stock photography are included. Reduced-motion preferences disable animation and smooth scrolling. Native dialog supplies focus containment and Escape; the previous focus is explicitly restored.
