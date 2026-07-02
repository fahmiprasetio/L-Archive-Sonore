import { Product } from '@/types';

export interface ProductWithSpecs extends Product {
  specs?: string[];
}

export const PRODUCTS: ProductWithSpecs[] = [
  {
    id: '1',
    name: 'Gibson Les Paul Standard',
    description: 'The legendary solid-body electric guitar with dual humbuckers and mahogany construction.',
    price: 2499,
    image_url: '/barang/Gibson Les Paul Standard.webp',
    images: ['/barang/Gibson Les Paul Standard.webp'],
    category: 'Guitar',
    specs: ['Mahogany Body', 'Rosewood Fretboard', 'Burstbucker Pickups', 'Nitrocellulose Finish']
  },
  {
    id: '2',
    name: 'Yamaha U1 Upright Piano',
    description: 'A perennial favorite among discerning pianists, offering outstanding musical performance.',
    price: 8999,
    image_url: '/barang/Yamaha U1 Upright Piano.webp',
    images: ['/barang/Yamaha U1 Upright Piano.webp'],
    category: 'Piano',
    specs: ['Spruce Soundboard', 'V-Pro Plate', 'Premium Felt Hammers', 'Soft-Close Fallboard']
  },
  {
    id: '3',
    name: 'Roland TD-17KVX V-Drums',
    description: 'Electronic drum kit with premium snare, hi-hat, and cymbals for professional practice.',
    price: 1699,
    image_url: '/barang/Roland TD-17KVX V-Drums.webp',
    images: ['/barang/Roland TD-17KVX V-Drums.webp'],
    category: 'Drums',
    specs: ['Mesh Snare Pad', 'VH-10 Hi-Hat', 'TD-17 Sound Module', 'Bluetooth Connectivity']
  },
  {
    id: '4',
    name: 'Fender Jazz Bass Professional',
    description: 'The industry-standard electric bass, known for its punchy sound and ergonomic neck.',
    price: 1799,
    image_url: '/barang/Fender Jazz Bass Professional.webp',
    images: ['/barang/Fender Jazz Bass Professional.webp'],
    category: 'Bass',
    specs: ['Alder Body', 'Slim C Neck Profile', 'V-Mod II Single-Coil Pickups', 'HiMass Vintage Bridge']
  },
  {
    id: '5',
    name: 'Stradivarius Replica Violin',
    description: 'Handcrafted spruce and maple violin offering warm, resonant projection.',
    price: 1250,
    image_url: '/barang/Stradivarius Replica Violin.webp',
    images: ['/barang/Stradivarius Replica Violin.webp'],
    category: 'Violin',
    specs: ['Solid Spruce Top', 'Maple Back & Sides', 'Ebony Fittings', 'Aubert Bridge']
  },
  {
    id: '7',
    name: 'Fender Custom Shop Stratocaster',
    description: 'Hand-selected alder body and vintage-wound pickups for ultimate classic tone.',
    price: 3899,
    image_url: '/barang/Fender Custom Shop Stratocaster.webp',
    images: ['/barang/Fender Custom Shop Stratocaster.webp'],
    category: 'Guitar',
    specs: ['Alder Body', 'Maple Neck', 'Custom Shop Pickups', 'Relic Finish']
  },
  {
    id: '8',
    name: 'Steinway & Sons Model B Grand',
    description: 'The standard of excellence in concert pianos, offering unparalleled tone and touch.',
    price: 112000,
    image_url: '/barang/Steinway & Sons Model B Grand.webp',
    images: ['/barang/Steinway & Sons Model B Grand.webp'],
    category: 'Piano',
    specs: ['Premium Sitka Spruce Soundboard', 'Hard Rock Maple Rim', 'Swedish Steel Treble Wire', 'Hand-crafted']
  },
  {
    id: '10',
    name: 'Taylor 814ce Acoustic Guitar',
    description: 'Taylor flag-ship grand auditorium acoustic-electric guitar with V-Class bracing.',
    price: 3999,
    image_url: '/barang/Taylor 814ce Acoustic Guitar.webp',
    images: ['/barang/Taylor 814ce Acoustic Guitar.webp'],
    category: 'Guitar',
    specs: ['Sitka Spruce Top', 'Indian Rosewood Back & Sides', 'Expression System 2 Electronics', 'V-Class Bracing']
  },
  {
    id: '11',
    name: 'Nord Stage 4 88 Keyboard',
    description: 'The ultimate stage keyboard with triple sensor keybed and physical drawbars.',
    price: 4899,
    image_url: '/barang/Nord Stage 4 88 Keyboard.webp',
    images: ['/barang/Nord Stage 4 88 Keyboard.webp'],
    category: 'Piano',
    specs: ['88 Weighted Keys', 'Independent Section Controls', 'Award-winning Sound Library', 'Physical Drawbars']
  },
  {
    id: '12',
    name: 'Pearl Export EXX Drum Kit',
    description: 'The best-selling drum set of all time, offering legendary sound and durability.',
    price: 849,
    image_url: '/barang/Pearl Export EXX Drum Kit.webp',
    images: ['/barang/Pearl Export EXX Drum Kit.webp'],
    category: 'Drums',
    specs: ['Poplar/Mahogany Shells', 'Opti-Loc Mounting System', 'Remo Drum Heads', 'Complete Hardware Pack']
  }
];

