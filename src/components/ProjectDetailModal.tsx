import React from 'react';
import { X, Calendar, User, Hammer, CheckCircle2 } from 'lucide-react';
import { PortfolioProject } from '../types';
import { motion } from 'motion/react';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  const [activeImage, setActiveImage] = React.useState(project.image);

  React.useEffect(() => {
    setActiveImage(project.image);
  }, [project]);

  return (
    <div
      id="project-detail-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        id="project-detail-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-900 rounded-none overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/80 hover:bg-neutral-800 text-white p-2 rounded-none border border-neutral-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Left Side: Large Artwork Panel & Gallery Thumbnails */}
        <div className="relative flex flex-col bg-neutral-950 border-r border-neutral-900 justify-between">
          <div className="relative flex-1 min-h-[300px] h-64 md:h-[450px] overflow-hidden flex items-center justify-center bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src={activeImage}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <span className="bg-white text-black font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold">
                {project.category}
              </span>
              {project.tag && (
                <span className="ml-2 bg-neutral-900 text-neutral-300 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 border border-neutral-800">
                  {project.tag}
                </span>
              )}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="p-4 bg-neutral-950/90 border-t border-neutral-900 flex gap-2 overflow-x-auto scrollbar-thin shrink-0">
              {/* Cover Image thumbnail */}
              <button
                onClick={() => setActiveImage(project.image)}
                className={`w-14 h-14 bg-neutral-900 border overflow-hidden cursor-pointer shrink-0 transition-all ${
                  activeImage === project.image ? 'border-orange-500 scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={project.image} alt="Cover Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
              {/* Additional Gallery images thumbnails */}
              {project.galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-14 h-14 bg-neutral-900 border overflow-hidden cursor-pointer shrink-0 transition-all ${
                    activeImage === imgUrl ? 'border-orange-500 scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Narrative Details Breakdown */}
        <div className="p-6 md:p-10 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div>
            <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block mb-1">
              STUDIO PORTFOLIO EXCERPT
            </span>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 leading-none">
              {project.title}
            </h2>

            <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Project Specs Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-900 mb-6">
              <div className="flex items-center space-x-2 text-neutral-300">
                <User size={14} className="text-neutral-500" />
                <div>
                  <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
                    CLIENT
                  </span>
                  <span className="font-sans text-xs font-semibold">{project.client}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-neutral-300">
                <Calendar size={14} className="text-neutral-500" />
                <div>
                  <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
                    YEAR
                  </span>
                  <span className="font-sans text-xs font-semibold">{project.year}</span>
                </div>
              </div>
            </div>

            {/* Tools Used */}
            <div className="mb-6">
              <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-2 flex items-center">
                <Hammer size={10} className="mr-1" /> CORE PRODUCTION TOOLS
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-1"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Creative details (Visual Breakdowns) */}
            <div>
              <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                VISUAL PRODUCTION SPECIFICS
              </span>
              <ul className="space-y-2.5">
                {project.visualDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-neutral-300">
                    <CheckCircle2 size={12} className="text-white mt-0.5 shrink-0" />
                    <span className="font-sans leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-900 pt-6">
            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-neutral-200 text-black py-2 text-center font-mono text-xs uppercase tracking-widest transition-colors rounded-none"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
