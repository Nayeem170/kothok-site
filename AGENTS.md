# AGENTS.md

Guidance for AI agents working on kothok-site.

## Project

Marketing site for KoThok, a reader app for Kobo e-ink devices.
Stack: Vite, React, TypeScript, React Three Fiber (three.js), Framer Motion, Tailwind CSS.

## Commands

- `npm run dev` - local dev server
- `npm run build` - type-check (`tsc --noEmit`) then production build; must pass before commit
- `npm run typecheck` - type-check only
- `npm run lint` - ESLint; must be clean
- `npm run lint:fix` - auto-fix lint
- `npm run format` - Prettier write
- `npm run format:check` - verify Prettier formatting; must pass

Before finishing any change, `npm run lint`, `npm run format:check`, and `npm run build` must all pass.

## Text rules (UI copy, docs, comments, metadata)

ASCII only. Replace these with the ASCII form and never reintroduce them:

- U+2014 / U+2013 / U+2012 / U+2212 (em/en dashes) -> `-`
- U+2022 / U+00B7 (bullet, middle dot) -> `-` or `/`
- U+2026 (ellipsis) -> `...`
- U+201C / U+201D (smart double quotes) -> `"`
- U+2018 / U+2019 (smart single quotes) -> `'`
- U+2192 / U+21D2 / U+2190 (arrows) -> `->`, `=>`, `<-`
- U+00A0 (no-break space), U+200B (zero-width space), other Unicode whitespace -> normal space or remove
- all emoji and decorative Unicode (stars, checks, box-drawing) -> remove

Write like a senior engineer: short sentences, concrete nouns, no filler. Do not use: premium, seamless, effortless, cutting-edge, revolutionary, immersive, leverage, utilize, "experience", "elevate", or similar marketing words. Keep UI labels short and plain.

## Code rules

- Strict TypeScript. No `any`, no `@ts-ignore` without a stated reason; prefer optional chaining over `!`.
- Files under ~300 lines; functions and components under ~60 lines; one responsibility per module.
- No `console.*` or `debugger` in committed code.
- Comments only to explain why (a constraint, a quirk, a deliberate best-effort ignore). Never narrate what the code does; no AI-generated or placeholder comments.
- Centralize colors and z-index as Tailwind tokens; centralize asset paths in `src/images.ts`.
- No dead code or unused exports; delete, do not comment out.
- LF line endings (enforced by `.gitattributes` and `.editorconfig`).

Full detail in `docs/CODE_CONVENTIONS.md` (local, gitignored).

## Git

- Branch off `develop`, commit with conventional messages (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`), and merge back to `develop` with `--no-ff`.
- Do not commit unless asked. Do not push unless asked.

## Layout notes

- The 3D scene (`HeroStage`) is lazy-loaded; keep heavy code out of the main bundle.
- Scene and device images live in `public/images/`; reference them only through `src/images.ts`.
- `docs/CODE_CONVENTIONS.md` is gitignored on purpose; it is a local reference, not shipped.
