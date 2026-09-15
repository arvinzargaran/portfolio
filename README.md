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

This is a GitHub Pages user site. Copy these three files to the root of
`arvinzargaran/arvinzargaran.github.io`, replacing the old Bootstrap template,
and push to `main`.

## Before it goes live

Several receipts on the page are marked **unproven**, in red. They are visible
to anyone reading the site, which is the point. Fix them, don't hide them.

- [ ] **Publish `acadvo`.** It has no git remote at all — the repo was never
      created on GitHub, which is why the old `Source →` link 404'd. Secret scan
      is clean: `.env` and `backend/.env` are gitignored and appear nowhere in
      history. Create the repo, push, then restore the link.
- [ ] **Push `arvinzargaran.github.io` and enable Pages.** The repo is not public,
      so the canonical URL in the `<head>` currently 404s and the site has nowhere
      to deploy to.
- [ ] **`resume.pdf`.** The contact link was removed rather than left pointing at
      a missing file. Add the PDF and restore the link when it is current.
- [ ] **UFC holdout accuracy.** Run `python3 -m src.evaluate`, then replace the
      `holdout accuracy` receipt with the real number and the test window.
- [ ] **Finance Tracker source.** Push `eclipse-workspace/PersonalFinanceTracker`
      to GitHub and link it.
- [ ] **Acadvo live demo.** Deploy it, or leave the receipt honest.
- [ ] Confirm the LinkedIn URL slug is right.
- [ ] Buy `arvinzargaran.com` and point it here with a `CNAME` file.

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
- `prefers-reduced-motion` disables every animation.
- The hero animation is pure CSS, so it still plays in a background tab where
  `requestAnimationFrame` is throttled; nothing on the page can be left
  invisible by a JavaScript failure.
- Skip link, visible focus rings, 44px tap targets, no horizontal overflow at
  375px, `color-scheme` set for native controls, print stylesheet included.
