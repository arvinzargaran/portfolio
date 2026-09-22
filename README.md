# arvinzargaran.github.io

Personal site. Static HTML, CSS and ~60 lines of JavaScript. No build step, no
framework, no dependencies, no analytics, no cookie banner.

## Design brief

```
DIRECTION  The audited document — the page behaves like the systems it describes
MOOD       Plain, checked, unhurried; the register of a report, not a brochure
PALETTE    Two greys and one red. Grey #E7E9EA / #101315 · Exception red #B32D23
TYPE       Archivo (display + data) + Source Serif 4 (body). No monospace.
LAYOUT     Chaptered scroll: grey hero → pinned ink thesis → ink work → grey close
SIGNATURE  The Confidence Meter
```

**Thesis:** *software that refuses to guess.* The through-line across all three projects
is provenance — each system can show its work, and says so plainly when it can't.

**Signature — the Confidence Meter.** Each project carries an instrument: one segment
per claim, lighting in sequence as the record scrolls through, with a readout that
counts only what is actually sourced. The unverified claim is a dashed amber gap that
never lights, and the readout turns amber when it settles short of the total. The page
reports its own incompleteness. That is the argument, made structurally rather than
stated.

**Chapters.** The ground inverts across the page rather than cutting. A chapter is
a *contrast inversion*, not a fixed colour: `base` is the viewer's own theme
ground, `flip` is its opposite. So the page goes light→dark for a light-mode
viewer and dark→light for a dark-mode one. Hard-coding the flip to dark made the
whole macro move invisible to dark-mode viewers.
The pinned thesis scene between the hero and the work is where it goes dark, and its
legend teaches the meter's vocabulary (solid = sourced, dashed = not measured) before
the work section starts using it.

**Motion.** One rAF loop driving a single damped "shadow scroll" value (α = 0.1), which
everything scroll-bound reads from. Continuous and reversible, never scroll-jacked. The
loop parks itself when there is nothing left to settle. Scroll motion is always ease-out;
the spring `linear()` curve is reserved for pointer gestures, per Apple's split.

**Fail-safe rule.** Nothing may be hidden by an animation unless the engine has
proven it is running, and **visibility never depends on the damped value.** The
scroll pass takes two positions: `truth` (the real `scrollY`) drives everything
that decides whether content is visible; `damped` drives only decoration that
cannot hide anything. An earlier version ran the clip-path wipes off the damped
value, so a single rAF interruption stranded the page at a stale scroll position
with the thesis text clipped to nothing.

**No layout reads in the scroll pass.** All `offsetTop` / `offsetHeight` /
`scrollHeight` reads live in `measure()`, called on load and resize only. Reading
them per frame forces a synchronous reflow every frame and janks the page.

**Scale.** Type is six steps on a ~1.125 ratio below body (`--t-xs` … `--t-body`)
plus fluid display clamps above it; there were 21 ad-hoc sizes before, several
within 3% of each other. Vertical spacing is a 0.25rem rhythm (`--sp-1` …
`--sp-9`); there were 28 distinct values, now 11. The single exception is the
0.1rem offset on the hero index, which is a measured optical correction to sit
its heading on the eyebrow's baseline, not a spacing value.

**Tokens**

| | |
|---|---|
| Grey chapter | `#E7E9EA` light / `#101315` dark |
| Ink chapter | `#101315` / `#E7E9EA` (inverted) |
| Sourced | no colour. Ink at 38%. |
| Exception red (unproven **only**) | `#B32D23` / `#E7594C` |
| Display + data | Archivo (variable, `wdth` 108–112) |
| Body | Source Serif 4 |
| Code | system monospace, not a webfont |

**Why there is only one colour.** Sourced claims get no accent. Being sourced is
the baseline, not an achievement, and a page that colour-codes its own strengths
is arguing for itself. Red appears only where the work falls short — the open
meter segments, the unproven receipts, and the word *guess* in the headline. It
is the only hue on the page, which is what makes it legible as a signal rather
than decoration.

**Why the projects aren't numbered.** They were `01 / 02 / 03`. They are not a
sequence and nothing about the order carries information, so the gutter now
holds the project's domain instead. Ornament that imitates structure is exactly
what the rest of the page argues against.

## Run it

```bash
python3 -m http.server 4321
```

## Deploy

Not decided yet. Was staged for GitHub Pages
(`arvinzargaran/arvinzargaran.github.io`) but Arvin is buying a custom `.com`
instead (2026-09-21) — see the domain item under "Before it goes live". Until
a host is picked, `python3 -m http.server` is the only way to view it.

## Copy review, v2 (applied 2026-09-18)

An outside reviewer edited the full copy deck. Applied in full except where a
claim would not have survived checking:

- "co-op" is "internship" everywhere.
- "I've shipped three systems" → "I've **built** three systems." The old verb
  contradicted the page's own red markers.
- The hero names the three systems and carries a stack line under the lede, so a
  technical reader does not have to scroll to learn what you work in.
- **The Acadvo line count is gone.** The site said ~37,700; the project's own
  audit totals closer to 49,500. A receipt that contradicts your own
  documentation is the most expensive kind of error on a page like this, and
  line counts read as padding anyway. The 49 suites and router/model counts
  carry the same signal without the risk.
- **The page-level tally is gone**, replaced by a prose statement of the rule it
  encoded. Hand-counted, stale the moment a sentence changes, and an invitation
  for a sharp reader to count and find a different number. The per-project
  ratios stay: local, small, verifiable.
- Source receipts were written in as live for all three projects. Only
  `ufc-predictor` resolves, so only that one is a receipt; the other two remain
  open in red until the repos exist.

## Before it goes live

Several receipts on the page are marked **unproven**, in red. They are visible
to anyone reading the site, which is the point. Fix them, don't hide them.

- [x] ~~**Publish `acadvo`.**~~ Done 2026-09-21. Public, green CI, source link
      restored, meter moved to 9/10 (the live-demo claim is the one remaining
      open receipt).
- [x] ~~**Finance Tracker source.**~~ Done 2026-09-21. Pushed
      `eclipse-workspace/PersonalFinanceTracker` to
      [`github.com/arvinzargaran/finance-tracker`](https://github.com/arvinzargaran/finance-tracker),
      linked, meter now 6/6 — the first fully-sourced record on the page.
- [x] ~~**UFC holdout accuracy.**~~ Re-measured 2026-09-21 — the earlier
      "70.2% / 0.580 / beats the market" figures were wrong (they conflated the
      model+market blend with the model alone). Actual: model stats-only 65.1%
      accuracy / 0.6359 log-loss; market baseline 70.0% / 0.5846; blend 69.7% /
      0.5821. **The market is the stronger predictor** — the page now says so.
      The record is 8/8, fully sourced.
- [x] ~~Confirm the LinkedIn URL slug is right.~~ Confirmed by Arvin, 2026-09-21.
- [x] ~~`resume.pdf`.~~ Not linked from the site, by Arvin's choice
      (2026-09-21) — stays a direct-send document, not a published page. The
      SWE-facing résumé at `~/Downloads/Arvin_Zargaran_Resume.docx` had the
      same wrong Acadvo/UFC numbers as the site did before the 2026-09-21
      correction pass; those three bullets were fixed in the docx too, with
      the pre-fix version kept alongside it as
      `Arvin_Zargaran_Resume_before-fix-2026-09-21.docx`.
- [x] ~~Graduation date and "seeking an internship" language.~~ Removed
      site-wide 2026-09-21, per Arvin's request — hero eyebrow, lede, meta
      description, `og:description`, the About paragraph's "(Honours BSc,
      expected 2029)", and the Contact section's "Summer 2027... internship"
      line, including its mailto subject. The page now reads as identity and
      evidence, not a time-boxed pitch.
- [x] ~~Security and web-interface-guidelines pass.~~ Done 2026-09-21 — see
      "Security" below. CSP, security headers, non-breaking spaces on every
      number+unit pair, the one `innerHTML` replaced with safe DOM
      construction, focus order and hit-target sizes re-verified in a real
      browser (not the sandboxed preview pane, which showed a false positive
      on the skip link's size from a stale focus-state test artifact).
- [ ] **Acadvo live demo.** Deploy it, or leave the receipt honest. This is
      the only remaining open (red) claim on the page.
- [ ] **Domain.** Arvin is buying a `.com` rather than using GitHub Pages
      (decided 2026-09-21). Until then: `<link rel="canonical">`, `og:url`,
      `og:image`, the JSON-LD `url`/`image`, `sitemap.xml` and `robots.txt`
      all still point at `arvinzargaran.github.io`, which is not live and
      won't be. Update all of these to the real domain once it's bought — a
      grep for `arvinzargaran.github.io` finds every instance. Once a host is
      picked, also activate `_headers` (or port it to that host's format —
      see "Security" below) and update the CSP's `style-src`/`font-src`/
      `connect-src` only if new external resources are added.

## Security, audited 2026-09-21

Static site, zero attack surface by construction — no forms, no user input,
no fetch/XHR, no third-party JS. What's in place anyway:

- **Content-Security-Policy**, both as a `<meta>` tag in `index.html` (works
  on any host) and duplicated with `frame-ancestors` added in `_headers`
  (Netlify/Cloudflare Pages format; `frame-ancestors` is a header-only
  directive browsers silently ignore in `<meta>`). `script-src` uses exact
  SHA-256 hashes for the two inline `<script>` blocks — no `unsafe-inline`
  for scripts. `style-src` needs `unsafe-inline` because the scroll engine
  drives animation through `element.style.setProperty('--t', …)` per frame;
  that's a deliberate, documented trade-off, not an oversight.
  **If you edit either inline script, the browser will silently block it
  until you recompute its hash** — the exact command is in `_headers`.
  Verify in a real browser after any CSP-adjacent edit; a wrong hash fails
  closed with no visible symptom beyond broken JSON-LD or a dead theme
  toggle. (Caught exactly this once already: my first computed hash for the
  theme script was wrong — Chrome's own console reported the correct one,
  which is what's actually in the file now.)
- `_headers` also sets `X-Frame-Options: DENY`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (denies camera/mic/geolocation/payment/usb and opts
  out of FLoC), `Strict-Transport-Security` (2-year max-age, preload-ready),
  and `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy: same-origin`.
  **GitHub Pages cannot serve custom headers at all** — if that ends up the
  host, only the `<meta>` CSP applies. Vercel needs these ported into
  `vercel.json`. Netlify and Cloudflare Pages read `_headers` natively.
- The one `innerHTML` write in `main.js` (rendering the hero's per-project
  ratio) was replaced with plain DOM node construction — the values it wrote
  were always trusted integers from the page's own DOM, never user input, so
  there was no actual XSS path, but the pattern is gone so a strict CSP
  `script-src` audit has nothing to flag.
- No secrets, tokens, or credentials anywhere in the repo or its history —
  scanned before every push in this project. No third-party trackers,
  analytics, or cookies.
- All outbound links are same-tab (no `target="_blank"`), so there's no
  `rel="noopener"` gap to begin with.

## Accessibility & performance notes

Measured 2026-09-15, not asserted.

**Weight.** ~207 KB of latin webfont + ~83 KB of page = ~290 KB first load.
The font request is deliberately narrowed: `wdth 100..125, wght 400..700` for
Archivo and `opsz 8..60, wght 400..600` for Source Serif 4. The full ranges cost
334 KB. **No italic face is loaded** — it was 126 KB on its own and only three
phrases used it, so emphasis rides the roman and the two provenance phrases are
set as labels in the utility face instead.

**Contrast**, computed against both grounds: body 15.2:1, secondary 5.0:1, red
5.2:1 — all pass AA. The meter fill is ink at 50%, which is 3.35:1 on grey and
4.50:1 on ink; at 38% it was 2.38:1 and failed, which is why it is 50%.
Hairlines are 1.34:1 and deliberately below 3:1 — they are decorative, and every
control they surround is identified by a text label at 15:1, not by its border.

**Tap targets** measured at a real 375px viewport: all interactive elements are
≥44px except the skip link, which is keyboard-only. No horizontal overflow at
375px.

- Audited against the Vercel Web Interface Guidelines.
- `prefers-reduced-motion` disables every animation: verified with Chrome's
  `--force-prefers-reduced-motion=reduce`, the root class stays `js` alone —
  neither `observed` nor `driven` is added, so nothing is hidden, the thesis is
  never clipped and the progress bar is `display: none`.
- **Reveals do not depend on IntersectionObserver alone.** Measured with the 4s
  safety net disabled, IO left the work heading and the third record at opacity
  0 after a full continuous scroll, and left six of eight hidden after a jump to
  `#work` — so anyone clicking the nav saw an empty section until the net fired.
  The scroll pass now also reveals anything above `truth + viewport + 240`, from
  positions cached in `measure()`, so no layout is read per frame and visibility
  never depends on the damped value or on an observer firing.
- The hero animation is pure CSS, so it still plays in a background tab where
  `requestAnimationFrame` is throttled; nothing on the page can be left
  invisible by a JavaScript failure.
- Skip link, visible focus rings, 44px tap targets, no horizontal overflow at
  375px, `color-scheme` set for native controls, print stylesheet included.
