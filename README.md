# The Aurum Century Club · Livetest · v7

A two-page bilingual (Korean / English) static site with consistent section dividers and interactive enhancements throughout. Pure HTML/CSS/JS, no build step.

**Live domain:** www.theaurumcc.com  
**Entity:** TACC PTE LTD

## Files
| File | Purpose |
|---|---|
| `index.html` (~119 KB) | Bilingual landing — hero, founding 100, 6 numbered sections, CTA |
| `interest.html` (~30 KB) | Bilingual sign-up form with confirmation screen |
| `vercel.json` | Static-site config + security headers |
| `README.md` | This file |

## What's new in v7

### Section transitions redesigned

Replaced inconsistent eyebrows + 1px `<hr>` rules with a **proper section divider** modeled on the deck's divider pages. Every major section gets the same treatment:

- Thin gold rule + corner accent (top)
- Large italic Cormorant Roman numeral (~96–124px gold)
- Short rule below numeral
- Mono caps eyebrow + Korean accent
- Thin gold rule + corner accent (bottom)

Now you can see — and feel — moving from one section to the next.

### Numbering corrected

| Section | Number | EN | KO |
|---|---|---|---|
| Founding 100 | (cohort) | THE FOUNDING 100 | 창립 100인 |
| **Origin** | **I** | ORIGIN | 서장 |
| **The Form** | **II** | THE FORM | 형태 |
| **The Qualifier** | **III** | THE QUALIFIER | 자격 |
| **Mechanism** | **IV** | MECHANISM | 메커니즘 |
| **Simplification** | **V** | SIMPLIFICATION | 단순화 |
| **Opening Book** | **VI** | OPENING BOOK | 개시 도서 |
| Path / CTA | → | THE PATH | 절차 |

Origin is now **I** (was II). Three Forces becomes **II** (was un-numbered, eyebrow renamed from "WHY THIS FORM" to "THE FORM" for parallel grammar with other section names). "SUBSCRIPTION" eyebrow renamed to "SIMPLIFICATION" to match what the section actually delivers. Compounding (Engines) and Path (CTA) keep simpler eyebrow treatment as sub-sections.

### Side rail updated

`[100][I][II][III][IV][V][VI][→]` — Founding 100 marked with "100" instead of a Roman numeral (it's a special cohort interlude, not a content section). I-VI are the six content sections. → is the CTA.

## Carried from v5/v6

- Bilingual EN/KO toggle (Korean default, persists via localStorage)
- TACC PTE LTD legal entity, AURUM brand wordmark
- "Member" replaces "patron" globally
- "Memo" replaces "Founders Package"
- Three Forces telescope (auto-rotate I→II→III, click to freeze)
- Qualifier toggle (manual click between HOLD/DEPLOYS/RECEIVES)
- Mechanism flow sequential lit + hover freeze
- Subscription scroll reveal (walls dim, gold ↓ arrow, replacement glows)
- Founding 100 count-up (0→8 grid)
- All inquiries flow through the form (no email exposed)

## Deploy
```bash
git add . && git commit -m "TACC v7 — section dividers" && git push
```

Vercel auto-deploys; `vercel.json` confirms no build step.

## Before launch
- Set form endpoint in `interest.html` (`const ENDPOINT = ''`)
- Update cohort count when subscriptions close
- Remove `<meta name="robots" content="noindex">` when ready

## License
Proprietary. TACC Pte Ltd · MMXXVI.
