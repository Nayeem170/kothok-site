# Build order: working session against localhost:5173

Companion to `UPGRADE_PLAN.md`. That document is organised by architecture layer. This one is
ordered by **what changes on screen**, in the smallest increments that leave the site working.

Every step is one commit and one visible diff. If a step does not change something you can point
at in the browser, it is grouped with the step that does.

## Before you start

```bash
npm run dev          # already running on :5173
```

Keep a second terminal for checks. Run before each commit:

```bash
npm run lint && npm run format:check && npm run build
```

Vite notes for this session:

- Edits to `src/**` hot-reload. No refresh needed.
- Edits to `tailwind.config.ts` or `index.html` trigger a full reload. If a new Tailwind token
  does not apply, restart the dev server.
- Deleting a file that is still imported will white-screen the page. Delete the import first.

### How to check the three states that are easy to forget

| State           | How to get there                                                              |
| --------------- | ----------------------------------------------------------------------------- |
| Mobile layout   | DevTools device toolbar, or narrow the window to 375px                         |
| No WebGL        | Chrome: `chrome://flags` -> Disable WebGL. Or DevTools -> Rendering -> disable  |
| Reduced motion  | DevTools -> Rendering -> Emulate CSS prefers-reduced-motion: reduce            |

---

## Group A - Fixes you can see today

Nothing here depends on the redesign. Ship this group on its own branch and merge it even if the
rest waits.

### Step 1 - Headline comes before the device on mobile

**You will see:** at 375px wide, "Read / Listen / Anywhere" is the first thing on screen. Right
now a 40vh canvas sits above it and pushes the h1 below the fold.

- File: `src/sections/Hero.tsx`
- Remove `order-first` from the canvas column, keep `md:order-last`.

**Check:** narrow to 375px. The h1 must be visible without scrolling.

```
git commit -m "fix: put hero headline above the device on mobile"
```

### Step 2 - The hero is not half empty without WebGL

**You will see:** with WebGL disabled, a static device image where the canvas would be. Today the
column renders nothing and the hero looks broken.

- Files: `src/three/StaticStage.tsx` (new), `src/sections/Hero.tsx`
- Render `StaticStage` when `enhanced` is false. Match the canvas framing so nothing shifts.
- Until the real poster exists (Group E), point it at an existing `scene-library` image.

**Check:** disable WebGL, reload. The hero must look complete, not missing a half.

```
git commit -m "fix: render a static device poster when WebGL is unavailable"
```

### Step 3 - The About section stops eating a screen

**You will see:** the dead scroll gap between the hero and the features collapses. Four lines of
text no longer own a full viewport.

- File: `src/sections/About.tsx`
- Remove `min-h-screen`, keep the vertical padding.

**Check:** at 375px, scrolling from hero to features should take one swipe, not two.

```
git commit -m "fix: stop the about section reserving a full viewport"
```

### Step 4 - Both nav links at every width

**You will see:** "About" stays in the nav below 400px instead of disappearing.

- File: `src/App.tsx`
- Remove the `hidden min-[400px]:inline` pair on the About link.

**Check:** narrow to 320px. Both links visible, nav does not wrap badly.

```
git commit -m "fix: keep both nav links visible on narrow screens"
```

### Step 5 - Phones stop downloading desktop images

**You will see:** nothing on screen. In DevTools Network, the feature images drop to a smaller
transfer on a narrow viewport.

- File: `src/components/FeaturePhoto.tsx`
- Add `srcset` and `sizes`. Delete `transform: scale(1.8)` and the inline `style` prop that
  carries it; crop the source images instead.

**Check:** Network tab, throttle to Fast 3G, reload at 375px. Compare transferred size before and
after.

```
git commit -m "fix: serve responsive feature images and drop the scale crop"
```

### Step 6 - Shares render with an image

**You will see:** nothing on the page. Paste the URL into any link preview tool.

- File: `index.html`
- Add `og:image` and `twitter:card`. Use the poster from Step 2 until the real one exists.

```
git commit -m "chore: add og:image so shared links render a preview"
```

---

## Group B - Copy corrections

Text only. No structural change, so these are fast and each is independently reviewable.

### Step 7 - The WiFi claim becomes accurate

**You will see:** the line under the hero button changes.

Current copy claims "No phone, no cloud account", which reads as offline-capable. Read-aloud is
Edge TTS over a WebSocket and needs WiFi.

- File: `src/sections/Hero.tsx`
- New line: "Free, open source. No account. Read-aloud needs WiFi - the voices come from
  Microsoft Edge."

**Check:** read it as someone who has never seen the product. Does it promise offline playback?

```
git commit -m "fix: correct the offline claim in the hero fine print"
```

### Step 8 - The hero says what the product is

**You will see:** two framing lines appear between the h1 and the sample player.

- File: `src/sections/Hero.tsx`
- "A reader you install on your Kobo. It takes over the screen."
- Keyline: "400+ Microsoft Edge voices, six scripts, read aloud over Bluetooth."

**Check:** the first screen should answer "what is this" without scrolling.

```
git commit -m "feat: lead the hero with what KoThok is and what it sounds like"
```

### Step 9 - Feature copy names what the reader does

**You will see:** the four feature descriptions change wording.

Translate implementation phrasing to reader phrasing:

| From                      | To                                             |
| ------------------------- | ---------------------------------------------- |
| Mid-sentence page break   | Follow along while it reads                    |
| Parsed-book disk cache    | Opens instantly after the first time           |
| Live font-size change     | Make the text bigger without losing your place |
| Per-book-language voice   | It picks a voice that matches the book         |
| Sleep/wake preserves page | Wakes up on the page you left                  |

- Files: `src/content/features.ts` (new), `src/sections/Features.tsx`
- Move the strings out of the component while you are in there.

```
git commit -m "refactor: move feature copy to content module and reword for readers"
```

---

## Group C - Structure

The visible shape of the page changes here. Each step leaves the site coherent.

### Step 10 - The About section disappears

**You will see:** one fewer section. Its content already lives in the hero after Steps 7 and 8.

- Files: `src/sections/About.tsx` (delete), `src/App.tsx`
- Remove the import and the `<div id="about">` wrapper first, then delete the file. Update the
  nav anchor that points at `#about`.

**Check:** no console error, no dead anchor in the nav.

```
git commit -m "refactor: dissolve the about section into the hero"
```

### Step 11 - Features become a grid

**You will see:** the biggest single change. Four alternating full-width rows become a four-cell
bento.

- Files: `src/sections/Features.tsx`, `src/components/SpecChips.tsx` (new)
- Cells: Read aloud (wide), Reads EPUB (half), Your library, Controls.
- Each cell: screen capture, heading, chip row. No paragraphs.

**Check:** 375, 768, 1024, 1440. Cells reflow, no sideways scroll.

```
git commit -m "feat: rebuild features as a bento grid with spec chips"
```

### Step 12 - A Languages section appears

**You will see:** a new strip of six script glyphs after the features.

- Files: `src/content/languages.ts` (new), `src/sections/Languages.tsx` (new), `src/App.tsx`
- Bengali, Arabic, Devanagari, Thai, CJK, Latin, each with its voice id.

**Check:** the glyphs must render. If any box-glyph, the system font stack is missing that
script; add a fallback rather than swapping the site font.

```
git commit -m "feat: add a languages section for the supported scripts"
```

### Step 13 - The read-along demo appears

**You will see:** two page panels and a waveform, with a button that walks the highlight across
the page turn.

- Files: `src/components/ReadAlongDemo.tsx` (new), `src/sections/ReadAlong.tsx` (new), `src/App.tsx`
- Framing is follow-along, not mechanism: "The screen keeps up with the voice."

**Check:** with reduced-motion emulated, the demo must jump to its end state rather than animate.

```
git commit -m "feat: add the read-along demo section"
```

### Step 14 - The comparison table appears

**You will see:** a seven-row table directly below the demo.

- Files: `src/content/compare.ts` (new), `src/components/CompareTable.tsx` (new),
  `src/sections/Compare.tsx` (new), `src/App.tsx`
- Columns: KoThok, Kobo 5.10 screen reader, KOReader plus audiobook plugin.
- The offline row marks KoThok as the weak one. Leave it that way.

**Check:** at 375px the table scrolls inside its own wrapper and the page body does not scroll
sideways.

```
git commit -m "feat: add a comparison table against Kobo 5.10 and KOReader"
```

### Step 15 - Requirements appear before the download

**You will see:** a six-row spec sheet under the install steps.

- Files: `src/content/requirements.ts` (new), `src/components/SpecSheet.tsx` (new),
  `src/sections/GetStarted.tsx`
- Devices, formats (EPUB only), install needs, read-aloud needs, first install, on exit.

```
git commit -m "feat: list requirements and limits before the download"
```

### Step 16 - Section order and nav settle

**You will see:** the page reads Hero, Features, Languages, Read along, Compare, Get it, Footer.
Nav becomes What it does / Compare / Get it.

- File: `src/App.tsx`

```
git commit -m "refactor: set the final section order and nav links"
```

---

## Group D - The 3D widget

### Step 17 - The device responds to a drag

**You will see:** you can grab the hero device and turn it. It drifts slowly when left alone.

- File: `src/three/HeroStage.tsx`
- Remove `pointerEvents: none`. Replace the `IdleRig` sine sweep with drag plus idle drift.
- Set `touch-action: pan-y` on the wrapper.

**Check on a phone viewport with touch emulation:** a vertical swipe must scroll the page, not
rotate the device. This is the most likely regression in the whole plan.

```
git commit -m "feat: make the hero device draggable"
```

### Step 18 - The canvas costs nothing until seen

**You will see:** nothing. In DevTools Performance, the WebGL context is created on scroll rather
than on load.

- File: `src/three/HeroStage.tsx`
- Mount the `Canvas` on intersection.

```
git commit -m "perf: mount the hero canvas on intersection"
```

### Step 19 - Particles go

**You will see:** the ambient particles around the device disappear.

- Files: `src/three/Particles.tsx` (delete), `src/three/HeroStage.tsx`
- Remove the import and the element first, then delete the file.

```
git commit -m "refactor: remove ambient particles from the hero stage"
```

---

## Group E - Assets and final pass

### Step 20 - Real photographs replace the drawn placeholders

**You will see:** the bento cells and the hero poster become photographs.

- Files: `src/images.ts`, `public/images/*`
- Five shots, specified in `UPGRADE_PLAN.md` Phase 5.
- WebP plus PNG, 1x and 2x, 250KB budget at 2x.

```
git commit -m "feat: add product photography and wire it through images.ts"
```

### Step 21 - Verification pass

Work through the list, fix what it turns up, then merge.

1. 320, 375, 414, 768, 1024, 1440. No horizontal body scroll anywhere.
2. WebGL disabled: complete page. Reduced motion: complete page, no animation.
3. Tab the whole page. Focus visible. The drag widget is not a focus trap.
4. Both themes, including caveat chips and the tinted compare column.
5. Non-ASCII check.

```bash
# note: grep -P fails on some Windows locales and will report a false pass
python -c "
import sys,glob
bad=0
for p in glob.glob('src/**/*.*',recursive=True)+['index.html']:
    try: t=open(p,encoding='utf-8').read()
    except Exception: continue
    for i,l in enumerate(t.split(chr(10)),1):
        for ch in l:
            if ord(ch)>127:
                print(p,i,repr(ch)); bad+=1
print('non-ascii:',bad)
"
```

```bash
npm run lint && npm run format:check && npm run build
git checkout develop && git merge --no-ff <branch>
```

---

## If you only have an afternoon

Steps 1, 3, 4, 7. Four small commits, all visible, all independent. They fix the two worst layout
bugs and the one inaccurate claim on the site, and none of them commit you to the redesign.
