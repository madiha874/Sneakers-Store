-- =============================================================================
-- SOLEVERSE SNEAKER E-COMMERCE — IDEMPOTENT DATABASE SEED (52 PRODUCTS, 7 BRANDS)
-- Safe to execute multiple times: uses ON CONFLICT DO NOTHING & NOT EXISTS.
-- =============================================================================

-- 1. BRANDS
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('SOLEVERSE Atelier', 'soleverse-atelier', 'Signature numbered Italian full-grain leather court & studio silhouettes.', 'Atelier House', true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('Aethel', 'aethel', 'Architectural minimalist low-tops crafted with Margom rubber cupsoles.', 'Minimalist Line', true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('Veloce', 'veloce', 'Supercritical foam distance trainers and marathon tempo machines.', 'Running Lab', true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('Aequos', 'aequos', 'Carbon-plated 3D AeroKnit racers and futuristic lifestyle runners.', 'Carbon Engineering', true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('TerraForge', 'terraforge', 'Weather-sealed ballistic ripstop trail runners and alpine approach shoes.', 'Outdoor Division', true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('Kuro', 'kuro', 'Brutalist charcoal nubuck high-tops and court heritage silhouettes.', 'Court Division', true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.brands (name, slug, description, origin, is_active)
VALUES ('Sovereign', 'sovereign', 'Vintage-washed Italian suede joggers and heritage track classics.', 'Heritage Archive', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Casual Sneakers', 'casual-sneakers', 'men', 'Architectural full-grain leather and suede low-tops built for everyday poise.', '/images/sneakers/sv-01-obsidian-apex-low.jpg', 1, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Running Shoes', 'running-shoes', 'running', 'Carbon-plated marathon racers and nitrogen-infused daily distance trainers.', '/images/sneakers/sv-03-sienna-tempo-marathon.jpg', 2, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Sports Shoes', 'sports-shoes', 'sports', 'High-traction court, trail, and multi-surface athletic silhouettes.', '/images/sneakers/sv-04-pine-ridge-gtx-trail.jpg', 3, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Training Shoes', 'training-shoes', 'sports', 'Lateral stability and grounded heel architecture for strength and studio sessions.', '/images/sneakers/sv-07-desert-sand-kinetic.jpg', 4, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Lifestyle Sneakers', 'lifestyle-sneakers', 'lifestyle', 'Heritage runner silhouettes reimagined in metallic mesh and Italian nubuck.', '/images/sneakers/sv-09-platinum-nimbus-99.jpg', 5, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Walking Shoes', 'walking-shoes', 'women', 'Featherlight anatomical cushioning engineered for all-day urban exploration.', '/images/sneakers/sv-13-ivory-chalk-walker.jpg', 6, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('High-Top Sneakers', 'high-top-sneakers', 'men', 'Sculpted ankle-collar court silhouettes in matte suede and tumbled calfskin.', '/images/sneakers/sv-06-slate-monolith-high.jpg', 7, true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (name, slug, parent_group, description, image_url, display_order, is_active)
VALUES ('Low-Top Sneakers', 'low-top-sneakers', 'women', 'Clean-lined minimalist profiles crafted with hand-stitched Margom cupsoles.', '/images/sneakers/sv-02-alabaster-court-minimal.jpg', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS (52 UNIQUE SNEAKERS WITH BRAND & CATEGORY LINKS)
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Obsidian Apex Low', 'sv-01-obsidian-apex-low', 'SV-101', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Matte pebble-grain calfskin low-top on a warm ivory sculpted cupsole.', 'Hand-lasted in small runs using full-grain drum-dyed calfskin leather, the Obsidian Apex Low pairs tonal waxed cotton laces with a calfskin-lined footbed and high-density natural rubber cupsole.', 'Italian full-grain pebble leather upper · Vegetable-tanned leather lining · Dual-density EVA & rubber cupsole', c.id, 'men', 'casual', 28500, 24900, true, true, true, true, false, TRUE, 4.92, 46, 184
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Alabaster Court Minimal', 'sv-02-alabaster-court-minimal', 'SV-102', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Crisp alabaster calfskin court sneaker finished with a taupe suede heel tab.', 'An enduring study in architectural restraint. Clean stitch-and-turn seams, zero external clutter, and an orthopedic cork-infused insole deliver effortless all-day poise.', 'Nappa calfskin upper · Brushed suede heel counter · Stitched Margom sidewall outsole', c.id, 'women', 'low-top', 26000, NULL, true, true, false, true, false, TRUE, 4.95, 52, 210
FROM public.categories c WHERE c.slug = 'low-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Sienna Tempo Marathon', 'sv-03-sienna-tempo-marathon', 'SV-103', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'Engineered mono-mesh runner in burnt sienna with supercritical foam.', 'Tuned for tempo progressions and long Sunday road sessions, the Sienna Tempo integrates breathable open-cell mesh with suede lockdown overlays and responsive dual-density FlightFoam cushioning.', 'Breathable engineered mesh · Suede quarter cage · Nitrogen-infused midsole · Carbon-rubber outsole', c.id, 'unisex', 'running', 32500, 27900, true, true, true, true, false, TRUE, 4.88, 39, 162
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Pine Ridge GTX Trail', 'sv-04-pine-ridge-gtx-trail', 'SV-104', 'TerraForge', (SELECT id FROM public.brands WHERE slug = 'terraforge' LIMIT 1), 'Weather-sealed ballistic ripstop and nubuck trail runner with deep lug grip.', 'Built for wet granite, gravel ascents, and urban monsoon streets alike. Features a protective rubberized toe rand, gusseted tongue, and deep multi-directional traction lugs.', 'Water-repellent ballistic nylon · Sand nubuck mudguard · High-traction lugged outsole', c.id, 'men', 'sports', 34900, NULL, true, false, true, false, false, TRUE, 4.91, 28, 118
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Cobalt Aero Carbon', 'sv-05-cobalt-aero-carbon', 'SV-105', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Full-length forked carbon fiber plate inside ultra-light 3D knit.', 'Our pinnacle race-day silhouette. A full-length articulated carbon plate snaps forward at toe-off while the seamless 3D-knitted upper wraps the midfoot with zero hot spots.', '3D AeroKnit upper · Full-length carbon composite plate · Pebax energy-return midsole', c.id, 'unisex', 'running', 38900, 33900, true, true, false, true, true, TRUE, 4.96, 64, 245
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Slate Monolith High-Top', 'sv-06-slate-monolith-high', 'SV-106', 'Kuro', (SELECT id FROM public.brands WHERE slug = 'kuro' LIMIT 1), 'Architectural charcoal nubuck high-top anchored by a natural gum cupsole.', 'Sculpted proportions inspired by 1980s brutalist court footwear. Padded collar support, bone-ivory leather quarter panels, and raw translucent gum rubber make a quiet statement.', 'Water-resistant charcoal nubuck · Bone calfskin overlays · Natural gum rubber sole', c.id, 'men', 'high-top', 33500, NULL, true, false, true, false, true, TRUE, 4.89, 31, 109
FROM public.categories c WHERE c.slug = 'high-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Desert Sand Kinetic', 'sv-07-desert-sand-kinetic', 'SV-107', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Grounded TPU heel stabilizer and abrasion-resistant mesh for heavy lifts.', 'Engineered for lateral agility, barbell stability, and high-output studio circuits. A wide flat forefoot meets a rigid matte-black heel counter that eliminates compression under load.', 'Cordura ballistic mesh · Matte TPU heel cradle · Espresso dual-density sole', c.id, 'unisex', 'training', 24900, 21500, false, true, false, true, false, TRUE, 4.84, 27, 141
FROM public.categories c WHERE c.slug = 'training-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Oxblood Heritage Sprint', 'sv-08-oxblood-heritage-sprint', 'SV-108', 'Sovereign', (SELECT id FROM public.brands WHERE slug = 'sovereign' LIMIT 1), 'Plush oxblood Italian suede paired with matte black leather and gum waffle tread.', 'Drawn from archival 1970s track runners and updated with modern memory-foam collar padding. Deep burgundy suede softens gracefully with every wear.', 'Italian brushed suede · Full-grain leather saddle · Die-cut EVA wedge & gum outsole', c.id, 'women', 'lifestyle', 27500, 23500, true, true, true, false, false, TRUE, 4.9, 41, 156
FROM public.categories c WHERE c.slug = 'lifestyle-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Platinum Nimbus 99', 'sv-09-platinum-nimbus-99', 'SV-109', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Metallic platinum overlays and open slate mesh over visible heel cushioning.', 'Retro-futurist running DNA distilled for contemporary streets. Multi-layered silver synthetic leather, breathable honeycomb mesh, and a sculpted cream midsole with heel air chamber.', 'Metallic synthetic overlays · Open-weave technical mesh · Visible heel air unit', c.id, 'men', 'lifestyle', 31000, NULL, false, true, true, true, false, TRUE, 4.93, 55, 198
FROM public.categories c WHERE c.slug = 'lifestyle-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Basalt Studio Runner', 'sv-10-basalt-studio-runner', 'SV-110', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Sculptural champagne suede and pearl calfskin silhouette on a cloud-rocker sole.', 'Balanced proportions with a softly flared rocker midsole that propels every stride. Designed for gallery days, travel itineraries, and effortless tailored pairings.', 'Pearl calfskin & champagne suede · Contoured anatomical footbed · Sculpted EVA sole', c.id, 'women', 'walking', 29500, 25900, true, false, true, false, true, TRUE, 4.94, 33, 132
FROM public.categories c WHERE c.slug = 'walking-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Champagne Atelier Low', 'sv-11-champagne-atelier-low', 'SV-111', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Warm ivory leather low-top with tonal stitched foxing and supple lambskin lining.', 'A refined wardrobe anchor designed to pair with structured linen or relaxed denim. Zero break-in time thanks to pillow-soft collar foam.', 'Soft milled calfskin · Lambskin interior lining · Natural crepe-textured rubber sole', c.id, 'women', 'low-top', 24500, NULL, false, false, true, false, false, TRUE, 4.86, 22, 96
FROM public.categories c WHERE c.slug = 'low-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Graphite Court Pro', 'sv-12-graphite-court-pro', 'SV-112', 'Kuro', (SELECT id FROM public.brands WHERE slug = 'kuro' LIMIT 1), 'Stealth charcoal leather court silhouette with reinforced toe bumper.', 'Built for urban mileage with an abrasion-resistant toe wrap and antimicrobial OrthoLite insole that keeps feet cool in humid climates.', 'Matte waxed leather · Antimicrobial OrthoLite footbed · High-density rubber cupsole', c.id, 'men', 'low-top', 27900, 23900, false, true, false, false, false, TRUE, 4.82, 19, 112
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Ivory Chalk Walker', 'sv-13-ivory-chalk-walker', 'SV-113', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Ultra-lightweight architectural walking sneaker with zero-gravity foam.', 'Weighing just 235g, the Ivory Chalk Walker eliminates mid-afternoon foot fatigue with a beveled heel and generous forefoot flex grooves.', 'Perforated calfskin · Memory-foam tongue · Dual-density lightweight foam sole', c.id, 'women', 'walking', 22900, 19900, false, false, false, true, false, TRUE, 4.89, 35, 147
FROM public.categories c WHERE c.slug = 'walking-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Amber Velocity Strider', 'sv-14-amber-velocity-strider', 'SV-114', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'High-visibility amber mesh upper built for dawn and dusk road intervals.', 'Reflective heel piping, a 8mm heel-to-toe drop, and responsive rocker geometry deliver smooth transitions across 5K to half-marathon distances.', '360-degree reflective weave · Engineered jacquard mesh · High-rebound EVA compound', c.id, 'men', 'running', 30500, NULL, false, false, true, false, false, TRUE, 4.85, 21, 88
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Moss Summit All-Terrain', 'sv-15-moss-summit-allterrain', 'SV-115', 'TerraForge', (SELECT id FROM public.brands WHERE slug = 'terraforge' LIMIT 1), 'All-weather walking shoe combining trail grip with refined nubuck panelling.', 'Seamless transition from cobblestone walks to mountain trails. Cushioned arch support meets mud-shedding rubber outsole channels.', 'Oiled nubuck leather · Hydro-shield membrane · Multi-terrain lug sole', c.id, 'men', 'walking', 31900, 27500, false, false, false, false, false, TRUE, 4.87, 24, 93
FROM public.categories c WHERE c.slug = 'walking-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Midnight Pulse Racer', 'sv-16-midnight-pulse-racer', 'SV-116', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Track-tuned sprint silhouette in midnight navy knit and torsion shank.', 'A midfoot composite shank prevents torsional twist during sharp cuts and track sprints, while the breathable sock collar locks the heel securely.', 'Compression fly-knit · Carbon torsion bridge · Wet-grip rubber outsole', c.id, 'men', 'sports', 34500, NULL, false, false, false, true, false, TRUE, 4.91, 30, 115
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Ash Elevate High-Top', 'sv-17-ash-elevate-high', 'SV-117', 'Kuro', (SELECT id FROM public.brands WHERE slug = 'kuro' LIMIT 1), 'Sleek ash-grey suede high-top with concealed wedge elevation and ivory sole.', 'Brings subtle vertical stature and sculptural ankle framing without compromising court-shoe comfort. Quick-pull heel loop for effortless entry.', 'Ash velvet suede · Full-grain ivory leather trim · Vulcanized rubber outsole', c.id, 'women', 'high-top', 29900, 25400, false, false, true, false, false, TRUE, 4.86, 18, 84
FROM public.categories c WHERE c.slug = 'high-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Espresso Apex Trainer', 'sv-18-espresso-apex-trainer', 'SV-118', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Tonal espresso brown cross-trainer engineered for gym floor durability.', 'Wrap-around rope-guard sidewalls resist abrasion during conditioning drills while internal forefoot pods keep toes splayed naturally.', 'Ripstop & suede hybrid upper · Abrasion sidewall wrap · Flat stability outsole', c.id, 'men', 'training', 26500, NULL, false, false, false, false, false, TRUE, 4.81, 16, 77
FROM public.categories c WHERE c.slug = 'training-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Garnet Track Classic', 'sv-19-garnet-track-classic', 'SV-119', 'Sovereign', (SELECT id FROM public.brands WHERE slug = 'sovereign' LIMIT 1), 'Deep garnet suede runner with contrast leather vector and cream midsole.', 'An archival tribute to golden-era marathon footwear, tailored with rich brushed suede and unbleached cotton laces.', 'Pigskin suede · Contrast calfskin stripes · Dual-tone gum outsole', c.id, 'men', 'casual', 25500, 21900, false, true, false, false, false, TRUE, 4.88, 37, 139
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Silver Mist Glide', 'sv-20-silver-mist-glide', 'SV-120', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Breathable metallic silver mesh runner engineered for smooth cadence.', 'Plush heel geometry absorbs impact on concrete pavements while airy mesh keeps feet cool through warm-weather runs.', 'Silver metallic TPU overlays · Breathable open mesh · Plush nitrogen foam', c.id, 'women', 'running', 28900, NULL, false, false, true, true, false, TRUE, 4.9, 29, 121
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Onyx Velvet Court', 'sv-21-onyx-velvet-court', 'SV-121', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Numbered Atelier reserve edition in velvet-touch nubuck and waxed leather.', 'Part of our limited Atelier Reserve capsule. Individually serialized tongue stamp, Italian calfskin lining, and tonal matte hardware.', 'Velvet-finish black nubuck · Full leather interior · Hand-finished outsole', c.id, 'men', 'casual', 36500, NULL, true, false, false, false, true, TRUE, 4.97, 25, 89
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Pearl Horizon Low', 'sv-22-pearl-horizon-low', 'SV-122', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Atelier exclusive sculptural low-top in pearl leather and warm bone suede.', 'Handcrafted in limited batches with concealed interior stitching and an articulated heel cradle for museum-grade minimalism.', 'Pearl calfskin · Bone suede heel tab · Custom tonal rubber cupsole', c.id, 'women', 'low-top', 34000, 29500, true, false, false, false, true, TRUE, 4.95, 21, 76
FROM public.categories c WHERE c.slug = 'low-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Rust Endurance V3', 'sv-23-rust-endurance-v3', 'SV-123', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'High-mileage distance trainer built to log 800+ kilometers comfortably.', 'Third-generation endurance chassis featuring extra outsole rubber in high-wear heel zones and a wide stable forefoot platform.', 'Reinforced ripstop mesh · High-wear carbon rubber outsole · 10mm drop foam', c.id, 'men', 'running', 29500, 24900, false, false, false, false, false, TRUE, 4.83, 32, 128
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Cypress Ridge Hiker', 'sv-24-cypress-ridge-hiker', 'SV-124', 'TerraForge', (SELECT id FROM public.brands WHERE slug = 'terraforge' LIMIT 1), 'Low-cut technical approach sneaker with speed-hook lacing and rock plate.', 'Bridges technical alpine approach shoes and modern gorpcore utility. An embedded forefoot rock plate shields against sharp scree.', 'Cypress Cordura · Suede mudguard · Forefoot rock protection plate', c.id, 'unisex', 'sports', 33900, NULL, false, false, true, false, false, TRUE, 4.88, 19, 74
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Indigo Carbon Fly', 'sv-25-indigo-carbon-fly', 'SV-125', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Sub-200g marathon super-shoe in indigo vapor-mesh with twin carbon rods.', 'Our lightest competition racer ever produced. Twin carbon rods guide footstrike alignment at fatigued late-race paces.', 'Translucent VaporWeave · Twin carbon propulsion rods · Supercritical Pebax foam', c.id, 'unisex', 'running', 41000, 35900, false, false, false, true, true, TRUE, 4.98, 44, 152
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Charcoal Dunk Archive', 'sv-26-charcoal-dunk-archive', 'SV-126', 'Kuro', (SELECT id FROM public.brands WHERE slug = 'kuro' LIMIT 1), 'Heritage hardwood high-top in charcoal suede with perforated toe box.', 'Constructed with double-stitched eyestays and an internal heel air pod for plush impact absorption on pavement.', 'Charcoal suede & tumbled leather · Breathable perforated toe · Herringbone rubber sole', c.id, 'men', 'high-top', 31500, 26900, false, true, false, false, false, TRUE, 4.87, 26, 103
FROM public.categories c WHERE c.slug = 'high-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Dune Stabilizer X', 'sv-27-dune-stabilizer-x', 'SV-127', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'Sculpted women’s studio and HIIT trainer in warm dune and obsidian.', 'Tailored to a women’s anatomical heel-to-forefoot ratio, locking down the ankle during plyometric box jumps and lateral shuffles.', 'Engineered warp-knit · Dual-wing midfoot lock · Flex-groove studio outsole', c.id, 'women', 'training', 23900, NULL, false, false, true, false, false, TRUE, 4.85, 20, 82
FROM public.categories c WHERE c.slug = 'training-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Crimson Suede 78', 'sv-28-crimson-suede-78', 'SV-128', 'Sovereign', (SELECT id FROM public.brands WHERE slug = 'sovereign' LIMIT 1), 'Vintage 1978 jogger reissued in brushed crimson suede and raw gum tread.', 'Effortless weekend staple featuring an exposed foam tongue, tonal zig-zag stitching, and lightweight EVA wedge.', 'Brushed crimson suede · Nylon underlays · Sawtooth gum outsole', c.id, 'men', 'lifestyle', 26900, 22900, false, false, false, true, false, TRUE, 4.86, 28, 108
FROM public.categories c WHERE c.slug = 'lifestyle-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Titanium Wave Runner', 'sv-29-titanium-wave-runner', 'SV-129', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Technical metallic mesh cruiser with sculpted wave midsole.', 'Combines 2000s performance runner aesthetics with plush everyday walking comfort and arch-supporting TPU shank.', 'Metallic silver overlays · Slate mesh · Wave-geometry dual EVA midsole', c.id, 'unisex', 'walking', 29900, NULL, false, false, false, false, false, TRUE, 4.9, 34, 127
FROM public.categories c WHERE c.slug = 'walking-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Noir Sculpt Low', 'sv-30-noir-sculpt-low', 'SV-130', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Monochrome matte black calfskin sneaker with subtly elevated platform sole.', 'Clean Parisian proportion meets soft Italian leather. An elevated 35mm cupsole elongates silhouettes while cushioning every step.', 'Smooth black calfskin · Leather-wrapped insole · 35mm tonal rubber platform', c.id, 'women', 'low-top', 27900, 23900, false, true, false, false, false, TRUE, 4.91, 38, 145
FROM public.categories c WHERE c.slug = 'low-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Bone Minimalist 02', 'sv-31-bone-minimalist-02', 'SV-131', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Warm bone calfskin low-top with tonal heel counter and waxed cotton laces.', 'Our second-generation minimalist court shoe updated with a wider anatomical toe box and reinforced internal heel stabilizer.', 'Full-grain bone leather · Calfskin lining · Stitched natural rubber cupsole', c.id, 'men', 'low-top', 26500, NULL, false, true, false, false, false, TRUE, 4.89, 42, 158
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Copper Stride Pro', 'sv-32-copper-stride-pro', 'SV-132', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'Daily pace-setter in burnished copper mesh with nitrogen-infused midsole.', 'Balanced firmness for effortless cruising on asphalt or treadmill. Seamless internal bootie prevents blister friction.', 'Seamless monofilament mesh · Burnished copper suede · Nitrogen EVA foam', c.id, 'unisex', 'running', 31500, 26900, false, false, true, false, false, TRUE, 4.86, 23, 94
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Olive Tactical Trail', 'sv-33-olive-tactical-trail', 'SV-133', 'TerraForge', (SELECT id FROM public.brands WHERE slug = 'terraforge' LIMIT 1), 'Rugged olive-drab trail shoe with Kevlar-reinforced toe bumper.', 'Designed to shrug off rocky ridges and muddy single-track. Quick-cinch lace garage tucks excess cord neatly out of sight.', 'Olive ballistic mesh · Reinforced toe cap · Deep self-cleaning rubber lugs', c.id, 'men', 'sports', 33500, 28500, false, false, false, false, false, TRUE, 4.87, 18, 79
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Sapphire Sprint Knit', 'sv-34-sapphire-sprint-knit', 'SV-134', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Aerodynamic sapphire knit racer with lightweight fiberglass propulsion plate.', 'Responsive enough for 10K personal bests, forgiving enough for daily recovery miles. Breathable open-knit vamp keeps heat low.', 'Sapphire 3D FlyKnit · Fiberglass torsion plate · Beveled crash-pad heel', c.id, 'women', 'running', 32900, NULL, false, false, false, true, false, TRUE, 4.92, 29, 114
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Pewter Sky High', 'sv-35-pewter-sky-high', 'SV-135', 'Kuro', (SELECT id FROM public.brands WHERE slug = 'kuro' LIMIT 1), 'Pewter-toned Italian suede high-top with sculpted ankle strap silhouette.', 'Clean geometric paneling in tonal pewter and stone grey creates sharp architectural depth.', 'Italian pewter suede · Perforated calfskin vamp · Gum rubber outsole', c.id, 'men', 'high-top', 32500, NULL, false, false, false, false, false, TRUE, 4.84, 15, 68
FROM public.categories c WHERE c.slug = 'high-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Taupe Flex Studio', 'sv-36-taupe-flex-studio', 'SV-136', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Flexible studio cross-trainer in warm taupe mesh and espresso heel clip.', 'Articulated split sole flexes effortlessly through lunges, planks, and reformer studio transitions.', 'Soft breathable knit · Matte espresso heel stabilizer · Non-marking gum pods', c.id, 'women', 'training', 24500, 20900, false, false, false, false, false, TRUE, 4.83, 17, 72
FROM public.categories c WHERE c.slug = 'training-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Burgundy Metro Low', 'sv-37-burgundy-metro-low', 'SV-137', 'Sovereign', (SELECT id FROM public.brands WHERE slug = 'sovereign' LIMIT 1), 'Velvety burgundy suede low-top accented with charcoal leather collar.', 'Pairs retro track attitude with soft tailored comfort. Gold-foil tongue branding stays subtle and refined.', 'Velvet pigskin suede · Charcoal calfskin trim · Cream EVA wedge midsole', c.id, 'women', 'casual', 25900, NULL, false, false, true, false, false, TRUE, 4.88, 22, 91
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Chrome Aero Retro', 'sv-38-chrome-aero-retro', 'SV-138', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Late-90s runner aesthetic updated with chrome-silver panels and breathable mesh.', 'A maximalist-minimalist bridge: sculpted foam curves under breathable silver mesh keep weight remarkably light.', 'Chrome metallic synthetics · Open athletic mesh · Heel shock-absorption pod', c.id, 'men', 'lifestyle', 29900, 25500, false, false, false, true, false, TRUE, 4.9, 33, 134
FROM public.categories c WHERE c.slug = 'lifestyle-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Carbon Noir Walker', 'sv-39-carbon-noir-walker', 'SV-139', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Sleek all-day commuter sneaker in matte black leather and carbon-infused foam.', 'Built for 15,000+ daily steps without sacrificing boardroom-ready monochrome polish.', 'Water-resistant matte calfskin · Arch-molded insole · Rockered EVA midsole', c.id, 'men', 'walking', 27500, NULL, false, false, false, false, false, TRUE, 4.87, 24, 99
FROM public.categories c WHERE c.slug = 'walking-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Linen Atelier Court', 'sv-40-linen-atelier-court', 'SV-140', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Breathable organic linen-weave and ivory leather walking silhouette.', 'Crafted specifically for warm summer climates with woven natural canvas panels framed in supple calfskin.', 'Heavyweight Belgian linen & calfskin · Cork footbed · Natural rubber sole', c.id, 'women', 'walking', 25500, 21500, false, false, false, false, false, TRUE, 4.84, 19, 85
FROM public.categories c WHERE c.slug = 'walking-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Terracotta Ultra 50K', 'sv-41-terracotta-ultra-50k', 'SV-141', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'Max-stack ultra-distance road and light-trail hybrid in terracotta.', '38mm stack height of plush nitrogen foam protects joints over marathon and ultra distances while flared sidewalls ensure stability.', 'Abrasion-resistant jacquard · 38mm max-stack midsole · All-surface tread', c.id, 'unisex', 'running', 35500, NULL, false, false, true, false, false, TRUE, 4.91, 27, 106
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Forest Vortex Sport', 'sv-42-forest-vortex-sport', 'SV-142', 'TerraForge', (SELECT id FROM public.brands WHERE slug = 'terraforge' LIMIT 1), 'Multi-sport outdoor turf and trail shoe in deep forest pine and charcoal.', 'High-wrap lateral outsole lugs deliver instant grip on wet grass, astroturf, and steep hillside trails.', 'Forest ripstop nylon · Molded heel wing · Dual-compound traction sole', c.id, 'men', 'sports', 31900, 26900, false, false, false, false, false, TRUE, 4.85, 16, 73
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Azure Track Elite', 'sv-43-azure-track-elite', 'SV-143', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Low-profile court and agility sport sneaker in electric azure and white.', 'Engineered for rapid deceleration and multi-directional court pivots with herringbone traction zones.', 'Breathable 3D knit · Lateral containment cage · Herringbone court outsole', c.id, 'unisex', 'sports', 33500, NULL, false, false, false, false, false, TRUE, 4.88, 21, 90
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Smoke Tower High', 'sv-44-smoke-tower-high', 'SV-144', 'Kuro', (SELECT id FROM public.brands WHERE slug = 'kuro' LIMIT 1), 'Smoke-grey nubuck high-top featuring contrast ivory piping and padded collar.', 'Structured high-collar silhouette sculpted to frame cropped trousers cleanly while offering plush ankle cushioning.', 'Smoke grey nubuck · Ivory calfskin overlays · Translucent gum rubber sole', c.id, 'women', 'high-top', 30900, 26500, false, false, false, false, false, TRUE, 4.86, 18, 75
FROM public.categories c WHERE c.slug = 'high-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Khaki Core Trainer', 'sv-45-khaki-core-trainer', 'SV-145', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Durable khaki ballistic mesh trainer with zero-compress heel block.', 'Built for demanding daily gym routines, pairing understated earth tones with serious biomechanical support.', 'Ballistic sand mesh · Suede toe reinforce · Rigid TPU heel block', c.id, 'men', 'training', 25900, NULL, false, false, false, false, false, TRUE, 4.82, 14, 66
FROM public.categories c WHERE c.slug = 'training-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Ruby Vintage Runner', 'sv-46-ruby-vintage-runner', 'SV-146', 'Sovereign', (SELECT id FROM public.brands WHERE slug = 'sovereign' LIMIT 1), 'Deep ruby suede lifestyle runner with cream midsole and honey gum sole.', 'Supple vintage-washed suede meets an ultra-soft terry cloth collar lining for immediate step-in comfort.', 'Vintage-washed ruby suede · Terry collar lining · Honey gum tread', c.id, 'women', 'lifestyle', 26500, 22500, false, false, false, false, false, TRUE, 4.89, 25, 101
FROM public.categories c WHERE c.slug = 'lifestyle-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Mercury Cloud 9', 'sv-47-mercury-cloud-9', 'SV-147', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Silver-grey sculpted lifestyle sneaker with dual air cushion pods.', 'Futuristic metallic contours meet neutral tonal mesh for effortless styling with monochromatic athleisure.', 'Metallic mercury leather · Open grey mesh · Dual-chamber air sole', c.id, 'women', 'lifestyle', 29500, NULL, false, false, true, false, false, TRUE, 4.9, 27, 111
FROM public.categories c WHERE c.slug = 'lifestyle-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Obsidian Reserve Edition', 'sv-48-obsidian-reserve-ed', 'SV-148', 'SOLEVERSE Atelier', (SELECT id FROM public.brands WHERE slug = 'soleverse-atelier' LIMIT 1), 'Flagship numbered Italian calfskin collector edition on monolithic sole.', 'Our definitive luxury release. Crafted from full-grain Tuscan calfskin with hand-painted leather edges, titanium lace aglets, and cedar shoe trees included.', 'Tuscan full-grain calfskin · Titanium aglets · Hand-stitched cupsole', c.id, 'men', 'casual', 42000, NULL, true, true, false, false, true, TRUE, 4.98, 36, 124
FROM public.categories c WHERE c.slug = 'casual-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Ecru Monolith Court', 'sv-49-ecru-monolith-court', 'SV-149', 'Aethel', (SELECT id FROM public.brands WHERE slug = 'aethel' LIMIT 1), 'Sculpted ecru leather and suede collector sneaker with architectural midsole.', 'Clean tonal layering in ecru, bone, and champagne suede creates understated dimensional luxury.', 'Ecru calfskin & suede · Calfskin footbed · Sculpted two-piece sole', c.id, 'women', 'low-top', 35500, 30900, false, false, false, false, true, TRUE, 4.93, 20, 81
FROM public.categories c WHERE c.slug = 'low-top-sneakers'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Burnt Earth Marathon', 'sv-50-burnt-earth-marathon', 'SV-150', 'Veloce', (SELECT id FROM public.brands WHERE slug = 'veloce' LIMIT 1), 'Long-run specialist in burnt earth mesh with responsive dual-foam core.', 'Built for marathon prep blocks with a plush heel bevel and high-grip wet-asphalt outsole rubber.', 'Engineered ventilated mesh · Dual-density supercritical core · Wet-grip sole', c.id, 'men', 'running', 33900, 28900, false, false, false, false, false, TRUE, 4.87, 22, 95
FROM public.categories c WHERE c.slug = 'running-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Alpine Sage Cross', 'sv-51-alpine-sage-cross', 'SV-151', 'TerraForge', (SELECT id FROM public.brands WHERE slug = 'terraforge' LIMIT 1), 'All-weather outdoor cross-trainer in alpine sage and charcoal.', 'Bridges gym conditioning and outdoor trail circuits with water-shedding uppers and grounded lateral stability.', 'Hydrophobic sage mesh · Abrasion toe shield · Multi-surface sole', c.id, 'unisex', 'training', 27900, NULL, false, false, true, false, false, TRUE, 4.85, 16, 69
FROM public.categories c WHERE c.slug = 'training-shoes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, sku, brand, brand_id, short_description, description, material_notes, category_id, gender, collection_type, price_pkr, discount_price_pkr, is_featured, is_bestseller, is_new_arrival, is_trending, is_exclusive, is_active, rating_avg, review_count, sales_count)
SELECT 'Cobalt Vanguard X', 'sv-52-cobalt-vanguard-x', 'SV-152', 'Aequos', (SELECT id FROM public.brands WHERE slug = 'aequos' LIMIT 1), 'Precision court & sprint hybrid engineered with carbon midfoot stability.', 'High-intensity indoor/outdoor court performance meets sleek cobalt knit styling.', 'Reinforced 3D cobalt knit · Carbon stability shank · Multi-axis traction sole', c.id, 'men', 'sports', 36900, 31500, true, false, false, true, false, TRUE, 4.92, 31, 129
FROM public.categories c WHERE c.slug = 'sports-shoes'
ON CONFLICT (slug) DO NOTHING;

-- 4. PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-01-obsidian-apex-low.jpg', 'Obsidian Apex Low studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-01-obsidian-apex-low.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-01-obsidian-apex-low-detail.jpg', 'Obsidian Apex Low upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-01-obsidian-apex-low-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-02-alabaster-court-minimal.jpg', 'Alabaster Court Minimal studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-02-alabaster-court-minimal.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-02-alabaster-court-minimal-detail.jpg', 'Alabaster Court Minimal upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-02-alabaster-court-minimal-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-03-sienna-tempo-marathon.jpg', 'Sienna Tempo Marathon studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-03-sienna-tempo-marathon.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-03-sienna-tempo-marathon-detail.jpg', 'Sienna Tempo Marathon upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-03-sienna-tempo-marathon-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-04-pine-ridge-gtx-trail.jpg', 'Pine Ridge GTX Trail studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-04-pine-ridge-gtx-trail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-04-pine-ridge-gtx-trail-detail.jpg', 'Pine Ridge GTX Trail upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-04-pine-ridge-gtx-trail-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-05-cobalt-aero-carbon.jpg', 'Cobalt Aero Carbon studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-05-cobalt-aero-carbon.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-05-cobalt-aero-carbon-detail.jpg', 'Cobalt Aero Carbon upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-05-cobalt-aero-carbon-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-06-slate-monolith-high.jpg', 'Slate Monolith High-Top studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-06-slate-monolith-high.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-06-slate-monolith-high-detail.jpg', 'Slate Monolith High-Top upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-06-slate-monolith-high-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-07-desert-sand-kinetic.jpg', 'Desert Sand Kinetic studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-07-desert-sand-kinetic.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-07-desert-sand-kinetic-detail.jpg', 'Desert Sand Kinetic upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-07-desert-sand-kinetic-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-08-oxblood-heritage-sprint.jpg', 'Oxblood Heritage Sprint studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-08-oxblood-heritage-sprint.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-08-oxblood-heritage-sprint-detail.jpg', 'Oxblood Heritage Sprint upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-08-oxblood-heritage-sprint-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-09-platinum-nimbus-99.jpg', 'Platinum Nimbus 99 studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-09-platinum-nimbus-99.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-09-platinum-nimbus-99-detail.jpg', 'Platinum Nimbus 99 upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-09-platinum-nimbus-99-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-10-basalt-studio-runner.jpg', 'Basalt Studio Runner studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-10-basalt-studio-runner.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-10-basalt-studio-runner-detail.jpg', 'Basalt Studio Runner upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-10-basalt-studio-runner-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-11-champagne-atelier-low.jpg', 'Champagne Atelier Low studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-11-champagne-atelier-low.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-11-champagne-atelier-low-detail.jpg', 'Champagne Atelier Low upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-11-champagne-atelier-low-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-12-graphite-court-pro.jpg', 'Graphite Court Pro studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-12-graphite-court-pro.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-12-graphite-court-pro-detail.jpg', 'Graphite Court Pro upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-12-graphite-court-pro-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-13-ivory-chalk-walker.jpg', 'Ivory Chalk Walker studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-13-ivory-chalk-walker.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-13-ivory-chalk-walker-detail.jpg', 'Ivory Chalk Walker upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-13-ivory-chalk-walker-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-14-amber-velocity-strider.jpg', 'Amber Velocity Strider studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-14-amber-velocity-strider.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-14-amber-velocity-strider-detail.jpg', 'Amber Velocity Strider upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-14-amber-velocity-strider-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-15-moss-summit-allterrain.jpg', 'Moss Summit All-Terrain studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-15-moss-summit-allterrain.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-15-moss-summit-allterrain-detail.jpg', 'Moss Summit All-Terrain upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-15-moss-summit-allterrain-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-16-midnight-pulse-racer.jpg', 'Midnight Pulse Racer studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-16-midnight-pulse-racer.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-16-midnight-pulse-racer-detail.jpg', 'Midnight Pulse Racer upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-16-midnight-pulse-racer-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-17-ash-elevate-high.jpg', 'Ash Elevate High-Top studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-17-ash-elevate-high.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-17-ash-elevate-high-detail.jpg', 'Ash Elevate High-Top upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-17-ash-elevate-high-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-18-espresso-apex-trainer.jpg', 'Espresso Apex Trainer studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-18-espresso-apex-trainer.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-18-espresso-apex-trainer-detail.jpg', 'Espresso Apex Trainer upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-18-espresso-apex-trainer-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-19-garnet-track-classic.jpg', 'Garnet Track Classic studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-19-garnet-track-classic.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-19-garnet-track-classic-detail.jpg', 'Garnet Track Classic upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-19-garnet-track-classic-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-20-silver-mist-glide.jpg', 'Silver Mist Glide studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-20-silver-mist-glide.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-20-silver-mist-glide-detail.jpg', 'Silver Mist Glide upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-20-silver-mist-glide-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-21-onyx-velvet-court.jpg', 'Onyx Velvet Court studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-21-onyx-velvet-court.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-21-onyx-velvet-court-detail.jpg', 'Onyx Velvet Court upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-21-onyx-velvet-court-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-22-pearl-horizon-low.jpg', 'Pearl Horizon Low studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-22-pearl-horizon-low.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-22-pearl-horizon-low-detail.jpg', 'Pearl Horizon Low upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-22-pearl-horizon-low-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-23-rust-endurance-v3.jpg', 'Rust Endurance V3 studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-23-rust-endurance-v3.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-23-rust-endurance-v3-detail.jpg', 'Rust Endurance V3 upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-23-rust-endurance-v3-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-24-cypress-ridge-hiker.jpg', 'Cypress Ridge Hiker studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-24-cypress-ridge-hiker.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-24-cypress-ridge-hiker-detail.jpg', 'Cypress Ridge Hiker upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-24-cypress-ridge-hiker-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-25-indigo-carbon-fly.jpg', 'Indigo Carbon Fly studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-25-indigo-carbon-fly.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-25-indigo-carbon-fly-detail.jpg', 'Indigo Carbon Fly upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-25-indigo-carbon-fly-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-26-charcoal-dunk-archive.jpg', 'Charcoal Dunk Archive studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-26-charcoal-dunk-archive.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-26-charcoal-dunk-archive-detail.jpg', 'Charcoal Dunk Archive upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-26-charcoal-dunk-archive-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-27-dune-stabilizer-x.jpg', 'Dune Stabilizer X studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-27-dune-stabilizer-x.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-27-dune-stabilizer-x-detail.jpg', 'Dune Stabilizer X upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-27-dune-stabilizer-x-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-28-crimson-suede-78.jpg', 'Crimson Suede 78 studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-28-crimson-suede-78.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-28-crimson-suede-78-detail.jpg', 'Crimson Suede 78 upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-28-crimson-suede-78-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-29-titanium-wave-runner.jpg', 'Titanium Wave Runner studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-29-titanium-wave-runner.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-29-titanium-wave-runner-detail.jpg', 'Titanium Wave Runner upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-29-titanium-wave-runner-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-30-noir-sculpt-low.jpg', 'Noir Sculpt Low studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-30-noir-sculpt-low.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-30-noir-sculpt-low-detail.jpg', 'Noir Sculpt Low upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-30-noir-sculpt-low-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-31-bone-minimalist-02.jpg', 'Bone Minimalist 02 studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-31-bone-minimalist-02.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-31-bone-minimalist-02-detail.jpg', 'Bone Minimalist 02 upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-31-bone-minimalist-02-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-32-copper-stride-pro.jpg', 'Copper Stride Pro studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-32-copper-stride-pro.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-32-copper-stride-pro-detail.jpg', 'Copper Stride Pro upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-32-copper-stride-pro-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-33-olive-tactical-trail.jpg', 'Olive Tactical Trail studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-33-olive-tactical-trail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-33-olive-tactical-trail-detail.jpg', 'Olive Tactical Trail upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-33-olive-tactical-trail-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-34-sapphire-sprint-knit.jpg', 'Sapphire Sprint Knit studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-34-sapphire-sprint-knit.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-34-sapphire-sprint-knit-detail.jpg', 'Sapphire Sprint Knit upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-34-sapphire-sprint-knit-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-35-pewter-sky-high.jpg', 'Pewter Sky High studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-35-pewter-sky-high.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-35-pewter-sky-high-detail.jpg', 'Pewter Sky High upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-35-pewter-sky-high-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-36-taupe-flex-studio.jpg', 'Taupe Flex Studio studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-36-taupe-flex-studio.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-36-taupe-flex-studio-detail.jpg', 'Taupe Flex Studio upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-36-taupe-flex-studio-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-37-burgundy-metro-low.jpg', 'Burgundy Metro Low studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-37-burgundy-metro-low.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-37-burgundy-metro-low-detail.jpg', 'Burgundy Metro Low upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-37-burgundy-metro-low-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-38-chrome-aero-retro.jpg', 'Chrome Aero Retro studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-38-chrome-aero-retro.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-38-chrome-aero-retro-detail.jpg', 'Chrome Aero Retro upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-38-chrome-aero-retro-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-39-carbon-noir-walker.jpg', 'Carbon Noir Walker studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-39-carbon-noir-walker.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-39-carbon-noir-walker-detail.jpg', 'Carbon Noir Walker upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-39-carbon-noir-walker-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-40-linen-atelier-court.jpg', 'Linen Atelier Court studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-40-linen-atelier-court.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-40-linen-atelier-court-detail.jpg', 'Linen Atelier Court upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-40-linen-atelier-court-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-41-terracotta-ultra-50k.jpg', 'Terracotta Ultra 50K studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-41-terracotta-ultra-50k.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-41-terracotta-ultra-50k-detail.jpg', 'Terracotta Ultra 50K upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-41-terracotta-ultra-50k-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-42-forest-vortex-sport.jpg', 'Forest Vortex Sport studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-42-forest-vortex-sport.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-42-forest-vortex-sport-detail.jpg', 'Forest Vortex Sport upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-42-forest-vortex-sport-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-43-azure-track-elite.jpg', 'Azure Track Elite studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-43-azure-track-elite.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-43-azure-track-elite-detail.jpg', 'Azure Track Elite upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-43-azure-track-elite-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-44-smoke-tower-high.jpg', 'Smoke Tower High studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-44-smoke-tower-high.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-44-smoke-tower-high-detail.jpg', 'Smoke Tower High upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-44-smoke-tower-high-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-45-khaki-core-trainer.jpg', 'Khaki Core Trainer studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-45-khaki-core-trainer.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-45-khaki-core-trainer-detail.jpg', 'Khaki Core Trainer upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-45-khaki-core-trainer-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-46-ruby-vintage-runner.jpg', 'Ruby Vintage Runner studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-46-ruby-vintage-runner.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-46-ruby-vintage-runner-detail.jpg', 'Ruby Vintage Runner upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-46-ruby-vintage-runner-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-47-mercury-cloud-9.jpg', 'Mercury Cloud 9 studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-47-mercury-cloud-9.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-47-mercury-cloud-9-detail.jpg', 'Mercury Cloud 9 upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-47-mercury-cloud-9-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-48-obsidian-reserve-ed.jpg', 'Obsidian Reserve Edition studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-48-obsidian-reserve-ed.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-48-obsidian-reserve-ed-detail.jpg', 'Obsidian Reserve Edition upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-48-obsidian-reserve-ed-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-49-ecru-monolith-court.jpg', 'Ecru Monolith Court studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-49-ecru-monolith-court.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-49-ecru-monolith-court-detail.jpg', 'Ecru Monolith Court upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-49-ecru-monolith-court-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-50-burnt-earth-marathon.jpg', 'Burnt Earth Marathon studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-50-burnt-earth-marathon.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-50-burnt-earth-marathon-detail.jpg', 'Burnt Earth Marathon upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-50-burnt-earth-marathon-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-51-alpine-sage-cross.jpg', 'Alpine Sage Cross studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-51-alpine-sage-cross.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-51-alpine-sage-cross-detail.jpg', 'Alpine Sage Cross upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-51-alpine-sage-cross-detail.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-52-cobalt-vanguard-x.jpg', 'Cobalt Vanguard X studio three-quarter profile', 0, true
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-52-cobalt-vanguard-x.jpg');
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT pr.id, '/images/sneakers/sv-52-cobalt-vanguard-x-detail.jpg', 'Cobalt Vanguard X upper material and craftsmanship close-up', 1, false
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
AND NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id = pr.id AND pi.image_url = '/images/sneakers/sv-52-cobalt-vanguard-x-detail.jpg');

-- 5. PRODUCT VARIANTS
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Obsidian / Cream', '#18181B', 'SV-101-40-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Graphite', '#3F3F46', 'SV-101-40-2', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Obsidian / Cream', '#18181B', 'SV-101-41-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Graphite', '#3F3F46', 'SV-101-41-2', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Obsidian / Cream', '#18181B', 'SV-101-42-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Graphite', '#3F3F46', 'SV-101-42-2', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Obsidian / Cream', '#18181B', 'SV-101-43-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Graphite', '#3F3F46', 'SV-101-43-2', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Obsidian / Cream', '#18181B', 'SV-101-44-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Graphite', '#3F3F46', 'SV-101-44-2', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Obsidian / Cream', '#18181B', 'SV-101-45-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Graphite', '#3F3F46', 'SV-101-45-2', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-01-obsidian-apex-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Alabaster / Taupe', '#F5F5F0', 'SV-102-37-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Pure Chalk', '#FFFFFF', 'SV-102-37-2', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Alabaster / Taupe', '#F5F5F0', 'SV-102-38-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Pure Chalk', '#FFFFFF', 'SV-102-38-2', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Alabaster / Taupe', '#F5F5F0', 'SV-102-39-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Pure Chalk', '#FFFFFF', 'SV-102-39-2', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Alabaster / Taupe', '#F5F5F0', 'SV-102-40-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Pure Chalk', '#FFFFFF', 'SV-102-40-2', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Alabaster / Taupe', '#F5F5F0', 'SV-102-41-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Pure Chalk', '#FFFFFF', 'SV-102-41-2', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-02-alabaster-court-minimal'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Burnt Sienna', '#9A3412', 'SV-103-39-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Charcoal Rust', '#431407', 'SV-103-39-2', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Burnt Sienna', '#9A3412', 'SV-103-40-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Charcoal Rust', '#431407', 'SV-103-40-2', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Burnt Sienna', '#9A3412', 'SV-103-41-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Charcoal Rust', '#431407', 'SV-103-41-2', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Burnt Sienna', '#9A3412', 'SV-103-42-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Charcoal Rust', '#431407', 'SV-103-42-2', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Burnt Sienna', '#9A3412', 'SV-103-43-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Charcoal Rust', '#431407', 'SV-103-43-2', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Burnt Sienna', '#9A3412', 'SV-103-44-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Charcoal Rust', '#431407', 'SV-103-44-2', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-03-sienna-tempo-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Pine / Sand', '#14532D', 'SV-104-40-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Basalt Moss', '#365314', 'SV-104-40-2', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Pine / Sand', '#14532D', 'SV-104-41-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Basalt Moss', '#365314', 'SV-104-41-2', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Pine / Sand', '#14532D', 'SV-104-42-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Basalt Moss', '#365314', 'SV-104-42-2', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Pine / Sand', '#14532D', 'SV-104-43-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Basalt Moss', '#365314', 'SV-104-43-2', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Pine / Sand', '#14532D', 'SV-104-44-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Basalt Moss', '#365314', 'SV-104-44-2', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Pine / Sand', '#14532D', 'SV-104-45-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Basalt Moss', '#365314', 'SV-104-45-2', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-04-pine-ridge-gtx-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Deep Cobalt', '#1E3A8A', 'SV-105-38-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Midnight Carbon', '#0F172A', 'SV-105-38-2', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Deep Cobalt', '#1E3A8A', 'SV-105-39-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Midnight Carbon', '#0F172A', 'SV-105-39-2', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Deep Cobalt', '#1E3A8A', 'SV-105-40-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Midnight Carbon', '#0F172A', 'SV-105-40-2', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Deep Cobalt', '#1E3A8A', 'SV-105-41-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Midnight Carbon', '#0F172A', 'SV-105-41-2', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Deep Cobalt', '#1E3A8A', 'SV-105-42-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Midnight Carbon', '#0F172A', 'SV-105-42-2', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Deep Cobalt', '#1E3A8A', 'SV-105-43-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Midnight Carbon', '#0F172A', 'SV-105-43-2', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Deep Cobalt', '#1E3A8A', 'SV-105-44-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Midnight Carbon', '#0F172A', 'SV-105-44-2', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-05-cobalt-aero-carbon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Slate / Gum', '#374151', 'SV-106-40-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Obsidian Bone', '#18181B', 'SV-106-40-2', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Slate / Gum', '#374151', 'SV-106-41-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Obsidian Bone', '#18181B', 'SV-106-41-2', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Slate / Gum', '#374151', 'SV-106-42-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Obsidian Bone', '#18181B', 'SV-106-42-2', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Slate / Gum', '#374151', 'SV-106-43-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Obsidian Bone', '#18181B', 'SV-106-43-2', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Slate / Gum', '#374151', 'SV-106-44-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Obsidian Bone', '#18181B', 'SV-106-44-2', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Slate / Gum', '#374151', 'SV-106-45-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Obsidian Bone', '#18181B', 'SV-106-45-2', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-06-slate-monolith-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Desert Sand', '#C29B61', 'SV-107-38-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Espresso', '#451A03', 'SV-107-38-2', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Desert Sand', '#C29B61', 'SV-107-39-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Espresso', '#451A03', 'SV-107-39-2', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Desert Sand', '#C29B61', 'SV-107-40-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Espresso', '#451A03', 'SV-107-40-2', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Desert Sand', '#C29B61', 'SV-107-41-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Espresso', '#451A03', 'SV-107-41-2', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Desert Sand', '#C29B61', 'SV-107-42-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Espresso', '#451A03', 'SV-107-42-2', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Desert Sand', '#C29B61', 'SV-107-43-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Espresso', '#451A03', 'SV-107-43-2', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Desert Sand', '#C29B61', 'SV-107-44-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Espresso', '#451A03', 'SV-107-44-2', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-07-desert-sand-kinetic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Oxblood / Black', '#7F1D1D', 'SV-108-37-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Deep Garnet', '#450A0A', 'SV-108-37-2', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Oxblood / Black', '#7F1D1D', 'SV-108-38-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Deep Garnet', '#450A0A', 'SV-108-38-2', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Oxblood / Black', '#7F1D1D', 'SV-108-39-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Deep Garnet', '#450A0A', 'SV-108-39-2', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Oxblood / Black', '#7F1D1D', 'SV-108-40-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Deep Garnet', '#450A0A', 'SV-108-40-2', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Oxblood / Black', '#7F1D1D', 'SV-108-41-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Deep Garnet', '#450A0A', 'SV-108-41-2', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Oxblood / Black', '#7F1D1D', 'SV-108-42-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Deep Garnet', '#450A0A', 'SV-108-42-2', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-08-oxblood-heritage-sprint'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Platinum Silver', '#94A3B8', 'SV-109-40-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Titanium Slate', '#475569', 'SV-109-40-2', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Platinum Silver', '#94A3B8', 'SV-109-41-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Titanium Slate', '#475569', 'SV-109-41-2', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Platinum Silver', '#94A3B8', 'SV-109-42-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Titanium Slate', '#475569', 'SV-109-42-2', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Platinum Silver', '#94A3B8', 'SV-109-43-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Titanium Slate', '#475569', 'SV-109-43-2', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Platinum Silver', '#94A3B8', 'SV-109-44-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Titanium Slate', '#475569', 'SV-109-44-2', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Platinum Silver', '#94A3B8', 'SV-109-45-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Titanium Slate', '#475569', 'SV-109-45-2', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-09-platinum-nimbus-99'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Pearl / Champagne', '#E7E5E4', 'SV-110-37-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Warm Sand', '#D6D3D1', 'SV-110-37-2', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Pearl / Champagne', '#E7E5E4', 'SV-110-38-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Warm Sand', '#D6D3D1', 'SV-110-38-2', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Pearl / Champagne', '#E7E5E4', 'SV-110-39-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Warm Sand', '#D6D3D1', 'SV-110-39-2', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Pearl / Champagne', '#E7E5E4', 'SV-110-40-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Warm Sand', '#D6D3D1', 'SV-110-40-2', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Pearl / Champagne', '#E7E5E4', 'SV-110-41-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Warm Sand', '#D6D3D1', 'SV-110-41-2', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-10-basalt-studio-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Champagne Ivory', '#F5F0E6', 'SV-111-37-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Champagne Ivory', '#F5F0E6', 'SV-111-38-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Champagne Ivory', '#F5F0E6', 'SV-111-39-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Champagne Ivory', '#F5F0E6', 'SV-111-40-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Champagne Ivory', '#F5F0E6', 'SV-111-41-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-11-champagne-atelier-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Graphite Black', '#27272A', 'SV-112-40-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Graphite Black', '#27272A', 'SV-112-41-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Graphite Black', '#27272A', 'SV-112-42-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Graphite Black', '#27272A', 'SV-112-43-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Graphite Black', '#27272A', 'SV-112-44-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Graphite Black', '#27272A', 'SV-112-45-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-12-graphite-court-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Ivory Chalk', '#FAF8F5', 'SV-113-37-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Ivory Chalk', '#FAF8F5', 'SV-113-38-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Ivory Chalk', '#FAF8F5', 'SV-113-39-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Ivory Chalk', '#FAF8F5', 'SV-113-40-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Ivory Chalk', '#FAF8F5', 'SV-113-41-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-13-ivory-chalk-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Amber Rust', '#B45309', 'SV-114-40-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Amber Rust', '#B45309', 'SV-114-41-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Amber Rust', '#B45309', 'SV-114-42-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Amber Rust', '#B45309', 'SV-114-43-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Amber Rust', '#B45309', 'SV-114-44-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-14-amber-velocity-strider'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Olive Moss', '#3F6212', 'SV-115-40-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Olive Moss', '#3F6212', 'SV-115-41-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Olive Moss', '#3F6212', 'SV-115-42-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Olive Moss', '#3F6212', 'SV-115-43-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Olive Moss', '#3F6212', 'SV-115-44-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Olive Moss', '#3F6212', 'SV-115-45-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-15-moss-summit-allterrain'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Midnight Navy', '#1E293B', 'SV-116-40-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Midnight Navy', '#1E293B', 'SV-116-41-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Midnight Navy', '#1E293B', 'SV-116-42-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Midnight Navy', '#1E293B', 'SV-116-43-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Midnight Navy', '#1E293B', 'SV-116-44-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-16-midnight-pulse-racer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Ash Slate', '#64748B', 'SV-117-37-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Ash Slate', '#64748B', 'SV-117-38-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Ash Slate', '#64748B', 'SV-117-39-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Ash Slate', '#64748B', 'SV-117-40-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Ash Slate', '#64748B', 'SV-117-41-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-17-ash-elevate-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Espresso Brown', '#451A03', 'SV-118-40-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Espresso Brown', '#451A03', 'SV-118-41-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Espresso Brown', '#451A03', 'SV-118-42-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Espresso Brown', '#451A03', 'SV-118-43-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Espresso Brown', '#451A03', 'SV-118-44-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Espresso Brown', '#451A03', 'SV-118-45-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-18-espresso-apex-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Garnet Crimson', '#881337', 'SV-119-40-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Garnet Crimson', '#881337', 'SV-119-41-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Garnet Crimson', '#881337', 'SV-119-42-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Garnet Crimson', '#881337', 'SV-119-43-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Garnet Crimson', '#881337', 'SV-119-44-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-19-garnet-track-classic'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Silver Mist', '#CBD5E1', 'SV-120-37-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Silver Mist', '#CBD5E1', 'SV-120-38-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Silver Mist', '#CBD5E1', 'SV-120-39-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Silver Mist', '#CBD5E1', 'SV-120-40-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Silver Mist', '#CBD5E1', 'SV-120-41-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Silver Mist', '#CBD5E1', 'SV-120-42-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-20-silver-mist-glide'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Matte Onyx', '#09090B', 'SV-121-40-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Matte Onyx', '#09090B', 'SV-121-41-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Matte Onyx', '#09090B', 'SV-121-42-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Matte Onyx', '#09090B', 'SV-121-43-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Matte Onyx', '#09090B', 'SV-121-44-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-21-onyx-velvet-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Pearl Bone', '#F3F0EA', 'SV-122-37-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Pearl Bone', '#F3F0EA', 'SV-122-38-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Pearl Bone', '#F3F0EA', 'SV-122-39-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Pearl Bone', '#F3F0EA', 'SV-122-40-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Pearl Bone', '#F3F0EA', 'SV-122-41-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-22-pearl-horizon-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Terracotta Rust', '#9A3412', 'SV-123-40-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Terracotta Rust', '#9A3412', 'SV-123-41-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Terracotta Rust', '#9A3412', 'SV-123-42-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Terracotta Rust', '#9A3412', 'SV-123-43-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Terracotta Rust', '#9A3412', 'SV-123-44-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Terracotta Rust', '#9A3412', 'SV-123-45-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-23-rust-endurance-v3'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Cypress Green', '#14532D', 'SV-124-38-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Cypress Green', '#14532D', 'SV-124-39-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Cypress Green', '#14532D', 'SV-124-40-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Cypress Green', '#14532D', 'SV-124-41-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Cypress Green', '#14532D', 'SV-124-42-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Cypress Green', '#14532D', 'SV-124-43-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Cypress Green', '#14532D', 'SV-124-44-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-24-cypress-ridge-hiker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Indigo Cobalt', '#1D4ED8', 'SV-125-39-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Indigo Cobalt', '#1D4ED8', 'SV-125-40-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Indigo Cobalt', '#1D4ED8', 'SV-125-41-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Indigo Cobalt', '#1D4ED8', 'SV-125-42-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Indigo Cobalt', '#1D4ED8', 'SV-125-43-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Indigo Cobalt', '#1D4ED8', 'SV-125-44-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-25-indigo-carbon-fly'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Charcoal / Bone', '#3F3F46', 'SV-126-40-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Charcoal / Bone', '#3F3F46', 'SV-126-41-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Charcoal / Bone', '#3F3F46', 'SV-126-42-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Charcoal / Bone', '#3F3F46', 'SV-126-43-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Charcoal / Bone', '#3F3F46', 'SV-126-44-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Charcoal / Bone', '#3F3F46', 'SV-126-45-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-26-charcoal-dunk-archive'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Warm Dune', '#D6B88E', 'SV-127-37-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Warm Dune', '#D6B88E', 'SV-127-38-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Warm Dune', '#D6B88E', 'SV-127-39-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Warm Dune', '#D6B88E', 'SV-127-40-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Warm Dune', '#D6B88E', 'SV-127-41-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-27-dune-stabilizer-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Crimson / Cream', '#991B1B', 'SV-128-40-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Crimson / Cream', '#991B1B', 'SV-128-41-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Crimson / Cream', '#991B1B', 'SV-128-42-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Crimson / Cream', '#991B1B', 'SV-128-43-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Crimson / Cream', '#991B1B', 'SV-128-44-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-28-crimson-suede-78'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Titanium Silver', '#94A3B8', 'SV-129-38-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Titanium Silver', '#94A3B8', 'SV-129-39-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Titanium Silver', '#94A3B8', 'SV-129-40-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Titanium Silver', '#94A3B8', 'SV-129-41-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Titanium Silver', '#94A3B8', 'SV-129-42-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Titanium Silver', '#94A3B8', 'SV-129-43-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Titanium Silver', '#94A3B8', 'SV-129-44-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-29-titanium-wave-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Noir Matte', '#111111', 'SV-130-37-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Noir Matte', '#111111', 'SV-130-38-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Noir Matte', '#111111', 'SV-130-39-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Noir Matte', '#111111', 'SV-130-40-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Noir Matte', '#111111', 'SV-130-41-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-30-noir-sculpt-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Warm Bone', '#E7E2D8', 'SV-131-40-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Warm Bone', '#E7E2D8', 'SV-131-41-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Warm Bone', '#E7E2D8', 'SV-131-42-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Warm Bone', '#E7E2D8', 'SV-131-43-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Warm Bone', '#E7E2D8', 'SV-131-44-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Warm Bone', '#E7E2D8', 'SV-131-45-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-31-bone-minimalist-02'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Burnished Copper', '#B45309', 'SV-132-38-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Burnished Copper', '#B45309', 'SV-132-39-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Burnished Copper', '#B45309', 'SV-132-40-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Burnished Copper', '#B45309', 'SV-132-41-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Burnished Copper', '#B45309', 'SV-132-42-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Burnished Copper', '#B45309', 'SV-132-43-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Burnished Copper', '#B45309', 'SV-132-44-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-32-copper-stride-pro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Olive Tactical', '#365314', 'SV-133-40-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Olive Tactical', '#365314', 'SV-133-41-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Olive Tactical', '#365314', 'SV-133-42-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Olive Tactical', '#365314', 'SV-133-43-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Olive Tactical', '#365314', 'SV-133-44-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Olive Tactical', '#365314', 'SV-133-45-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-33-olive-tactical-trail'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Sapphire Blue', '#1E40AF', 'SV-134-37-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Sapphire Blue', '#1E40AF', 'SV-134-38-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Sapphire Blue', '#1E40AF', 'SV-134-39-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Sapphire Blue', '#1E40AF', 'SV-134-40-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Sapphire Blue', '#1E40AF', 'SV-134-41-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Sapphire Blue', '#1E40AF', 'SV-134-42-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-34-sapphire-sprint-knit'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Pewter Grey', '#52525B', 'SV-135-40-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Pewter Grey', '#52525B', 'SV-135-41-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Pewter Grey', '#52525B', 'SV-135-42-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Pewter Grey', '#52525B', 'SV-135-43-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Pewter Grey', '#52525B', 'SV-135-44-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-35-pewter-sky-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Warm Taupe', '#A8A29E', 'SV-136-37-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Warm Taupe', '#A8A29E', 'SV-136-38-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Warm Taupe', '#A8A29E', 'SV-136-39-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Warm Taupe', '#A8A29E', 'SV-136-40-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Warm Taupe', '#A8A29E', 'SV-136-41-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-36-taupe-flex-studio'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Burgundy / Charcoal', '#7F1D1D', 'SV-137-37-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Burgundy / Charcoal', '#7F1D1D', 'SV-137-38-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Burgundy / Charcoal', '#7F1D1D', 'SV-137-39-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Burgundy / Charcoal', '#7F1D1D', 'SV-137-40-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Burgundy / Charcoal', '#7F1D1D', 'SV-137-41-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-37-burgundy-metro-low'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Chrome / Slate', '#94A3B8', 'SV-138-40-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Chrome / Slate', '#94A3B8', 'SV-138-41-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Chrome / Slate', '#94A3B8', 'SV-138-42-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Chrome / Slate', '#94A3B8', 'SV-138-43-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Chrome / Slate', '#94A3B8', 'SV-138-44-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Chrome / Slate', '#94A3B8', 'SV-138-45-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-38-chrome-aero-retro'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Carbon Noir', '#18181B', 'SV-139-40-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Carbon Noir', '#18181B', 'SV-139-41-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Carbon Noir', '#18181B', 'SV-139-42-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Carbon Noir', '#18181B', 'SV-139-43-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Carbon Noir', '#18181B', 'SV-139-44-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Carbon Noir', '#18181B', 'SV-139-45-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-39-carbon-noir-walker'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Linen / Cream', '#E7E5E4', 'SV-140-37-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Linen / Cream', '#E7E5E4', 'SV-140-38-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Linen / Cream', '#E7E5E4', 'SV-140-39-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Linen / Cream', '#E7E5E4', 'SV-140-40-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Linen / Cream', '#E7E5E4', 'SV-140-41-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-40-linen-atelier-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Terracotta Clay', '#9A3412', 'SV-141-38-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Terracotta Clay', '#9A3412', 'SV-141-39-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Terracotta Clay', '#9A3412', 'SV-141-40-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Terracotta Clay', '#9A3412', 'SV-141-41-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Terracotta Clay', '#9A3412', 'SV-141-42-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Terracotta Clay', '#9A3412', 'SV-141-43-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Terracotta Clay', '#9A3412', 'SV-141-44-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-41-terracotta-ultra-50k'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Forest Pine', '#14532D', 'SV-142-40-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Forest Pine', '#14532D', 'SV-142-41-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Forest Pine', '#14532D', 'SV-142-42-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Forest Pine', '#14532D', 'SV-142-43-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Forest Pine', '#14532D', 'SV-142-44-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Forest Pine', '#14532D', 'SV-142-45-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-42-forest-vortex-sport'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Azure Cobalt', '#1D4ED8', 'SV-143-38-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Azure Cobalt', '#1D4ED8', 'SV-143-39-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Azure Cobalt', '#1D4ED8', 'SV-143-40-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Azure Cobalt', '#1D4ED8', 'SV-143-41-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Azure Cobalt', '#1D4ED8', 'SV-143-42-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Azure Cobalt', '#1D4ED8', 'SV-143-43-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Azure Cobalt', '#1D4ED8', 'SV-143-44-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-43-azure-track-elite'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Smoke Grey', '#4B5563', 'SV-144-37-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Smoke Grey', '#4B5563', 'SV-144-38-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Smoke Grey', '#4B5563', 'SV-144-39-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Smoke Grey', '#4B5563', 'SV-144-40-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Smoke Grey', '#4B5563', 'SV-144-41-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-44-smoke-tower-high'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Khaki / Espresso', '#A16207', 'SV-145-40-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Khaki / Espresso', '#A16207', 'SV-145-41-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Khaki / Espresso', '#A16207', 'SV-145-42-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Khaki / Espresso', '#A16207', 'SV-145-43-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Khaki / Espresso', '#A16207', 'SV-145-44-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Khaki / Espresso', '#A16207', 'SV-145-45-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-45-khaki-core-trainer'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Ruby Oxblood', '#881337', 'SV-146-37-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Ruby Oxblood', '#881337', 'SV-146-38-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Ruby Oxblood', '#881337', 'SV-146-39-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Ruby Oxblood', '#881337', 'SV-146-40-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Ruby Oxblood', '#881337', 'SV-146-41-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-46-ruby-vintage-runner'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Mercury Silver', '#9CA3AF', 'SV-147-37-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Mercury Silver', '#9CA3AF', 'SV-147-38-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Mercury Silver', '#9CA3AF', 'SV-147-39-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Mercury Silver', '#9CA3AF', 'SV-147-40-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Mercury Silver', '#9CA3AF', 'SV-147-41-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Mercury Silver', '#9CA3AF', 'SV-147-42-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-47-mercury-cloud-9'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Obsidian / Ivory', '#111111', 'SV-148-40-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Obsidian / Ivory', '#111111', 'SV-148-41-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Obsidian / Ivory', '#111111', 'SV-148-42-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Obsidian / Ivory', '#111111', 'SV-148-43-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Obsidian / Ivory', '#111111', 'SV-148-44-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-48-obsidian-reserve-ed'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '37', 'Ecru / Champagne', '#E5DFD3', 'SV-149-37-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Ecru / Champagne', '#E5DFD3', 'SV-149-38-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Ecru / Champagne', '#E5DFD3', 'SV-149-39-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Ecru / Champagne', '#E5DFD3', 'SV-149-40-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Ecru / Champagne', '#E5DFD3', 'SV-149-41-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-49-ecru-monolith-court'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Burnt Earth', '#7C2D12', 'SV-150-40-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Burnt Earth', '#7C2D12', 'SV-150-41-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Burnt Earth', '#7C2D12', 'SV-150-42-1', 16, TRUE
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Burnt Earth', '#7C2D12', 'SV-150-43-1', 5, TRUE
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Burnt Earth', '#7C2D12', 'SV-150-44-1', 8, TRUE
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Burnt Earth', '#7C2D12', 'SV-150-45-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-50-burnt-earth-marathon'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '38', 'Alpine Sage', '#3F6212', 'SV-151-38-1', 11, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '39', 'Alpine Sage', '#3F6212', 'SV-151-39-1', 14, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Alpine Sage', '#3F6212', 'SV-151-40-1', 3, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Alpine Sage', '#3F6212', 'SV-151-41-1', 6, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Alpine Sage', '#3F6212', 'SV-151-42-1', 9, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Alpine Sage', '#3F6212', 'SV-151-43-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Alpine Sage', '#3F6212', 'SV-151-44-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-51-alpine-sage-cross'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '40', 'Cobalt / Obsidian', '#1E3A8A', 'SV-152-40-1', 12, TRUE
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '41', 'Cobalt / Obsidian', '#1E3A8A', 'SV-152-41-1', 15, TRUE
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '42', 'Cobalt / Obsidian', '#1E3A8A', 'SV-152-42-1', 4, TRUE
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '43', 'Cobalt / Obsidian', '#1E3A8A', 'SV-152-43-1', 7, TRUE
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '44', 'Cobalt / Obsidian', '#1E3A8A', 'SV-152-44-1', 10, TRUE
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
ON CONFLICT (sku_variant) DO NOTHING;
INSERT INTO public.product_variants (product_id, size_eu, color_name, color_hex, sku_variant, stock_quantity, is_active)
SELECT pr.id, '45', 'Cobalt / Obsidian', '#1E3A8A', 'SV-152-45-1', 13, TRUE
FROM public.products pr WHERE pr.slug = 'sv-52-cobalt-vanguard-x'
ON CONFLICT (sku_variant) DO NOTHING;

-- 6. PROMO COUPONS
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_pkr, max_uses, is_active) VALUES ('SOLE10', '10% off orders PKR 15,000+', 'percentage', 10, 15000, 1000, TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_pkr, max_uses, is_active) VALUES ('ATELIER2500', 'PKR 2,500 off orders PKR 25,000+', 'fixed', 2500, 25000, 500, TRUE) ON CONFLICT (code) DO NOTHING;

-- 7. SITE SETTINGS
INSERT INTO public.site_settings (key, value) VALUES ('announcement', '{"enabled":true,"text":"Complimentary Express Delivery Across Pakistan on Orders Above PKR 25,000 · Use Code SOLE10 for 10% Off","link_url":"/collections/new-arrivals"}'::jsonb) ON CONFLICT (key) DO NOTHING;
INSERT INTO public.site_settings (key, value) VALUES ('shipping', '{"flat_rate_pkr":350,"free_threshold_pkr":25000,"estimated_days":"2–4 Business Days (Cash on Delivery Nationwide)"}'::jsonb) ON CONFLICT (key) DO NOTHING;
INSERT INTO public.site_settings (key, value) VALUES ('store', '{"name":"SOLEVERSE","support_email":"your-business-email@gmail.com","support_phone":"+92 300 0000000","whatsapp_number":"923000000000","instagram_url":"https://instagram.com/soleverse","flagship_city":"Lahore · Karachi · Islamabad"}'::jsonb) ON CONFLICT (key) DO NOTHING;
