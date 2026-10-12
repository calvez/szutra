// Section map for convert.mjs: where each sutra starts in the token stream, and how to title it.
// `start`  first token (regex on token text), searched forward from the previous section
// `back`   pull the start n tokens earlier (leading gong marks that belong to this section)
// `drop`   title tokens to remove (each regex consumed once); gong marks trailing a dropped title are kept
// `heads`  caps paragraphs that are headings, not chant lines
// `h2chant` bookmarked h2s in this section are chant lines, not headings

const HU = 'hu', EN = 'en';

export const sections = [
  // ---------------------------------------------------------------- magyar
  {
    id: 'sziv-szutra', lang: HU, order: 1, group: 'Szútrák',
    title: 'Prajna Paramita / Szív szútra',
    subtitle: 'Maha Prajna Paramita Hridaya Sutra – a nagy észt meghaladó bölcsesség',
    start: /^OOOIO$/,
    drop: [/^MAHA PRAJNA PARAMITA HRIDAYA SUTRA$/, /^\(A nagy észt meghaladó/],
  },
  {
    id: 'teidai-denpo', lang: HU, order: 2, group: 'Szútrák',
    title: 'Teidai denpo', subtitle: 'Busso no myogo – a Dharma átadási lánca',
    start: /^TEIDAI DENPO BUSSO NO/, lineage: true,
    drop: [/^TEIDAI DENPO BUSSO NO$/, /^MYOGO$/, /^\(A Dharma átadási lánca\)$/],
  },
  {
    id: 'hannya-shingyo', lang: HU, order: 3, group: 'Szútrák',
    title: 'Hannya Shingyo / Szív szútra', subtitle: 'Maka Hannya Haramita Shingyo – japánul',
    start: /MAKA HANNYA HARAMITA SHINGYO$/,
    drop: [/^MAKA HANNYA HARAMITA SHINGYO$/, /^HAN NYA SHIN GYO$/],
  },
  {
    id: 'na-mu-sa-man-da', lang: HU, order: 4, group: 'Szútrák',
    title: 'Na Mu Sa Man Da', subtitle: 'A csapásokat elhárító és jó szerencsét hozó dharáni',
    start: /^NA MU SA MAN DA$/,
    drop: [/^NA MU SA MAN DA$/, /^\(A csapásokat elhárító$/, /^és jó szerencsét hozó dharáni\)$/],
  },
  {
    id: 'elosszo-rinzai-mondasaihoz', lang: HU, order: 5, group: 'Szútrák',
    title: 'Előszó Rinzai mondásaihoz', subtitle: 'A Chin tartományból származó zen mester, Rinzai feljegyzett mondásaihoz',
    start: /^ELŐSZÓ$/,
    drop: [/^ELŐSZÓ$/, /^A CHIN TARTOMÁNYBÓL/],
  },
  {
    id: 'na-mu-ka-ra-tan-no', lang: HU, order: 6, group: 'Szútrák',
    title: 'Na Mu Ka Ra Tan No', subtitle: 'Dai Hi Shu – a Nagy Együttérzés dharánija',
    start: /^DAI HI SHU$/,
    drop: [/^DAI HI SHU$/, /^\(A Nagy Együttérzés dharánija\)$/],
  },
  {
    id: 'hakuin-zazen-dala', lang: HU, order: 7, group: 'Szútrák',
    title: 'Hakuin zenji Zazen dala',
    start: /^HAKUIN ZENJI ZAZEN DALA/,
    drop: [/^HAKUIN ZENJI ZAZEN DALA$/],
  },
  {
    id: 'torei-bodhiszattva-fogadalma', lang: HU, order: 8, group: 'Szútrák',
    title: 'Bódhiszattva fogadalma', subtitle: 'Torei zenji',
    start: /^IO$/,
    drop: [/^TOREI ZENJI:$/, /^A BÓDHISZATTVA$/, /^FOGADALMA$/],
  },
  {
    id: 'enmei-juku-kannon-gyo', lang: HU, order: 9, group: 'Szútrák',
    title: 'Enmei Juku Kannon Gyo', subtitle: 'A hosszú élet tíz tételének dharánija – Avalókitésvara bódhiszattva szútra',
    start: /^ENMEI JUKU KANNON GYO$/,
    drop: [/^ENMEI JUKU KANNON GYO$/, /^\(A hosszú élet tíz tételének/],
  },
  {
    id: 'negy-fogadalom-japan', lang: HU, order: 10, group: 'Szútrák',
    title: '4 fogadalom (japán)', subtitle: 'Shu jo mu hen sei gan do',
    start: /^A NÉGY BÓDHISZATTVA FOGADALOM$/,
    drop: [/^A NÉGY BÓDHISZATTVA FOGADALOM$/, /^SHU JO MU HEN SEI GAN DO$/],
    override: { '(X X X)': [{ k: 'mark', text: 'X X X' }] },
  },
  {
    id: 'negy-fogadalom', lang: HU, order: 11, group: 'Szútrák',
    title: '4 fogadalom', subtitle: 'A négy bódhiszattva fogadalom',
    start: /^NÉGY BÓDHISZATTVA FOGADALOM$/,
    drop: [/^NÉGY BÓDHISZATTVA FOGADALOM$/],
    override: {
      'X XX xxxxxxxxxxxxxx 1. X I': [{ k: 'mark', text: 'X XX xxxxxxxxxxxxxx' }, { k: 'p', text: '1. ⟦X I⟧' }],
      '3. XX I felegyenesedve:': [{ k: 'p', text: '3. ⟦XX I⟧ felegyenesedve:' }],
    },
  },
  {
    id: 'a-dharma-megnyitasa', lang: HU, order: 12, group: 'Szútrák',
    title: 'A Dharma megnyitása', subtitle: 'A tan elfogadásának szútrája – Teisho előtt',
    start: /^A TAN ELFOGADÁSÁNAK SZÚTRÁJA$/,
    drop: [/^A TAN ELFOGADÁSÁNAK SZÚTRÁJA$/, /^A DHARMA MEGNYITÁSA/],
  },
  {
    id: 'daito-kokushi-intelmei', lang: HU, order: 13, group: 'Szútrák',
    title: 'Daito Kokushi intelmei',
    start: /^DAITO KOKUSHI INTELMEI$/,
    drop: [/^DAITO KOKUSHI INTELMEI$/],
  },
  {
    id: 'daie-zenji-fogadalma', lang: HU, order: 14, group: 'Esti sesshin szútrák',
    title: 'DaiE zenji fogadalma a felébredésre', subtitle: 'Esti szútra',
    start: /^ESTI SZÚTRA$/,
    drop: [/^ESTI SZÚTRA$/, /^DAIE ZENJI FOGADALMA A FELÉBREDÉSRE$/],
  },
  {
    id: 'hetkoznapi-felajanlasok', lang: HU, order: 15, group: 'Hétköznapi felajánlások',
    title: 'Hétköznapi felajánlások', subtitle: 'Szútrák felajánlása',
    start: /^HÉTKÖZNAPI FELAJÁNLÁS SZÚTRÁK$/,
    drop: [/^HÉTKÖZNAPI FELAJÁNLÁS SZÚTRÁK$/],
  },
  {
    id: 'etkezesi-szutrak', lang: HU, order: 16, group: 'Étkezési szútrák',
    title: 'Étkezési szútrák',
    start: /^ÉTKEZÉSI SZÚTRÁK$/,
    drop: [/^ÉTKEZÉSI SZÚTRÁK$/],
    headOverride: { 'MAHA PRAJNA PARAMITA HRIDAYA SUTRA': 'Maha Prajna Paramita Hridaya Sutra', 'EBÉD / VACSORA UTÁN': 'Ebéd / vacsora után' },
  },

  // ---------------------------------------------------------------- english
  {
    id: 'heart-sutra', lang: EN, order: 101, group: 'Sesshin Sutras',
    title: 'Prajna Paramita / Heart Sutra', subtitle: 'Maha Prajna Paramita Hridaya Sutra',
    start: /^English$/,
    drop: [/^English$/, /^Sutra Book$/, /^MAHA PRAJNA PARAMITA HRIDAYA SUTRA$/, /^\(The Heart Sutra\)$/],
  },
  {
    id: 'teidai-denpo', lang: EN, order: 102, group: 'Sesshin Sutras',
    title: 'Teidai Denpo', subtitle: 'Busso no myogo – lineage of dharma transmission',
    start: /^TEIDAI DENPO BUSSO NO$/, lineage: true,
    drop: [/^TEIDAI DENPO BUSSO NO$/, /^MYOGO$/, /^\(Lineage of dharma transmission\)$/],
  },
  {
    id: 'hannya-shingyo', lang: EN, order: 103, group: 'Sesshin Sutras',
    title: 'Hannya Shingyo / Heart Sutra', subtitle: 'Maka Hannya Haramita Shingyo',
    start: /^I O$/,
    drop: [/^MAKA HANNYA HARAMITA SHINGYO$/, /^HAN NYA SHIN GYO$/],
  },
  {
    id: 'na-mu-sa-man-da', lang: EN, order: 104, group: 'Sesshin Sutras',
    title: 'Na Mu Sa Man Da',
    start: /^NA MU SA MAN DA\n/,
    drop: [/^NA MU SA MAN DA$/],
  },
  {
    id: 'preface-to-rinzai-record', lang: EN, order: 105, group: 'Sesshin Sutras',
    title: 'Preface to Rinzai Record', subtitle: 'To the recorded sayings of Zen Master Rinzai of Chin Province',
    start: /^PREFACE$/,
    drop: [/^PREFACE$/, /^TO THE RECORDED SAYINGS$/, /^OF ZEN MASTER RINZAI/],
  },
  {
    id: 'na-mu-ka-ra-tan-no', lang: EN, order: 106, group: 'Sesshin Sutras',
    title: 'Na Mu Ka Ra Tan No', subtitle: 'Dai Hi Shu – the Dharani of the Great Compassionate One',
    start: /^NA MU KA RA TAN NO$/,
  },
  {
    id: 'hakuin-song-of-zazen', lang: EN, order: 107, group: 'Sesshin Sutras',
    title: 'Hakuin Zenji’s Song of Zazen',
    start: /^HAKUIN ZENJI’S SONG OF ZAZEN$/,
    drop: [/^HAKUIN ZENJI’S SONG OF ZAZEN$/],
  },
  {
    id: 'torei-bodhisattva-vow', lang: EN, order: 108, group: 'Sesshin Sutras',
    title: 'Torei Zenji’s Bodhisattva Vow', subtitle: 'Bosatsu Gangyo Mon',
    start: /^I O$/,
    drop: [/^TOREI ZENJI’S BODHISATTVA VOW/],
  },
  {
    id: 'enmei-juku-kannon-gyo', lang: EN, order: 109, group: 'Sesshin Sutras',
    title: 'Enmei Juku Kannon Gyo', subtitle: 'The dharani of the ten phrases for long life',
    start: /^ENMEI JUKU KANNON GYO/,
    drop: [/^ENMEI JUKU KANNON GYO$/],
  },
  {
    id: 'shu-jo-mu-hen-sei-gan-do', lang: EN, order: 110, group: 'Sesshin Sutras',
    title: 'Shu Jo Mu Hen Sei Gan Do', subtitle: 'The four bodhisattva vows',
    start: /^SHU JO MU HEN SEI GAN DO/,
    drop: [/^SHU JO MU HEN SEI GAN DO$/],
  },
  {
    id: 'sentient-beings', lang: EN, order: 111, group: 'Sesshin Sutras',
    title: 'Sentient Beings', subtitle: 'The four bodhisattva vows',
    start: /^SENTIENT BEINGS/,
    drop: [/^SENTIENT BEINGS$/],
    prefixP: 'Sentient beings ',
    ocr: (s) => s.replace('to them. The Dharmas', 'to them.\n\nThe Dharmas'),
    override: {
      '1. X I': [{ k: 'p', text: '1. ⟦X I⟧' }],
      '2. X I': [{ k: 'p', text: '2. ⟦X I⟧' }],
      '3. XX I': [{ k: 'p', text: '3. ⟦XX I⟧' }],
    },
  },
  {
    id: 'opening-na-mu-ka-ra-tan-no', lang: EN, order: 112, group: 'Opening the Dharma',
    title: 'Na Mu Ka Ra Tan No', subtitle: 'Opening the Dharma',
    start: /^OPENING THE DHARMA$/,
    drop: [/^OPENING THE DHARMA$/],
  },
  {
    id: 'the-dharma-opening', lang: EN, order: 113, group: 'Opening the Dharma',
    title: 'The Dharma Opening',
    start: /^THE DHARMA,/,
    drop: [/^THE DHARMA,$/],
    prefixP: 'The Dharma, ',
  },
  {
    id: 'daito-kokushi-admonition', lang: EN, order: 114, group: 'Opening the Dharma',
    title: 'Daito Kokushi’s Admonition',
    start: /^DAITO KOKUSHI’S ADMONITION$/,
    drop: [/^DAITO KOKUSHI’S ADMONITION$/],
  },
  {
    id: 'dai-e-vow-for-awakening', lang: EN, order: 115, group: 'Evening Sutra',
    title: 'Dai E Zenji’s Vow for Awakening', subtitle: 'Evening sutra',
    start: /^DAI E ZENJI’S VOW FOR AWAKENING$/, back: 1,
    drop: [/^DAI E ZENJI’S VOW FOR AWAKENING$/],
  },
  {
    id: 'end-of-sesshin-ceremony', lang: EN, order: 116, group: 'End of Sesshin Ceremony',
    title: 'End of Sesshin Ceremony', subtitle: 'Setsuryo fugin',
    start: /^END OF SESSHIN CEREMONY$/,
    drop: [/^END OF SESSHIN CEREMONY$/, /^\{?SETSURYO FUGIN\}?$/, /^SETSURYO FUGIN$/],
  },
  {
    id: 'lay-ordination-ceremony', lang: EN, order: 117, group: 'Lay Ordination Ceremony',
    title: 'Lay Ordination Ceremony', subtitle: 'Jukai ceremony',
    start: /^LAY ORDINATION CEREMONY/,
    drop: [/^LAY ORDINATION CEREMONY/, /^JUKAI CEREMONY$/],
    heads: [/^(THREE PURE PRECEPTS|TEN PRECEPTS):$/, /^WILL YOU OBSERVE THESE PRECEPTS ALWAYS\?$/],
  },
  {
    id: 'buchinson-shin-dharani', lang: EN, order: 118, group: 'Lay Ordination Ceremony',
    title: 'Buchinson Shin Dharani', subtitle: 'Dharani of the Victorious Buddha Crown',
    start: /^BUCHINSON SHIN DHARANI$/,
    drop: [/^BUCHINSON SHIN DHARANI$/],
    ocr: (s) => s.replace(/\b([A-Z]{1,3})l\b/g, '$1I'),
  },
  {
    id: 'ita-ten-fu-gin', lang: EN, order: 119, group: 'Lay Ordination Ceremony',
    title: 'Ita Ten Fu Gin',
    start: /^ITA TEN FU GIN/, h2chant: true,
    drop: [/^ITA TEN FU GIN$/],
  },
  {
    id: 'meal-chants', lang: EN, order: 120, group: 'Meal Chants',
    title: 'Meal Chants',
    start: /^MEAL CHANTS$/,
    drop: [/^MEAL CHANTS$/],
    heads: [/^BEFORE MEALS$/],
  },
];

// Which sutra pages get which of the Hungarian notes at the back of the book.
export const noteMap = [
  { head: /^Hannya Shingyo \/ Szív szútra$/, ids: ['hu/sziv-szutra', 'hu/hannya-shingyo'] },
  { head: /^Tedai Dempo Busso No Myo Go \/$/, skip: 1, ids: ['hu/teidai-denpo'] },
  { head: /^Na Mu Sa Man Da$/, skip: 1, ids: ['hu/na-mu-sa-man-da'] },
  { head: /^Előszó a Chin tartományból/, ids: ['hu/elosszo-rinzai-mondasaihoz'] },
  { head: /^Dai Hi Shu:$/, skip: 3, ids: ['hu/na-mu-ka-ra-tan-no'] },
  { head: /^Hakuin zenji Zazen dala$/, ids: ['hu/hakuin-zazen-dala'] },
  { head: /^Torei Zenji Bódhiszattva fogadalma /, inline: true, ids: ['hu/torei-bodhiszattva-fogadalma'] },
  { head: /^Enmei Juku Kannon Gyo$/, skip: 1, ids: ['hu/enmei-juku-kannon-gyo'] },
  { head: /^Négy fogadalom$/, ids: ['hu/negy-fogadalom-japan', 'hu/negy-fogadalom'] },
  { head: /^DaiE zenji fogadalma a felébredésre /, inline: true, ids: ['hu/daie-zenji-fogadalma'] },
  { head: /^A Dharma megnyitása$/, ids: ['hu/a-dharma-megnyitasa'] },
  { head: /^Buchinson Shin dharáni$/, skip: 1, ids: ['en/buchinson-shin-dharani'] },
  { head: /^Gyaku Hon Jin Shu$/, ids: ['en/buchinson-shin-dharani'] },
  { head: /^Ita Ten Fu Gin$/, ids: ['en/ita-ten-fu-gin'] },
];
export const generalHeads = [/^Szútrák$/, /^Eko$/, /^Mantrák$/, /^Dharáni$/];
