/**
 * LUMARIS — Database Seed Script
 * Run: node utils/seedData.js
 * Seeds the database with gemstones and collections
 */

const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS for SRV record resolution
require('dotenv').config({ path: `${__dirname}/../.env` });

const Gemstone = require('../models/Gemstone');
const Collection = require('../models/Collection');
const User = require('../models/User');

const GEMSTONES = [
  {
    name: 'Amethyst', slug: 'amethyst', color: 'Deep violet-purple',
    mohs: 7, origin: 'Brazil, Uruguay, Zambia',
    description: 'Amethyst, the violet variety of quartz, has captivated humanity for millennia. Its rich purple hue — ranging from pale lavender to deep violet — has made it one of the most prized gemstones throughout history.',
    geologicalBackground: 'Amethyst is a variety of quartz formed in volcanic rocks. Its purple color comes from irradiation and iron impurities. Major deposits are found in Brazil, Uruguay, Russia, and Africa.',
    symbolism: 'Throughout history, amethyst has been associated with royalty, clarity, and protection. The ancient Greeks believed it prevented intoxication and wore it in rings and goblets.',
    emotionalProperties: 'Amethyst is known as a stone of emotional balance. It helps calm anxiety, reduces stress, and promotes inner peace. It encourages clear thinking and assists in making wise decisions.',
    energeticProperties: 'Amethyst carries a high spiritual vibration. It enhances intuition, opens the third eye, and promotes spiritual awakening. It is one of the most powerful stones for meditation and psychic protection.',
    spiritualAssociations: 'Strongly associated with the Crown and Third Eye chakras. Connected to the archangel Raphael and the planet Jupiter. Used in spiritual practices for centuries across many traditions.',
    chakra: 'Crown · Third Eye',
    zodiacSign: ['Pisces', 'Virgo', 'Aquarius', 'Capricorn'],
    planet: 'Jupiter',
    element: 'Air / Water',
    careInstructions: 'Clean with warm soapy water. Avoid prolonged sunlight exposure which can fade the color. Recharge under moonlight. Cleanse with sage or sound.',
    isFeatured: true
  },
  {
    name: 'Emerald', slug: 'emerald', color: 'Deep vivid green',
    mohs: 7.5, origin: 'Colombia, Zambia, Brazil, Zimbabwe',
    description: 'Emerald, the gemstone of Venus, is one of the most precious stones on Earth. Its intense green color — caused by trace amounts of chromium and vanadium — has made it the symbol of spring, growth, and eternal love.',
    geologicalBackground: 'Emerald is a variety of the mineral beryl. The finest specimens come from Colombia\'s Muzo and Chivor mines, where they have been mined for over 500 years. Their color is unrivaled by emeralds from any other source.',
    symbolism: 'Cleopatra was famously passionate about emeralds and claimed ownership of all emerald mines in Egypt. The Incas considered emerald sacred. It has long symbolized love, renewal, and wisdom.',
    emotionalProperties: 'Emerald is the stone of successful love. It brings loyalty, domestic bliss, and unconditional love. It enhances unity, compassion, and promotes friendship.',
    energeticProperties: 'Emerald opens and nurtures the heart chakra. It attracts abundance, prosperity, and success. It is a stone of inspiration and infinite patience.',
    spiritualAssociations: 'Sacred to Venus, the goddess of love. Associated with the Heart chakra and the element of Earth. Used in ancient healing traditions across Egypt, Rome, and South America.',
    chakra: 'Heart',
    zodiacSign: ['Taurus', 'Gemini', 'Aries'],
    planet: 'Venus',
    element: 'Earth / Water',
    careInstructions: 'Clean with a soft, damp cloth. Avoid ultrasonic cleaners and steam. Never use harsh chemicals. Store separately to prevent scratching.',
    isFeatured: true
  },
  {
    name: 'Aquamarine', slug: 'aquamarine', color: 'Pale to deep blue-green',
    mohs: 7.5, origin: 'Brazil, Madagascar, Pakistan, Nigeria',
    description: 'Aquamarine, the gem of the sea, evokes the infinite tranquility of the ocean. Its name from the Latin "aqua marina" — water of the sea. This beryl variety ranges from pale sky blue to deep blue-green.',
    geologicalBackground: 'Like emerald, aquamarine is a beryl mineral. Its blue-green color comes from traces of iron. The finest aquamarines come from Brazil, particularly the Santa Maria mine.',
    symbolism: 'For centuries, sailors wore aquamarine to ensure safe passage and calm seas. It was considered the treasure of mermaids, and a symbol of courage and communication.',
    emotionalProperties: 'Aquamarine reduces stress, quiets the mind, and promotes harmony. It encourages clear communication and helps release old patterns of emotional holding.',
    energeticProperties: 'This stone resonates with the water element and cleanses the emotional body. It enhances intuition, promotes truth, and supports spiritual growth and clarity of mind.',
    spiritualAssociations: 'Deeply connected to Neptune and the ocean. Associated with the Throat chakra, supporting clear, honest expression. Sacred to sea deities across many traditions.',
    chakra: 'Throat',
    zodiacSign: ['Pisces', 'Aquarius', 'Aries'],
    planet: 'Neptune',
    element: 'Water',
    careInstructions: 'Clean with warm soapy water. Rinse thoroughly. Avoid exposure to heat and sudden temperature changes. Recharge near water or under the moon.',
    isFeatured: true
  },
  {
    name: 'Moonstone', slug: 'moonstone', color: 'Pearlescent white-blue',
    mohs: 6, origin: 'Sri Lanka, India, Madagascar, Brazil',
    description: 'Moonstone shimmers with a mysterious inner light — a phenomenon called adularescence — that seems to move beneath the surface like moonlight on water. This feldspar mineral has been considered sacred across many cultures.',
    geologicalBackground: 'Moonstone is a variety of the feldspar mineral orthoclase. Its adularescence (the glowing light) is caused by light scattering between alternating layers of albite and orthoclase. The finest specimens come from Sri Lanka.',
    symbolism: 'In ancient India, moonstone was considered sacred and magical — a talisman of good fortune. In Rome, it was believed to be formed from solidified moonbeams. It has always been associated with the divine feminine.',
    emotionalProperties: 'Moonstone soothes emotional instability and stress. It stabilizes emotions and provides calmness. It enhances intuitive perception and promotes empathy.',
    energeticProperties: 'Moonstone is deeply connected to lunar cycles and the divine feminine. It enhances psychic abilities, promotes lucid dreaming, and supports new beginnings and inner journeys.',
    spiritualAssociations: 'Sacred to all lunar goddesses — Diana, Selene, Artemis, and Hecate. Associated with the Third Eye and Crown chakras. Powerful during the full and new moon.',
    chakra: 'Third Eye · Crown · Sacral',
    zodiacSign: ['Cancer', 'Libra', 'Scorpio'],
    planet: 'Moon',
    element: 'Water',
    careInstructions: 'Handle gently as moonstone can be brittle. Clean with a soft, damp cloth. Avoid harsh chemicals. Recharge under moonlight.',
    isFeatured: true
  },
  {
    name: 'Citrine', slug: 'citrine', color: 'Yellow to amber-orange',
    mohs: 7, origin: 'Brazil, Bolivia, Madagascar, Spain',
    description: 'Citrine, the "merchant\'s stone," radiates the warm energy of the sun. Its golden to amber color brings light and optimism wherever it is placed. Natural citrine is rare — most commercial citrine is heat-treated amethyst.',
    geologicalBackground: 'Natural citrine is a variety of quartz colored by iron trace elements. Its name comes from the French word "citron," meaning lemon. Most mined citrine comes from Brazil.',
    symbolism: 'Known as the "merchant\'s stone," citrine has been used to attract wealth and prosperity for centuries. Ancient Romans used it in rings and jewels. It carries the energy of the sun.',
    emotionalProperties: 'Citrine is one of the most positive and energizing stones. It dispels negative energy, promotes confidence, encourages creativity, and brings a sunny, optimistic attitude.',
    energeticProperties: 'Citrine does not hold or accumulate negative energy — it dissipates and transmutes it. It attracts abundance, prosperity, and success. It energizes every level of life.',
    spiritualAssociations: 'Associated with the Solar Plexus chakra — the seat of personal power. Connected to the Sun. Used in feng shui to attract wealth when placed in the prosperity corner.',
    chakra: 'Solar Plexus · Sacral',
    zodiacSign: ['Aries', 'Gemini', 'Leo', 'Libra'],
    planet: 'Sun',
    element: 'Fire',
    careInstructions: 'Clean with warm soapy water. Avoid prolonged sunlight to prevent fading. Store away from other gemstones to prevent scratching.',
    isFeatured: true
  },
  {
    name: 'Opal', slug: 'opal', color: 'Rainbow play-of-color',
    mohs: 5.5, origin: 'Australia, Ethiopia, Mexico, Brazil',
    description: 'Opal is one of the most spectacular and unique gemstones in the world, displaying a phenomenon known as "play-of-color" — a dynamic shifting of spectral colors across the stone\'s surface. No two opals are alike.',
    geologicalBackground: 'Opal is formed from silica spheres that scatter light in different wavelengths, creating the play-of-color effect. Australia produces over 90% of the world\'s precious opal.',
    symbolism: 'Ancient Romans considered opal the most precious of all gemstones, calling it "opalus" — a gem containing all gems. Aboriginal Australians believed the Creator descended to earth on an opal rainbow.',
    emotionalProperties: 'Opal amplifies emotions and helps release inhibitions. It encourages both freedom and independence. It brings originality and creativity.',
    energeticProperties: 'Opal is a stone of inspiration — it enhances imagination and creativity, and brings flashes of intuition. It absorbs and reflects the energy of its wearer.',
    spiritualAssociations: 'Associated with the Crown chakra and spiritual realms. Amplifies psychic abilities. Used in vision quests and shamanic journeys across many traditions.',
    chakra: 'Crown · All',
    zodiacSign: ['Cancer', 'Libra', 'Scorpio', 'Pisces'],
    planet: 'Neptune',
    element: 'Water / Fire',
    careInstructions: 'Store in a damp cloth or with a small vial of water to prevent cracking. Avoid extreme temperature changes. Clean only with a soft, damp cloth. Avoid ultrasonic cleaners.',
    isFeatured: true
  },
  {
    name: 'Pyrite', slug: 'pyrite', color: 'Metallic golden yellow',
    mohs: 6, origin: 'Spain, Italy, Peru, Russia',
    description: 'Pyrite, known as "fool\'s gold" for its striking metallic luster, is one of the most mesmerizing minerals in the world. Its cubic crystal structure and brilliant gold surface have fascinated humans throughout history.',
    geologicalBackground: 'Pyrite (iron disulfide) is one of the most common sulfide minerals. It forms in cubic crystal structures, often with striated faces. The name comes from the Greek word for fire, as it creates sparks when struck.',
    symbolism: 'Despite its nickname, pyrite has been valued for its own remarkable properties. The ancient Incas used polished pyrite as mirrors for scrying. It was prized for its ability to start fires — a profound symbol of power.',
    emotionalProperties: 'Pyrite encourages confidence, assertiveness, and strength. It helps overcome feelings of inadequacy and stimulates flow of ideas. It promotes positive thinking.',
    energeticProperties: 'Pyrite is a powerful protection stone and shields against negative energies. It attracts abundance and supports manifestation. It activates the Solar Plexus chakra and enhances willpower.',
    spiritualAssociations: 'Associated with the Solar Plexus chakra. Connected to the element of Fire and the planet Mars. Used in shamanic practices as a mirror for the spirit world.',
    chakra: 'Solar Plexus',
    zodiacSign: ['Leo'],
    planet: 'Mars',
    element: 'Fire / Earth',
    careInstructions: 'Keep dry — pyrite can rust when exposed to moisture. Clean with a soft, dry cloth only. Store separately. Do not use in elixirs.',
    isFeatured: true
  },
  {
    name: 'Rose Quartz', slug: 'rose-quartz', color: 'Soft pink to rose',
    mohs: 7, origin: 'Brazil, Madagascar, South Africa',
    description: 'Rose quartz, the quintessential stone of love, carries a soft, gentle energy that speaks directly to the heart. Its delicate pink hue — caused by trace amounts of titanium, iron, and manganese — embodies unconditional love.',
    geologicalBackground: 'Rose quartz is a macrocrystalline variety of quartz. Unlike other quartz varieties, it rarely forms distinct crystals and usually occurs in massive form. The finest rose quartz comes from Brazil and Madagascar.',
    symbolism: 'In ancient Greece and Rome, rose quartz was used in love rituals and as a beauty treatment. Egyptian women used rose quartz face masks, believing it prevented aging. It has always been the stone of the heart.',
    emotionalProperties: 'The stone of unconditional love — it opens the heart to all forms of love, promotes self-love, deep inner healing, and feelings of peace. It is the essential stone for anyone on a healing journey.',
    energeticProperties: 'Rose quartz opens, clears, and nurtures the heart chakra. It radiates a soft, feminine energy of compassion, peace, and tenderness. It attracts love in all forms.',
    spiritualAssociations: 'Sacred to Aphrodite and Venus. Connected to the Heart chakra. Promotes forgiveness, self-acceptance, and the opening of the heart to receive love.',
    chakra: 'Heart',
    zodiacSign: ['Taurus', 'Libra'],
    planet: 'Venus',
    element: 'Earth / Water',
    careInstructions: 'Clean with warm soapy water. Avoid harsh chemicals. Recharge under moonlight or in sunlight for a short time. Cleanse regularly as it absorbs emotional energy.',
    isFeatured: false
  },
  {
    name: "Tiger's Eye", slug: "tiger's-eye", color: 'Golden brown with chatoyancy',
    mohs: 7, origin: 'South Africa, Western Australia, India',
    description: "Tiger's eye is a captivating stone that displays a remarkable optical phenomenon called chatoyancy — a shifting band of light that glides across the surface like the slit pupil of a tiger's eye.",
    geologicalBackground: "Tiger's eye is a metamorphic rock composed of quartz pseudomorphously after crocidolite (blue asbestos). The silky luster is created by parallel strands of fibrous crocidolite that have been replaced by quartz.",
    symbolism: 'In ancient Egypt, tiger\'s eye was used to represent divine vision and was embedded in the eyes of deity statues to express divine vision. Roman soldiers wore it to be invincible in battle.',
    emotionalProperties: 'Grounds scattered energy and brings calmness to anxiety. Promotes clear thinking, integrity, and the courage to accomplish goals. Helps resolve inner conflicts.',
    energeticProperties: "Tiger's eye combines the earth energy with the energies of the sun. It creates a high vibrational state while keeping one grounded. Excellent for overcoming fear and taking action.",
    spiritualAssociations: 'Associated with the Solar Plexus and Sacral chakras. Connected to the Sun and Earth energies. Used in meditation for grounding and for protection during journeys.',
    chakra: 'Solar Plexus · Sacral · Root',
    zodiacSign: ['Leo', 'Capricorn'],
    planet: 'Sun',
    element: 'Earth / Fire',
    careInstructions: 'Clean with warm soapy water. Avoid harsh chemicals. Safe to recharge in sunlight.',
    isFeatured: false
  },
  {
    name: 'Lapis Lazuli', slug: 'lapis-lazuli', color: 'Deep blue with gold pyrite flecks',
    mohs: 5.5, origin: 'Afghanistan, Russia, Chile, Myanmar',
    description: 'Lapis lazuli — one of the oldest spiritual stones in human history — has been used since antiquity for its deep blue color and gold flecks that resemble a starry night sky. For over 6,000 years, it has been prized above all else.',
    geologicalBackground: 'Lapis lazuli is a metamorphic rock composed primarily of lazurite, calcite, and pyrite. The world\'s finest lapis comes from the Sar-i Sang mines in Afghanistan, which have been mined continuously for 6,000 years.',
    symbolism: 'In ancient Egypt, lapis lazuli was reserved for royalty and the divine. Tutankhamun\'s death mask was inlaid with lapis. The stone was ground into ultramarine — the most precious blue pigment used in Renaissance paintings, including Vermeer\'s work.',
    emotionalProperties: 'Lapis lazuli promotes honesty, compassion, and self-awareness. It encourages dignity in friendship and social ability, releasing stress and bringing deep peace.',
    energeticProperties: 'One of the most powerful stones for activating the higher mind and enhancing intellectual ability. It stimulates wisdom and good judgment. Recognized as a stone of truth.',
    spiritualAssociations: 'Sacred to many ancient cultures. Associated with the Third Eye and Throat chakras. Used in ritual and ceremony across Egypt, Mesopotamia, and the Indus Valley.',
    chakra: 'Third Eye · Throat',
    zodiacSign: ['Taurus', 'Virgo', 'Libra', 'Sagittarius'],
    planet: 'Jupiter',
    element: 'Water',
    careInstructions: 'Clean with a damp cloth only. Avoid acids, hot water, and ultrasonic cleaners. Do not soak in water. Keep away from household chemicals.',
    isFeatured: false
  },
  {
    name: 'Garnet', slug: 'garnet', color: 'Deep red to burgundy',
    mohs: 6.5, origin: 'India, Africa, Sri Lanka, Russia, USA',
    description: 'Garnet, one of the oldest and most precious gemstones known to humanity, has been used as a gemstone and abrasive since the Bronze Age. While most associated with deep red, garnet actually occurs in nearly every color.',
    geologicalBackground: 'Garnet is not a single mineral but a group of related silicate minerals. The most common variety is almandine (red garnet). Garnets are found in metamorphic rocks around the world.',
    symbolism: 'Throughout history, garnet has been considered a stone of safe travel. Crusaders set it in their weapons as protection. In ancient Egypt, it was used as inlay in jewelry. It was widely traded along the Silk Road.',
    emotionalProperties: 'Garnet revitalizes, purifies, and balances energy. It inspires love and devotion, stimulates the senses, and increases vitality. It alleviates emotional disharmony.',
    energeticProperties: 'Garnet is a powerful energizing and regenerating stone. It activates and strengthens the survival instinct, bringing courage and hope. It grounds spiritual forces into the physical plane.',
    spiritualAssociations: 'Associated with the Root and Sacral chakras. Connected to the planet Mars. Used in shamanic work for protection and grounding.',
    chakra: 'Root · Sacral',
    zodiacSign: ['Aries', 'Leo', 'Virgo'],
    planet: 'Mars',
    element: 'Fire',
    careInstructions: 'Clean with warm soapy water. Safe for ultrasonic cleaning in most cases. Avoid steam cleaning and sudden temperature changes.',
    isFeatured: false
  },
  {
    name: 'Labradorite', slug: 'labradorite', color: 'Gray-green with iridescent flash',
    mohs: 6.5, origin: 'Canada, Madagascar, Finland, Russia',
    description: 'Labradorite is a stone of mystery and magic — its most extraordinary feature is its labradorescence, an optical phenomenon that displays stunning flashes of blue, green, yellow, and gold across its dark surface.',
    geologicalBackground: 'Labradorite is a feldspar mineral discovered in Labrador, Canada in 1770. Its labradorescence is caused by light refracting between twinned crystal layers.',
    symbolism: 'The Inuit people believed labradorite fell from the frozen fire of the Aurora Borealis. Finnish Lapps called it "Spectrolite." Myths describe warriors shooting frozen fire into the rocks, creating labradorite\'s magical colors.',
    emotionalProperties: 'Labradorite calms an overactive mind and brings peace. It relieves anxiety and stress. It dispels illusions, going to the root of a matter and showing the real intention behind thoughts and actions.',
    energeticProperties: 'Labradorite is the most powerful protector in the mineral kingdom. It creates a shielding force throughout the aura and strengthens natural energies. It banishes fears and insecurities.',
    spiritualAssociations: 'Associated with the Third Eye chakra. A stone of magic, awakening the mystical and magical powers within. Used extensively in shamanic work and spiritual practices.',
    chakra: 'Third Eye · Crown',
    zodiacSign: ['Leo', 'Scorpio', 'Sagittarius'],
    planet: 'Uranus',
    element: 'Water / Wind',
    careInstructions: 'Clean with warm soapy water. Avoid harsh chemicals. Handle with care as it can cleave along crystal planes.',
    isFeatured: false
  }
];

const COLLECTIONS = [
  {
    name: 'Vita Nuova',
    slug: 'vita-nuova',
    subtitle: 'The New Life',
    inspirationType: 'person',
    inspiration: 'Dante Alighieri',
    era: 'Italian Renaissance',
    storyIntroduction: 'Vita Nuova — The New Life — is Dante\'s testament to the transformative power of love. Written between 1292 and 1295, it chronicles his profound love for Beatrice, a woman he met at age nine and loved until her death at twenty-four. This collection captures that eternal, transcendent love — expressed through emerald, representing eternal spring and the renewal of the soul, and gold, speaking of divinity.',
    historicalBackground: 'Dante Alighieri (1265–1321) is considered the father of the Italian language and one of the greatest poets in world literature. His Vita Nuova, written in the years following Beatrice\'s death, weaves together poetry and prose to describe a love that transcended the earthly realm — a love that would later inspire The Divine Comedy.',
    emotionalMeaning: 'Every piece in this collection speaks of the moment when love transforms us — when we glimpse something eternal in another person and understand that life has a new meaning. Like Dante\'s vision of Beatrice, these pieces carry the weight of profound, transformative feeling.',
    gemstoneConnection: 'Emerald — the stone of Venus, goddess of love — was chosen for its connection to eternal spring and the renewal of the heart. Its deep green vibration resonates with the Heart chakra, the center of unconditional love that Dante\'s poetry embodies.',
    quote: 'In that book which is my memory, on the first page of the chapter that is the day when I first met you, appear the words: Here begins a new life.',
    quoteAuthor: 'Dante Alighieri, Vita Nuova',
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: 'Wuthering Heights',
    slug: 'wuthering-heights',
    subtitle: 'The Wild Passion',
    inspirationType: 'literature',
    inspiration: 'Emily Brontë',
    era: 'Victorian England',
    storyIntroduction: 'Emily Brontë\'s Wuthering Heights (1847) is one of literature\'s most powerful explorations of obsessive love, social class, and the raw, uncontrollable force of passion. Set against the wild Yorkshire moors — harsh, beautiful, and indifferent — the love between Heathcliff and Catherine transcends time, death, and social convention.',
    historicalBackground: 'Published in 1847 under the pseudonym Ellis Bell, Wuthering Heights was controversial upon its release for its dark themes and unconventional morality. Emily Brontë wrote it in the isolation of Haworth Parsonage, drawing inspiration from the wild moors that surrounded her.',
    emotionalMeaning: 'This collection captures the untamed, almost savage beauty of emotions that refuse to be civilized — the love that does not ask permission, the longing that outlasts life itself. These pieces are for those who feel deeply, who carry landscapes within them.',
    gemstoneConnection: 'Amethyst — deep violet, mysterious, and spiritually charged — mirrors the moors at twilight. Its energy of spiritual depth and emotional protection resonates with the fierce, protective love that defined Heathcliff and Catherine\'s bond.',
    quote: 'He\'s more myself than I am. Whatever our souls are made of, his and mine are the same.',
    quoteAuthor: 'Emily Brontë, Wuthering Heights',
    isFeatured: true,
    sortOrder: 2
  },
  {
    name: 'Queen Victoria',
    slug: 'queen-victoria',
    subtitle: 'Mourning & Majesty',
    inspirationType: 'person',
    inspiration: 'Queen Victoria',
    era: 'Victorian Era (1837–1901)',
    storyIntroduction: 'Queen Victoria\'s reign defined an era. Her profound love for Prince Albert, and her devastation at his death in 1861 — after which she wore mourning dress for the remaining forty years of her life — created the elaborate Victorian tradition of mourning jewelry. This collection explores the intersection of grief, love, and the beauty that emerges from both.',
    historicalBackground: 'Queen Victoria reigned for sixty-three years, making her one of the longest-reigning British monarchs. Her personal style and emotional authenticity — particularly her public mourning for Albert — profoundly influenced the jewelry aesthetics of her era. Mourning jewelry, typically in jet or onyx, became fashionable across the British Empire.',
    emotionalMeaning: 'This collection speaks to the courage required to love deeply — knowing that love makes us vulnerable to loss. But also to the beauty that can emerge from grief, and the way love persists beyond death.',
    gemstoneConnection: 'Onyx — black, mysterious, and protective — has been used in mourning jewelry for centuries. Its energy provides strength in difficult times and absorbs and transforms negative energy.',
    quote: 'I am most anxious to enlist everyone who can speak or write to join in checking this mad, wicked folly of "Women\'s Rights."',
    quoteAuthor: 'Queen Victoria',
    isFeatured: true,
    sortOrder: 3
  },
  {
    name: 'La Serenissima',
    slug: 'la-serenissima',
    subtitle: 'Venice — The Most Serene Republic',
    inspirationType: 'city',
    inspiration: 'Venice, Italy',
    era: 'Renaissance Venice (15th–16th century)',
    storyIntroduction: 'Venice — La Serenissima, The Most Serene Republic — is one of the most beautiful cities ever created by human hands. Built on water, defying the laws of reason, Venice has inspired artists, poets, and dreamers for centuries. Its light — the way it reflects off the water, shifting between gold and silver throughout the day — is unlike any other light on earth.',
    historicalBackground: 'At its height in the 15th and 16th centuries, Venice was the wealthiest and most powerful city-state in Europe. Its trade routes connected East and West, bringing silk, spices, and precious stones — including aquamarine and turquoise — from across the known world.',
    emotionalMeaning: 'There is a particular quality to love that happens in Venice — it feels both eternal and ephemeral, like the reflections on the lagoon. This collection captures that feeling: the beauty of impermanence, the luxury of the present moment, the way light transforms everything it touches.',
    gemstoneConnection: 'Aquamarine — the color of the Venetian lagoon at dawn — was chosen to evoke the water that is Venice\'s very essence. Its energy of serenity, clarity, and flow mirrors the feeling of moving through Venice by gondola at sunrise.',
    quote: 'I stood in Venice, on the Bridge of Sighs; A palace and a prison on each hand.',
    quoteAuthor: 'Lord Byron, Childe Harold\'s Pilgrimage',
    isFeatured: true,
    sortOrder: 4
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        firstName: 'Lumaris',
        lastName: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@lumaris.com',
        password: 'LumarisAdmin2024!',
        role: 'admin',
        isEmailVerified: true
      });
      console.log('✓ Admin user created');
      console.log('  Email:', process.env.ADMIN_EMAIL || 'admin@lumaris.com');
      console.log('  Password: LumarisAdmin2024! (CHANGE THIS)');
    }

    // Seed gemstones
    for (const gem of GEMSTONES) {
      await Gemstone.findOneAndUpdate({ slug: gem.slug }, gem, { upsert: true, new: true });
      console.log(`✓ Gemstone: ${gem.name}`);
    }

    // Seed collections
    for (const col of COLLECTIONS) {
      await Collection.findOneAndUpdate({ slug: col.slug }, col, { upsert: true, new: true });
      console.log(`✓ Collection: ${col.name}`);
    }

    console.log('\n✓ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedDatabase();
