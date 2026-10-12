# Szútrakönyv

Onedropzendo sutra book (2022), Hungarian and English, as an Astro site on Cloudflare.

- `szutra.htm` – the PDF-derived source
- `scripts/convert.mjs` – turns it into markdown in `src/content/szutrak/{hu,en}` (`npm run` is not wired up; run `node scripts/convert.mjs`). Section boundaries and titles live in `scripts/sections.mjs`.
- Gong notation is written `⟦O X X⟧` in the markdown and expanded by `src/plugins/gong.mjs`:
  `O` large gong, `X` small gong, `xxxx` accelerating strikes, `I` muted strike.

```sh
npm install
node scripts/convert.mjs   # regenerates the content; overwrites hand edits
npm run dev
npm run build
```
