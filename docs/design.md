# Brand tokens and components

The site uses Rook’s indigo brand palette with neutral surfaces and the app’s charcoal dark tones. Indigo connects headings, buttons, focus states, icons, comparisons and social cards to the existing mascot. Fonts are served by the browser. Product screenshots preserve the real application UI.

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#F7F7F8` | Page/product section background |
| `--color-surface` | `#FFFFFF` | Cards, header, content |
| `--color-text` | `#191919` | Main text |
| `--color-secondary` | `#5A5A5A` | Body/supporting text |
| `--color-brand` | `#5B5BD6` | Rook indigo: CTA, headings, links, focus, supporting details |
| `--color-brand-soft` | `#ECECFF` | Rook lavender: comparison and closing CTA surfaces |
| `--color-brand-border` | Brand/surface blend | Subtle borders around lavender surfaces |
| `--color-brand-on-dark` | Brand/light-text blend | Readable indigo accents on charcoal |
| `--color-dark` | `#19191D` | Rook dark canvas for privacy |
| `--color-dark-surface` | `#202024` | Rook dark surface for screenshot frame |
| `--color-dark-text` | `#F5F5F7` | Rook dark primary text |
| `--color-dark-secondary` | `#A0A0A8` | Rook dark secondary text |
| `--radius` | `16px` | Feature cards |

Desktop headings scale up to 80px, mobile hero headings to 38–52px depending on viewport, and section headings to 34–52px. Body sizes are 17–19px for primary copy; supporting card and FAQ copy is 14–16px. Main content is capped at 1200px. Sections use 66–108px vertical rhythm. At 390px, mobile text stays readable, comparison rows become definition-list cards, and image dialogs support independent horizontal scrolling for a readable close-up.

Reusable components: `Icon.astro` (local accessible decorative icons), `Screenshot.astro` (dimensioned images with enlargement), and `Site.astro` (same content structure for both languages). Buttons, cards, section headings, tabs, navigation, comparison cards, native FAQ disclosures and the native modal share CSS tokens.

No external fonts, analytics, remote embeds, autoplay video, scroll hijacking, neon surfaces or stock photography are included. Reduced-motion preferences disable animation and smooth scrolling. Native dialog supplies focus containment and Escape; the previous focus is explicitly restored.

Palette source: `src/app.css` in [Rook Lite commit 19834729](https://github.com/volkanto/rook-lite/blob/19834729d368fa3a5aca04345fd28101b79d0790/src/app.css). The indigo/lavender pair comes from its “Rook fallback palette”; charcoal tokens come from its explicit dark-theme palette. The active app screenshots retain their original blue controls. Hover and dark-section brand accents are derived from these source tokens for contrast.
