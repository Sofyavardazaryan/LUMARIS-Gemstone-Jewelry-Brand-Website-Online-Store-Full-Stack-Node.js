/**
 * LUMARIS — Product Seed Script
 * Run: node utils/seedProducts.js
 * Seeds the catalog with gemstone bracelets and related jewelry,
 * linking each piece to its Gemstone and (where fitting) a Collection.
 *
 * Requires gemstones & collections to already exist (run seedData.js first).
 */

const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: `${__dirname}/../.env` });

const Product = require('../models/Product');
const Gemstone = require('../models/Gemstone');
const Collection = require('../models/Collection');

// Reliable, deterministic imagery so cards render even offline-friendly hosts.
const img = (seed) => `https://picsum.photos/seed/lumaris-${seed}/800/800`;

/**
 * Catalog. `gem` / `col` are SLUGS resolved to ObjectIds at seed time.
 * Bracelets are the hero category, with supporting pieces across the range.
 */
const PRODUCTS = [
  // ─── Stone Bracelets (hero category) ───────────────────────────────
  {
    name: 'Amethyst Serenity Beaded Bracelet',
    category: 'bracelets', gem: 'amethyst', col: 'vita-nuova',
    sku: 'LUM-BR-AME-01', seed: 'amethyst-serenity',
    shortDescription: '8mm genuine amethyst beads on a hand-knotted elastic cord.',
    description: 'A calming circle of deep violet amethyst, hand-selected for even colour and clarity. Worn close to the pulse, this bracelet is a quiet companion for meditation and rest — a reminder to breathe and return to yourself.',
    materials: ['Genuine Amethyst', '8mm Round Beads', 'Sterling Silver Accent'],
    dimensions: { length: '18cm (stretch)', width: '8mm', weight: '14g' },
    energeticMeaning: 'Amethyst soothes an overactive mind, easing anxiety and inviting clarity and calm.',
    price: 68, compareAtPrice: 89, stock: 40,
    isFeatured: true, isBestSeller: true, tags: ['amethyst', 'bracelet', 'calming', 'beaded'],
    rating: 4.8, numReviews: 24, soldCount: 132,
  },
  {
    name: 'Rose Quartz Tender Heart Bracelet',
    category: 'bracelets', gem: 'rose-quartz',
    sku: 'LUM-BR-ROS-01', seed: 'rosequartz-heart',
    shortDescription: 'Soft blush rose quartz beads with a sterling heart charm.',
    description: 'The stone of unconditional love, rendered in gentle blush. Each translucent bead carries the warmth of rose quartz, finished with a delicate sterling heart. A piece made for self-compassion and open-hearted living.',
    materials: ['Genuine Rose Quartz', '8mm Round Beads', 'Sterling Silver Heart Charm'],
    dimensions: { length: '18cm (stretch)', width: '8mm', weight: '13g' },
    energeticMeaning: 'Rose quartz opens the heart to love — for others and, above all, for oneself.',
    price: 62, stock: 55,
    isFeatured: true, isNewArrival: true, tags: ['rose quartz', 'bracelet', 'love', 'heart'],
    rating: 4.9, numReviews: 31, soldCount: 98,
  },
  {
    name: "Tiger's Eye Grounding Bracelet",
    category: 'bracelets', gem: "tiger's-eye",
    sku: 'LUM-BR-TIG-01', seed: 'tigerseye-grounding',
    shortDescription: 'Golden-brown banded tiger\'s eye for courage and focus.',
    description: 'Warm bands of gold and earth catch the light as they turn. Tiger\'s eye is the stone of the confident, grounded traveller — worn for courage before a challenge and steadiness through it.',
    materials: ["Genuine Tiger's Eye", '10mm Round Beads', 'Brass Accent'],
    dimensions: { length: '19cm (stretch)', width: '10mm', weight: '18g' },
    energeticMeaning: "Tiger's eye grounds scattered energy, restoring courage, focus and personal power.",
    price: 58, stock: 60,
    isBestSeller: true, tags: ["tiger's eye", 'bracelet', 'grounding', 'courage'],
    rating: 4.7, numReviews: 19, soldCount: 87,
  },
  {
    name: 'Citrine Abundance Bracelet',
    category: 'bracelets', gem: 'citrine',
    sku: 'LUM-BR-CIT-01', seed: 'citrine-abundance',
    shortDescription: 'Sun-gold citrine beads for optimism and abundance.',
    description: 'Bottled sunlight for the wrist. Citrine carries a bright, generous energy — long associated with abundance, confidence and joy. A warm gold companion for new beginnings.',
    materials: ['Genuine Citrine', '8mm Round Beads', '18K Gold-Plated Accent'],
    dimensions: { length: '18cm (stretch)', width: '8mm', weight: '13g' },
    energeticMeaning: 'Citrine radiates optimism and draws in abundance, prosperity and self-belief.',
    price: 72, compareAtPrice: 95, stock: 34,
    isNewArrival: true, tags: ['citrine', 'bracelet', 'abundance', 'gold'],
    rating: 4.6, numReviews: 14, soldCount: 61,
  },
  {
    name: 'Lapis Lazuli Wisdom Bracelet',
    category: 'bracelets', gem: 'lapis-lazuli', col: 'la-serenissima',
    sku: 'LUM-BR-LAP-01', seed: 'lapis-wisdom',
    shortDescription: 'Deep celestial-blue lapis flecked with golden pyrite.',
    description: 'The blue of a Venetian night sky, scattered with gold. Prized since antiquity, lapis lazuli is the stone of the scholar and the seeker — worn for truth, insight and inner wisdom.',
    materials: ['Genuine Lapis Lazuli', '8mm Round Beads', 'Gold-Plated Spacers'],
    dimensions: { length: '18cm (stretch)', width: '8mm', weight: '15g' },
    energeticMeaning: 'Lapis lazuli awakens the mind, deepening wisdom, truth and self-expression.',
    price: 74, stock: 42,
    isFeatured: true, tags: ['lapis lazuli', 'bracelet', 'wisdom', 'blue'],
    rating: 4.8, numReviews: 22, soldCount: 76,
  },
  {
    name: 'Moonstone Intuition Bracelet',
    category: 'bracelets', gem: 'moonstone', col: 'wuthering-heights',
    sku: 'LUM-BR-MOO-01', seed: 'moonstone-intuition',
    shortDescription: 'Adularescent moonstone with a soft blue inner glow.',
    description: 'Light moves beneath the surface like a tide. Moonstone is the stone of intuition and the feminine, of new moons and quiet knowing. A luminous companion through every phase.',
    materials: ['Genuine Rainbow Moonstone', '8mm Round Beads', 'Sterling Silver'],
    dimensions: { length: '18cm (stretch)', width: '8mm', weight: '13g' },
    energeticMeaning: 'Moonstone heightens intuition and eases emotional cycles into gentle balance.',
    price: 78, compareAtPrice: 98, stock: 28,
    isBestSeller: true, tags: ['moonstone', 'bracelet', 'intuition', 'silver'],
    rating: 4.9, numReviews: 27, soldCount: 104,
  },
  {
    name: 'Garnet Passion Bracelet',
    category: 'bracelets', gem: 'garnet', col: 'queen-victoria',
    sku: 'LUM-BR-GAR-01', seed: 'garnet-passion',
    shortDescription: 'Deep wine-red garnet, a Victorian favourite.',
    description: 'A river of deep, glowing red. Beloved in the Victorian age, garnet is the stone of passion, vitality and devotion — worn to rekindle energy and warm the heart.',
    materials: ['Genuine Garnet', '6mm Round Beads', 'Sterling Silver Accent'],
    dimensions: { length: '18cm (stretch)', width: '6mm', weight: '12g' },
    energeticMeaning: 'Garnet reignites passion and vitality, grounding love in steady devotion.',
    price: 66, stock: 45,
    tags: ['garnet', 'bracelet', 'passion', 'red'],
    rating: 4.6, numReviews: 12, soldCount: 53,
  },
  {
    name: 'Labradorite Mystic Bracelet',
    category: 'bracelets', gem: 'labradorite', col: 'wuthering-heights',
    sku: 'LUM-BR-LAB-01', seed: 'labradorite-mystic',
    shortDescription: 'Flashing peacock-blue labradorite for transformation.',
    description: 'Grey stone that hides a storm of blue and gold fire. Labradorite is the stone of magic and transformation — worn to protect the aura and reveal hidden strength.',
    materials: ['Genuine Labradorite', '10mm Round Beads', 'Gunmetal Accent'],
    dimensions: { length: '19cm (stretch)', width: '10mm', weight: '19g' },
    energeticMeaning: 'Labradorite shields the aura and awakens intuition, magic and transformation.',
    price: 82, stock: 30,
    isNewArrival: true, tags: ['labradorite', 'bracelet', 'transformation', 'protection'],
    rating: 4.8, numReviews: 16, soldCount: 44,
  },
  {
    name: 'Pyrite Prosperity Bracelet',
    category: 'bracelets', gem: 'pyrite',
    sku: 'LUM-BR-PYR-01', seed: 'pyrite-prosperity',
    shortDescription: 'Metallic gold pyrite — the stone of fortune.',
    description: 'Fool\'s gold, and no fool who wears it. Pyrite\'s bright metallic facets have long symbolised wealth, willpower and the confidence to act. A bold statement for the ambitious.',
    materials: ['Genuine Pyrite', '8mm Faceted Beads', 'Brass Accent'],
    dimensions: { length: '18cm (stretch)', width: '8mm', weight: '22g' },
    energeticMeaning: 'Pyrite fuels willpower and draws prosperity, confidence and decisive action.',
    price: 64, stock: 38,
    tags: ['pyrite', 'bracelet', 'prosperity', 'gold'],
    rating: 4.5, numReviews: 9, soldCount: 37,
  },
  {
    name: 'Aquamarine Calm Waters Bracelet',
    category: 'bracelets', gem: 'aquamarine', col: 'la-serenissima',
    sku: 'LUM-BR-AQU-01', seed: 'aquamarine-calm',
    shortDescription: 'Pale sea-blue aquamarine for serenity and clarity.',
    description: 'The colour of the Adriatic at dawn. Aquamarine is the sailor\'s stone — of calm seas, clear communication and cool composure. A serene blue thread for turbulent days.',
    materials: ['Genuine Aquamarine', '7mm Round Beads', 'Sterling Silver'],
    dimensions: { length: '18cm (stretch)', width: '7mm', weight: '12g' },
    energeticMeaning: 'Aquamarine calms the emotions and clears the mind, easing honest communication.',
    price: 88, compareAtPrice: 110, stock: 26,
    isFeatured: true, tags: ['aquamarine', 'bracelet', 'calm', 'blue'],
    rating: 4.7, numReviews: 18, soldCount: 58,
  },

  // ─── Related jewellery ─────────────────────────────────────────────
  {
    name: 'Amethyst Teardrop Pendant Necklace',
    category: 'necklaces', gem: 'amethyst', col: 'vita-nuova',
    sku: 'LUM-NE-AME-01', seed: 'amethyst-teardrop',
    shortDescription: 'Faceted amethyst teardrop on an 18" sterling chain.',
    description: 'A single faceted teardrop of amethyst suspended on a fine sterling chain — understated, luminous, and worn close to the heart. From the Vita Nuova collection, inspired by Dante\'s new life.',
    materials: ['Genuine Amethyst', 'Sterling Silver', '18" Cable Chain'],
    dimensions: { length: '18" chain', width: '12mm pendant', weight: '6g' },
    energeticMeaning: 'Amethyst clears the mind and lifts the spirit toward calm and clarity.',
    price: 124, stock: 22,
    isFeatured: true, isBestSeller: true, tags: ['amethyst', 'necklace', 'pendant'],
    rating: 4.9, numReviews: 20, soldCount: 71,
  },
  {
    name: 'Emerald Renaissance Pendant',
    category: 'pendants', gem: 'emerald', col: 'queen-victoria',
    sku: 'LUM-PE-EME-01', seed: 'emerald-renaissance',
    shortDescription: 'Vivid green emerald pendant in gold-plated setting.',
    description: 'A deep, living green set in warm gold. Emerald has crowned royalty for millennia — the stone of the heart, of loyalty and rebirth. A regal centrepiece for a considered wardrobe.',
    materials: ['Genuine Emerald', '18K Gold-Plated Setting', '20" Chain'],
    dimensions: { length: '20" chain', width: '10mm pendant', weight: '7g' },
    energeticMeaning: 'Emerald opens the heart to love, loyalty and hopeful renewal.',
    price: 168, compareAtPrice: 210, stock: 15,
    tags: ['emerald', 'pendant', 'gold', 'heart'],
    rating: 4.8, numReviews: 11, soldCount: 29,
  },
  {
    name: 'Moonstone Solitaire Ring',
    category: 'rings', gem: 'moonstone', col: 'wuthering-heights',
    sku: 'LUM-RI-MOO-01', seed: 'moonstone-ring',
    shortDescription: 'Cabochon moonstone solitaire in sterling silver.',
    description: 'A single smooth cabochon of moonstone, its blue fire shifting with the light, cradled in a fine sterling band. Quiet, romantic, and endlessly wearable.',
    materials: ['Genuine Rainbow Moonstone', 'Sterling Silver Band'],
    dimensions: { length: 'Adjustable', width: '9mm stone', weight: '4g' },
    energeticMeaning: 'Moonstone attunes you to intuition and the gentle rhythm of your own cycles.',
    price: 96, stock: 33,
    isNewArrival: true, tags: ['moonstone', 'ring', 'silver', 'solitaire'],
    rating: 4.7, numReviews: 13, soldCount: 40,
  },
  {
    name: 'Rose Quartz Drop Earrings',
    category: 'earrings', gem: 'rose-quartz',
    sku: 'LUM-EA-ROS-01', seed: 'rosequartz-earrings',
    shortDescription: 'Faceted rose quartz drops on gold-filled hooks.',
    description: 'Two soft blush drops of faceted rose quartz that catch the light as you move. Light enough for every day, romantic enough for an occasion.',
    materials: ['Genuine Rose Quartz', '14K Gold-Filled Hooks'],
    dimensions: { length: '3cm drop', width: '6mm stone', weight: '3g pair' },
    energeticMeaning: 'Rose quartz surrounds you in gentle, loving, heart-opening energy.',
    price: 58, stock: 48,
    tags: ['rose quartz', 'earrings', 'gold', 'drop'],
    rating: 4.8, numReviews: 17, soldCount: 55,
  },
  {
    name: 'La Serenissima Lapis & Aquamarine Bracelet Set',
    category: 'sets', gem: 'lapis-lazuli', col: 'la-serenissima',
    sku: 'LUM-SE-LSA-01', seed: 'serenissima-set',
    shortDescription: 'A stacking duo of lapis lazuli and aquamarine.',
    description: 'Venice in two bracelets — the deep midnight blue of lapis paired with the pale dawn of aquamarine. Designed to be stacked, worn together as wisdom and serenity, hand in hand.',
    materials: ['Genuine Lapis Lazuli', 'Genuine Aquamarine', 'Gold-Plated Spacers'],
    dimensions: { length: '18cm each (stretch)', width: '8mm', weight: '28g set' },
    energeticMeaning: 'Wisdom and calm together — lapis for insight, aquamarine for serene, honest expression.',
    price: 148, compareAtPrice: 176, stock: 20,
    isFeatured: true, isNewArrival: true, tags: ['set', 'bracelet', 'lapis lazuli', 'aquamarine', 'stack'],
    rating: 4.9, numReviews: 15, soldCount: 33,
  },
  {
    name: 'Opal Iridescence Pendant',
    category: 'pendants', gem: 'opal',
    sku: 'LUM-PE-OPA-01', seed: 'opal-iridescence',
    shortDescription: 'Play-of-colour opal pendant on a fine silver chain.',
    description: 'A small window of shifting fire — greens, blues and flashes of orange dancing across a milky ground. Opal is the stone of inspiration and imagination, worn to amplify creativity and emotion.',
    materials: ['Genuine Opal', 'Sterling Silver', '18" Chain'],
    dimensions: { length: '18" chain', width: '10mm pendant', weight: '5g' },
    energeticMeaning: 'Opal amplifies emotion and creativity, illuminating inspiration and self-expression.',
    price: 134, stock: 18,
    tags: ['opal', 'pendant', 'iridescent', 'silver'],
    rating: 4.7, numReviews: 8, soldCount: 21,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Resolve gemstone & collection slugs → ObjectIds
    const gems = await Gemstone.find({}, 'slug');
    const cols = await Collection.find({}, 'slug');
    const gemMap = Object.fromEntries(gems.map(g => [g.slug, g._id]));
    const colMap = Object.fromEntries(cols.map(c => [c.slug, c._id]));

    if (gems.length === 0 || cols.length === 0) {
      console.error('✗ No gemstones/collections found. Run `node utils/seedData.js` first.');
      process.exit(1);
    }

    await Product.deleteMany({});
    console.log('  Cleared existing products');

    for (const p of PRODUCTS) {
      const gemId = gemMap[p.gem];
      if (!gemId) { console.warn(`  ⚠ Skipping ${p.name}: gemstone "${p.gem}" not found`); continue; }
      const colId = p.col ? colMap[p.col] : undefined;
      if (p.col && !colId) console.warn(`  ⚠ ${p.name}: collection "${p.col}" not found — leaving unset`);

      const images = [img(p.seed), img(`${p.seed}-b`), img(`${p.seed}-c`)];
      const doc = {
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sku: p.sku,
        category: p.category,
        gemstone: gemId,
        collection: colId,
        images,
        thumbnailImage: images[0],
        shortDescription: p.shortDescription,
        description: p.description,
        materials: p.materials,
        dimensions: p.dimensions,
        energeticMeaning: p.energeticMeaning,
        careInstructions: 'Keep dry and remove before bathing or swimming. Wipe gently with a soft cloth. Store separately to avoid scratches. Recharge under moonlight.',
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        isFeatured: !!p.isFeatured,
        isNewArrival: !!p.isNewArrival,
        isBestSeller: !!p.isBestSeller,
        tags: p.tags,
        rating: p.rating || 0,
        numReviews: p.numReviews || 0,
        soldCount: p.soldCount || 0,
      };

      await Product.create(doc); // create() runs the pre-save hook (sets isInStock)
      console.log(`  ✓ ${p.category.padEnd(10)} ${p.name}`);
    }

    const total = await Product.countDocuments();
    console.log(`\n✓ Seeded ${total} products successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('✗ Product seed failed:', err.message);
    process.exit(1);
  }
}

seedProducts();
