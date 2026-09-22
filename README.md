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
- [ ] **`resume.pdf`.** The only PDF on hand
      (`~/Desktop/Arvin_Zargaran_Resume.pdf`) is a client-services/banking
      résumé — no GPA, no Acadvo, no SWE experience — wrong for a page pitching
      a software engineering internship. Needs an actual SWE-facing résumé
      before this link goes back in.
- [ ] **Acadvo live demo.** Deploy it, or leave the receipt honest. This is the
      only remaining open (red) claim on the page.
- [ ] **Domain.** Arvin is buying a `.com` rather than using GitHub Pages
      (decided 2026-09-21). Until then: `<link rel="canonical">`, `og:url`,
      `og:image`, the JSON-LD `url`/`image`, `sitemap.xml` and `robots.txt`
      all still point at `arvinzargaran.github.io`, which is not live and
      won't be. Update all of these to the real domain once it's bought — a
      grep for `arvinzargaran.github.io` finds every instance.

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
