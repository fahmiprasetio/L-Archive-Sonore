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
    image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=600',
    category: 'Guitar',
    specs: ['Mahogany Body', 'Rosewood Fretboard', 'Burstbucker Pickups', 'Nitrocellulose Finish']
  },
  {
    id: '2',
    name: 'Yamaha U1 Upright Piano',
    description: 'A perennial favorite among discerning pianists, offering outstanding musical performance.',
    price: 8999,
    image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=600',
    category: 'Piano',
    specs: ['Spruce Soundboard', 'V-Pro Plate', 'Premium Felt Hammers', 'Soft-Close Fallboard']
  },
  {
    id: '3',
    name: 'Roland TD-17KVX V-Drums',
    description: 'Electronic drum kit with premium snare, hi-hat, and cymbals for professional practice.',
    price: 1699,
    image_url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=600',
    category: 'Drums',
    specs: ['Mesh Snare Pad', 'VH-10 Hi-Hat', 'TD-17 Sound Module', 'Bluetooth Connectivity']
  },
  {
    id: '4',
    name: 'Fender Jazz Bass Professional',
    description: 'The industry-standard electric bass, known for its punchy sound and ergonomic neck.',
    price: 1799,
    image_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ec52744?auto=format&fit=crop&q=80&w=600',
    category: 'Bass',
    specs: ['Alder Body', 'Slim C Neck Profile', 'V-Mod II Single-Coil Pickups', 'HiMass Vintage Bridge']
  },
  {
    id: '5',
    name: 'Stradivarius Replica Violin',
    description: 'Handcrafted spruce and maple violin offering warm, resonant projection.',
    price: 1250,
    image_url: 'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?auto=format&fit=crop&q=80&w=600',
    category: 'Violin',
    specs: ['Solid Spruce Top', 'Maple Back & Sides', 'Ebony Fittings', 'Aubert Bridge']
  },
  {
    id: '6',
    name: 'Moog Subsequent 37 Synthesizer',
    description: 'Analog synthesizer with duo-phonic capabilities, multidrive, and advanced controls.',
    price: 1899,
    image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600',
    category: 'Synthesizer',
    specs: ['37 Semi-Weighted Keys', 'Duo-Phonic Engine', 'MultiDrive Circuit', '256 Presets']
  },
  {
    id: '7',
    name: 'Fender Custom Shop Stratocaster',
    description: 'Hand-selected alder body and vintage-wound pickups for ultimate classic tone.',
    price: 3899,
    image_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ec52744?auto=format&fit=crop&q=80&w=600',
    category: 'Guitar',
    specs: ['Alder Body', 'Maple Neck', 'Custom Shop Pickups', 'Relic Finish']
  },
  {
    id: '8',
    name: 'Steinway & Sons Model B Grand',
    description: 'The standard of excellence in concert pianos, offering unparalleled tone and touch.',
    price: 112000,
    image_url: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=600',
    category: 'Piano',
    specs: ['Premium Sitka Spruce Soundboard', 'Hard Rock Maple Rim', 'Swedish Steel Treble Wire', 'Hand-crafted']
  },
  {
    id: '9',
    name: 'Korg Minilogue XD',
    description: 'Four-voice polyphonic analog synthesizer with digital multi-engine and effects.',
    price: 649,
    image_url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=600',
    category: 'Synthesizer',
    specs: ['4-Voice Polyphony', 'Hybrid Analog/Digital Engine', '16-Step Sequencer', 'Stereo Effects']
  },
  {
    id: '10',
    name: 'Taylor 814ce Acoustic Guitar',
    description: 'Taylor flag-ship grand auditorium acoustic-electric guitar with V-Class bracing.',
    price: 3999,
    image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=600',
    category: 'Guitar',
    specs: ['Sitka Spruce Top', 'Indian Rosewood Back & Sides', 'Expression System 2 Electronics', 'V-Class Bracing']
  },
  {
    id: '11',
    name: 'Nord Stage 4 88 Keyboard',
    description: 'The ultimate stage keyboard with triple sensor keybed and physical drawbars.',
    price: 4899,
    image_url: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=600',
    category: 'Piano',
    specs: ['88 Weighted Keys', 'Independent Section Controls', 'Award-winning Sound Library', 'Physical Drawbars']
  },
  {
    id: '12',
    name: 'Pearl Export EXX Drum Kit',
    description: 'The best-selling drum set of all time, offering legendary sound and durability.',
    price: 849,
    image_url: 'https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=600',
    category: 'Drums',
    specs: ['Poplar/Mahogany Shells', 'Opti-Loc Mounting System', 'Remo Drum Heads', 'Complete Hardware Pack']
  }
];
