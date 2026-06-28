import { CMSData } from './types';

export const DEFAULT_IMAGES = {
  designerWorkspace: '/src/assets/images/designer_workspace_1782307686622.jpg',
  mangaShonen: '/src/assets/images/comic_manga_shonen_1782307702361.jpg',
  cyberpunk: '/src/assets/images/comic_cyberpunk_1782307718573.jpg',
  fantasy: '/src/assets/images/comic_fantasy_1782307735870.jpg',
  studioTeam: '/src/assets/images/studio_team_discussion_1782312722466.jpg',
  
  sketch1: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600',
  sketch2: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600',
  sketch3: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600',
  sketch4: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
  sketch5: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=600',
  sketch6: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600',
};

export const INITIAL_CMS_DATA: CMSData = {
  navigation: {
    logoText: 'KAIJU',
    logoSubtext: 'STUDIOS',
    links: [
      { label: 'Home', page: 'home' },
      { label: 'Portfolio', page: 'portfolio' },
      { label: 'Studio', page: 'studio' },
      { label: 'Blog', page: 'blog' },
      { label: 'Contact', page: 'contact' },
    ],
  },
  hero: {
    badge: 'WORLD-CLASS CREATIVE SEQUENTIAL AGENCY',
    title: 'COMIC ART STUDIO',
    subtitle: 'Crafting ultra-premium manga, webtoons, and graphic novels for high-end international publishers, global brands, and independent visionary creators.',
    bgGradientType: 'cinematic',
    bgGradientColor1: '#0a0a0a',
    bgGradientColor2: '#1a1a1a',
    bgGradientColor3: '#111111',
    buttons: [
      { id: 'btn-1', text: 'Book a Strategy Call', url: '#contact', style: 'primary' },
      { id: 'btn-2', text: 'View Studio Portfolio', url: '#portfolio', style: 'secondary' }
    ],
    backgroundImage: '/src/assets/images/cinematic_hero_gradient_1782310250120.jpg',
    bgSelection: 'generated',
    uploadedBackgroundImage: '',
    starfield: {
      numStars: 22,
      speed: 0.4,
      minSize: 0.8,
      maxSize: 1.8,
      brightness: 1.0,
      glowIntensity: 0,
      accentColor: '#ffffff',
      enableHover: false,
    },
  },
  showcase: {
    panel1: {
      media: [
        { id: 'm-sc-1', url: DEFAULT_IMAGES.mangaShonen, type: 'image' },
        { id: 'm-sc-2', url: DEFAULT_IMAGES.sketch1, type: 'image' },
        { id: 'm-sc-3', url: DEFAULT_IMAGES.sketch2, type: 'image' }
      ],
      speed: 3,
      enabled: true,
    },
    panel2: {
      media: [
        { id: 'm-sc-4', url: DEFAULT_IMAGES.cyberpunk, type: 'image' },
        { id: 'm-sc-5', url: DEFAULT_IMAGES.sketch3, type: 'image' },
        { id: 'm-sc-6', url: DEFAULT_IMAGES.sketch4, type: 'image' }
      ],
      speed: 2.5,
      enabled: true,
    },
    panel3: {
      media: [
        { id: 'm-sc-7', url: DEFAULT_IMAGES.fantasy, type: 'image' },
        { id: 'm-sc-8', url: DEFAULT_IMAGES.sketch5, type: 'image' },
        { id: 'm-sc-9', url: DEFAULT_IMAGES.sketch6, type: 'image' }
      ],
      speed: 3.5,
      enabled: true,
    },
  },
  services: {
    keywords: [
      'Storyboarding',
      'Character Design',
      'Graphic Novels',
      'Manga Creation',
      'Visual Development',
      'Comic Production',
      'World Building',
    ],
    speed: 15,
    enabled: true
  },
  portfolio: {
    categories: ['Manga', 'Manhwa', 'American Comics', 'Character Design', 'Visual Development'],
    projects: [
      {
        id: 'proj-1',
        title: 'Shingeki no Legend',
        slug: 'shingeki-no-legend',
        category: 'Manga',
        tag: 'Shonen',
        image: DEFAULT_IMAGES.mangaShonen,
        description: 'An intense action battle saga featuring high-contrast hand-drawn combat sequences and dramatic page spreads.',
        longDescription: 'This project represents our premier shonen production capability. Working directly with Japanese publishers, we created an entire physical volume run of 200 pages. Every chapter is designed around extreme kinetic impact, heavy black inks, and a rigorous panel-to-panel flow that guides readers seamlessly through intense multi-opponent battle scenes.',
        client: 'Tokyo Publishing Corp',
        year: '2025',
        tags: ['Shonen', 'Action', 'Samurai', 'Traditional Ink'],
        galleryImages: [DEFAULT_IMAGES.mangaShonen, DEFAULT_IMAGES.sketch1, DEFAULT_IMAGES.sketch2],
        seoTitle: 'Shingeki no Legend Manga - Premium Action Sequel Work | Kaiju Studios',
        seoDescription: 'Explore the high-contrast battle scenes, traditional ink detailing, and meticulous storyboard layout developed for Shingeki no Legend.',
        seoKeywords: 'manga art, traditional ink, shonen, storyboard, action comics',
        tools: ['Traditional Ink', 'Clip Studio Paint', 'Pentel Brush Pen'],
        visualDetails: [
          'High-speed physical combat sequences using meticulous ink speed lines.',
          'Intense dual-spread panels featuring complex perspective background detail.',
          'Custom handcrafted brush texturing for visceral action impact.'
        ]
      },
      {
        id: 'proj-2',
        title: 'Neo-Tokyo Ingress',
        slug: 'neo-tokyo-ingress',
        category: 'American Comics',
        tag: 'Cyberpunk',
        image: DEFAULT_IMAGES.cyberpunk,
        description: 'A premium neo-noir detective graphic novel illustrated in a hybrid western-eastern high-shadow aesthetic.',
        longDescription: 'Neo-Tokyo Ingress is a fully colored, cinematic western-format graphic novel. Inspired by iconic cyber-thrillers and classic 1940s detective movies, we focused heavily on negative space and heavy cast shadows. We integrated custom digital halftone patterns and extreme color grading to make every scene feel atmospheric and dangerous.',
        client: 'Dark Horizon Press',
        year: '2026',
        tags: ['Cyberpunk', 'Sci-Fi', 'Detective', 'Colors'],
        galleryImages: [DEFAULT_IMAGES.cyberpunk, DEFAULT_IMAGES.sketch3, DEFAULT_IMAGES.sketch4],
        seoTitle: 'Neo-Tokyo Ingress - Cyberpunk Graphic Novel Art | Kaiju Studios',
        seoDescription: 'Case file review of Neo-Tokyo Ingress, an atmospheric high-contrast cyberpunk detective comic designed by Kaiju Studios.',
        seoKeywords: 'cyberpunk comic, halftone shader, neo-noir story, digital inks',
        tools: ['Photoshop CC', 'Wacom Cintiq Pro', 'Custom halftone brushes'],
        visualDetails: [
          'Heavy film-noir shadows blended with glowing accent neon colors.',
          'Highly detailed urban cyberpunk environment layout.',
          'Cinematic widescreen aspect panel layout mimicking 35mm film shots.'
        ]
      },
      {
        id: 'proj-3',
        title: 'The Fallen Keepsake',
        slug: 'the-fallen-keepsake',
        category: 'Visual Development',
        tag: 'Fantasy',
        image: DEFAULT_IMAGES.fantasy,
        description: 'Atmospheric environmental key art and concept development for an award-winning dark gothic fantasy saga.',
        longDescription: 'A comprehensive world-building assignment containing environment keys, character design guides, and mood paints. We designed key locations, legendary weapons, and regional outfits to define the dark, decaying high-fantasy aesthetic prior to comic production.',
        client: 'Epic Myth Games',
        year: '2025',
        tags: ['Fantasy', 'Gothic', 'Concept Art', 'Landscape'],
        galleryImages: [DEFAULT_IMAGES.fantasy, DEFAULT_IMAGES.sketch5, DEFAULT_IMAGES.sketch6],
        seoTitle: 'The Fallen Keepsake Dark Fantasy Visual Dev | Kaiju Studios',
        seoDescription: 'Explore the atmospheric gothic key art, architectural layouts, and creature design guidelines for The Fallen Keepsake.',
        seoKeywords: 'fantasy art, visual development, procreate sketch, gothic concept',
        tools: ['iPad Pro', 'Procreate', 'Charcoal brushes'],
        visualDetails: [
          'Gothic landscape layouts showcasing towering ruins and intricate architectural crosshatching.',
          'Moody monochromatic tonal shifts conveying existential dread.',
          'Symbolic character designs integrated seamlessly into the scenery.'
        ]
      },
      {
        id: 'proj-4',
        title: 'Ascension Leveling',
        slug: 'ascension-leveling',
        category: 'Manhwa',
        tag: 'Action',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600',
        description: 'A scrolling web-comic optimized for mobile screens, emphasizing vibrant cell shading and spectacular magic visual effects.',
        longDescription: 'Ascension Leveling is a modern webtoon produced fully in digital color. It features ultra-clean lineart, vibrant dynamic colors, and cinematic vertical action sequences where characters jump down from massive heights across continuous flowing frames.',
        client: 'Line-Toons Global',
        year: '2026',
        tags: ['Manhwa', 'Webtoon', 'Action', 'Vibrant'],
        galleryImages: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600', DEFAULT_IMAGES.sketch1],
        tools: ['Clip Studio Paint EX', 'Huion Kamvas', 'Vector line stabilization'],
        visualDetails: [
          'Infinite scroll layout flow with dynamic vertical panel spacing.',
          'Vibrant high-contrast lightning and energy particle effects.',
          'Sleek modern protagonist designs with signature stylized outfits.'
        ]
      },
      {
        id: 'proj-5',
        title: 'Vanguard Protocol',
        slug: 'vanguard-protocol',
        category: 'Character Design',
        tag: 'Sci-Fi',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
        description: 'Full aesthetic development, orthographic model sheets, and custom outfit permutations for a futuristic armored squad.',
        longDescription: 'Character model sheets detailing physical heights, weapon designs, and color-blocking schemes for a high-tech armored infantry unit. We optimized the armored shapes to maintain visual interest while keeping the design rapid to reproduce.',
        client: 'Anima Interactive',
        year: '2024',
        tags: ['Sci-Fi', 'Armored', 'Mecha', 'Model Sheet'],
        galleryImages: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600', DEFAULT_IMAGES.sketch3],
        tools: ['Photoshop', 'Traditional pencil draft', 'ZBrush blocking'],
        visualDetails: [
          'Meticulous mechanical articulation details on exoplanetary armor suits.',
          'Distinct facial silhouette profiling to ensure strong character readability.',
          'Detailed material render sheets highlighting carbon fiber, matte metal, and glass.'
        ]
      },
      {
        id: 'proj-6',
        title: 'Demon Core Chronicle',
        slug: 'demon-core-chronicle',
        category: 'Manga',
        tag: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600',
        description: 'Dark shonen manga detailing ancient folklore-inspired battles with massive ink wash backgrounds.',
        longDescription: 'A classic samurai horror fantasy story. Rendered entirely in physical ink and screen tones on Kent paper. We fused traditional wash textures with high-contrast inks to create an eerie, raw folklore world.',
        client: 'Gekkan Manga',
        year: '2026',
        tags: ['Manga', 'Samurai', 'Traditional Ink', 'Horror'],
        galleryImages: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600', DEFAULT_IMAGES.sketch5],
        tools: ['Deleter Manga Ink', 'Maru Pen G-pen', 'Sumie Ink wash'],
        visualDetails: [
          'Authentic Sumi-e ink washes applied to giant creature summon designs.',
          'Detailed speed lines indicating extreme momentum and force impact.',
          'Hand-drawn typography for custom spell chants.'
        ]
      }
    ],
  },
  inquiry: {
    designerImage: DEFAULT_IMAGES.designerWorkspace,
    title: 'START A PROJECT',
    subtitle: 'Looking to turn an epic vision into custom artwork, a serialized graphic novel, or high-fidelity character sheets? Pitch us your universe.',
    badge: '06 // ALIGNMENT CORRIDORS',
    description: 'Ready to bring your intellectual property into definitive physical lines? Fill out the pitch dockets below, or reach out directly to our production deck.',
    emails: [
      { id: 'email-1', label: 'GENERAL INQUIRIES & PITCHES', email: 'contact@kaijustudios.com' }
    ],
    phones: [
      { id: 'phone-1', label: 'STUDIO DIRECT LINE', phone: '+44 20 7946 0192' }
    ],
    hours: [
      { id: 'hr-1', days: 'Monday - Friday', hours: '10:00 AM - 7:00 PM EST' },
      { id: 'hr-2', days: 'Saturday', hours: '11:00 AM - 4:00 PM EST' },
      { id: 'hr-3', days: 'Sunday', hours: 'Creative Hiatus', closed: true }
    ],
    address: '42 Shoreditch High St, London, E1 6JJ, United Kingdom',
    fields: [
      { id: 'field-1', label: 'Full Name', type: 'text', placeholder: 'e.g., Brandon Stark', required: true, width: 'half' },
      { id: 'field-2', label: 'Email Address', type: 'email', placeholder: 'e.g., brandon@winterfell.com', required: true, width: 'half' },
      { id: 'field-3', label: 'Project Category', type: 'select', placeholder: 'Select a project category', required: true, options: ['Manga Serial', 'Manhwa Webtoon', 'American Graphic Novel', 'Character Design / Concepts', 'Other Custom Illustration'], width: 'full' },
      { id: 'field-4', label: 'Project Budget Range', type: 'select', placeholder: 'Estimate your production budget', required: true, options: ['$2,500 - $5,000', '$5,000 - $15,000', '$15,000 - $50,000', '$50,000+'], width: 'full' },
      { id: 'field-5', label: 'Brief Narrative Pitch / Scope', type: 'textarea', placeholder: 'Describe your world, key characters, script status, and any specific deadlines...', required: true, width: 'full' }
    ]
  },
  process: {
    title: 'CREATIVE WORKFLOW',
    subtitle: 'Our battle-tested pipeline ensures world-class illustrative execution from preliminary script to finalized high-resolution press delivery.',
    steps: [
      {
        id: 'step-1',
        stepNumber: '01',
        title: 'Discovery & Narrative Alignment',
        description: 'We breakdown your scripts, outlines, and character references to align on style direction, page limits, panel layouts, and cultural vibes.'
      },
      {
        id: 'step-2',
        stepNumber: '02',
        title: 'Storyboarding & Name Stage',
        description: 'Rough thumbnail sketches (Nemutai/Name stage) are designed to map narrative tempo, camera lens dynamics, readable speech bubbles, and raw panel impact.'
      },
      {
        id: 'step-3',
        stepNumber: '03',
        title: 'Penciling & Concept Refining',
        description: 'We draft high-fidelity anatomical outlines and environment mockups. Character model sheets are finalized and locked in from all core view angles.'
      },
      {
        id: 'step-4',
        stepNumber: '04',
        title: 'Inking & Halftone Texturing',
        description: 'The definitive creative step. We draw ultra-crisp digital or physical ink contours, laying down screen tones, crosshatching, or dynamic cell-shading.'
      },
      {
        id: 'step-5',
        stepNumber: '05',
        title: 'Formatting & Speech Lettering',
        description: 'Panels are customized for printing or scrolling webtoon containers. Clean custom-licensed typography, balloon trails, and SFX lettering are perfectly integrated.'
      },
      {
        id: 'step-6',
        stepNumber: '06',
        title: 'Refinement & Master Delivery',
        description: 'Rigorous color grading and pre-press inspection. High-resolution multi-layer master files are delivered ready for instant distribution, publication, or printing.'
      }
    ]
  },
  metrics: {
    featuredImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200',
    stats: [
      { id: 'stat-1', label: 'Projects Delivered', value: 180, suffix: '+' },
      { id: 'stat-2', label: 'Active Clients', value: 42, suffix: '' },
      { id: 'stat-3', label: 'Countries Served', value: 15, suffix: '+' },
      { id: 'stat-4', label: 'Average Rating', value: 4.9, suffix: '' },
      { id: 'stat-5', label: 'Returning Clients', value: 94, suffix: '%' }
    ]
  },
  blog: {
    categories: ['Industry Insights', 'Comic Production', 'Storytelling', 'Character Design', 'Manga', 'Studio Updates', 'Tutorials'],
    tags: ['crosshatching', 'inking', 'screentones', 'techniques', 'webtoons', 'scrolling', 'layouts', 'mobile', 'outfits', 'silhouette', 'character-design', 'protagonist'],
    articles: [
      {
        id: 'blog-1',
        title: 'The Art of Black & White Crosshatching in Comic Production',
        excerpt: 'Delve deep into manual pen shading techniques and digital screen-toning to add maximum depth, grit, and drama to your manga spreads.',
        content: `Manga and black-and-white comic production rely heavily on line weight, contrast, and texturing to convey shadows, materials, and mood without the aid of a color palette.

### 1. The G-Pen: The Standard of High Impact
The classic Japanese G-pen remains the champion of dramatic dynamic lines. It is incredibly responsive to downward hand pressure, letting you transition from hairline details to deep, heavy contours in a single continuous stroke.

### 2. The Science of Crosshatching
Hatching is not simply drawing random grids. It is about contour wrap.
- **Directional Lines**: Hatch lines must curve slightly along the form of the muscles or armor to reinforce three-dimensional depth.
- **Gradient Density**: Increase density closer to core shadow boundaries to create smooth, high-contrast values.

### 3. Screen Toning (Halftones)
Halftones mimic physical printed ink dots. Using Clip Studio Paint or Photoshop, keep your halftone frequencies between 50L and 65L. Higher frequencies can cause 'moire patterns' when downscaled on mobile web displays.`,
        date: 'June 18, 2026',
        readTime: '5 min read',
        image: DEFAULT_IMAGES.sketch1,
        author: 'Keiji Sato',
        category: 'Comic Production',
        tags: ['crosshatching', 'inking', 'screentones', 'techniques'],
        seoTitle: 'The Art of Black & White Crosshatching Guide | Kaiju Studios',
        seoDescription: 'Delve deep into professional manga crosshatching, line weights, and digital screen-toning.',
        seoKeywords: 'manga, inking, crosshatching, screentones, layout'
      },
      {
        id: 'blog-2',
        title: 'Infinite Scroll: Crafting Webtoons vs. Traditional Page Layouts',
        excerpt: 'An agency guide to transition from standard landscape panels to seamless vertical mobile scroll layouts without losing cinematic suspense.',
        content: `Webtoon vertical scroll layouts are dominating modern comic consumption. However, designing for an infinite canvas requires a complete paradigm shift in visual storytelling.

### 1. Panel Spacing as a Temporal Controller
In traditional comics, readers scan a page in Z-fashion. In vertical scrolling, panel spacing directly dictates time:
- **Tight gaps (10px - 50px)**: Fast, frantic action.
- **Long gaps (150px - 300px)**: Deep dramatic pauses, heavy silence, or a long fall.

### 2. Gutter Color and Atmosphere
- **White Gutters**: Lighthearted, cheerful, everyday slice-of-life scenes.
- **Black Gutters**: Heavy suspense, mystery, underground cyberpunk alleys, or magical sequences.

### 3. Layering Overlapping Panels
Using transparent overlapping elements (e.g., character hair or magical energy bursting out of panel borders) guides the readers eyes downwards, pulling them further into the story.`,
        date: 'May 14, 2026',
        readTime: '7 min read',
        image: DEFAULT_IMAGES.sketch2,
        author: 'Elena Rostova',
        category: 'Storytelling',
        tags: ['webtoons', 'scrolling', 'layouts', 'mobile'],
        seoTitle: 'Infinite Scroll & Webtoon Layoutsus Design Guide | Kaiju Studios',
        seoDescription: 'Professional studio tips on spacing vertical comic frames to maximize suspension and reader retention.',
        seoKeywords: 'webtoon layout, mobile scrolling, comic suspense, visual story'
      },
      {
        id: 'blog-3',
        title: 'World-Building: Designing Iconic Outfits for Manga Protagonists',
        excerpt: 'Learn how silhouette theory and repetitive emblem design can make your comic characters instantly recognizable from any visual distance.',
        content: `Whether you look at Son Goku, Naruto, or Spider-Man, the most legendary comic characters have one key thing in common: an instantly recognizable silhouette and a distinctive, simple visual identity.

### 1. The Silhouette Test
Can you identify your character purely by their shadow? If their hair, clothing, or companion items do not create a unique silhouette profile, your design is too generic.

### 2. Color Accents & Color Blocking
Keep your main character's design limited to two primary base colors and a single sharp accent. In black-and-white print, this translates to:
- Solid Black blocks
- Clean White blocks
- Distinct Halftone textures or heavy pattern stamps

### 3. Practical Utility
Ensure the characters outfit is quick to draw. If your comic runs for 100 chapters, you will have to draw this outfit thousands of times. Avoid excessive belts, buckles, or hyper-complex patterns that slow down weekly production deadlines.`,
        date: 'April 22, 2026',
        readTime: '4 min read',
        image: DEFAULT_IMAGES.sketch4,
        author: 'Marcus Vance',
        category: 'Character Design',
        tags: ['outfits', 'silhouette', 'character-design', 'protagonist'],
        seoTitle: 'World-Building: Iconic Manga Outfit Design | Kaiju Studios',
        seoDescription: 'Master silhouette theory, color blocking, and drawing speed guidelines for character concept art.',
        seoKeywords: 'character design, manga outfit, silhouette, comic concept art'
      }
    ]
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        quote: 'Kaiju Studios completely re-engineered our gaming franchise concept artwork. Their black-and-white draft ink panels feel like high-end art museum assets. Truly professional in every single revision cycle.',
        author: 'Alistair Sterling',
        role: 'Director of IP Development',
        company: 'Nova Interactive Games',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
      },
      {
        id: 'test-2',
        quote: 'Finding illustrators who understand storyboards, speed line dynamic pressure, and clean layout flow for standard Japanese manga formatting is exceptionally rare. Kaiju is a gold-standard agency.',
        author: 'Yuki Takahashi',
        role: 'Editor-in-Chief',
        company: 'Shogun Manga Bunko',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150'
      },
      {
        id: 'test-3',
        quote: 'Our cyber-thriller webtoon hit over 1.5 million vertical scroll reads on Launch Week. The lettering layout and suspense-spacing Kaiju built kept readers glued page after page.',
        author: 'Sarah Jenkins',
        role: 'Co-Creator',
        company: 'Nexa Comics Platform',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
      }
    ]
  },
  faq: {
    items: [
      {
        id: 'faq-1',
        question: 'What is your typical production timeframe for a single comic issue?',
        answer: 'For a standard 22-page comic book or equivalent 60-panel webtoon, our typical pipeline spans 4 to 6 weeks. This includes thumbnail layouts (1 week), high-fidelity pencils (1-2 weeks), definitive ink renderings (1-2 weeks), and final speech lettering and quality checks (1 week).'
      },
      {
        id: 'faq-2',
        question: 'Do we retain full intellectual property (IP) rights to the final designs?',
        answer: 'Yes. Unless agreed otherwise under special publishing co-ownership, all characters, scripts, panel layouts, and final artwork we produce are delivered to you with 100% full commercial intellectual property rights. We only retain the right to showcase selection layouts in our studio portfolio.'
      },
      {
        id: 'faq-3',
        question: 'Do you work in full color or only in monochrome black and white?',
        answer: 'While our signature studio aesthetic is high-contrast, premium 90% monochrome, we are fully equipped for luxury digital coloring, atmospheric cel-shading, and neon-wash grading, particularly for Manhwa webtoons and cinematic cover art.'
      },
      {
        id: 'faq-4',
        question: 'Can you handle both digital webtoons and traditional print-ready formats?',
        answer: 'Absolutely. We configure our canvas resolutions to at least 600 DPI for print files (TIFF/PSD with CMYK profiles) and build customized scrolling formats (HTML slice, PNG with RGB) optimized for mobile comic platforms like LINE Webtoon or Tapas.'
      },
      {
        id: 'faq-5',
        question: 'Do you offer custom lettering, speech balloon placements, and sound FX drafting?',
        answer: 'Yes. Speech balloon mapping is handled directly in our penciling phase to ensure text never covers vital character action or facial expressions. We offer bespoke sound FX drawing and localized lettering services in multiple languages.'
      }
    ]
  },
  footer: {
    aboutText: 'Kaiju Studios is an elite international sequential creative agency delivering premium manga, concept development, and graphic novels with high-contrast, hand-inked aesthetic precision.',
    email: 'production@kaijustudios.com',
    phone: '+1 (800) 902-KAJU',
    address: 'Creative District, Suite 900, New York, NY 10013',
    copyright: '© 2026 KAIJU STUDIOS. All Rights Reserved.',
    socials: [
      { id: 'soc-instagram', name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com/kaiju_studios', visible: true },
      { id: 'soc-twitter', name: 'X / Twitter', icon: 'Twitter', url: 'https://twitter.com/kaiju_studios', visible: true },
      { id: 'soc-linkedin', name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com/company/kaiju_studios', visible: true },
      { id: 'soc-artstation', name: 'ArtStation', icon: 'Palette', url: 'https://artstation.com/kaiju_studios', visible: true },
      { id: 'soc-behance', name: 'Behance', icon: 'Globe', url: 'https://behance.net/kaiju_studios', visible: true },
      { id: 'soc-dribbble', name: 'Dribbble', icon: 'Figma', url: 'https://dribbble.com/kaiju_studios', visible: true },
      { id: 'soc-pinterest', name: 'Pinterest', icon: 'Pin', url: 'https://pinterest.com/kaiju_studios', visible: false }
    ]
  },
  audio: {
    enabledGlobally: false,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  mediaLibrary: [
    { id: 'lib-1', name: 'Designer Workspace Studio', url: DEFAULT_IMAGES.designerWorkspace, type: 'image', uploadedAt: '2026-06-24' },
    { id: 'lib-2', name: 'Shonen Manga Cover Spread', url: DEFAULT_IMAGES.mangaShonen, type: 'image', uploadedAt: '2026-06-24' },
    { id: 'lib-3', name: 'Cyberpunk Noir Panel Art', url: DEFAULT_IMAGES.cyberpunk, type: 'image', uploadedAt: '2026-06-24' },
    { id: 'lib-4', name: 'Gothic Dark Fantasy Scene', url: DEFAULT_IMAGES.fantasy, type: 'image', uploadedAt: '2026-06-24' },
    { id: 'lib-5', name: 'Creative Tokyo Team Reviews', url: DEFAULT_IMAGES.studioTeam, type: 'image', uploadedAt: '2026-06-24' },
    { id: 'lib-6', name: 'Ink Draft Charcoal Sketch', url: DEFAULT_IMAGES.sketch1, type: 'image', uploadedAt: '2026-06-24' },
    { id: 'lib-7', name: 'Dystopian Mech Concept Sketch', url: DEFAULT_IMAGES.sketch2, type: 'image', uploadedAt: '2026-06-24' }
  ],
  homepageLayout: [
    { id: 'hero', name: 'Hero Header Banner', enabled: true },
    { id: 'showcase', name: 'Comic Showcase Reels', enabled: true },
    { id: 'services', name: 'Moving Keywords Marquee', enabled: true },
    { id: 'portfolio', name: 'Featured Portfolio Grid', enabled: true },
    { id: 'process', name: 'Creative Workflow Pipeline', enabled: true },
    { id: 'metrics', name: 'Studio Achievements & Counter', enabled: true },
    { id: 'testimonials', name: 'Client Testimonials Panel', enabled: true },
    { id: 'faq', name: 'FAQ Accordion Deck', enabled: true },
    { id: 'inquiry', name: 'Start a Project Form', enabled: true }
  ],
  studioPage: {
    bannerImage: DEFAULT_IMAGES.studioTeam,
    headline: 'KAIJU STUDIOS',
    subtitle: 'Founded as an alliance of elite storyboard directors, manga ink specialists, and western pencilers, we bridge high-contrast art-house aesthetic precision with industrial-scale publication output.',
    philosophyTitle: 'A REFUSAL OF REPETITIVE TEMPLATES',
    philosophyText: 'We started Kaiju Studios because we grew tired of sterile, formulaic digital comic styling. The comic industry is experiencing a surge in demand, yet artistic depth is frequently sacrificed for sheer quantity. Our studio approaches every project as a bespoke creative challenge. We construct distinct visual dictionaries for each universe, blending classic Japanese brushwork techniques, heavy western ink washes, and cutting-edge digital post-processing tools. Whether it is an intimate dystopian slice-of-life or a sprawling intergalactic fantasy epic, the art will be unmistakably premium.',
    philosophySubPoints: [
      { title: 'CORE VALUES', desc: 'We believe that strong narrative flow and layout integrity are non-negotiable. Every panel must justify its weight and spacing.', icon: 'Compass' },
      { title: 'STUDIO CULTURE', desc: 'A high-trust collaborative atmosphere where illustrators, inkers, and visual artists experiment with extreme lighting and cinematic lensing.', icon: 'Lightbulb' }
    ],
    values: [
      { id: 'val-1', title: 'ANATOMICAL INTEGRITY & IMPACT', description: 'We believe that powerful visual momentum starts with perfect physical weight. Every dynamic battle pose, atmospheric frame, and subtle expression is grounded in rigorous anatomical drafting.', icon: 'ShieldCheck' },
      { id: 'val-2', title: 'CINEMATIC PANELS & LENSING', description: 'A great comic is a great movie on paper. We utilize advanced cinematography rules—extreme wide-angle layouts, telephoto focal compressions, and Dutch-angle horizons—to control reading momentum.', icon: 'Compass' },
      { id: 'val-3', title: 'THE RITUAL OF RAW INK', description: 'While our pipeline is digital, our soul is hand-drawn. We celebrate the deep contrast, heavy crosshatching, and crisp line weights that have defined sequential storytelling for generations.', icon: 'BookOpen' },
      { id: 'val-4', title: 'SEQUENTIAL PACING DYNAMICS', description: 'The gutter (the blank space between panels) is where the reader\'s imagination works. We masterfully adjust panel shapes and vertical spacing to accelerate action or suspend emotional weight.', icon: 'Users' }
    ],
    ctaTitle: 'HAVE A UNIVERSE TO BUILD?',
    ctaDescription: 'Our storyboard and illustration specialists are ready to collaborate on your serialized manga, webtoon, or character sheets. Let\'s make something outstanding.',
    ctaBtnText: 'View Full Portfolio',
    ctaImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200'
  },
  globalSettings: {
    websiteName: 'STUDIO KAIJU',
    studioName: 'Kaiju Studios',
    appName: 'Kaiju CMS',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '',
    browserTitle: 'STUDIO KAIJU | Premium Comic Art & Manga Agency',
    defaultTimezone: 'GMT+1',
    contactEmail: 'contact@kaijustudios.com',
    contactPhone: '+44 20 7946 0192',
    companyAddress: '42 Shoreditch High St, London, E1 6JJ, United Kingdom',

    // Admin Branding
    adminPanelName: 'Kaiju Administrative Console',
    adminLogoUrl: '',
    adminFaviconUrl: '',

    // Theme Customization
    primaryColor: '#f97316',
    secondaryColor: '#1c1917',
    accentColor: '#f97316',
    backgroundColor: '#0c0a09',
    surfaceColor: '#1c1917',
    textColor: '#ffffff',
    borderColor: '#292524',
    hoverColor: '#ea580c',
    buttonColor: '#f97316',

    // Footer Builder
    footerLogoUrl: '',
    footerTitle: 'STUDIO KAIJU',
    footerDescription: 'A premium production partner specialized in custom sequential art, high-fidelity character design, storyboard blueprints, and cinematic narrative illustration.',
    copyrightText: '© 2026 Studio Kaiju. All rights reserved.',
    footerNewsletterText: 'Stay connected. Subscribe to receive our high-fidelity sequential arts releases, case studies, and studio insights.',

    // Social Media Manager
    socialPlatforms: [
      { id: 'instagram', name: 'Instagram', enabled: true, url: 'https://instagram.com/kaiju', displayName: '@kaijustudios' },
      { id: 'facebook', name: 'Facebook', enabled: false, url: 'https://facebook.com/kaiju' },
      { id: 'twitter', name: 'X (Twitter)', enabled: true, url: 'https://x.com/kaijustudios', displayName: '@kaijustudios' },
      { id: 'linkedin', name: 'LinkedIn', enabled: true, url: 'https://linkedin.com/company/kaiju' },
      { id: 'behance', name: 'Behance', enabled: true, url: 'https://behance.net/kaiju' },
      { id: 'dribbble', name: 'Dribbble', enabled: false, url: 'https://dribbble.com/kaiju' },
      { id: 'pinterest', name: 'Pinterest', enabled: false, url: 'https://pinterest.com/kaiju' },
      { id: 'artstation', name: 'ArtStation', enabled: true, url: 'https://artstation.com/kaiju', displayName: 'ArtStation' },
      { id: 'youtube', name: 'YouTube', enabled: true, url: 'https://youtube.com/kaiju' },
      { id: 'tiktok', name: 'TikTok', enabled: false, url: 'https://tiktok.com/@kaiju' },
      { id: 'whatsapp', name: 'WhatsApp', enabled: false, url: 'https://wa.me/kaiju' },
      { id: 'telegram', name: 'Telegram', enabled: false, url: 'https://t.me/kaiju' },
      { id: 'discord', name: 'Discord', enabled: true, url: 'https://discord.gg/kaiju' },
      { id: 'threads', name: 'Threads', enabled: false, url: 'https://threads.net/kaiju' },
      { id: 'vimeo', name: 'Vimeo', enabled: false, url: 'https://vimeo.com/kaiju' }
    ],

    // SEO Global
    seoTitle: 'STUDIO KAIJU | Premium Comic Art & Manga Agency',
    seoDescription: 'Specialized production agency crafting high-fidelity sequential art, manga boards, storyboard sequences, and bespoke digital illustrations for global entertainment brands.',
    seoKeywords: 'comic art, manga agency, character sheets, storyboarding, anime illustration, webtoons, kaiju studios',
    seoCanonicalUrl: 'https://kaijustudios.com',
    seoOgTitle: 'STUDIO KAIJU | Premium Comic Art & Manga Agency',
    seoOgDescription: 'Specialized production agency crafting high-fidelity sequential art.',
    seoTwitterTitle: 'STUDIO KAIJU | Premium Comic Art & Manga Agency',
    seoTwitterDescription: 'Specialized production agency crafting high-fidelity sequential art.',
    seoOgImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200',
    seoTwitterImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200',
    seoShareImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200',

    // Search Engine Files & Indexing
    seoXmlSitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://kaijustudios.com/</loc>\n    <lastmod>2026-06-26</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>',
    seoRobotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://kaijustudios.com/sitemap.xml',
    seoIndex: true,
    seoFollow: true,
    seoDefaultSchema: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Studio Kaiju",\n  "url": "https://kaijustudios.com",\n  "logo": "https://kaijustudios.com/logo.png"\n}',

    // Page Level Defaults
    pageSeo: {
      home: {
        metaTitle: 'STUDIO KAIJU | Premium Comic Art & Manga Agency',
        metaDescription: 'Specialized production agency crafting high-fidelity sequential art, manga boards, storyboard sequences, and bespoke digital illustrations for global entertainment brands.'
      },
      portfolio: {
        metaTitle: 'Sequential Arts Portfolio | STUDIO KAIJU',
        metaDescription: 'Exquisite curation of manga pages, detailed character sheets, production storyboard sequences, and conceptual illustrations built by Studio Kaiju.'
      },
      studio: {
        metaTitle: 'About Our Production Pipeline | STUDIO KAIJU',
        metaDescription: 'Discover the philosophy, raw ink traditions, and high-fidelity sequential production pipeline behind Studio Kaiju.'
      },
      blog: {
        metaTitle: 'Studio Chronicles & Insights | STUDIO KAIJU',
        metaDescription: 'Deep dives, artistic tutorial essays, production case studies, and updates directly from the creators at Studio Kaiju.'
      },
      contact: {
        metaTitle: 'Pitch Your Creative Universe | STUDIO KAIJU',
        metaDescription: 'Connect with our sequential production leads to organize schedules, receive quote evaluations, and align creative goals.'
      }
    }
  },
  analytics: {
    totalVisitors: 1248,
    todayVisitors: 84,
    weeklyVisitors: 512,
    monthlyVisitors: 1940,
    buttonClicks: 320,
    portfolioViews: 612,
    contactSubmissions: 18,
    bounceRate: 38.4,
    ctr: 4.2,
    countries: [
      { country: 'United Kingdom', visits: 450, percentage: 36 },
      { country: 'United States', visits: 320, percentage: 25 },
      { country: 'Japan', visits: 240, percentage: 19 },
      { country: 'Germany', visits: 138, percentage: 11 },
      { country: 'Other', visits: 100, percentage: 9 }
    ],
    dayLogs: []
  },
  smtpSettings: {
    driver: 'smtp',
    host: 'smtp.hostinger.com',
    port: 465,
    encryption: 'ssl',
    username: 'contact@samcomics.com',
    password: '••••••••',
    fromName: 'Sam Comics Studio',
    fromEmail: 'contact@samcomics.com',
    replyToEmail: 'contact@samcomics.com'
  },
  autoResponseTemplate: "Thank you for contacting us. We've received your enquiry and will get back to you shortly.",
  autoResponseSettings: {
    subject: "Inquiry Received | We'll be in touch shortly",
    htmlBody: "<p>Thank you for reaching out! We have successfully received your project inquiry.</p><p>Our creative production lead will review your concept details and get back to you with alignment coordinates and schedule openings within 24 business hours.</p>",
    plainText: "Thank you for reaching out! We have successfully received your project inquiry. Our creative production lead will review your concept details and get back to you within 24 business hours.",
    companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    companyAddress: "42 Shoreditch High St, London, E1 6JJ, United Kingdom",
    contactInfo: "contact@kaijustudios.com | +44 20 7946 0192",
    footerText: "© 2026 Studio Kaiju. All rights reserved.",
    mode: 'html'
  },
  emailSignatureSettings: {
    companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    companyName: "Studio Kaiju",
    senderName: "Keiji Sato",
    jobTitle: "Production Lead / Creative Director",
    website: "https://kaijustudios.com",
    phoneNumber: "+44 20 7946 0192",
    socialLinks: "Twitter • Instagram • ArtStation",
    senderEmail: "contact@kaijustudios.com",
    officeAddress: "42 Shoreditch High St, London, E1 6JJ, United Kingdom"
  },
  submissions: [
    {
      id: 'sub-1',
      name: 'Bruce Wayne',
      email: 'bruce@waynecorp.com',
      phone: '+1 555-019-2831',
      message: 'Need dynamic dark fantasy designs for an upcoming serialized detective graphic novel series.',
      submittedAt: '2026-06-25T14:24:00Z',
      status: 'new',
      fieldsData: {
        'field-1': 'Bruce Wayne',
        'field-2': 'bruce@waynecorp.com',
        'field-3': 'American Graphic Novel',
        'field-4': '$50,000+',
        'field-5': 'Need dynamic dark fantasy designs for an upcoming serialized detective graphic novel series.'
      },
      uploadedFiles: [
        { name: 'bat_logo_concept.pdf', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', size: 1048576 }
      ],
      replies: [
        {
          id: 'rep-1',
          sender: 'admin',
          message: 'Hello Bruce, we are absolutely thrilled to discuss this Gotham detective aesthetic with you. Our lead storyboard inker Keiji Sato is available for a briefing.',
          sentAt: '2026-06-25T16:00:00Z'
        }
      ]
    },
    {
      id: 'sub-2',
      name: 'Motoko Kusanagi',
      email: 'major@section9.gov.jp',
      phone: '+81 3-5555-0144',
      message: 'Looking to hire storyboard directors for a cyberpunk tactical operations layout.',
      submittedAt: '2026-06-26T09:12:00Z',
      status: 'replied',
      fieldsData: {
        'field-1': 'Motoko Kusanagi',
        'field-2': 'major@section9.gov.jp',
        'field-3': 'Manga Serial',
        'field-4': '$15,000 - $50,000',
        'field-5': 'Looking to hire storyboard directors for a cyberpunk tactical operations layout.'
      },
      uploadedFiles: [],
      replies: [
        {
          id: 'rep-2',
          sender: 'admin',
          message: 'Understood, Major. We have deep expertise in crosshatching, perspective lensing, and dystopian concept panels. I have updated your status.',
          sentAt: '2026-06-26T10:15:00Z'
        }
      ]
    }
  ]
};

const STORAGE_KEY = 'comicart_studio_cms_data_v4';

export function getCMSData(): CMSData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Clean fallback upgrades to handle previous versions seamlessly
      if (!parsed.mediaLibrary) parsed.mediaLibrary = INITIAL_CMS_DATA.mediaLibrary;
      if (!parsed.homepageLayout) parsed.homepageLayout = INITIAL_CMS_DATA.homepageLayout;
      if (!parsed.studioPage) parsed.studioPage = INITIAL_CMS_DATA.studioPage;
      if (!parsed.hero.buttons) parsed.hero.buttons = INITIAL_CMS_DATA.hero.buttons;
      if (!parsed.footer.socials) parsed.footer.socials = INITIAL_CMS_DATA.footer.socials;
      if (!parsed.services.speed) parsed.services.speed = INITIAL_CMS_DATA.services.speed;
      if (parsed.services.enabled === undefined) parsed.services.enabled = INITIAL_CMS_DATA.services.enabled;
      if (!parsed.globalSettings) parsed.globalSettings = INITIAL_CMS_DATA.globalSettings;
      if (!parsed.analytics) parsed.analytics = INITIAL_CMS_DATA.analytics;
      if (!parsed.smtpSettings) parsed.smtpSettings = INITIAL_CMS_DATA.smtpSettings;
      if (!parsed.autoResponseTemplate) parsed.autoResponseTemplate = INITIAL_CMS_DATA.autoResponseTemplate;
      if (!parsed.autoResponseSettings) parsed.autoResponseSettings = INITIAL_CMS_DATA.autoResponseSettings;
      if (!parsed.emailSignatureSettings) parsed.emailSignatureSettings = INITIAL_CMS_DATA.emailSignatureSettings;
      if (!parsed.submissions) parsed.submissions = INITIAL_CMS_DATA.submissions;
      if (parsed.inquiry) {
        if (!parsed.inquiry.emails) parsed.inquiry.emails = INITIAL_CMS_DATA.inquiry.emails;
        if (!parsed.inquiry.phones) parsed.inquiry.phones = INITIAL_CMS_DATA.inquiry.phones;
        if (!parsed.inquiry.hours) parsed.inquiry.hours = INITIAL_CMS_DATA.inquiry.hours;
        if (!parsed.inquiry.address) parsed.inquiry.address = INITIAL_CMS_DATA.inquiry.address;
        if (!parsed.inquiry.badge) parsed.inquiry.badge = INITIAL_CMS_DATA.inquiry.badge;
        if (!parsed.inquiry.description) parsed.inquiry.description = INITIAL_CMS_DATA.inquiry.description;
      } else {
        parsed.inquiry = INITIAL_CMS_DATA.inquiry;
      }
      
      return parsed;
    } catch (e) {
      console.error('Error reading CMS storage data, using defaults', e);
    }
  }
  return INITIAL_CMS_DATA;
}

export function saveCMSData(data: CMSData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('cms_data_updated'));
}

export function resetCMSData(): CMSData {
  saveCMSData(INITIAL_CMS_DATA);
  return INITIAL_CMS_DATA;
}

export async function fetchCMSDataFromServer(): Promise<CMSData> {
  try {
    const res = await fetch('/api/cms-data');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('cms_data_updated'));
      return data;
    }
  } catch (err) {
    try {
      const resFallback = await fetch('/api/cms/get');
      if (resFallback.ok) {
        const data = await resFallback.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('cms_data_updated'));
        return data;
      }
    } catch (e) {
      console.warn('Backend API offline or loading, falling back to local cache', e);
    }
  }
  return getCMSData();
}

export async function saveCMSDataToServer(data: CMSData): Promise<boolean> {
  try {
    const res = await fetch('/goat02/cms-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('cms_data_updated'));
      return true;
    }
  } catch (err) {
    try {
      const resFallback = await fetch('/api/cms/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resFallback.ok) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('cms_data_updated'));
        return true;
      }
    } catch (e) {
      console.error('Error syncing CMS to database', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('cms_data_updated'));
  return false;
}

export async function resetCMSDataOnServer(): Promise<CMSData> {
  try {
    const res = await fetch('/goat02/cms-reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
      window.dispatchEvent(new Event('cms_data_updated'));
      return INITIAL_CMS_DATA;
    }
  } catch (err) {
    try {
      const resFallback = await fetch('/api/cms/reset', { method: 'POST' });
      if (resFallback.ok) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
        window.dispatchEvent(new Event('cms_data_updated'));
        return INITIAL_CMS_DATA;
      }
    } catch (e) {
      console.error('Error resetting CMS on server', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
  window.dispatchEvent(new Event('cms_data_updated'));
  return INITIAL_CMS_DATA;
}
