# KoThok Site

Landing page for [KoThok](https://github.com/Nayeem170/KoThok), a custom e-reader
app for Kobo e-ink devices. Read EPUBs in colour, or have them read aloud over
Bluetooth.

Built with **Vite + React + TypeScript**, **React Three Fiber** (three.js) for
the 3D device, **Framer Motion** for scroll reveals, and **Tailwind CSS**.

## Design

The centerpiece is a 3D e-reader that orbits as you scroll. Its screen cycles
through three real KoThok states: library, reading, and read-aloud. Brand
colours come from the device logo.

The 3D layer is lazy-loaded, gated behind WebGL support and
`prefers-reduced-motion`, with a static fallback. All real content is plain HTML,
so the page works and is indexable without WebGL.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/kothok-site/
npm run build    # type-check + production build to dist/
npm run preview
```

## Project links

- [KoThok](https://github.com/Nayeem170/KoThok) (reader app)
- [kobo-core](https://crates.io/crates/kobo-core) (device SDK)
- [kothok-edge-tts](https://crates.io/crates/kothok-edge-tts) (TTS client)

MIT
