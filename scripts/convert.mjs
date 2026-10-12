// Converts the PDF-derived szutra.htm into clean markdown files in src/content/szutrak/{hu,en}.
// Gong notation is written as ⟦O X X⟧ and expanded to styled marks by src/plugins/gong.mjs.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tokenize, GLOSS_OPEN, GLOSS_CLOSE } from './tokens.mjs';
import { sections, noteMap, generalHeads } from './sections.mjs';

const tokens = tokenize(new URL('../szutra.htm', import.meta.url).pathname);

// ---------- helpers ----------
const isMarker = (s) => /^[OXIx ]+$/.test(s) && /[OXI]/.test(s);
const SUFFIX = /^(BUTSU|SONJA|DAISHI|ZENJI)$/;
const CAPS = /^[A-ZÁÉÍÓÖŐÚÜŰŌĀĪŪ0-9'’ ,.\-!?():]+$/;
const HEAD_EKO = /^((?:Honzon|Kaisan|Chinju) )?Eko\b:?/;
const LOWER = /^[a-záéíóöőúüű]/;

const stripGloss = (s) => s.replaceAll(GLOSS_OPEN, '').replaceAll(GLOSS_CLOSE, '');
const noTags = (s) => s.replace(/<[^>]+>/g, '');
const gong = (s) => `⟦${s.replace(/\s+/g, ' ').trim()}⟧`;

function glossToEm(s) {
  // a gloss ending inside the parenthesis is a typo in the source:  "({a tudat) }"  ->  "{(a tudat) }"
  s = s.replace(new RegExp(`\\(${GLOSS_OPEN}([^${GLOSS_CLOSE})]*)\\)\\s*${GLOSS_CLOSE}`, 'g'), `${GLOSS_OPEN}($1) ${GLOSS_CLOSE}`);
  return s.replace(new RegExp(`${GLOSS_OPEN}([\\s\\S]*?)${GLOSS_CLOSE}`, 'g'), (m, inner) => {
    const t = inner.trim();
    if (!t) return inner ? ' ' : '';
    return `${/^\s/.test(inner) ? ' ' : ''}<i class="gloss">${t}</i>${/\s$/.test(inner) ? ' ' : ''}`;
  });
}

function inlineMarks(s) {
  s = s.replace(/^((?:X ?)+)(?=\S)/, (m, g) => gong(g) + ' '); // leading:  "X hogy ..."
  s = s.replace(/(\s)((?:(?:[OX]|IO)\s*)+)$/, (m, sp, g) => ' ' + gong(g)); // trailing:  "... időben, O"
  return s;
}

const titleCase = (s) => s.toLocaleLowerCase('hu').replace(/(^|[\s\-/(])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('hu'));
const sentenceCase = (s) => { const l = s.toLocaleLowerCase('hu'); return l.charAt(0).toLocaleUpperCase('hu') + l.slice(1); };
function headText(s, sec) {
  const plain = stripGloss(s);
  if (sec.headOverride?.[plain]) return sec.headOverride[plain];
  if (/[a-záéíóöőúüű]/.test(plain)) return s;
  return sec.lang === 'hu' ? sentenceCase(s) : titleCase(s);
}

// ---------- text repairs ----------
const hyphenated = [
  'bódhiszatt-va', 'mant-rája', 'mant-ra', 'Dhar-ma', 'kö-nyörgök', 'mahájá-na', 'recitá-lása', 'káp-rázat', 'mahászattvá-jának',
  'Tathá-gata', 'Szam-szára', 'Budd-ha', 'zen-jinek', 'o-shónak', 'An-cestor', 'Pre-face', 'Pra-jna', 'emp-tiness', 'ut-most',
  'depar-ture', 'unsur-passable', 'sur-passable', 're-turns', 'hap-pen', 'indi-vidual', 'com-plete', 'Taishitsu-mon', 'in-tellektualitáson',
];
const fixes = [
  [/õ/g, 'ő'], [/Õ/g, 'Ő'], [/û/g, 'ű'], [/Û/g, 'Ű'],
  [/Compasssionate/g, 'Compassionate'],
  [/visz-sza/g, 'vissza'], [/meny-nyei/g, 'mennyei'],
  [/templomvédő\u0001\(ke\)\u0002 ?t /g, 'templomvédő(ke)t '],
  ...hyphenated.map((w) => [new RegExp(w, 'g'), w.replace('-', '')]),
  [/ - /g, ' – '],
  [/ ?\.{3,} ?/g, ' … '],
];
function repair(s) {
  for (const [re, to] of fixes) s = s.replace(re, to);
  return s.replace(/ {2,}/g, ' ').replace(/ ([,.;:!?])/g, '$1');
}

// ---------- section slicing ----------
let cursor = 0;
const slices = sections.map((s) => {
  const i = tokens.findIndex((t, k) => k >= cursor && s.start.test(t.text));
  if (i < 0) throw new Error(`start not found: ${s.lang}/${s.id} ${s.start}`);
  const at = i - (s.back ?? 0);
  cursor = i + 1;
  return { ...s, at };
});
const tail = tokens.findIndex((t, k) => k > 1500 && !t.table && t.text === 'Szútrák');
slices.forEach((s, i) => { s.end = i + 1 < slices.length ? slices[i + 1].at : tail; });

// the Japanese lineage continues past the table in the Hungarian layout; the English one has it row by row
const lineageTail = (() => {
  const i = tokens.findIndex((t, k) => k > 300 && t.table && /^KUKYU JO RUI/.test(t.text));
  const names = [];
  for (let k = i + 1; k < tokens.length && tokens[k].table; k++) if (tokens[k].text !== 'ZENJI') names.push(tokens[k].text.replace(/ ZENJI$/, ''));
  return names;
})();

// ---------- render a token range to blocks ----------
function render(sec, range = tokens.slice(sec.at, sec.end), { notes = false } = {}) {
  const out = [];
  const subtitle = [];
  let lineage = null;
  const pending = new Set(sec.drop ?? []);
  const dropped = (txt) => { for (const re of pending) if (re.test(txt)) { pending.delete(re); return true; } return false; };
  const flushLineage = () => { if (lineage) { out.push({ k: 'list', items: lineage }); lineage = null; } };

  for (const t of range) {
    const text = t.text;
    if (t.gloss) { out.push({ k: 'verse', text: repair(text) }); continue; }
    if (sec.lineage) {
      if (t.table) {
        const plain = stripGloss(text).replace(/\|$/, '').trim();
        if (dropped(plain)) continue;
        if (/^\(.*\)$/.test(plain) && !lineage) continue;
        if (isMarker(plain)) { flushLineage(); out.push({ k: 'mark', text: plain }); continue; }
        lineage ??= [];
        if (SUFFIX.test(plain) && lineage.length) lineage[lineage.length - 1] += ' ' + plain;
        else lineage.push(plain);
        continue;
      }
      if (/^O AN DON GE MITTAN|^TAI GEN SHIGEN|^(ZENJI ){5,}/.test(text)) {
        if (/^O AN DON GE/.test(text)) { lineage ??= []; lineageTail.forEach((n) => lineage.push(n + ' ZENJI')); }
        continue;
      }
      flushLineage();
    }

    text.split('\n\n').forEach((part, pi) => {
      const plain = stripGloss(part).trim();
      if (!plain) return;
      if (dropped(plain)) return;
      const trail = /^(.*?)\s+((?:(?:[OX]|IO)\s*)+)$/.exec(plain);
      if (trail && dropped(trail[1])) { out.push({ k: 'mark', text: trail[2] }); return; }
      if (sec.override?.[plain]) { out.push(...sec.override[plain]); return; }
      if (isMarker(plain)) { out.push({ k: 'mark', text: plain }); return; }
      if (/^-{3,}$/.test(plain)) { out.push({ k: 'hr' }); return; }
      const numbered = /^(\d+)\.\s+((?:[XOI]\s*)+)$/.exec(plain);
      if (numbered) { out.push({ k: 'p', text: `${numbered[1]}. ${gong(numbered[2])}` }); return; }

      const rubric = !notes && part.startsWith(GLOSS_OPEN) && part.trim().endsWith(GLOSS_CLOSE) && part.split(GLOSS_OPEN).length === 2;
      let s = glossToEm(repair(part)).trim();
      if (rubric) {
        let r = noTags(s).replace(/^\((.*)\)$/s, '$1').trim();
        r = r.replace(/\s+((?:[OX]\s*)+)$/, (m, g) => ' ' + gong(g));
        out.push({ k: 'rubric', text: r });
        return;
      }
      if (HEAD_EKO.test(plain) && plain.length < 40) { out.push({ k: 'head', level: 3, text: s }); return; }
      if (t.tag === 'h2' && pi === 0 && !sec.h2chant) { out.push({ k: 'head', level: 2, text: headText(s, sec) }); return; }
      if ((sec.heads ?? []).some((re) => re.test(plain))) { out.push({ k: 'head', level: 3, text: headText(s, sec) }); return; }
      if (sec.ocr) s = sec.ocr(s);
      s = inlineMarks(s);
      const bare = noTags(s).replace(/⟦.*?⟧/g, '').trim();
      const chant = !notes && CAPS.test(bare) && !/^\d+\./.test(bare);
      out.push({ k: chant ? 'chant' : 'p', text: s });
    });
  }
  flushLineage();
  if (sec.prefixP) { const f = out.find((b) => b.k === 'p'); if (f) f.text = sec.prefixP + f.text; }
  return { blocks: out, subtitle };
}

// ---------- blocks -> markdown ----------
function toMarkdown(blocks) {
  const body = [];
  let chant = [];
  let prev = null;
  const flush = () => { if (chant.length) { body.push(chant.join('  \n')); chant = []; } };
  const pushP = (b) => {
    if (prev?.k === 'p') {
      const last = body.length - 1;
      const pt = body[last];
      const open = !/[.!?:…”"»)\]⟧>]$/.test(pt);
      if (/[A-Za-zÁ-ű]-$/.test(pt) && LOWER.test(b.text)) { body[last] = pt.slice(0, -1) + b.text; return; }
      if (open && LOWER.test(b.text)) { body[last] = pt + ' ' + b.text; return; }
      if (open && pt.length > 110 && /^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(b.text) && /[a-záéíóöőúüű,]$/.test(pt)) { body[last] = pt + ' ' + b.text; return; }
    }
    body.push(b.text);
  };
  for (const b of blocks) {
    if (b.k === 'chant') { chant.push(b.text); prev = b; continue; }
    flush();
    if (b.k === 'mark') body.push(gong(b.text));
    else if (b.k === 'hr') body.push('***');
    else if (b.k === 'head') body.push(`${'#'.repeat(b.level)} ${b.text}`);
    else if (b.k === 'rubric') body.push(`> ${b.text}`);
    else if (b.k === 'verse') body.push(`*${b.text}*`);
    else if (b.k === 'list') body.push(b.items.map((n) => `- ${titleCase(n)}`).join('\n'));
    else if (b.k === 'p') pushP(b);
    prev = b;
  }
  flush();
  return body.join('\n\n');
}

// ---------- notes at the back of the book ----------
const notes = {}; // id -> markdown
let generalNotes = '';
{
  const rest = tokens.slice(tail, tokens.length - 1); // last token is the colophon
  const heads = [...generalHeads, ...noteMap.map((n) => n.head)];
  const idx = [];
  rest.forEach((t, i) => { if (!t.table && heads.some((re) => re.test(t.text))) idx.push(i); });
  const pseudo = { lang: 'hu', drop: [], headOverride: {} };
  idx.forEach((start, n) => {
    const next = idx[n + 1] ?? rest.length;
    const first = rest[start];
    const map = noteMap.find((m) => m.head.test(first.text));
    let range = rest.slice(start + 1 + (map?.skip ?? 0), next);
    if (map?.inline) range = [{ ...first, text: first.text.replace(map.head, '') }, ...range];
    // consecutive gloss-only tokens are Sanskrit lines: keep them as italic lines, joining split parentheses
    const merged = [];
    for (const t of range) {
      const plain = stripGloss(t.text).trim();
      const onlyGloss = t.text.replace(new RegExp(`${GLOSS_OPEN}[\\s\\S]*?${GLOSS_CLOSE}`, 'g'), '').trim() === '';
      if (onlyGloss) {
        const prevT = merged[merged.length - 1];
        if (prevT?.gloss && (prevT.text.match(/\(/g) ?? []).length > (prevT.text.match(/\)/g) ?? []).length) prevT.text = (prevT.text + ' ' + plain).replace(/ \)/g, ')');
        else merged.push({ tag: 'p', text: plain, gloss: true });
      } else merged.push(t);
    }
    const blocks = render(pseudo, merged, { notes: true }).blocks;
    const md = toMarkdown(blocks);
    const fixed = md;
    if (generalHeads.some((re) => re.test(first.text))) generalNotes += `## ${first.text}\n\n${fixed}\n\n`;
    else for (const id of map.ids) notes[id] = (notes[id] ? notes[id] + '\n\n' : '') + fixed;
  });
}

// ---------- emit ----------
const q = (s) => JSON.stringify(s);
const outDir = new URL('../src/content/szutrak/', import.meta.url);
rmSync(outDir, { recursive: true, force: true });
for (const l of ['hu', 'en']) mkdirSync(new URL(`${l}/`, outDir), { recursive: true });

const written = [];
for (const s of slices) {
  const { blocks, subtitle } = render(s);
  const note = notes[`${s.lang}/${s.id}`];
  const label = s.lang === 'hu' ? 'Megjegyzés' : 'Megjegyzés (magyarul)';
  const fm = ['---', `title: ${q(s.title)}`, (s.subtitle ?? subtitle[0]) ? `subtitle: ${q(s.subtitle ?? subtitle[0])}` : null, `lang: ${s.lang}`, `group: ${q(s.group)}`, `order: ${s.order}`, '---']
    .filter(Boolean).join('\n');
  const noteMd = note ? `<details class="note">\n<summary>${label}</summary>\n\n${note}\n\n</details>\n\n` : '';
  const md = `${fm}\n\n${noteMd}${toMarkdown(blocks)}\n`;
  writeFileSync(new URL(`${s.lang}/${s.id}.md`, outDir), md);
  written.push(md);
}
writeFileSync(
  new URL('hu/jegyzetek.md', outDir),
  `---\ntitle: "Jegyzetek"\nsubtitle: "A szútrákról, az ekóról, a mantrákról és a dharánikról"\nlang: hu\ngroup: "Jegyzetek"\norder: 17\n---\n\n${generalNotes.replace(/^## /gm, '## ').trim()}\n`,
);
console.log(slices.length + 1, 'files');

// report suspicious leftovers for manual review
const all = written.join('\n');
console.log('inline hyphens:', [...new Set(all.match(/[A-Za-záéíóöőúüű]{2,}-[a-záéíóöőúüű]{2,}/g) ?? [])].join(' '));
console.log('leftover markers:', [...new Set(all.match(/\u0001|\u0002/g) ?? [])].length);
