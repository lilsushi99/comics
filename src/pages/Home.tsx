import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, ArrowRight, Play, Sparkles, Send, Star } from 'lucide-react';
import { CMSData, PortfolioProject, BlogArticle } from '../types';
import ComicConveyor from '../components/ComicConveyor';
import AmbientAudioPlayer from '../components/AmbientAudioPlayer';
import HeroStarfield from '../components/HeroStarfield';
import KeywordMarquee from '../components/KeywordMarquee';
import CountUpMetric from '../components/CountUpMetric';

interface HomeProps {
  data: CMSData;
  onNavigate: (page: 'home' | 'portfolio' | 'studio' | 'blog' | 'contact') => void;
  onSelectProject: (project: PortfolioProject) => void;
  onSelectArticle: (article: BlogArticle) => void;
}

export default function Home({ data, onNavigate, onSelectProject, onSelectArticle }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Filters for portfolio previews
  const homepageCategoriesToUse = data.portfolio.homepageCategories && data.portfolio.homepageCategories.length > 0
    ? data.portfolio.homepageCategories
    : data.portfolio.categories;
  const categoriesList = ['All', ...homepageCategoriesToUse];

  const baseProjectsList = data.portfolio.homepageFeaturedOnly
    ? data.portfolio.projects.filter(p => p.featured === true)
    : data.portfolio.projects;

  const filteredProjects = activeCategory === 'All'
    ? baseProjectsList.slice(0, data.portfolio.homepageLimit || 6)
    : baseProjectsList.filter(p => p.category === activeCategory).slice(0, data.portfolio.homepageLimit || 6);

  // Sort and limit articles
  const homepageArticles = (() => {
    let list = [...data.blog.articles];
    if (data.blog.homepageSortOrder === 'oldest') {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return list.slice(0, data.blog.homepageLimit || 3);
  })();

  const handleFormChange = (id: string, value: string) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Premium studio project inquiry received:', formValues);
    setFormSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <div id="homepage" className="bg-transparent text-inherit min-h-screen pt-16">
      
      {data.homepageLayout?.filter(section => section.enabled).map((layoutItem) => {
        switch (layoutItem.id) {
          case 'hero':
            return (
              <section key="hero" id="hero" className="relative min-h-[95vh] flex items-center justify-center px-6 py-20 overflow-hidden">
                {/* Dynamic Theme backdrop */}
                {(() => {
                  const theme = data.hero.activeTheme || 'theme-2';
                  if (theme === 'theme-2') {
                    return (
                      <HeroStarfield
                        config={{
                          numStars: data.hero.starfield?.numStars || 120,
                          speed: data.hero.starfield?.speed || 1.6,
                          minSize: 0.8,
                          maxSize: data.hero.starfield?.maxSize || 2.8,
                          brightness: 0.95,
                          glowIntensity: 8,
                          accentColor: '#f97316',
                          enableHover: data.hero.starfield?.enableHover !== false
                        }}
                        mode="starfield-a"
                      />
                    );
                  }
                  if (theme === 'theme-3') {
                    return (
                      <HeroStarfield
                        config={{
                          numStars: data.hero.starfield?.numStars || 30,
                          speed: data.hero.starfield?.speed || 0.45,
                          minSize: 0.8,
                          maxSize: data.hero.starfield?.maxSize || 2.2,
                          brightness: 0.5,
                          glowIntensity: 0,
                          accentColor: '#38bdf8',
                          enableHover: data.hero.starfield?.enableHover !== false
                        }}
                        mode="starfield-b"
                      />
                    );
                  }
                  if (theme === 'theme-1') {
                    const customImg = data.hero.theme1CustomImage;
                    return (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-neutral-950">
                        {customImg ? (
                          <img
                            src={customImg}
                            alt="4K Gradient Artwork Background"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover select-none scale-100 transition-all duration-1000 opacity-90"
                          />
                        ) : (
                          <div className="absolute inset-0 theme-4k-gradient-bg">
                            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>
                    );
                  }
                  if (theme === 'theme-4') {
                    const starsEnabled = data.hero.theme4Stars === true;
                    return (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-black">
                        {starsEnabled && (
                          <HeroStarfield
                            config={{
                              numStars: data.hero.starfield?.numStars || 80,
                              speed: data.hero.starfield?.speed || 1.2,
                              minSize: 0.8,
                              maxSize: data.hero.starfield?.maxSize || 2.4,
                              brightness: 0.8,
                              glowIntensity: 4,
                              accentColor: '#38bdf8',
                              enableHover: data.hero.starfield?.enableHover !== false
                            }}
                            mode="starfield-a"
                          />
                        )}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-radial-gradient from-[#050505] via-black to-black opacity-30 blur-3xl" />
                      </div>
                    );
                  }
                  
                  // Fallback
                  return (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#000000]" />
                  );
                })()}

                {/* Content wrapper */}
                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                  
                  {/* Small badge/tag */}
                  <motion.div
                    id="hero-badge"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-6 shadow-xl"
                  >
                    <Sparkles size={12} className="text-orange-500 animate-pulse" />
                    <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] font-bold text-orange-400">
                      {data.hero.badge}
                    </span>
                  </motion.div>

                  {/* Large Stretched Typography Headline */}
                  <motion.h1
                    id="hero-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="stretched-text text-5xl sm:text-7xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tight uppercase select-none mb-8 scale-x-110 origin-center filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                  >
                    {data.hero.title}
                  </motion.h1>

                  {/* Impactful description */}
                  <motion.p
                    id="hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="font-sans text-neutral-400 text-sm md:text-lg max-w-2xl leading-relaxed mb-12 px-4"
                  >
                    {data.hero.subtitle}
                  </motion.p>

                  {/* Dynamic Buttons */}
                  <motion.div
                    id="hero-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 justify-center items-center"
                  >
                    {(data.hero.buttons || []).map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          // Track button click event dynamically
                          const bId = btn.text.toLowerCase().includes('book') 
                            ? 'book_a_call' 
                            : btn.text.toLowerCase().includes('portfolio') || btn.text.toLowerCase().includes('work') 
                            ? 'view_portfolio' 
                            : 'contact_us';
                          if ((window as any).trackAnalyticsEvent) {
                            (window as any).trackAnalyticsEvent({ type: 'button_click', buttonId: bId });
                          }

                          const rawUrl = (btn.url || '').trim();
                          const normalizedUrl = rawUrl.startsWith('/') && !rawUrl.startsWith('//') ? rawUrl.slice(1) : rawUrl;

                          if (rawUrl.startsWith('#')) {
                            const el = document.getElementById(rawUrl.slice(1));
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              onNavigate(rawUrl.slice(1) as any);
                            }
                          } else if (normalizedUrl === 'portfolio' || normalizedUrl === 'studio' || normalizedUrl === 'blog' || normalizedUrl === 'contact') {
                            onNavigate(normalizedUrl as any);
                          } else {
                            if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
                              window.open(rawUrl, '_blank');
                            } else {
                              window.location.href = rawUrl;
                            }
                          }
                        }}
                        className={`font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-none transition-all duration-300 cursor-pointer ${
                          btn.style === 'primary'
                            ? 'bg-orange-500 hover:bg-orange-600 text-white hover:tracking-[0.15em] hover:shadow-[0_0_25px_rgba(249,115,22,0.45)]'
                            : btn.style === 'accent'
                            ? 'bg-white text-black hover:tracking-[0.15em] hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] font-bold'
                            : 'bg-transparent hover:bg-white/5 text-white border border-white/10 hover:border-white/30'
                        }`}
                      >
                        {btn.text}
                      </button>
                    ))}
                  </motion.div>
                </div>

                {/* Minimal scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-40">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase mb-2">SCROLL DOWN</span>
                  <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent animate-bounce" />
                </div>
              </section>
            );

          case 'showcase':
            return (
              <section key="showcase" id="showcase-section" className="relative px-6 py-20 bg-black border-t border-neutral-900 z-10">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-12 text-center flex flex-col items-center">
                    <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-2">{data.showcase.subtitle || 'CINEMATIC GALLERY STRIPS'}</span>
                    <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                      {data.showcase.title || 'STUDIO COMIC REEL'}
                    </h2>
                    
                    {data.audio && (
                      <div className="mt-2 w-full flex justify-center">
                        <AmbientAudioPlayer
                          audioUrl={data.audio.audioUrl}
                          enabledGlobally={data.audio.enabledGlobally}
                        />
                      </div>
                    )}
                  </div>

                  <div id="showcase-deck" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <ComicConveyor
                      media={data.showcase.panel1.media}
                      speed={data.showcase.panel1.speed}
                      direction="horizontal"
                      reverse={true}
                      enabled={data.showcase.panel1.enabled}
                      className="h-[350px] md:h-[460px]"
                    />
                    <ComicConveyor
                      media={data.showcase.panel2.media}
                      speed={data.showcase.panel2.speed}
                      direction="vertical"
                      reverse={false}
                      enabled={data.showcase.panel2.enabled}
                      className="h-[500px] md:h-[620px]"
                    />
                    <ComicConveyor
                      media={data.showcase.panel3.media}
                      speed={data.showcase.panel3.speed}
                      direction="horizontal"
                      reverse={false}
                      enabled={data.showcase.panel3.enabled}
                      className="h-[350px] md:h-[460px]"
                    />
                  </div>

                  <div className="text-center mt-8 text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
                    * HOVER TO DECELERATE THE STRIP AND EXPOSE HIGH-ACCENT VIBRANT RENDERS
                  </div>
                </div>
              </section>
            );

          case 'services':
            return (
              <div key={layoutItem.id}>
                <KeywordMarquee keywords={data.services.keywords} speed={data.services.speed} />
              </div>
            );

          case 'portfolio':
            return (
              <section key="portfolio" id="portfolio-sector" className="px-6 py-24 bg-black">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                      <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block mb-2">
                        {data.portfolio.homepageSubtitle || 'CURATED EXCERPTS'}
                      </span>
                      <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                        {data.portfolio.homepageTitle || 'CREATIVE REGISTRY'}
                      </h2>
                      {data.portfolio.homepageDescription && (
                        <p className="font-sans text-xs text-neutral-400 mt-4 max-w-xl leading-relaxed">
                          {data.portfolio.homepageDescription}
                        </p>
                      )}
                    </div>

                    <div id="category-filters" className="flex flex-wrap gap-2">
                      {categoriesList.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all rounded-full cursor-pointer ${
                            activeCategory === cat
                              ? 'bg-orange-500 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                              : 'bg-[#121212] text-neutral-400 border border-white/10 hover:text-white hover:border-orange-500/30'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group relative bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)]"
                      >
                        <div className="relative aspect-[3/4] bg-neutral-950 overflow-hidden border-b border-white/10">
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-black/85 text-orange-400 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 border border-orange-500/20 rounded-full">
                              {project.tag}
                            </span>
                          </div>
                          <img
                            src={project.image}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity pointer-events-none" />
                        </div>

                        <div className="p-5 flex flex-col flex-grow justify-between">
                          <div>
                            <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase mb-1 block">
                              {project.category}
                            </span>
                            <h3 className="font-sans text-base font-bold text-white uppercase tracking-tight mb-2 leading-tight">
                              {project.title}
                            </h3>
                            <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-2 mb-4">
                              {project.description}
                            </p>
                          </div>

                          <button
                            onClick={() => onSelectProject(project)}
                            className="w-full bg-[#121212] hover:bg-orange-500 hover:text-white border border-white/10 hover:border-orange-500/50 text-neutral-300 font-mono text-[9px] uppercase tracking-widest py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            View Visual Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-16">
                    <button
                      onClick={() => {
                        const url = data.portfolio.homepageCtaUrl || 'portfolio';
                        if (url === 'portfolio' || url === 'blog' || url === 'contact' || url === 'studio') {
                          onNavigate(url as any);
                        } else {
                          window.location.href = url;
                        }
                      }}
                      className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
                    >
                      <span>{data.portfolio.homepageCtaText || 'View All Portfolio'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </section>
            );

          case 'process':
            return (
              <section key="process" id="process-timeline" className="px-6 py-24 bg-neutral-950 border-y border-neutral-900">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-20 text-center">
                    <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block mb-2">PRODUCTION PIPELINE</span>
                    <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{data.process.title}</h2>
                    <p className="font-sans text-neutral-400 text-xs md:text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
                      {data.process.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.process.steps.map((step) => (
                      <div
                        key={step.id}
                        className="p-8 bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden transition-all duration-500 hover:border-orange-500/30 hover:-translate-y-1 group"
                      >
                        <span className="absolute right-4 top-2 text-8xl font-sans font-black text-neutral-900/40 select-none pointer-events-none group-hover:text-orange-500/10 transition-colors duration-500">
                          {step.stepNumber}
                        </span>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                          <div>
                            <span className="font-mono text-xs text-orange-500 block mb-4">{step.stepNumber} // PIPELINE</span>
                            <h3 className="font-sans text-base font-bold text-white uppercase tracking-tight mb-3">
                              {step.title}
                            </h3>
                            <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'metrics':
            return (
              <section key="metrics" id="metrics-section" className="px-6 py-24 bg-black">
                <div className="max-w-7xl mx-auto">
                  <div className="relative h-64 md:h-[450px] overflow-hidden mb-12 border border-white/10 rounded-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
                    <motion.img
                      src={data.metrics.featuredImage}
                      alt="Studio production floor view"
                      referrerPolicy="no-referrer"
                      initial={{ scale: 1.25, filter: 'grayscale(100%) brightness(0.1)' }}
                      whileInView={{ scale: 1.0, filter: 'grayscale(100%) brightness(0.45)' }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    />
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 max-w-xl">
                      <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase block mb-2">
                        {data.metrics.tagline || 'AGENCY BENCHMARK'}
                      </span>
                      <h3 className="font-sans text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-3">
                        {data.metrics.heading || 'DELIVERING LEGENDARY VISUAL INTENSITY'}
                      </h3>
                      {data.metrics.description && (
                        <p className="font-sans text-xs text-neutral-300 leading-relaxed max-w-lg mb-4">
                          {data.metrics.description}
                        </p>
                      )}
                      {data.metrics.buttonText && (
                        <button
                          onClick={() => {
                            const url = data.metrics.buttonUrl || '#contact';
                            if (url.startsWith('#')) {
                              const el = document.getElementById(url.slice(1));
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                              } else {
                                onNavigate('contact');
                              }
                            } else if (url === 'portfolio' || url === 'studio' || url === 'blog' || url === 'contact') {
                              onNavigate(url as any);
                            } else {
                              window.location.href = url;
                            }
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-mono text-[9px] uppercase tracking-widest px-4 py-2 font-bold transition-all shadow-md"
                        >
                          {data.metrics.buttonText}
                        </button>
                      )}
                    </div>
                  </div>

                  <div id="metrics-grid" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {data.metrics.stats.map((stat) => (
                      <CountUpMetric
                        key={stat.id}
                        value={stat.value}
                        label={stat.label}
                        suffix={stat.suffix}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'inquiry':
            return (
              <section key="inquiry" id="inquiry-section" className="px-6 py-24 bg-[#080808] border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                  <div className="lg:col-span-5 relative min-h-[350px] bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
                    <img
                      src={data.inquiry.designerImage}
                      alt="Designer sketching intense comic cells"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                    />
                    <div className="absolute bottom-6 left-6 z-20">
                      <span className="bg-orange-500 text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-full shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        {data.inquiry.designerTag || 'CREATIVE HUB'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-center bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                    <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-2">
                      {data.inquiry.tagline || 'COLLABORATION DECK'}
                    </span>
                    <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                      {data.inquiry.title}
                    </h2>
                    <p className="text-neutral-400 font-sans text-xs md:text-sm leading-relaxed mb-8">
                      {data.inquiry.subtitle}
                    </p>

                    {formSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-neutral-900/40 border border-orange-500/20 rounded-2xl text-center flex flex-col items-center justify-center space-y-4 py-12"
                      >
                        <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center rounded-full font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                          ✓
                        </div>
                        <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-white">
                          Pitch Docket Registered Successfully
                        </h3>
                        <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                          Our Senior Narrative Producer will review your universe bible, character profiles, and production budget parameters. Expect alignment coordinates in your inbox within 24 working hours.
                        </p>
                        <button
                          onClick={() => setFormSubmitted(false)}
                          className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          Submit Another Project Pitch
                        </button>
                      </motion.div>
                    ) : (
                      <form id="inquiry-form" onSubmit={handleInquirySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.inquiry.fields.slice(0, 2).map((field) => (
                            <div key={field.id} className="flex flex-col space-y-1">
                              <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                                {field.label} {field.required && <span className="text-orange-500">*</span>}
                              </label>
                              <input
                                type={field.type}
                                placeholder={field.placeholder}
                                required={field.required}
                                value={formValues[field.id] || ''}
                                onChange={(e) => handleFormChange(field.id, e.target.value)}
                                className="bg-black/60 border border-white/10 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.inquiry.fields.slice(2, 4).map((field) => (
                            <div key={field.id} className="flex flex-col space-y-1">
                              <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                                {field.label} {field.required && <span className="text-orange-500">*</span>}
                              </label>
                              <select
                                required={field.required}
                                value={formValues[field.id] || ''}
                                onChange={(e) => handleFormChange(field.id, e.target.value)}
                                className="bg-black/60 border border-white/10 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors cursor-pointer"
                              >
                                <option value="" disabled>{field.placeholder}</option>
                                {field.options?.map((opt, i) => (
                                  <option key={i} value={opt} className="bg-neutral-950">
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>

                        {data.inquiry.fields.slice(4).map((field) => (
                          <div key={field.id} className="flex flex-col space-y-1">
                            <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                              {field.label} {field.required && <span className="text-orange-500">*</span>}
                            </label>
                            <textarea
                              placeholder={field.placeholder}
                              required={field.required}
                              rows={4}
                              value={formValues[field.id] || ''}
                              onChange={(e) => handleFormChange(field.id, e.target.value)}
                              className="bg-black/60 border border-white/10 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors resize-none"
                            />
                          </div>
                        ))}

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 hover:tracking-[0.12em] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
                        >
                          <Send size={12} />
                          <span>{data.inquiry.submitButtonText || 'TRANSMIT PROJECT INQUIRY'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <section key="testimonials" id="testimonials-section" className="px-6 py-24 bg-neutral-950 border-t border-neutral-900">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-20 text-center">
                    <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block mb-2">
                      {data.testimonials.subtitle || 'PROVEN EXCELLENCE'}
                    </span>
                    <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                      {data.testimonials.heading || 'CLIENT TESTIMONIALS'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {data.testimonials.items.slice(0, data.testimonials.homepageLimit || undefined).map((test) => (
                      <div
                        key={test.id}
                        className="bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)] relative"
                      >
                        <span className="absolute top-4 left-4 text-6xl font-sans font-black text-neutral-900/60 select-none leading-none">
                          “
                        </span>

                        <div className="relative z-10 pt-4">
                          {test.rating && (
                            <div className="flex items-center space-x-0.5 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={`${
                                    i < (test.rating || 0)
                                      ? 'text-orange-500 fill-orange-500'
                                      : 'text-neutral-700'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          <p className="font-sans text-sm italic text-neutral-300 leading-relaxed mb-8">
                            {test.quote}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                          <div className="flex items-center space-x-4">
                            {test.image && (
                              <img
                                src={test.image}
                                alt={test.author}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full grayscale border border-white/10 object-cover"
                              />
                            )}
                            <div>
                              <h4 className="font-sans text-xs font-bold uppercase text-white leading-none mb-1">
                                {test.author}
                              </h4>
                              <span className="font-mono text-[9px] text-orange-400 uppercase tracking-widest block">
                                {test.role}, <span className="text-neutral-400">{test.company}</span>
                              </span>
                              {test.projectAssociation && (
                                <span className="inline-block font-mono text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-neutral-400 mt-1 uppercase tracking-wider">
                                  {test.projectAssociation}
                                </span>
                              )}
                            </div>
                          </div>
                          {test.companyLogo && (
                            <img
                              src={test.companyLogo}
                              alt={`${test.company} logo`}
                              referrerPolicy="no-referrer"
                              className="max-h-6 max-w-[60px] grayscale opacity-40 hover:opacity-100 transition-all object-contain"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'faq':
            return (
              <section key="faq" id="faq-section" className="px-6 py-24 bg-black border-t border-neutral-900">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-16 text-center">
                    <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block mb-2">
                      {data.faq.subtitle || 'INFORMATION COUNTER'}
                    </span>
                    <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                      {data.faq.heading || 'Frequently Asked Questions (FAQ)'}
                    </h2>
                  </div>

                  <div id="faq-accordion" className="space-y-4">
                    {data.faq.items.slice(0, data.faq.homepageLimit || undefined).map((item, index) => {
                      const isOpen = faqOpenIndex === index;
                      return (
                        <div
                          key={item.id}
                          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-500/30 bg-[#0f0f0f]' : 'border-white/10 bg-[#0d0d0d]/80'}`}
                        >
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                          >
                            <span className={`font-sans text-sm md:text-base font-bold uppercase tracking-tight pr-4 transition-colors ${isOpen ? 'text-orange-400' : 'text-white'}`}>
                              {item.question}
                            </span>
                            <span className={`shrink-0 transition-colors ${isOpen ? 'text-orange-400' : 'text-neutral-500'}`}>
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 pt-0 border-t border-white/5">
                                  <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
                                    {item.answer}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {(!data.homepageLayout?.some(item => item.id === 'blog') || data.homepageLayout?.find(item => item.id === 'blog')?.enabled) && (
        <section id="blog-preview-section" className="px-6 py-24 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-2">
                  {data.blog.homepageSubtitle || 'STUDIO WISDOM'}
                </span>
                <h2 className="font-sans text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                  {data.blog.homepageTitle || 'LATEST INSIGHTS'}
                </h2>
              </div>
              <button
                onClick={() => {
                  const url = data.blog.homepageCtaUrl || 'blog';
                  if (url === 'blog' || url === 'portfolio' || url === 'contact' || url === 'studio') {
                    onNavigate(url as any);
                  } else {
                    window.location.href = url;
                  }
                }}
                className="text-neutral-400 hover:text-orange-400 font-mono text-xs uppercase tracking-widest transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{data.blog.homepageCtaText || 'View All Articles'}</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homepageArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)] group"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden mb-4 border border-white/10 rounded-xl bg-black">
                      <img
                        src={article.image}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                    <div className="flex items-center space-x-4 mb-3 text-[9px] font-mono">
                      <span className="text-neutral-500 uppercase">{article.date}</span>
                      <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full" />
                      <span className="text-neutral-400 uppercase">{article.readTime}</span>
                    </div>
                    <h3 className="font-sans text-sm font-black uppercase text-white tracking-tight mb-2 group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectArticle(article)}
                    className="text-orange-400 hover:text-orange-500 font-mono text-[10px] uppercase tracking-widest flex items-center space-x-1 mt-4 cursor-pointer font-bold"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
