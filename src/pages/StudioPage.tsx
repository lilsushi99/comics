import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Users, Compass, Lightbulb, ShieldCheck, HelpCircle, ArrowRight,
  Award, Briefcase, Cpu, Layers, Globe, Heart, Zap, Sparkles, Star,
  Terminal, Target, TrendingUp, Video, Music, Code, Image as ImageIcon 
} from 'lucide-react';
import { CMSData } from '../types';
import CountUpMetric from '../components/CountUpMetric';

interface StudioPageProps {
  data: CMSData;
  onNavigate: (page: 'home' | 'portfolio' | 'studio' | 'blog' | 'contact') => void;
}

const renderIcon = (iconName: string) => {
  const iconLower = iconName?.toLowerCase()?.replace(/[^a-z0-9]/g, '') || '';
  const className = "text-orange-500 mr-2 shrink-0";
  const size = 18;
  
  switch (iconLower) {
    case 'bookopen':
    case 'book-open':
      return <BookOpen size={size} className={className} />;
    case 'users':
      return <Users size={size} className={className} />;
    case 'compass':
      return <Compass size={size} className={className} />;
    case 'lightbulb':
      return <Lightbulb size={size} className={className} />;
    case 'shieldcheck':
    case 'shield-check':
      return <ShieldCheck size={size} className={className} />;
    case 'award':
      return <Award size={size} className={className} />;
    case 'briefcase':
      return <Briefcase size={size} className={className} />;
    case 'cpu':
      return <Cpu size={size} className={className} />;
    case 'layers':
      return <Layers size={size} className={className} />;
    case 'globe':
      return <Globe size={size} className={className} />;
    case 'heart':
      return <Heart size={size} className={className} />;
    case 'zap':
      return <Zap size={size} className={className} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} />;
    case 'star':
      return <Star size={size} className={className} />;
    case 'terminal':
      return <Terminal size={size} className={className} />;
    case 'target':
      return <Target size={size} className={className} />;
    case 'trendingup':
      return <TrendingUp size={size} className={className} />;
    case 'video':
      return <Video size={size} className={className} />;
    case 'music':
      return <Music size={size} className={className} />;
    case 'code':
      return <Code size={size} className={className} />;
    case 'image':
      return <ImageIcon size={size} className={className} />;
    default:
      return <HelpCircle size={size} className={className} />;
  }
};

export default function StudioPage({ data, onNavigate }: StudioPageProps) {
  const { studioPage } = data;

  const layout = studioPage.layout || [
    { id: 'hero', name: 'Our Story & Manifesto Header', enabled: true },
    { id: 'image', name: 'Featured Studio Image', enabled: true },
    { id: 'philosophy', name: 'Creative Philosophy & Sub-Points', enabled: true },
    { id: 'manifesto', name: 'Strategic Pillars (Manifesto Grid)', enabled: true },
    { id: 'statistics', name: 'Studio Statistics & Scale', enabled: true },
    { id: 'cta', name: 'Portfolio Call-To-Action (CTA)', enabled: true }
  ];

  return (
    <div id="studio-page" className="bg-transparent text-inherit min-h-screen pt-28 pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {layout.filter(section => section.enabled).map((section, idx) => {
          const sectionType = section.id.split('-')[0];
          switch (sectionType) {
            case 'hero':
              return (
                <div key="hero" className="border-b border-neutral-900 pb-12 text-center md:text-left">
                  <span className="font-mono text-xs text-orange-500 tracking-[0.2em] uppercase block mb-3">
                    {studioPage.badge || 'OUR STORY & MANIFESTO'}
                  </span>
                  <h1 className="stretched-text text-4xl sm:text-6xl font-black text-white uppercase tracking-tight scale-x-105 origin-left leading-none mb-6">
                    {studioPage.headline}
                  </h1>
                  <p className="font-sans text-neutral-400 text-sm md:text-base max-w-3xl leading-relaxed mb-4">
                    {studioPage.subtitle}
                  </p>
                  {studioPage.description && (
                    <p className="font-sans text-neutral-500 text-xs md:text-sm max-w-3xl leading-relaxed">
                      {studioPage.description}
                    </p>
                  )}
                  {studioPage.heroShowCta && (
                    <button
                      type="button"
                      onClick={() => {
                        const url = studioPage.heroCtaUrl || 'contact';
                        if (url.startsWith('http') || studioPage.heroCtaNewTab) {
                          window.open(url, studioPage.heroCtaNewTab ? '_blank' : '_self');
                        } else {
                          onNavigate(url as any);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="mt-6 inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
                    >
                      <span>{studioPage.heroCtaText || 'Contact Us'}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              );

            case 'image':
              return (
                <div key="image" className="w-full">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-4">
                    {studioPage.bannerLabel || '01 // COLLABORATIVE WORKSPACE IN TOKYO'}
                  </span>
                  <div className="relative overflow-hidden aspect-[21/9] w-full border border-white/10 rounded-2xl md:rounded-[2rem] bg-neutral-950 group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/25 z-10 pointer-events-none" />
                    
                    <motion.img
                      src={studioPage.bannerImage}
                      alt="Elite designers and directors reviewing storyboards at Kaiju Studios"
                      referrerPolicy="no-referrer"
                      initial={{ scale: 1.15, filter: 'grayscale(100%) brightness(0.15)' }}
                      whileInView={{ scale: 1.0, filter: 'grayscale(100%) brightness(0.65)' }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                    />
                    
                    {/* Soft inner vignette border */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none z-20" />
                    
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
                      <span className="font-mono text-[8px] md:text-[9px] text-orange-400 uppercase tracking-widest bg-black/80 border border-white/10 px-3 py-1.5 rounded-none font-bold">
                        {studioPage.bannerCap || 'KAIJU CORE TEAM // PRODUCTION DECK'}
                      </span>
                    </div>
                  </div>
                </div>
              );

            case 'philosophy':
              return (
                <section key="philosophy" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-5 space-y-6">
                    <span className="font-mono text-xs text-orange-500 block">
                      {studioPage.philosophyBadge || '02 // CREATIVE PHILOSOPHY'}
                    </span>
                    <h2 className="font-sans text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                      {studioPage.philosophyTitle}
                    </h2>
                    <div className="h-1 w-12 bg-orange-500" />
                  </div>
                  
                  <div className="lg:col-span-7 space-y-8 font-sans text-xs md:text-sm text-neutral-400 leading-relaxed border-l border-neutral-900 lg:pl-12">
                    {studioPage.philosophyParagraphs && studioPage.philosophyParagraphs.length > 0 ? (
                      <div className="space-y-4">
                        {studioPage.philosophyParagraphs.map((para, i) => (
                          <p key={i} className="text-neutral-300 font-medium md:text-base leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-300 font-medium md:text-base leading-relaxed">
                        {studioPage.philosophyText}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900">
                      {studioPage.philosophySubPoints?.map((sub, i) => (
                        <div key={i} className="space-y-2">
                          <span className="font-mono text-[10px] text-white uppercase tracking-wider block flex items-center font-bold">
                            {renderIcon(sub.icon)} {sub.title}
                          </span>
                          <p className="text-neutral-500 text-xs leading-relaxed">
                            {sub.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'manifesto':
              return (
                <div key="manifesto" className="w-full">
                  <div className="text-center mb-12">
                    <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-2">
                      {studioPage.manifestoBadge || '03 // STRATEGIC PILLARS'}
                    </span>
                    <h2 className="font-sans text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                      {studioPage.manifestoTitle || 'THE KAIJU MANIFESTO'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studioPage.values?.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-8 bg-[#0a0a0a] border border-neutral-900 rounded-none hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.08)] group"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-6 h-6 bg-orange-500 text-white font-mono text-[10px] font-bold flex items-center justify-center rounded-none shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                            {idx + 1}
                          </div>
                          <h3 className="font-sans text-sm font-bold uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors flex items-center">
                            {item.icon && renderIcon(item.icon)} {item.title}
                          </h3>
                        </div>
                        <p className="font-sans text-xs text-neutral-400 leading-relaxed pl-9">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'statistics':
              return (
                <div key="statistics" className="py-16 border-t border-neutral-900">
                  <span className="font-mono text-xs text-orange-500 tracking-widest block mb-4">
                    {studioPage.statsBadge || '04 // AUTHENTIC VERIFIED PERFORMANCE'}
                  </span>
                  <h3 className="font-sans text-2xl md:text-4xl font-black uppercase tracking-tight mb-12">
                    {studioPage.statsTitle || 'STUDIO STATISTICS & SCALE'}
                  </h3>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {data.metrics.stats?.map((stat) => (
                      <CountUpMetric
                        key={stat.id}
                        value={stat.value}
                        label={stat.label}
                        suffix={stat.suffix}
                      />
                    ))}
                  </div>
                </div>
              );

            case 'cta':
              return (
                <div key="cta" className="bg-neutral-950 border border-neutral-900 p-8 md:p-16 rounded-2xl md:rounded-[2rem] shadow-2xl relative overflow-hidden">
                  {/* Subtle accent blur glow */}
                  <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-6 space-y-6">
                      <span className="font-mono text-xs text-orange-500 tracking-widest block mb-3 flex items-center">
                        <BookOpen size={14} className="mr-1.5" /> {studioPage.ctaBadge || '05 // VISUAL RECONNAISSANCE'}
                      </span>
                      <h3 className="font-sans text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
                        {studioPage.ctaTitle}
                      </h3>
                      <p className="font-sans text-neutral-400 text-xs md:text-sm leading-relaxed max-w-lg">
                        {studioPage.ctaDescription}
                      </p>
                      {studioPage.ctaBtnVisible !== false && (
                        <button
                          onClick={() => {
                            const url = studioPage.ctaBtnUrl || 'portfolio';
                            if (url.startsWith('http') || studioPage.ctaBtnNewTab) {
                              window.open(url, studioPage.ctaBtnNewTab ? '_blank' : '_self');
                            } else {
                              onNavigate(url as any);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
                        >
                          <span>{studioPage.ctaBtnText}</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-xl border border-white/5 bg-neutral-900 group">
                      <img
                        src={studioPage.ctaImage}
                        alt="Bespoke comic artwork production peek"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 right-4 bg-black/85 border border-white/10 px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                        PREVIEW PANELS
                      </div>
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}

      </div>
    </div>
  );
}
