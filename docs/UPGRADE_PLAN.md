# Upgrade plan: current site to Field Notes

Seven phases taking kothok-site from its current build to the gridded, visual-first design.
Each phase ships green on its own. Phase 0 is independent of the redesign and is worth merging
first regardless of what happens to the rest.

Roughly seven working days end to end. Photography is the critical path.

## Ground rules

From AGENTS.md, and they apply to every phase:

- ASCII only in all copy. No em dashes, smart quotes, ellipses, arrows, or emoji.
- No marketing vocabulary. The banned list covers most of what a redesign tempts you into.
- Files under ~300 lines, components under ~60 lines, one responsibility per module.
- Colours and z-index stay Tailwind tokens. Asset paths stay in `src/images.ts`.
- Strict TypeScript, no `any`, no dead code, LF endings.
- Branch off `develop`, conventional commits, merge back with `--no-ff`.

Fonts do not change. Fredoka and JetBrains Mono stay exactly as declared in
`tailwind.config.ts` and `index.html`. Type work is limited to scale, weight, tracking and
line-height.

Before every merge:

```bash
npm run lint
npm run format:check
npm run build   # tsc --noEmit then vite build
```

## Totals

| Metric        | Count |
| ------------- | ----- |
| Phases        | 7     |
| New files     | 9     |
| Files edited  | 11    |
| Files deleted | 2     |
| Photos needed | 5     |

---

## Phase 0 - Fix what is already broken

**~0.5 day.** Six defects found reading the current source. None depend on the redesign. Merge
this first so the redesign starts from a working baseline.

| File                            | Op   | Change                                                                                                    |
| ------------------------------- | ---- | --------------------------------------------------------------------------------------------------------- |
| `src/sections/Hero.tsx`         | Edit | Drop `order-first` on the canvas column. The h1 must come first on mobile; the device follows it.          |
| `src/sections/Hero.tsx`         | Edit | When `enhanced` is false, render a static poster instead of nothing. Half the hero is currently blank.     |
| `src/components/FeaturePhoto.tsx` | Edit | Add `srcset` and `sizes`. Delete the `transform: scale(1.8)` crop and crop the source images instead.    |
| `src/sections/About.tsx`        | Edit | Remove `min-h-screen`. Four lines of text should not own a viewport.                                       |
| `src/App.tsx`                   | Edit | Nav hides the About link below 400px. Keep both links at every width.                                      |
| `index.html`                    | Edit | No `og:image`. Add one, or every share renders as a bare text card.                                        |

---

## Phase 1 - Content layer

**~1 day.** Copy first, components second. Every string moves into typed data files so the
sections become layout only, and so wording can be reviewed without reading JSX.

| File                          | Op  | Contents                                                                                          |
| ----------------------------- | --- | ------------------------------------------------------------------------------------------------- |
| `src/content/features.ts`     | New | Four bento cells: title, one line, spec chips, screen state, shot direction.                       |
| `src/content/languages.ts`    | New | Six scripts: glyph, name, voice id, sample file. Drives the strip and the player.                  |
| `src/content/compare.ts`      | New | Seven rows against Kobo 5.10 and KOReader. Each cell typed with a tone of `ours \| weak \| plain`. |
| `src/content/requirements.ts` | New | Six spec-sheet rows: devices, formats, install, aloud, first run, exit.                            |
| `src/content/steps.ts`        | New | Four install steps and three installers, lifted out of GetStarted.                                 |

### The copy rewrite is the real work here

Two corrections are non-negotiable:

1. **The "no cloud account" line is inaccurate.** Read-aloud is Edge TTS over a WebSocket and
   needs WiFi. No account is required, which is true, but a reader who takes "no cloud" at face
   value will expect offline playback. Replace with: "No account, no phone. Read-aloud needs WiFi
   - the voices come from Microsoft Edge."
2. **Nothing may claim the page-turn behaviour is unique.** KOReader's `audiobook.koplugin`
   ships synchronised word highlighting, automatic page turns and continuous playback across
   pages, including MTK Bluetooth on Clara Colour and Libra Colour. See the comparison section.

Beyond those, run every string through one test: does it name what the reader does, or what the
code does?

| Changelog phrasing        | Reader-facing phrasing                          |
| ------------------------- | ----------------------------------------------- |
| Mid-sentence page break   | Follow along while it reads                     |
| Parsed-book disk cache    | Opens instantly after the first time            |
| Live font-size change     | Make the text bigger without losing your place  |
| Per-book-language voice   | It picks a voice that matches the book          |
| Sleep/wake preserves page | Wakes up on the page you left                   |

---

## Phase 2 - Shared components

**~1.5 days.** Build the pieces the new sections are assembled from. Each stays under the 60-line
rule by taking its data as props from Phase 1.

| File                               | Op  | Responsibility                                                                                                     |
| ---------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------ |
| `src/components/SpecChips.tsx`     | New | Chip row with key / caveat / plain tones. Used by every bento cell.                                                 |
| `src/components/CompareTable.tsx`  | New | Semantic table in an `overflow-x: auto` wrapper. Row headers are `th scope="row"`. KoThok column tinted, not bolded. |
| `src/components/SpecSheet.tsx`     | New | A `dl` of requirement rows. Stacks under 40rem, two columns above.                                                  |
| `src/components/ReadAlongDemo.tsx` | New | Two page panels plus one waveform. Timers advance the live panel. Respects `prefers-reduced-motion` by jumping to the end state. |

Reuse, do not rebuild. `SamplePlayer`, `DownloadButton`, `Reveal`, `Logo` and `StickyBar` all
survive as-is. `FeatureLightbox` survives if the bento keeps tap-to-enlarge; delete it if not,
rather than leaving it unused.

---

## Phase 3 - Sections and page order

**~1.5 days.** Now the structure changes. About dissolves, two sections are new, Features becomes
a grid.

| File                          | Op     | Change                                                                                                     |
| ----------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| `src/sections/Hero.tsx`       | Edit   | Keep the three-line h1 exactly as it is. Add the two framing lines, the voices keyline, and the corrected fine print under the button. |
| `src/sections/About.tsx`      | Delete | Its facts move into the hero and the fine print. Do not comment it out.                                     |
| `src/sections/Features.tsx`   | Edit   | Alternating rows become a four-cell bento driven by `features.ts`.                                          |
| `src/sections/Languages.tsx`  | New    | Script glyph strip. Pays off the hero sample player. Currently absent from the site.                        |
| `src/sections/ReadAlong.tsx`  | New    | Wraps `ReadAlongDemo` with the follow-along framing. Sits directly above Compare.                           |
| `src/sections/Compare.tsx`    | New    | Wraps `CompareTable`.                                                                                       |
| `src/sections/GetStarted.tsx` | Edit   | Steps widen out of the narrow column. Append `SpecSheet` as a "Before you download" block.                  |
| `src/App.tsx`                 | Edit   | New section order. Nav links become What it does / Compare / Get it.                                        |

### Page order

1. Hero
2. Features (four screens)
3. Languages
4. Read along (the demo)
5. Compare
6. Get it
7. Footer

The demo sits immediately above Compare on purpose. The reader sees the page turn without a gap,
then reads the table conceding KOReader does the same thing and showing where KoThok wins
instead. Proof, then honest context.

---

## Phase 4 - The 3D widget

**~1 day.** This design uses the lightest 3D of the three directions: one contained, draggable
device in the hero. The existing stage is most of the way there.

| File                        | Op     | Change                                                                                                    |
| --------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| `src/three/HeroStage.tsx`   | Edit   | Remove `pointerEvents: none`. Swap the `IdleRig` sine sweep for drag-to-rotate with a slow idle drift when untouched. |
| `src/three/HeroStage.tsx`   | Edit   | Mount the `Canvas` on intersection, not on load. It should cost nothing until seen.                        |
| `src/three/StaticStage.tsx` | New    | Poster image for the no-WebGL and reduced-motion paths. Same framing as the live render so layout does not shift. |
| `src/three/Particles.tsx`   | Delete | Ambient particles do not serve a spec-sheet page. Remove rather than leave unused.                         |

**Touch and scroll must not fight.** Enabling pointer events on a canvas inside a vertical page
traps scroll on phones. Set `touch-action: pan-y` on the wrapper so vertical swipes still scroll
the page and only horizontal drags rotate the device.

---

## Phase 5 - Photography

**~1 day plus a shoot.** The one part that cannot be coded. This direction fails if the photos
are mediocre, so it is worth blocking on them rather than shipping grey placeholders.

| Shot           | Frame                                                     | On screen                                |
| -------------- | --------------------------------------------------------- | ---------------------------------------- |
| 01 table       | Device flat on a table, speaker beside it, warm side light | Read-aloud view, Bluetooth connected     |
| 02 hand        | Held at reading distance, slight angle, shallow depth      | A page of text with the seek bar visible |
| 03 desk        | Propped on a desk, three-quarter view                      | Library cover grid                       |
| 04 night       | Nightstand, low ambient light, frontlight off              | Control panel with the four sliders      |
| 05 hero poster | Clean studio angle matching the 3D framing                 | Library. Doubles as WebGL fallback and og:image |

- Shoot in colour on a Kaleido device. Colour covers on a colour panel is a selling point the
  site never shows.
- Export WebP plus PNG fallback at 1x and 2x. Register every path in `src/images.ts` and wire
  `sizes` to the grid breakpoints.
- Budget 250KB per image at 2x. The current PNGs are well over.

---

## Phase 6 - Verify and ship

**~0.5 day.**

1. **Responsive sweep.** 320, 375, 414, 768, 1024, 1440. Nothing scrolls sideways; the compare
   table scrolls inside its own wrapper only.
2. **Degradation.** WebGL disabled, then reduced-motion on. Both must give a complete page, not a
   hole.
3. **Keyboard.** Tab the whole page. Focus visible everywhere; the drag widget is not a focus
   trap.
4. **Contrast.** Both themes, including the amber caveat chips and the tinted compare column.
5. **Copy audit.** Check for non-ASCII and banned marketing words before merging.
6. **Then** lint, format:check, build, and merge to `develop` with `--no-ff`.

```bash
# catches smart quotes, em dashes, emoji that crept into copy
grep -rPn "[^\x00-\x7F]" src/ index.html
```

---

## Sequencing

Phase 0 merges on its own and improves the live site immediately. Phase 1 gates everything after
it, since components read from those files. Phases 2 and 5 run in parallel if someone else is
shooting. Phase 4 is independent of 1 through 3 and can slot in wherever.

```
0 fixes        ###
1 content         #######
2 components             ##########
3 sections                         ##########
4 3D widget              ######
5 photography     #############
6 verify                                    ###
                  day 1        3        5        7      8
```

If you need a date, treat photography as the critical path and start it the same day as Phase 1.

## What could go wrong

- **Photography slips.** Highest risk, lowest control. Mitigation: the bento renders the device
  screens without photos, so the site can ship with four screen captures and gain photos later.
- **The compare table ages.** Kobo firmware and the KOReader plugin both move. Put a "checked on"
  date beside the table and re-verify each release.
- **Scope creep back into prose.** The page is deliberately short. Every new paragraph should
  have to displace an existing one.
- **Component line limits.** The bento cell and the compare table both want to grow past 60
  lines. Split presentational sub-components early rather than after review.

## Reference

Findings this plan is built on:

- Content inventory: 42 key points from `README.md` and `CHANGELOG.md`, of which the current site
  carries 11.
- Competitive check, verified 2026-07-19: Kobo firmware 5.10 (optional, July 2025) adds a screen
  reader to Clara BW, Clara Colour and Libra Colour, but requires a factory reset to install and
  another to revert, is Europe-only, and needs a Bluetooth keyboard to navigate. KOReader plus
  `audiobook.koplugin` provides TTS with automatic page turns and Bluetooth on the same hardware,
  using espeak-ng or a local Piper model.
- KoThok's defensible position: Edge TTS voice quality (400+ voices), script coverage with native
  voices (Bengali, Arabic, Devanagari, Thai, CJK), and a one double-click install. The trade-off
  is that read-aloud needs WiFi while both competitors run offline.
