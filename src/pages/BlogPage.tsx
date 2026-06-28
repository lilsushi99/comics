import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, User, Clock, ChevronRight, Search, Tag, X } from 'lucide-react';
import { CMSData, BlogArticle } from '../types';

// Markdown inline and block parser helpers
export function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(<u>([^<]+)<\/u>)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let iterations = 0;
  
  while ((match = regex.exec(text)) !== null && iterations < 500) {
    iterations++;
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }
    
    if (match[1]) {
      const displayText = match[2];
      const url = match[3];
      result.push(
        <a 
          key={`link-${match.index}`} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-orange-500 hover:underline inline font-sans font-semibold"
        >
          {displayText}
        </a>
      );
    } else if (match[4]) {
      result.push(
        <strong key={`bold-${match.index}`} className="font-bold text-white font-sans">
          {match[5]}
        </strong>
      );
    } else if (match[6]) {
      result.push(
        <em key={`italic-${match.index}`} className="italic text-neutral-300 font-sans">
          {match[7]}
        </em>
      );
    } else if (match[8]) {
      result.push(
        <u key={`underline-${match.index}`} className="underline decoration-neutral-400 text-neutral-200 font-sans">
          {match[9]}
        </u>
      );
    }
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  
  return result.length > 0 ? result : [text];
}

export function renderRichContent(text: string): React.ReactNode[] {
  if (!text) return [];
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inList = false;
  let listItems: React.ReactNode[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (line.startsWith('- ')) {
      inList = true;
      listItems.push(
        <li key={`li-${i}`} className="list-disc ml-4 text-neutral-300 font-sans text-xs md:text-sm">
          {parseInline(line.slice(2))}
        </li>
      );
      continue;
    } else if (inList) {
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 my-4 space-y-2 text-neutral-300">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
    
    if (trimmed === '') {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }
    
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-black text-white uppercase mt-6 mb-3 tracking-tight font-sans">
          {parseInline(line.slice(2))}
        </h1>
      );
    }
    else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-black text-white uppercase mt-5 mb-2.5 tracking-tight border-b border-neutral-900 pb-1.5 font-sans">
          {parseInline(line.slice(3))}
        </h2>
      );
    }
    else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-black text-white uppercase mt-4 mb-2 tracking-tight font-sans">
          {parseInline(line.slice(4))}
        </h3>
      );
    }
    else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm font-bold text-neutral-200 uppercase mt-3 mb-1.5 font-sans">
          {parseInline(line.slice(5))}
        </h4>
      );
    }
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${i}`} className="border-l-2 border-orange-500 pl-4 italic text-neutral-400 my-4 bg-neutral-950/50 py-2.5 px-3 rounded-r-xl font-sans">
          {parseInline(line.slice(2))}
        </blockquote>
      );
    }
    else if (line.startsWith('![') && line.includes('](')) {
      const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const alt = match[1];
        const url = match[2];
        elements.push(
          <div key={`img-${i}`} className="my-6">
            <img 
              src={url} 
              alt={alt} 
              referrerPolicy="no-referrer" 
              className="w-full max-w-2xl rounded-2xl border border-neutral-800 object-cover shadow-lg" 
            />
            {alt && alt !== 'Image' && <span className="text-[10px] text-neutral-500 font-mono mt-1.5 block">{alt}</span>}
          </div>
        );
      }
    }
    else if (line.includes('<video ') || line.includes('video src=')) {
      const match = line.match(/src="([^"]+)"/);
      const url = match ? match[1] : '';
      if (url) {
        elements.push(
          <div key={`vid-${i}`} className="my-6">
            <video 
              src={url} 
              controls 
              className="w-full max-w-2xl rounded-2xl border border-neutral-800 shadow-lg bg-black" 
            />
          </div>
        );
      }
    }
    else {
      elements.push(
        <p key={`p-${i}`} className="text-neutral-400 my-2 leading-relaxed font-sans text-xs md:text-sm">
          {parseInline(line)}
        </p>
      );
    }
  }
  
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="ul-final" className="list-disc pl-5 my-4 space-y-2 text-neutral-300">
        {listItems}
      </ul>
    );
  }
  
  return elements;
}

interface BlogPageProps {
  data: CMSData;
  selectedArticle: BlogArticle | null;
  onSelectArticle: (article: BlogArticle | null) => void;
}

export default function BlogPage({ data, selectedArticle, onSelectArticle }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Format body text with basic markdown/HTML blocks for visual richness
  const renderArticleContent = (content: string) => {
    return renderRichContent(content);
  };

  if (selectedArticle) {
    return (
      <div id="blog-reading-view" className="bg-transparent text-inherit min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Back button */}
          <button
            onClick={() => {
              onSelectArticle(null);
              window.scrollTo({ top: 0 });
            }}
            className="inline-flex items-center space-x-2 text-neutral-500 hover:text-white font-mono text-xs uppercase tracking-widest mb-10 group cursor-pointer"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Insights Index</span>
          </button>

          {/* Article Header */}
          <div className="mb-10">
            <div className="flex items-center space-x-4 mb-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              <span className="flex items-center"><Calendar size={12} className="mr-1" /> {selectedArticle.date}</span>
              <span>//</span>
              <span className="flex items-center"><Clock size={12} className="mr-1" /> {selectedArticle.readTime}</span>
              {selectedArticle.category && (
                <>
                  <span>//</span>
                  <span className="text-orange-400 font-bold tracking-wider">{selectedArticle.category}</span>
                </>
              )}
            </div>
            <h1 className="font-sans text-3xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight mb-6">
              {selectedArticle.title}
            </h1>

            {/* Author info */}
            <div className="flex items-center space-x-3 border-y border-neutral-900 py-4 mb-8">
              <div className="w-8 h-8 rounded-none bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[10px] flex items-center justify-center font-bold">
                {selectedArticle.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
                  CONTRIBUTING AUTHOR
                </span>
                <span className="font-sans text-xs font-semibold text-neutral-300">{selectedArticle.author}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden border border-neutral-900 bg-neutral-950 mb-12">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 pointer-events-none" />
          </div>

          {/* Reading body */}
          <div className="prose prose-invert prose-sm max-w-none">
            {renderArticleContent(selectedArticle.content)}
          </div>

          {/* Tags */}
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 pt-6 border-t border-neutral-900">
              {selectedArticle.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center space-x-1 font-mono text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1 rounded-full">
                  <Tag size={10} className="text-neutral-500" />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Bottom navigation helper */}
          <div className="mt-16 pt-10 border-t border-neutral-900 flex justify-between items-center">
            <button
              onClick={() => {
                onSelectArticle(null);
                window.scrollTo({ top: 0 });
              }}
              className="text-neutral-500 hover:text-white font-mono text-xs uppercase tracking-widest cursor-pointer"
            >
              ← Back to index
            </button>
            <span className="font-mono text-[9px] text-neutral-600 uppercase">
              COMICART STUDIO JOURNAL DOCKET
            </span>
          </div>

        </div>
      </div>
    );
  }

  // Categories list
  const categoriesList = ['All', ...(data.blog.categories || ['Industry Insights', 'Comic Production', 'Storytelling', 'Character Design', 'Manga', 'Studio Updates', 'Tutorials'])];

  // Filtering criteria: category filter + text match (title, content, tags, author, excerpt)
  const filteredArticles = data.blog.articles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesTitle = article.title.toLowerCase().includes(query);
    const matchesExcerpt = article.excerpt.toLowerCase().includes(query);
    const matchesContent = article.content.toLowerCase().includes(query);
    const matchesAuthor = article.author.toLowerCase().includes(query);
    const matchesTags = article.tags?.some(tag => tag.toLowerCase().includes(query)) || false;

    return matchesCategory && (matchesTitle || matchesExcerpt || matchesContent || matchesAuthor || matchesTags);
  });

  // Check if filtering is active
  const isFilteringActive = searchQuery.trim() !== '' || selectedCategory !== 'All';

  // Traditional Layout setup: featured is the first one, the rest are recent
  // If filtering is active, we just display all matching results inside the grid
  const featuredArticle = !isFilteringActive && filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = featuredArticle ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div id="blog-index-page" className="bg-transparent text-inherit min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="border-b border-white/5 pb-10 mb-12 text-center md:text-left">
          <span className="font-mono text-xs text-orange-500 tracking-[0.2em] uppercase block mb-3">
            05 // TECHNICAL JOURNAL & ESSAYS
          </span>
          <h1 className="stretched-text text-4xl sm:text-6xl font-black text-white uppercase tracking-tight scale-x-105 origin-left leading-none mb-6">
            STUDIO INSIGHTS
          </h1>
          <p className="font-sans text-neutral-400 text-sm max-w-2xl leading-relaxed">
            Read professional insights from our lead ink coordinators, panel directors, and character designers about high-contrast comic craftsmanship.
          </p>
        </div>

        {/* Categories (Mobile Tabs) & Search Bar (Both Desktop and Mobile) */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Search bar row */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search essays by title, author, hashtags (#screentones) or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3.5 pl-12 pr-10 text-xs sm:text-sm font-sans focus:outline-none focus:border-orange-500/50 transition-colors text-white placeholder-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-neutral-500 hover:text-white"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mobile Category Horizontal Slider */}
          <div className="lg:hidden w-full overflow-x-auto scrollbar-none flex items-center space-x-2 pb-2">
            {categoriesList.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider shrink-0 border transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-500 border-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] font-bold'
                    : 'bg-[#0d0d0d] border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Desktop Sidebar Categories */}
          <aside className="hidden lg:block lg:col-span-3 border-r border-white/5 pr-8 h-fit sticky top-28">
            <h3 className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 pb-2 border-b border-neutral-900 flex items-center space-x-1.5">
              <span>EXPLORE CATEGORIES</span>
            </h3>
            <ul className="space-y-2">
              {categoriesList.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left font-mono text-[10px] md:text-xs uppercase tracking-widest py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                      selectedCategory === category
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold'
                        : 'text-neutral-400 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className={`w-1.5 h-1.5 mr-2.5 rounded-full ${selectedCategory === category ? 'bg-orange-500' : 'bg-transparent group-hover:bg-neutral-600'}`} />
                      {category}
                    </span>
                    <span className="text-[9px] text-neutral-600 group-hover:text-neutral-400 font-mono">
                      ({
                        category === 'All'
                          ? data.blog.articles.length
                          : data.blog.articles.filter(a => a.category === category).length
                      })
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Right Column: Search Results / Articles lists */}
          <main className="lg:col-span-9 flex flex-col">
            
            {/* Status indicators */}
            {isFilteringActive && (
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-900">
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  FILTER ACTIVE: <span className="text-orange-400 font-bold">"{selectedCategory}"</span>
                  {searchQuery && <> + KEYWORD: <span className="text-orange-400 font-bold">"{searchQuery}"</span></>}
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 hover:text-white flex items-center space-x-1 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded"
                >
                  <X size={10} />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}

            {/* Zero Results Handling */}
            {filteredArticles.length === 0 ? (
              <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-16 text-center">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded-full flex items-center justify-center mx-auto mb-4 font-mono text-lg">
                  ?
                </div>
                <h3 className="font-sans text-lg font-black uppercase tracking-tight text-white mb-2">No Matching Essays Found</h3>
                <p className="font-sans text-xs text-neutral-500 max-w-md mx-auto mb-6">
                  We couldn't find any articles matching your search query or category filter. Try clearing filters or searching for terms like "G-Pen", "screentones", or "silhouette".
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg font-bold"
                >
                  Reset Studio Filters
                </button>
              </div>
            ) : (
              <>
                {/* 1. Featured Big Article - Only if not filtering */}
                {featuredArticle && (
                  <div
                    onClick={() => {
                      onSelectArticle(featuredArticle);
                      window.scrollTo({ top: 0 });
                    }}
                    className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-2xl mb-10 cursor-pointer hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)] transition-all duration-500 animate-fade-in"
                  >
                    <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[220px] overflow-hidden bg-black border border-white/5 rounded-xl">
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.025] transition-all duration-700"
                      />
                      {featuredArticle.category && (
                        <div className="absolute top-4 left-4 bg-orange-500 text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-lg">
                          {featuredArticle.category}
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-5 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center space-x-3 text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                          <span className="text-orange-400 font-bold tracking-wider">// FEATURED ESSAY</span>
                          <span>{featuredArticle.date}</span>
                        </div>
                        <h2 className="font-sans text-lg md:text-xl font-black uppercase text-white tracking-tight leading-tight mb-3 group-hover:text-orange-400 transition-colors duration-300">
                          {featuredArticle.title}
                        </h2>
                        <p className="font-sans text-xs text-neutral-400 leading-relaxed line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 border-t border-white/5 pt-4">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">
                          BY: {featuredArticle.author}
                        </span>
                        <span className="font-mono text-[9px] text-orange-400 uppercase tracking-widest group-hover:underline flex items-center space-x-1 shrink-0 font-bold">
                          <span>Read Article</span>
                          <ChevronRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Grid Articles */}
                <div>
                  <h3 className="font-mono text-xs text-neutral-500 tracking-widest uppercase mb-6 flex items-center">
                    <BookOpen size={12} className="mr-1.5 text-neutral-400" />
                    <span>{isFilteringActive ? `FILTERED JOURNAL DOCKET (${filteredArticles.length})` : 'RECENT ENTRIES'}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {gridArticles.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => {
                          onSelectArticle(article);
                          window.scrollTo({ top: 0 });
                        }}
                        className="bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col justify-between transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)] group cursor-pointer"
                      >
                        <div>
                          <div className="relative aspect-video overflow-hidden mb-4 border border-white/5 rounded-xl bg-black">
                            <img
                              src={article.image}
                              alt={article.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                            {article.category && (
                              <div className="absolute top-3 left-3 bg-neutral-900/90 border border-white/10 text-orange-400 font-mono text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                                {article.category}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 mb-2.5">
                            <span className="font-mono text-[9px] text-neutral-500 uppercase">{article.date}</span>
                            <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                            <span className="font-mono text-[9px] text-neutral-400 uppercase">{article.readTime}</span>
                          </div>
                          <h3 className="font-sans text-xs sm:text-sm font-black uppercase text-white tracking-tight mb-2 group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-neutral-400 font-sans text-[11px] leading-relaxed line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* Card bottom details */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-3.5">
                          <span className="font-mono text-[9px] text-neutral-500 uppercase">
                            BY: {article.author}
                          </span>
                          <span className="text-orange-400 font-mono text-[9px] uppercase tracking-widest group-hover:underline font-bold">
                            Read →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}
