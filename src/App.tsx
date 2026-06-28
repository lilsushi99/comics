import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCMSData, saveCMSDataToServer, resetCMSDataOnServer, fetchCMSDataFromServer } from './data';
import { CMSData, PortfolioProject, BlogArticle } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PortfolioPage from './pages/PortfolioPage';
import StudioPage from './pages/StudioPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import AdminPanel from './components/AdminPanel';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [cmsData, setCmsData] = useState<CMSData>(getCMSData());
  const [currentPage, setCurrentPage] = useState<CMSData['navigation']['links'][0]['page']>('home');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.pathname === '/goat02');

  // Expose global tracker helper for buttons and page views
  useEffect(() => {
    (window as any).trackAnalyticsEvent = (event: {
      type: 'visit' | 'pageview' | 'button_click' | 'lead';
      page?: string;
      buttonId?: string;
      leadType?: string;
      projectId?: string;
    }) => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.analytics) {
            // Keep local state in sync if we want immediate updates
            setCmsData(prev => ({
              ...prev,
              analytics: data.analytics
            }));
          }
        })
        .catch(err => console.warn('Tracker failed', err));
    };
  }, []);

  // Automatically track page views on navigation
  useEffect(() => {
    if (window.location.pathname !== '/goat02') {
      if ((window as any).trackAnalyticsEvent) {
        (window as any).trackAnalyticsEvent({ type: 'pageview', page: currentPage });
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'pageview', page: currentPage })
        }).catch(err => console.warn('Tracker failed', err));
      }
    }
  }, [currentPage]);

  // Synchronize state when custom event triggers or fetch on load
  useEffect(() => {
    const handleCmsUpdate = () => {
      setCmsData(getCMSData());
    };
    window.addEventListener('cms_data_updated', handleCmsUpdate);

    // Initial server fetch to load actual production database
    const syncWithServer = async () => {
      const serverData = await fetchCMSDataFromServer();
      setCmsData(serverData);
      if (window.location.pathname !== '/goat02') {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'visit' })
        }).catch(err => console.warn('Failed to register visit tracker', err));
      }
    };
    syncWithServer();

    // Enforce robots.txt noindex metadata dynamically
    if (window.location.pathname === '/goat02') {
      let meta = document.querySelector('meta[name="robots"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'robots');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', 'noindex, nofollow');
    }

    return () => window.removeEventListener('cms_data_updated', handleCmsUpdate);
  }, []);

  // Dynamic SEO & Search Engine Meta updating
  useEffect(() => {
    if (isAdminRoute) return;

    const pageKey = currentPage === 'home' ? 'home' : 
                    currentPage === 'portfolio' ? 'portfolio' : 
                    currentPage === 'studio' ? 'studio' : 
                    currentPage === 'blog' ? 'blog' : 
                    currentPage === 'contact' ? 'contact' : 'home';

    const pageSeo = cmsData.globalSettings?.pageSeo?.[pageKey];
    
    const title = pageSeo?.metaTitle || cmsData.globalSettings?.seoTitle || cmsData.globalSettings?.browserTitle || 'STUDIO KAIJU';
    document.title = title;

    const desc = pageSeo?.metaDescription || cmsData.globalSettings?.seoDescription || 'Studio Kaiju - Premium Comic Art & Manga Agency';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    const keywords = pageSeo?.keywords || cmsData.globalSettings?.seoKeywords || 'comic art, manga, storyboards';
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    const ogTitle = pageSeo?.ogTitle || cmsData.globalSettings?.seoOgTitle || title;
    let metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (!metaOgTitle) {
      metaOgTitle = document.createElement('meta');
      metaOgTitle.setAttribute('property', 'og:title');
      document.head.appendChild(metaOgTitle);
    }
    metaOgTitle.setAttribute('content', ogTitle);

    const ogDesc = pageSeo?.ogDescription || cmsData.globalSettings?.seoOgDescription || desc;
    let metaOgDesc = document.querySelector('meta[property="og:description"]');
    if (!metaOgDesc) {
      metaOgDesc = document.createElement('meta');
      metaOgDesc.setAttribute('property', 'og:description');
      document.head.appendChild(metaOgDesc);
    }
    metaOgDesc.setAttribute('content', ogDesc);

    const ogImage = cmsData.globalSettings?.seoOgImageUrl || cmsData.globalSettings?.seoShareImageUrl;
    if (ogImage) {
      let metaOgImage = document.querySelector('meta[property="og:image"]');
      if (!metaOgImage) {
        metaOgImage = document.createElement('meta');
        metaOgImage.setAttribute('property', 'og:image');
        document.head.appendChild(metaOgImage);
      }
      metaOgImage.setAttribute('content', ogImage);
    }

    const twitterTitle = pageSeo?.twitterTitle || cmsData.globalSettings?.seoTwitterTitle || title;
    let metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!metaTwitterTitle) {
      metaTwitterTitle = document.createElement('meta');
      metaTwitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(metaTwitterTitle);
    }
    metaTwitterTitle.setAttribute('content', twitterTitle);

    const twitterDesc = pageSeo?.twitterDescription || cmsData.globalSettings?.seoTwitterDescription || desc;
    let metaTwitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!metaTwitterDesc) {
      metaTwitterDesc = document.createElement('meta');
      metaTwitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(metaTwitterDesc);
    }
    metaTwitterDesc.setAttribute('content', twitterDesc);

    const twitterImage = cmsData.globalSettings?.seoTwitterImageUrl || cmsData.globalSettings?.seoShareImageUrl;
    if (twitterImage) {
      let metaTwitterImg = document.querySelector('meta[name="twitter:image"]');
      if (!metaTwitterImg) {
        metaTwitterImg = document.createElement('meta');
        metaTwitterImg.setAttribute('name', 'twitter:image');
        document.head.appendChild(metaTwitterImg);
      }
      metaTwitterImg.setAttribute('content', twitterImage);
    }

    const canonical = pageSeo?.canonicalUrl || cmsData.globalSettings?.seoCanonicalUrl;
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }

    const schemaData = pageSeo?.structuredData || cmsData.globalSettings?.seoDefaultSchema;
    if (schemaData) {
      let scriptSchema = document.querySelector('script[type="application/ld+json"]');
      if (!scriptSchema) {
        scriptSchema = document.createElement('script');
        scriptSchema.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptSchema);
      }
      try {
        scriptSchema.textContent = JSON.stringify(JSON.parse(schemaData));
      } catch {
        scriptSchema.textContent = schemaData;
      }
    }

    const faviconUrl = cmsData.globalSettings?.faviconUrl || cmsData.navigation?.favicon;
    if (faviconUrl) {
      let linkFavicon = document.querySelector('link[rel~="icon"]');
      if (!linkFavicon) {
        linkFavicon = document.createElement('link');
        linkFavicon.setAttribute('rel', 'icon');
        document.head.appendChild(linkFavicon);
      }
      linkFavicon.setAttribute('href', faviconUrl);
    }
  }, [currentPage, cmsData.globalSettings, isAdminRoute]);

  const handleSaveCMS = async (newData: CMSData) => {
    setCmsData(newData);
    await saveCMSDataToServer(newData);
  };

  const handleResetCMS = async () => {
    const defaultData = await resetCMSDataOnServer();
    setCmsData(defaultData);
  };

  const handleNavigate = (page: typeof currentPage) => {
    setCurrentPage(page);
    // Clear sub-page detail selectors when moving around
    setSelectedArticle(null);
    setSelectedProject(null);
  };

  const handleSelectProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    if ((window as any).trackAnalyticsEvent) {
      (window as any).trackAnalyticsEvent({ type: 'pageview', page: 'portfolio', projectId: project.id });
    }
  };

  const handleSelectArticle = (article: BlogArticle | null) => {
    setSelectedArticle(article);
    if (article) {
      setCurrentPage('blog');
    }
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            data={cmsData}
            onNavigate={handleNavigate}
            onSelectProject={handleSelectProject}
            onSelectArticle={handleSelectArticle}
          />
        );
      case 'portfolio':
        return (
          <PortfolioPage
            data={cmsData}
            onSelectProject={handleSelectProject}
          />
        );
      case 'studio':
        return <StudioPage data={cmsData} onNavigate={handleNavigate} />;
      case 'blog':
        return (
          <BlogPage
            data={cmsData}
            selectedArticle={selectedArticle}
            onSelectArticle={setSelectedArticle}
          />
        );
      case 'contact':
        return <ContactPage data={cmsData} />;
      default:
        return (
          <Home
            data={cmsData}
            onNavigate={handleNavigate}
            onSelectProject={handleSelectProject}
            onSelectArticle={handleSelectArticle}
          />
        );
    }
  };

  // If visiting the secret /goat02 route, render the powerful Neubrutalist Fullscreen Admin Panel
  if (isAdminRoute) {
    return (
      <div id="admin-viewport" className="bg-neutral-950 text-white min-h-screen">
        <AdminPanel
          data={cmsData}
          isOpen={true}
          onClose={() => {
            // Re-route back to home page if they exit
            window.history.pushState({}, '', '/');
            setIsAdminRoute(false);
          }}
          onSave={handleSaveCMS}
          onReset={handleResetCMS}
        />
      </div>
    );
  }

  const activeTheme = cmsData.hero?.activeTheme || 'theme-2';
  const getThemeClass = () => {
    switch (activeTheme) {
      case 'theme-1': return 'theme-4k-gradient bg-neutral-950 text-white';
      case 'theme-2': return 'theme-starfield-a bg-black text-white';
      case 'theme-3': return 'theme-starfield-b bg-black text-white';
      case 'theme-4': return 'theme-deep-black bg-black text-white';
      default:
        return 'theme-starfield-a bg-black text-white';
    }
  };

  const isStarfieldCursor = activeTheme === 'theme-2' || activeTheme === 'theme-3';

  return (
    <div
      id="applet-viewport"
      className={`${getThemeClass()} min-h-screen relative flex flex-col font-sans antialiased selection:bg-white selection:text-black ${
        isStarfieldCursor ? 'cursor-none' : ''
      }`}
    >
      {!isAdminRoute && (
        <style>{`
          :root {
            --color-primary: ${cmsData.globalSettings?.primaryColor || '#f97316'};
            --color-secondary: ${cmsData.globalSettings?.secondaryColor || '#1c1917'};
            --color-accent: ${cmsData.globalSettings?.accentColor || '#f97316'};
            --color-bg: ${cmsData.globalSettings?.backgroundColor || '#0c0a09'};
            --color-surface: ${cmsData.globalSettings?.surfaceColor || '#1c1917'};
            --color-text: ${cmsData.globalSettings?.textColor || '#ffffff'};
            --color-border: ${cmsData.globalSettings?.borderColor || '#292524'};
            --color-hover: ${cmsData.globalSettings?.hoverColor || '#ea580c'};
            --color-button: ${cmsData.globalSettings?.buttonColor || '#f97316'};
          }

          #applet-viewport, body {
            background-color: ${cmsData.globalSettings?.backgroundColor || '#0c0a09'} !important;
            color: ${cmsData.globalSettings?.textColor || '#ffffff'} !important;
          }

          .bg-[#0e0e12], .bg-neutral-950, .bg-[#0d0d10], .bg-[#0a0a0a], .bg-[#050505], .bg-[#070707], .bg-neutral-900, .bg-zinc-950 {
            background-color: ${cmsData.globalSettings?.surfaceColor || '#1c1917'} !important;
          }

          .bg-orange-500, .btn-primary, .cta-btn, button.bg-orange-500 {
            background-color: ${cmsData.globalSettings?.buttonColor || '#f97316'} !important;
            color: ${cmsData.globalSettings?.textColor === '#ffffff' ? '#000000' : '#ffffff'} !important;
          }

          .bg-orange-500:hover, .btn-primary:hover, .cta-btn:hover, button.bg-orange-500:hover {
            background-color: ${cmsData.globalSettings?.hoverColor || '#ea580c'} !important;
          }

          .text-orange-500, .text-orange-400 {
            color: ${cmsData.globalSettings?.primaryColor || '#f97316'} !important;
          }

          .border-orange-500 {
            border-color: ${cmsData.globalSettings?.primaryColor || '#f97316'} !important;
          }

          .border-neutral-800, .border-neutral-900, .border-neutral-850, .border-white\\/10, .border-white\\/5 {
            border-color: ${cmsData.globalSettings?.borderColor || '#292524'} !important;
          }

          .text-neutral-400 {
            color: ${cmsData.globalSettings?.textColor || '#ffffff'}cc !important;
          }
          .text-neutral-500 {
            color: ${cmsData.globalSettings?.textColor || '#ffffff'}99 !important;
          }
        `}</style>
      )}
      {isStarfieldCursor && <CustomCursor />}
      
      {/* Sticky Top Navbar */}
      <Navbar
        config={cmsData.navigation}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCMS={() => {}}
        globalSettings={cmsData.globalSettings}
      />

      {/* Main Page Rendering Workspace with Smooth motion transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + (selectedArticle ? `-${selectedArticle.id}` : '')}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="flex-1"
        >
          {renderActivePage()}
        </motion.div>
      </AnimatePresence>

      {/* Persistent Global Footer Coordinates */}
      <Footer
        config={cmsData.footer}
        links={cmsData.navigation.links}
        onNavigate={handleNavigate}
        globalSettings={cmsData.globalSettings}
      />

      {/* Modal: View Visual Portfolio Details */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
