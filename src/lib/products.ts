import { Product } from '@/types';

export interface ProductWithSpecs extends Product {
  specs?: string[];
  longDescription?: string;
}

export const PRODUCTS: ProductWithSpecs[] = [
  {
    id: '1',
    name: 'Gibson Les Paul Standard',
    description: 'The legendary solid-body electric guitar with dual humbuckers and mahogany construction.',
    longDescription:
      'Few instruments carry a silhouette this recognisable. The Les Paul Standard is the electric other electrics are measured against \u2014 a carved maple cap over a mahogany body, wired to a pair of Burstbuckers that move from a whisper to a roar without ever losing their composure. It does not ask to be noticed; it simply is. Pick it up once and the weight, the warmth, and the sustain explain the last seventy years of rock without a word.',
    price: 2499,
    image_url: '/barang/Gibson_Les_Paul_Standard.webp',
    images: ['/barang/Gibson_Les_Paul_Standard.webp'],
    category: 'Guitar',
    specs: ['Mahogany Body', 'Rosewood Fretboard', 'Burstbucker Pickups', 'Nitrocellulose Finish']
  },
  {
    id: '2',
    name: 'Yamaha U1 Upright Piano',
    description: 'A perennial favorite among discerning pianists, offering outstanding musical performance.',
    longDescription:
      'The U1 has spent decades as the quiet benchmark of the upright world, and it has earned every bit of that reputation. Its spruce soundboard speaks with a clarity that flatters the player and forgives nothing, while the action responds to the lightest change of intent. This is not furniture that happens to play \u2014 it is an instrument that happens to be beautiful, built to sit at the centre of a home or a conservatory for a generation.',
    price: 8999,
    image_url: '/barang/Yamaha_U1_Upright_Piano.webp',
    images: ['/barang/Yamaha_U1_Upright_Piano.webp'],
    category: 'Piano',
    specs: ['Spruce Soundboard', 'V-Pro Plate', 'Premium Felt Hammers', 'Soft-Close Fallboard']
  },
  {
    id: '3',
    name: 'Roland TD-17KVX V-Drums',
    description: 'Electronic drum kit with premium snare, hi-hat, and cymbals for professional practice.',
    longDescription:
      'Serious practice deserves a serious instrument, and the TD-17KVX refuses to behave like a compromise. Mesh heads answer the stick the way an acoustic kit does, the VH-10 hi-hat tracks every nuance of the foot, and the sound engine is borrowed, unapologetically, from Roland\u2019s flagship. Play it at midnight through headphones; sound like the stage. It is the rare practice tool that makes you a better drummer instead of merely a quieter one.',
    price: 1699,
    image_url: '/barang/Roland_TD-17KVX_V-Drums.webp',
    images: ['/barang/Roland_TD-17KVX_V-Drums.webp'],
    category: 'Drums',
    specs: ['Mesh Snare Pad', 'VH-10 Hi-Hat', 'TD-17 Sound Module', 'Bluetooth Connectivity']
  },
  {
    id: '4',
    name: 'Fender Jazz Bass Professional',
    description: 'The industry-standard electric bass, known for its punchy sound and ergonomic neck.',
    longDescription:
      'The Jazz Bass did not follow the standard \u2014 it wrote it. That slim, fast neck and the pair of V-Mod single-coils give you a voice that sits in a mix with authority, equally at home under a smoky trio or a stadium low end. Decades of records were built on this exact shape, and it has never once needed reinventing. Plug in and you inherit a lineage; the only thing left to add is you.',
    price: 1799,
    image_url: '/barang/Fender_Jazz_Bass_Professional.webp',
    images: ['/barang/Fender_Jazz_Bass_Professional.webp'],
    category: 'Bass',
    specs: ['Alder Body', 'Slim C Neck Profile', 'V-Mod II Single-Coil Pickups', 'HiMass Vintage Bridge']
  },
  {
    id: '5',
    name: 'Stradivarius Replica Violin',
    description: 'Handcrafted spruce and maple violin offering warm, resonant projection.',
    longDescription:
      'An honest tribute to the most celebrated form in music, hand-graduated from solid spruce and flamed maple by luthiers who understand that tone lives in the millimetres. It offers the warmth and carrying projection players chase for a lifetime, dressed in ebony fittings and finished entirely by hand. A first serious violin, or a lifelong one \u2014 either way, it rewards the player who listens as carefully as they play.',
    price: 1250,
    image_url: '/barang/Stradivarius_Replica_Violin.webp',
    images: ['/barang/Stradivarius_Replica_Violin.webp'],
    category: 'Violin',
    specs: ['Solid Spruce Top', 'Maple Back & Sides', 'Ebony Fittings', 'Aubert Bridge']
  },
  {
    id: '7',
    name: 'Fender Custom Shop Stratocaster',
    description: 'Hand-selected alder body and vintage-wound pickups for ultimate classic tone.',
    longDescription:
      'Built one at a time by the hands the rest of the industry studies, this Stratocaster is what happens when a legend is given no shortcuts. Hand-selected alder, a neck shaped to disappear under the fingers, and vintage-wound pickups that bloom under overdrive and stay glassy when clean. The relic finish tells a story you didn\u2019t have to live. Nothing here is accidental, and nothing here is ordinary.',
    price: 3899,
    image_url: '/barang/Fender_Custom_Shop_Stratocaster.webp',
    images: ['/barang/Fender_Custom_Shop_Stratocaster.webp'],
    category: 'Guitar',
    specs: ['Alder Body', 'Maple Neck', 'Custom Shop Pickups', 'Relic Finish']
  },
  {
    id: '8',
    name: 'Steinway & Sons Model B Grand',
    description: 'The standard of excellence in concert pianos, offering unparalleled tone and touch.',
    longDescription:
      'For many artists the Model B is simply \u201cthe piano\u201d \u2014 the instrument that ends the search. Every rim is bent from a single length of hard-rock maple, every soundboard tapered by hand, and the result is a dynamic range that seems to have neither ceiling nor floor. It is not bought so much as committed to. Place one in a room and the room changes to suit it.',
    price: 112000,
    image_url: '/barang/Steinway_and_Sons_Model_B_Grand.webp',
    images: ['/barang/Steinway_and_Sons_Model_B_Grand.webp'],
    category: 'Piano',
    specs: ['Premium Sitka Spruce Soundboard', 'Hard Rock Maple Rim', 'Swedish Steel Treble Wire', 'Hand-crafted']
  },
  {
    id: '10',
    name: 'Taylor 814ce Acoustic Guitar',
    description: 'Taylor flag-ship grand auditorium acoustic-electric guitar with V-Class bracing.',
    longDescription:
      'The 814ce is Taylor at full confidence: a grand auditorium built around V-Class bracing that lets the guitar sustain longer, tune truer, and project without ever shouting. Sitka spruce over Indian rosewood gives it a voice that is articulate under a pick and lush beneath the fingers, with onboard electronics good enough to trust on the biggest night of the tour. Balanced, modern, and quietly certain of itself.',
    price: 3999,
    image_url: '/barang/Taylor_814ce_Acoustic_Guitar.webp',
    images: ['/barang/Taylor_814ce_Acoustic_Guitar.webp'],
    category: 'Guitar',
    specs: ['Sitka Spruce Top', 'Indian Rosewood Back & Sides', 'Expression System 2 Electronics', 'V-Class Bracing']
  },
  {
    id: '11',
    name: 'Nord Stage 4 88 Keyboard',
    description: 'The ultimate stage keyboard with triple sensor keybed and physical drawbars.',
    longDescription:
      'The Stage 4 is the keyboard working professionals reach for when there is no room for excuses. Three engines \u2014 piano, organ, and synth \u2014 sit under your hands at once, each with its own dedicated controls: no menu-diving, no apologies. Weighted to feel like the real thing and built in Sweden to survive the road it was designed for. Everything you need on stage, and nothing you have to explain.',
    price: 4899,
    image_url: '/barang/Nord_Stage_4_88_Keyboard.webp',
    images: ['/barang/Nord_Stage_4_88_Keyboard.webp'],
    category: 'Piano',
    specs: ['88 Weighted Keys', 'Independent Section Controls', 'Award-winning Sound Library', 'Physical Drawbars']
  },
  {
    id: '12',
    name: 'Pearl Export EXX Drum Kit',
    description: 'The best-selling drum set of all time, offering legendary sound and durability.',
    longDescription:
      'The best-selling drum kit in history did not earn that title by accident. The Export EXX pairs poplar and mahogany shells for a voice that is warm yet cuts through a room, hangs it on hardware that shrugs off years of abuse, and dresses the whole thing in Remo heads straight out of the box. Proof that a first serious kit can also be a lasting one \u2014 dependable enough to grow into, good enough to keep.',
    price: 849,
    image_url: '/barang/Pearl_Export_EXX_Drum_Kit.webp',
    images: ['/barang/Pearl_Export_EXX_Drum_Kit.webp'],
    category: 'Drums',
    specs: ['Poplar/Mahogany Shells', 'Opti-Loc Mounting System', 'Remo Drum Heads', 'Complete Hardware Pack']
  }
];

// ---------------------------------------------------------------------------
// Lookup berdasarkan NAMA produk (dinormalisasi).
// Produk dari database memakai id UUID yang berbeda dari data mock di atas,
// jadi deskripsi panjang & spesifikasi dicocokkan lewat nama agar tetap tampil.
// ---------------------------------------------------------------------------

const LONG_DESC_BY_NAME: Record<string, string> = {};
const SPECS_BY_NAME: Record<string, string[]> = {};

for (const p of PRODUCTS) {
  const key = p.name.trim().toLowerCase();
  if (p.longDescription) LONG_DESC_BY_NAME[key] = p.longDescription;
  if (p.specs && p.specs.length > 0) SPECS_BY_NAME[key] = p.specs;
}

export function getLongDescription(name?: string | null): string | undefined {
  if (!name) return undefined;
  return LONG_DESC_BY_NAME[name.trim().toLowerCase()];
}

export function getProductSpecs(name?: string | null): string[] | undefined {
  if (!name) return undefined;
  return SPECS_BY_NAME[name.trim().toLowerCase()];
}
