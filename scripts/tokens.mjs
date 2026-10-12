// Tokenizes the PDF-derived szutra.htm into a flat list of {tag, text, indent, table} tokens.
import { readFileSync } from 'node:fs';

const GLOSS_OPEN = '\u0001', GLOSS_CLOSE = '\u0002';

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

export function tokenize(file) {
  const src = readFileSync(file, 'utf8').replace(/^﻿/, '');
  const body = src.slice(src.indexOf('<body>'));
  const tokens = [];
  let inTable = 0;
  const re = /<(h1|h2|p|table|\/table|tr)\b([^>]*)>([\s\S]*?)(?=<(?:h1|h2|p|table|\/table|tr)\b|$)/g;
  for (const m of body.matchAll(re)) {
    const [, tag, attr, inner] = m;
    if (tag === 'table') { inTable++; continue; }
    if (tag === '/table') { inTable = Math.max(0, inTable - 1); continue; }
    if (tag === 'tr') continue;
    let t = inner
      .replace(/<span class="font0"[^>]*>([\s\S]*?)<\/span>/g, `${GLOSS_OPEN}$1${GLOSS_CLOSE}`)
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '');
    t = decode(t)
      .replace(/[ \t\r\f\v]+/g, ' ')
      .replace(/ ?\n ?/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (!t) continue;
    const indent = Number(/(?:padding:0pt 0pt 0pt|text-indent:)(\d+)pt/.exec(attr)?.[1] ?? 0);
    tokens.push({ tag, text: t, indent, table: inTable > 0 });
  }
  return tokens;
}
export { GLOSS_OPEN, GLOSS_CLOSE };
