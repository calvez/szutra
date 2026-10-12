// Remark plugin: expands ⟦O X X⟧ into styled gong marks and tags chant paragraphs.
//   O  large gong     X  small gong     xxxx  accelerating strikes     I  muted strike
const LABELS = {
  hu: { O: 'nagy gong', X: 'kis gong', x: 'gyorsuló ütések', I: 'leállított bongás' },
  en: { O: 'large gong', X: 'small gong', x: 'accelerating strikes', I: 'muted strike' },
};

const el = (name, className, children = [], props = {}) => ({
  type: 'emphasis',
  data: { hName: name, hProperties: { className: className ? [className] : [], ...props } },
  children,
});
const text = (value) => ({ type: 'text', value });

function marks(src, lang) {
  const labels = LABELS[lang] ?? LABELS.hu;
  const kids = [];
  const said = [];
  for (const m of src.matchAll(/(\s*)(O|X|I|x+)/g)) {
    const [, gap, tok] = m;
    const cls = gap ? 'sp' : '';
    if (tok[0] === 'x') {
      const dots = [...tok].map((_, i) => el('i', '', [], { style: `margin-left:${(0.32 * (1 - i / tok.length) + 0.04).toFixed(3)}em`, 'aria-hidden': 'true' }));
      kids.push(el('span', `roll ${cls}`.trim(), dots, { 'aria-hidden': 'true' }));
      said.push(labels.x);
    } else {
      const k = { O: 'o', X: 'x', I: 'stop' }[tok];
      kids.push(el('span', `${k} ${cls}`.trim(), [], { 'aria-hidden': 'true' }));
      said.push(labels[tok]);
    }
  }
  return el('span', 'gong', kids, { role: 'img', 'aria-label': said.join(', ') });
}

function expand(node, lang) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text' && child.value.includes('⟦')) {
      let last = 0;
      for (const m of child.value.matchAll(/⟦([^⟧]*)⟧/g)) {
        if (m.index > last) next.push(text(child.value.slice(last, m.index)));
        next.push(marks(m[1], lang));
        last = m.index + m[0].length;
      }
      if (last < child.value.length) next.push(text(child.value.slice(last)));
    } else {
      expand(child, lang);
      next.push(child);
    }
  }
  node.children = next;
}

const plain = (node) => (node.type === 'text' ? node.value : node.data?.hProperties?.className?.includes('gong') ? '' : (node.children ?? []).map(plain).join(''));

export default function remarkGong() {
  return (tree, file) => {
    const lang = /[\\/]en[\\/]/.test(file.path ?? '') ? 'en' : 'hu';
    const walk = (node, parent) => {
      if (node.type === 'paragraph') {
        const only = parent?.type === 'root' && node.children.length === 1 && node.children[0].type === 'text' && /^⟦[^⟧]*⟧$/.test(node.children[0].value.trim());
        expand(node, lang);
        const cls = [];
        if (only) cls.push('gong-line');
        else {
          const t = plain(node).replace(/[^\p{L}]/gu, '');
          if (t.length > 2 && t === t.toLocaleUpperCase()) cls.push('chant');
        }
        if (cls.length) node.data = { hProperties: { className: cls } };
        return;
      }
      (node.children ?? []).forEach((c) => walk(c, node));
      if (node.type !== 'root') expand(node, lang);
    };
    walk(tree);
  };
}
