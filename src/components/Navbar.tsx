import React, { useState, useEffect } from 'react';
import { Menu, X, Sliders } from 'lucide-react';
import { NavigationConfig, GlobalSettings } from '../types';

interface NavbarProps {
  config: NavigationConfig;
  currentPage: 'home' | 'portfolio' | 'studio' | 'blog' | 'contact';
  onNavigate: (page: 'home' | 'portfolio' | 'studio' | 'blog' | 'contact') => void;
  onOpenCMS: () => void;
  globalSettings?: GlobalSettings;
}

export default function Navbar({ config, currentPage, onNavigate, onOpenCMS, globalSettings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (page: 'home' | 'portfolio' | 'studio' | 'blog' | 'contact') => {
    onNavigate(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-neutral-900 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo area */}
        <button
          id="nav-logo"
          onClick={() => handleLinkClick('home')}
          className="flex items-center space-x-3 cursor-pointer group text-left"
        >
          {globalSettings?.logoUrl ? (
            <img
              src={globalSettings.logoUrl}
              alt={globalSettings.websiteName || config.logoText}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col items-start text-left">
              <span className="font-mono text-2xl font-black tracking-widest text-white leading-none transition-transform group-hover:scale-105">
                {globalSettings?.websiteName || config.logoText}
              </span>
              <span className="font-sans text-[9px] tracking-[0.3em] font-medium text-neutral-400 leading-none mt-1">
                {config.logoSubtext}
              </span>
            </div>
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {config.links.map((link) => (
            <button
              key={link.page}
              id={`nav-link-${link.page}`}
              onClick={() => handleLinkClick(link.page as any)}
              className={`font-mono text-xs tracking-widest uppercase transition-colors relative py-1 cursor-pointer ${
                currentPage === link.page
                  ? 'text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
              {currentPage === link.page && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
            </button>
          ))}
        </div>

        {/* Studio CMS Activation & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-x-0 top-[60px] bg-black border-b border-neutral-900 z-30 px-6 py-8 flex flex-col space-y-6"
        >
          {config.links.map((link) => (
            <button
              key={link.page}
              id={`mobile-nav-link-${link.page}`}
              onClick={() => handleLinkClick(link.page as any)}
              className={`text-left font-mono text-sm tracking-widest uppercase py-2 border-b border-neutral-950 ${
                currentPage === link.page ? 'text-white font-black' : 'text-neutral-400'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
