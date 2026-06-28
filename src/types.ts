export interface NavLink {
  label: string;
  page: 'home' | 'portfolio' | 'studio' | 'blog' | 'contact';
}

export interface NavigationConfig {
  logoText: string;
  logoSubtext: string;
  links: NavLink[];
  favicon?: string;
}

export interface StarfieldConfig {
  numStars: number;
  speed: number;
  minSize: number;
  maxSize: number;
  brightness: number;
  glowIntensity: number;
  accentColor: string;
  enableHover: boolean;
}

export interface HeroButton {
  id: string;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'accent';
  type?: 'internal' | 'external';
  openNewTab?: boolean;
  icon?: string;
  visible?: boolean;
}

export interface HeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  bgGradientType: 'cinematic' | 'monochrome' | 'dark-cosmic' | 'neon-ink';
  bgGradientColor1: string;
  bgGradientColor2: string;
  bgGradientColor3: string;
  buttons: HeroButton[];
  backgroundImage?: string;
  bgSelection?: 'generated' | 'uploaded' | 'starfield' | 'starfield-b';
  uploadedBackgroundImage?: string;
  starfield?: StarfieldConfig;
  activeTheme?: 'theme-1' | 'theme-2' | 'theme-3' | 'theme-4';
  theme1CustomImage?: string;
  theme4Stars?: boolean;
}

export interface ShowcasePanelConfig {
  media: { id: string; url: string; type: 'image' | 'video' }[];
  speed: number; // in seconds per flip or transition speed
  enabled: boolean;
}

export interface ShowcaseConfig {
  title?: string;
  subtitle?: string;
  panel1: ShowcasePanelConfig;
  panel2: ShowcasePanelConfig;
  panel3: ShowcasePanelConfig;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string; // Manga, Manhwa, American Comics, Character Design, Visual Development
  tag: string; // e.g. Cyberpunk, Shonen, Fantasy, Action, Sci-Fi
  image: string;
  description: string;
  longDescription: string;
  client: string;
  year: string;
  tags: string[];
  galleryImages: string[];
  video?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tools: string[];
  visualDetails: string[]; // List of detail aspects shown on click
  featured?: boolean;
}

export interface PortfolioConfig {
  categories: string[];
  projects: PortfolioProject[];
  homepageTitle?: string;
  homepageSubtitle?: string;
  homepageDescription?: string;
  homepageCtaText?: string;
  homepageCtaUrl?: string;
  homepageLimit?: number;
  homepageCategories?: string[];
  homepageFeaturedOnly?: boolean;
}

export interface ServicesConfig {
  keywords: string[];
  speed: number; // custom speed multiplier
  enabled: boolean;
}

export interface InquiryFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'budget' | 'file' | 'image';
  placeholder: string;
  required: boolean;
  options?: string[]; // for select, radio, budget
  width?: 'half' | 'full';
  defaultValue?: string;
  helpText?: string;
}

export interface InquiryConfig {
  designerImage: string;
  title: string;
  subtitle: string;
  formTitle?: string;
  fields: InquiryFormField[];
  designerTag?: string;
  tagline?: string;
  submitButtonText?: string;
  // Contact page CMS additions
  badge?: string;
  description?: string;
  emails?: { id: string; label: string; email: string }[];
  phones?: { id: string; label: string; phone: string }[];
  hours?: { id: string; days: string; hours: string; closed?: boolean }[];
  address?: string;
}

export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessConfig {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface MetricItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export interface MetricsConfig {
  featuredImage: string;
  stats: MetricItem[];
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string; // rich content with HTML or markdown support
  date: string;
  readTime: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BlogConfig {
  articles: BlogArticle[];
  categories: string[];
  tags: string[];
  homepageTitle?: string;
  homepageSubtitle?: string;
  homepageLimit?: number;
  homepageSortOrder?: 'newest' | 'oldest';
  homepageCtaText?: string;
  homepageCtaUrl?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  rating?: number;
  companyLogo?: string;
  projectAssociation?: string;
}

export interface TestimonialsConfig {
  items: TestimonialItem[];
  heading?: string;
  subtitle?: string;
  homepageLimit?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  items: FAQItem[];
  heading?: string;
  subtitle?: string;
  homepageLimit?: number;
}

export interface SocialConfig {
  id: string;
  name: string;
  icon: string; // icon name from lucide-react or social platform identifier
  url: string;
  visible: boolean;
}

export interface FooterConfig {
  aboutText: string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  socials: SocialConfig[];
}

export interface AudioConfig {
  enabledGlobally: boolean;
  audioUrl: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  uploadedAt: string;
}

export interface StudioManifestoValue {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface StudioPageConfig {
  bannerImage: string;
  headline: string;
  subtitle: string;
  philosophyTitle: string;
  philosophyText: string;
  philosophySubPoints: { title: string; desc: string; icon: string }[];
  values: StudioManifestoValue[];
  ctaTitle: string;
  ctaDescription: string;
  ctaBtnText: string;
  ctaImage: string;

  // Advanced studio page-builder additions
  badge?: string;
  description?: string;
  heroShowCta?: boolean;
  heroCtaText?: string;
  heroCtaUrl?: string;
  heroCtaNewTab?: boolean;
  
  bannerLabel?: string;
  bannerCap?: string;

  philosophyBadge?: string;
  philosophyParagraphs?: string[];

  manifestoBadge?: string;
  manifestoTitle?: string;

  statsBadge?: string;
  statsTitle?: string;

  ctaBadge?: string;
  ctaBtnUrl?: string;
  ctaBtnNewTab?: boolean;
  ctaBtnVisible?: boolean;

  layout?: HomepageLayoutSection[];
}

export interface HomepageLayoutSection {
  id: string;
  name: string;
  enabled: boolean;
}

export interface SocialPlatformConfig {
  id: string;
  name: string;
  enabled: boolean;
  url: string;
  displayName?: string;
}

export interface PageSeoConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
  structuredData?: string;
}

export interface GlobalSettings {
  // Website Identity
  websiteName: string;
  studioName: string;
  appName: string;
  logoUrl: string;
  faviconUrl: string;
  browserTitle: string;
  defaultTimezone: string;
  contactEmail: string;
  contactPhone: string;
  companyAddress: string;

  // Admin Branding
  adminPanelName?: string;
  adminLogoUrl?: string;
  adminFaviconUrl?: string;

  // Theme Customization
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  buttonColor?: string;

  // Footer Builder
  footerLogoUrl?: string;
  footerTitle?: string;
  footerDescription?: string;
  copyrightText?: string;
  footerNewsletterText?: string;

  // Social Media Manager
  socialPlatforms?: SocialPlatformConfig[];

  // SEO Global
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonicalUrl?: string;
  seoOgTitle?: string;
  seoOgDescription?: string;
  seoTwitterTitle?: string;
  seoTwitterDescription?: string;
  seoOgImageUrl?: string;
  seoTwitterImageUrl?: string;
  seoShareImageUrl?: string;
  
  // Search Engine Files & Indexing
  seoXmlSitemap?: string;
  seoRobotsTxt?: string;
  seoIndex?: boolean;
  seoFollow?: boolean;
  seoDefaultSchema?: string;

  // Page-Level SEO Overrides
  pageSeo?: {
    home?: PageSeoConfig;
    portfolio?: PageSeoConfig;
    studio?: PageSeoConfig;
    blog?: PageSeoConfig;
    contact?: PageSeoConfig;
  };
}

export interface AnalyticsCountry {
  country: string;
  visits: number;
  percentage: number;
}

export interface DeviceStats {
  os: { Windows: number; macOS: number; Linux: number; Android: number; iOS: number };
  deviceType: { desktop: number; mobile: number; tablet: number };
  browser: { Chrome: number; Edge: number; Firefox: number; Safari: number; Opera: number };
}

export interface DayAnalytics {
  date: string;
  visitors: number;
  pageViews: {
    home: number;
    portfolio: number;
    studio: number;
    blog: number;
    contact: number;
  };
  buttonClicks: {
    view_portfolio: number;
    book_a_call: number;
    contact_us: number;
  };
  countries: Record<string, number>;
  devices: DeviceStats;
  leads: {
    contactForm: number;
    bookCall: number;
    newsletter: number;
  };
  projectViews: Record<string, number>;
  averageTimeSpent: number;
}

export interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  buttonClicks: number;
  portfolioViews: number;
  contactSubmissions: number;
  bounceRate: number;
  ctr: number;
  countries: AnalyticsCountry[];
  dayLogs?: DayAnalytics[];
}

export interface SMTPConfig {
  driver: string;
  host: string;
  port: number;
  encryption: 'ssl' | 'tls' | 'none';
  username: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
}

export interface AutoResponseSettings {
  subject: string;
  htmlBody: string;
  plainText: string;
  companyLogoUrl?: string;
  companyAddress?: string;
  contactInfo?: string;
  footerText?: string;
  mode?: 'text' | 'html';
}

export interface EmailSignatureSettings {
  companyLogoUrl?: string;
  companyName?: string;
  senderName?: string;
  jobTitle?: string;
  website?: string;
  phoneNumber?: string;
  socialLinks?: string;
  senderEmail?: string;
  officeAddress?: string;
}

export interface EnquiryReply {
  id: string;
  sender: 'admin' | 'user';
  message: string;
  sentAt: string;
}

export interface EnquirySubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  submittedAt: string;
  status: 'new' | 'open' | 'replied' | 'closed';
  fieldsData: Record<string, any>; // holds all other fields
  uploadedFiles?: { name: string; url: string; size: number }[];
  replies?: EnquiryReply[];
}

export interface CMSData {
  navigation: NavigationConfig;
  hero: HeroConfig;
  showcase: ShowcaseConfig;
  portfolio: PortfolioConfig;
  services: ServicesConfig;
  inquiry: InquiryConfig;
  process: ProcessConfig;
  metrics: MetricsConfig;
  blog: BlogConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
  footer: FooterConfig;
  audio?: AudioConfig;
  mediaLibrary: MediaItem[];
  homepageLayout: HomepageLayoutSection[];
  studioPage: StudioPageConfig;
  globalSettings?: GlobalSettings;
  analytics?: AnalyticsData;
  smtpSettings?: SMTPConfig;
  autoResponseTemplate?: string;
  autoResponseSettings?: AutoResponseSettings;
  emailSignatureSettings?: EmailSignatureSettings;
  submissions?: EnquirySubmission[];
}
