import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, Grid } from 'lucide-react';
import { CMSData, PortfolioProject } from '../types';

interface PortfolioPageProps {
  data: CMSData;
  onSelectProject: (project: PortfolioProject) => void;
}

export default function PortfolioPage({ data, onSelectProject }: PortfolioPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...data.portfolio.categories];

  const filteredProjects = data.portfolio.projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="portfolio-page" className="bg-transparent text-inherit min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="border-b border-neutral-900 pb-12 mb-16 text-center md:text-left">
          <span className="font-mono text-xs text-neutral-500 tracking-[0.2em] uppercase block mb-3">
            SEQUENTIAL CREATIVE DIRECTORY
          </span>
          <h1 className="stretched-text text-4xl sm:text-6xl font-black text-white uppercase tracking-tight scale-x-105 origin-left leading-none mb-6">
            STUDIO PORTFOLIO
          </h1>
          <p className="font-sans text-neutral-400 text-sm max-w-2xl leading-relaxed">
            Browse through our award-winning history of serialized manga publication runs, mobile webtoons, high-impact western comic pencils, and comprehensive visual developments.
          </p>
        </div>

        {/* Search and Filters Hub */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-12">
          {/* Categories list */}
          <div id="portfolio-page-filters" className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all rounded-full cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                    : 'bg-[#121212] text-neutral-400 border border-white/10 hover:text-white hover:border-orange-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-grow md:max-w-xs">
            <input
              type="text"
              placeholder="Search by title, tag or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/60 border border-white/10 text-white font-sans text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500/50 transition-colors"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mb-6 pb-2 border-b border-neutral-950">
          <span className="flex items-center gap-1.5">
            <Grid size={12} />
            SHOWING {filteredProjects.length} PORTFOLIO REGISTER ENTRIES
          </span>
          {searchQuery && (
            <span>
              FILTERED BY "{searchQuery.toUpperCase()}"
            </span>
          )}
        </div>

        {/* Portfolio gallery */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950/20 border border-neutral-950">
            <span className="block font-mono text-sm text-neutral-500 uppercase mb-2">No Matching Records Found</span>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              We haven't indexed any projects matching those filters. Adjust your categorical checkboxes or simplify your search phrasing.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-6 font-mono text-xs uppercase bg-white text-black px-6 py-2.5"
            >
              Clear Active Filters
            </button>
          </div>
        ) : (
          <div id="portfolio-page-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.1)]"
              >
                {/* Image layout container */}
                <div className="relative aspect-[3/4] overflow-hidden border-b border-white/10 bg-black">
                  <div className="absolute top-3 left-3 z-10 flex space-x-2">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                </div>

                {/* Info and action */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="font-sans text-base font-bold text-white uppercase tracking-tight mb-2 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-neutral-400 font-sans text-xs leading-relaxed mb-4">
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
        )}

        {/* Aesthetic footer notice */}
        <div className="mt-24 bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-orange-500 text-white p-2.5 flex items-center justify-center font-bold rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              ★
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase text-white leading-none mb-1">
                COMMISSION A CUSTOM MASTERPIECE?
              </h4>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                Bring your custom characters, environments, or serial concepts to life.
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              const navbar = document.getElementById('main-navbar');
              if (navbar) {
                // Trigger navigation to contact page
                const link = document.getElementById('nav-link-contact');
                if (link) link.click();
              }
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0 cursor-pointer"
          >
            Start Project Pitch
          </button>
        </div>

      </div>
    </div>
  );
}
