DELETE FROM products;
INSERT INTO products (id, name, description, price, image_url, category, stock) VALUES
(gen_random_uuid(), 'Fender Custom Shop Stratocaster', 'Premium electric guitar.', 25000000, '/barang/Fender_Custom_Shop_Stratocaster.webp', 'Guitar', 5),
(gen_random_uuid(), 'Fender Jazz Bass Professional', 'Classic professional bass.', 22000000, '/barang/Fender_Jazz_Bass_Professional.webp', 'Bass', 4),
(gen_random_uuid(), 'Gibson Les Paul Standard', 'Iconic heavy rock guitar.', 30000000, '/barang/Gibson_Les_Paul_Standard.webp', 'Guitar', 3),
(gen_random_uuid(), 'Nord Stage 4 88 Keyboard', 'Stage keyboard for professionals.', 45000000, '/barang/Nord_Stage_4_88_Keyboard.webp', 'Keyboard', 2),
(gen_random_uuid(), 'Pearl Export EXX Drum Kit', 'Complete drum kit setup.', 15000000, '/barang/Pearl_Export_EXX_Drum_Kit.webp', 'Drums', 3),
(gen_random_uuid(), 'Roland TD-17KVX V-Drums', 'Electronic drum set.', 18000000, '/barang/Roland_TD-17KVX_V-Drums.webp', 'Drums', 5),
(gen_random_uuid(), 'Steinway & Sons Model B Grand', 'Luxury grand piano.', 500000000, '/barang/Steinway_and_Sons_Model_B_Grand.webp', 'Piano', 1),
(gen_random_uuid(), 'Stradivarius Replica Violin', 'High quality violin replica.', 12000000, '/barang/Stradivarius_Replica_Violin.webp', 'Strings', 2),
(gen_random_uuid(), 'Taylor 814ce Acoustic Guitar', 'Premium acoustic guitar.', 40000000, '/barang/Taylor_814ce_Acoustic_Guitar.webp', 'Guitar', 4),
(gen_random_uuid(), 'Yamaha U1 Upright Piano', 'Classic upright piano.', 65000000, '/barang/Yamaha_U1_Upright_Piano.webp', 'Piano', 3);
