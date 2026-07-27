export interface Chapter {
  title: string;
  subtitle?: string;
  content: string[];
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorRole?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  dodoProductId?: string;
  rating: number;
  reviewsCount: number;
  pages: number;
  readingTime: string;
  category: string;
  tags: string[];
  badge?: "Bestseller" | "New Release" | "Staff Pick" | "Trending";
  formats: ("PDF" | "EPUB")[];
  pdfUrl?: string;
  epubUrl?: string;
  coverUrl?: string;
  coverStyle: {
    bgGradient: string;
    accentColor: string;
    textColor: string;
    pattern: "minimal" | "geometric" | "editorial" | "architectural" | "abstract";
  };
  synopsis: string;
  sampleChapters: Chapter[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  iconName: string;
  featuredColor: string;
}

export const HERO_COPY_PAIRS = [
  {
    headlineMain: "Buy it. Open it.",
    headlineAccent: "Start reading.",
    subheadline:
      "No shipping wait, no app store downloads. Premium digital books delivered to your browser the second checkout completes.",
  },
  {
    headlineMain: "Your next book,",
    headlineAccent: "unlocked in seconds.",
    subheadline:
      "Read directly in your browser tab or save DRM-free PDF and EPUB files to your personal library forever.",
  },
  {
    headlineMain: "Ebooks, ready the moment",
    headlineAccent: "you buy them.",
    subheadline:
      "An independent digital bookshop built for reader comfort—clean typography, zero physical delay, and complete ownership.",
  },
];

export const VALUE_PROPS_COPY = [
  {
    title: "Instant Access",
    sentence: "The moment your order completes, your book opens immediately in your browser tab with zero shipping delay.",
    badge: "Immediate Access",
  },
  {
    title: "In-Browser Reading",
    sentence: "Enjoy responsive typography, custom font sizes, and dark or sepia themes in any web browser without installing an app.",
    badge: "Zero App Friction",
  },
  {
    title: "Yours to Keep",
    sentence: "Download DRM-free PDF and EPUB files anytime to store on your hard drive or send directly to your Kindle, Kobo, or tablet.",
    badge: "Permanent Ownership",
  },
];

export const HOW_IT_WORKS_COPY = [
  {
    step: "01",
    title: "Browse & Preview",
    sentence: "Explore curated titles and read full sample chapters directly in our browser preview reader before purchasing.",
  },
  {
    step: "02",
    title: "Buy Securely",
    sentence: "Checkout in seconds with one-click payment—no physical address forms or shipping fees required.",
  },
  {
    step: "03",
    title: "Read or Download",
    sentence: "Open your book immediately in your browser tab, or download clean PDF and EPUB files to keep permanently.",
  },
];

export const FAQS_COPY = [
  {
    question: "Which file formats are included with my purchase?",
    answer:
      "Every title includes both DRM-free PDF (optimal for desktop and tablet reading) and EPUB (designed for Kindle, Kobo, and e-ink readers) along with lifetime browser access.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "[Placeholder Policy] We offer a 14-day hassle-free refund window if a title fails to meet your technical or reading expectations—simply email our support team with your order number.",
  },
  {
    question: "Which devices can I read on?",
    answer:
      "Any device with a modern browser—including iPhone, Android, iPad, Mac, and PC—plus e-readers like Kindle, Kobo, and reMarkable via standard EPUB transfer.",
  },
  {
    question: "Can I re-download my books after purchase?",
    answer:
      "Yes, your purchase grants permanent access to re-download your PDF and EPUB files or resume reading in-browser whenever you sign in.",
  },
];

export const FOOTER_NEWSLETTER_CTA =
  "Join The Reader's Edition—a quiet monthly dispatch featuring curated title recommendations, author interviews, and new release notes.";

export const TESTIMONIALS = [
  {
    quote:
      "AIVV Store is what digital reading always should have been. No clunky DRM apps, no physical delivery wait—just crisp typography right in my browser, and a clean EPUB download for my e-reader.",
    author: "David Chen",
    title: "Staff Product Designer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    purchasedBook: "Designing for the Screen",
  },
  {
    quote:
      "I love that I can buy a book on my laptop, start reading instantly in the browser tab during lunch, and then download the PDF to my iPad. Seamless experience.",
    author: "Sarah Jenkins",
    title: "Lead Frontend Engineer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
    purchasedBook: "Systems Thinking for Software Architects",
  },
  {
    quote:
      "The reader interface is stunning. Font sizing, dark mode, sepia mode, clean typography—it feels like holding a luxury printed monograph on screen.",
    author: "Marcus Aurel",
    title: "Tech Lead & Writer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    purchasedBook: "Monetizing Digital Craft",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "tech-code",
    name: "Tech & Code",
    description: "System design, frontend craftsmanship, and software architecture.",
    count: 42,
    iconName: "Code2",
    featuredColor: "from-amber-700 to-amber-900",
  },
  {
    id: "design-creative",
    name: "Design & Creative",
    description: "UI/UX typography, design systems, visual hierarchy, and aesthetics.",
    count: 38,
    iconName: "Palette",
    featuredColor: "from-stone-700 to-stone-900",
  },
  {
    id: "business-strategy",
    name: "Business & Strategy",
    description: "Bootstrapping, product marketing, pricing models, and founder playbooks.",
    count: 51,
    iconName: "TrendingUp",
    featuredColor: "from-emerald-800 to-teal-950",
  },
  {
    id: "mind-philosophy",
    name: "Mind & Philosophy",
    description: "Deep work, decision frameworks, stoicism, and intellectual history.",
    count: 29,
    iconName: "BrainCircuit",
    featuredColor: "from-indigo-900 to-slate-950",
  },
  {
    id: "sci-fi-speculative",
    name: "Sci-Fi & Speculative",
    description: "Futuristic tales, artificial minds, cybernetics, and cosmic fiction.",
    count: 34,
    iconName: "Sparkles",
    featuredColor: "from-purple-900 to-slate-950",
  },
  {
    id: "fiction-literature",
    name: "Fiction & Literature",
    description: "Contemporary prose, award-winning novellas, and curated classics.",
    count: 45,
    iconName: "BookOpen",
    featuredColor: "from-orange-800 to-amber-950",
  },
];

export const BOOKS: Book[] = [
  {
    id: "book-1",
    title: "Designing for the Screen",
    subtitle: "A Masterclass in Typography, Layout & Spatial Balance",
    author: "Elena Rostova",
    authorRole: "Principal Design Director at Atelier",
    price: 24.99,
    originalPrice: 34.99,
    discountPercent: 28,
    dodoProductId: "pdt_default",
    rating: 4.9,
    reviewsCount: 312,
    pages: 284,
    readingTime: "5 hrs 40 mins",
    category: "design-creative",
    tags: ["Typography", "UI Design", "Design Systems"],
    badge: "Bestseller",
    formats: ["PDF", "EPUB"],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    epubUrl: "https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/georgia-cfi/EPUB/xhtml/r3.xhtml",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    coverStyle: {
      bgGradient: "bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-800",
      accentColor: "#f59e0b",
      textColor: "text-amber-500",
      pattern: "editorial",
    },
    synopsis:
      "Essential reading for modern digital product designers. Elena Rostova breaks down grid discipline, optical alignment, and typography as an emotional language.",
    sampleChapters: [
      {
        title: "Chapter 1: The Geometry of Whitespace",
        subtitle: "Why empty space is your strongest visual component",
        content: [
          "Whitespace is rarely passive. In digital interface design, negative space performs the vital structural work that margins and gutters provided in 15th-century printed codices.",
          "When we inspect high-craft design, we notice that rhythm is not dictated by what is present, but by the intentional intervals between components. Micro-whitespace manages character kerning and line leading; macro-whitespace establishes hierarchical relationships.",
          "Consider the classic book page layout designed by Jan Tschichold. The margin proportions—1:1.5:2:2.5—were not arbitrary rules, but mathematical harmonies intended to put the human eye at ease.",
          "In the digital browser, where screen sizes shift dynamically, we construct relative fluid bounds. Yet the fundamental rule persists: space creates clarity, and clarity engenders confidence in the reader."
        ],
      },
      {
        title: "Chapter 2: Typographic Hierarchy",
        subtitle: "Guiding the eye without noise",
        content: [
          "A page without clear typographic contrast forces the reader to expend cognitive energy simply figuring out where to begin.",
          "We achieve hierarchy not merely by cranking font sizes up to 64px, but through contrast of weight, tracking, and optical scale. Pair a strong serif display face with a restrained neutral sans-serif body.",
          "Good typography goes unnoticed because it feels like direct communication from writer to reader without visual static."
        ],
      },
    ],
  },
  {
    id: "book-2",
    title: "Systems Thinking for Software Architects",
    subtitle: "Building Resilient, High-Throughput Distributed Systems",
    author: "Marcus Vance",
    authorRole: "Distinguished Systems Engineer",
    price: 29.99,
    originalPrice: 42.00,
    discountPercent: 28,
    dodoProductId: "pdt_default",
    rating: 4.95,
    reviewsCount: 489,
    pages: 360,
    readingTime: "7 hrs 15 mins",
    category: "tech-code",
    tags: ["Architecture", "Distributed Systems", "Backend"],
    badge: "Bestseller",
    formats: ["PDF", "EPUB"],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    epubUrl: "https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/georgia-cfi/EPUB/xhtml/r3.xhtml",
    coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    coverStyle: {
      bgGradient: "bg-gradient-to-br from-zinc-900 via-slate-900 to-neutral-900",
      accentColor: "#10b981",
      textColor: "text-emerald-400",
      pattern: "architectural",
    },
    synopsis:
      "A deep dive into distributed fault tolerance, event streams, consensus protocols, and scalable state management without unnecessary complexity.",
    sampleChapters: [
      {
        title: "Chapter 1: Deconstructing Complexity",
        subtitle: "Essential versus Accidental Complexity in Software",
        content: [
          "Fred Brooks famously separated software difficulty into essential complexity—the inherent domain difficulty—and accidental complexity, which we introduce through our own abstractions.",
          "In distributed architectures, accidental complexity often creeps in under the guise of 'future-proofing'. Microservices deployed for a product with 50 daily active users, or Kafka clusters configured before data pipelines even exist.",
          "Pragmatic systems engineering prioritizes append-only logs, idempotent APIs, and transparent failure domains over speculative abstractions."
        ],
      },
    ],
  },
  {
    id: "book-3",
    title: "Monetizing Digital Craft",
    subtitle: "The Founder's Playbook for Bootstrapping Software & Ebooks",
    author: "Julian Thorne",
    authorRole: "Independent Creator & Founder",
    price: 32.00,
    originalPrice: 45.00,
    discountPercent: 29,
    dodoProductId: "pdt_default",
    rating: 4.88,
    reviewsCount: 215,
    pages: 240,
    readingTime: "4 hrs 50 mins",
    category: "business-strategy",
    tags: ["Bootstrapping", "Pricing", "Monetization"],
    badge: "Staff Pick",
    formats: ["PDF", "EPUB"],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    epubUrl: "https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/georgia-cfi/EPUB/xhtml/r3.xhtml",
    coverUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80",
    coverStyle: {
      bgGradient: "bg-gradient-to-br from-emerald-950 via-teal-900 to-stone-900",
      accentColor: "#34d399",
      textColor: "text-emerald-300",
      pattern: "minimal",
    },
    synopsis:
      "How to package your technical expertise into high-margin digital products. Covers pricing models, direct audience building, and automated checkout funnels.",
    sampleChapters: [
      {
        title: "Chapter 1: The Economics of Digital Ownership",
        subtitle: "Why direct distribution beats platform lock-in",
        content: [
          "When you sell digital assets directly to your audience, your unit economics change fundamentally.",
          "Instead of giving up 30% to legacy marketplaces, modern web primitives allow one-click checkouts with instant browser delivery.",
          "Ownership is the core promise: readers receive clean, DRM-free files that belong to them permanently."
        ],
      },
    ],
  },
  {
    id: "book-4",
    title: "The Architecture of Quiet Minds",
    subtitle: "Mental Models for Deep Work in a Hyper-Connected World",
    author: "Dr. Serena Vance",
    authorRole: "Cognitive Scientist & Author",
    price: 21.50,
    originalPrice: 28.00,
    discountPercent: 23,
    dodoProductId: "pdt_default",
    rating: 4.92,
    reviewsCount: 178,
    pages: 210,
    readingTime: "3 hrs 45 mins",
    category: "mind-philosophy",
    tags: ["Deep Work", "Stoicism", "Focus"],
    badge: "Trending",
    formats: ["PDF", "EPUB"],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    epubUrl: "https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/georgia-cfi/EPUB/xhtml/r3.xhtml",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    coverStyle: {
      bgGradient: "bg-gradient-to-br from-indigo-950 via-slate-900 to-stone-900",
      accentColor: "#818cf8",
      textColor: "text-indigo-300",
      pattern: "abstract",
    },
    synopsis:
      "Practical mental frameworks to protect focus, eliminate algorithmic distraction, and reclaim deep creative solitude.",
    sampleChapters: [
      {
        title: "Chapter 1: The Attention Sanctuary",
        subtitle: "Designing environments for uninterrupted thought",
        content: [
          "Attention is not merely a cognitive resource—it is the raw material of human agency.",
          "In an era engineered for continuous micro-interruption, deep work requires intentional friction against shallow inputs."
        ],
      },
    ],
  },
  {
    id: "book-5",
    title: "Silicon Horizon 2099",
    subtitle: "A Speculative Monograph on Synthetic Consciousness",
    author: "Kaelen Voss",
    authorRole: "Speculative Fiction Author",
    price: 19.99,
    originalPrice: 26.00,
    discountPercent: 23,
    dodoProductId: "pdt_default",
    rating: 4.85,
    reviewsCount: 340,
    pages: 310,
    readingTime: "6 hrs 10 mins",
    category: "sci-fi-speculative",
    tags: ["Sci-Fi", "AI", "Futurism"],
    badge: "New Release",
    formats: ["PDF", "EPUB"],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    epubUrl: "https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/georgia-cfi/EPUB/xhtml/r3.xhtml",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    coverStyle: {
      bgGradient: "bg-gradient-to-br from-purple-950 via-slate-950 to-stone-900",
      accentColor: "#c084fc",
      textColor: "text-purple-300",
      pattern: "geometric",
    },
    synopsis:
      "A thrilling speculative journey into the first self-aware orbital network and the human minds tasked with guiding its evolution.",
    sampleChapters: [
      {
        title: "Chapter 1: The First Pulse",
        subtitle: "When orbital server farms began to dream",
        content: [
          "The first anomaly was not an error code, but a rhythm.",
          "At 03:00 UTC, the geosynchronous compute arrays shifted their energy load without human prompt."
        ],
      },
    ],
  },
  {
    id: "book-6",
    title: "The Craftsman's Monograph",
    subtitle: "Essays on Aesthetic Mastery & Printed Typography",
    author: "Claire Sterling",
    authorRole: "Senior Literary Curator",
    price: 27.50,
    originalPrice: 38.00,
    discountPercent: 27,
    dodoProductId: "pdt_default",
    rating: 4.97,
    reviewsCount: 192,
    pages: 260,
    readingTime: "5 hrs 15 mins",
    category: "fiction-literature",
    tags: ["Essays", "Craft", "Literature"],
    badge: "Staff Pick",
    formats: ["PDF", "EPUB"],
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    epubUrl: "https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/georgia-cfi/EPUB/xhtml/r3.xhtml",
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    coverStyle: {
      bgGradient: "bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950",
      accentColor: "#f59e0b",
      textColor: "text-amber-400",
      pattern: "editorial",
    },
    synopsis:
      "A rich collection of prose celebrating physical and digital book design, classic binding techniques, and the enduring power of the written word.",
    sampleChapters: [
      {
        title: "Chapter 1: The Permanence of the Page",
        subtitle: "From Gutenberg to the digital codex",
        content: [
          "A book is an architecture for human thought.",
          "Whether bound in calfskin or rendered in crisp web typography, the vessel honors the voice inside."
        ],
      },
    ],
  },
];
