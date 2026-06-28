import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Save, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, Sliders, Settings, 
  Image as ImageIcon, Video, Music, Link as LinkIcon, Copy, Eye, PlusCircle, Check, 
  Type, List, Bold, Italic, Quote, Code, ArrowLeft, ArrowRight, ExternalLink, EyeOff, 
  FileText, Upload, FolderOpen, Shield, ShieldAlert, User, Database, Layout, 
  Activity, BarChart2, MessageSquare, HelpCircle, FileCheck, Share2, Compass, 
  Lightbulb, ShieldCheck, BookOpen, Layers, Lock, Sparkles, Globe, Palette, Film,
  Clock, Hash, Terminal, Smartphone, Calendar, UserCheck, Inbox, Server, Paperclip, Mail
} from 'lucide-react';
import { 
  CMSData, PortfolioProject, BlogArticle, TestimonialItem, FAQItem, 
  InquiryFormField, ProcessStep, MetricItem, SocialConfig, HomepageLayoutSection, HeroButton, MediaItem,
  GlobalSettings
} from '../types';
import { fetchCMSDataFromServer } from '../data';
import MediaPicker from './MediaPicker';
import ContactCMSView from './ContactCMSView';
import InboxCMSView from './InboxCMSView';
import SMTPSettingsView from './SMTPSettingsView';

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

interface SimpleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

function SimpleImageUpload({ value, onChange, label }: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to upload image.');
      
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        throw new Error(result.message || 'Invalid upload response.');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
      <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider font-bold block">{label}</span>
      
      {value ? (
        <div className="relative w-28 h-28 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer shadow-md"
            title="Delete Image"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ) : (
        <div className="w-28 h-28 bg-neutral-950 border border-dashed border-neutral-800 rounded-lg flex items-center justify-center">
          <ImageIcon className="text-neutral-600" size={24} />
        </div>
      )}

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-[10px] font-mono uppercase text-white rounded-lg border border-neutral-700 transition-colors cursor-pointer flex items-center space-x-1"
        >
          <Upload size={10} />
          <span>{uploading ? 'Uploading...' : 'Upload From Device'}</span>
        </button>
      </div>

      {error && (
        <p className="text-[9px] font-mono text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

interface AdminPanelProps {
  data: CMSData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: CMSData) => void;
  onReset: () => void;
}

export default function AdminPanel({ data, isOpen, onClose, onSave, onReset }: AdminPanelProps) {
  // Authentication State (Laravel Auth Emulation)
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('cms_logged_in') === 'true');
  const [email, setEmail] = useState('admin@kaijustudios.com');
  const [password, setPassword] = useState('admin-kaiju');
  const [loginError, setLoginError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'themes' | 'layout' | 'portfolio' | 'blog' | 'studio' | 'testimonials' | 'outreach' | 'media' | 'settings' | 'contact-cms' | 'inbox-cms' | 'smtp-settings'>('dashboard');
  const [tempData, setTempData] = useState<CMSData>(JSON.parse(JSON.stringify(data)));
  
  // Dynamic Analytics State Filter Controls
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | '7days' | '30days' | '90days' | 'custom'>('7days');
  const [startDate, setStartDate] = useState('2026-03-23');
  const [endDate, setEndDate] = useState('2026-06-26');
  const [dashboardSubTab, setDashboardSubTab] = useState<'overview' | 'visitors' | 'conversions' | 'portfolio' | 'leads' | 'devices'>('overview');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; visitors: number; date: string } | null>(null);
  
  // Sub-editors
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [blogStep, setBlogStep] = useState<'write' | 'media' | 'seo'>('write');
  
  // Input fields for categories
  const [newCatName, setNewCatName] = useState('');
  const [newBlogCatName, setNewBlogCatName] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date().toISOString().slice(11, 19)}] Booting Laravel v12.1.0 framework...`,
    `[${new Date().toISOString().slice(11, 19)}] Loaded cached route provider 'routes/admin.php' with prefix /goat02`,
    `[${new Date().toISOString().slice(11, 19)}] Connection established with MySQL Relational Schema`,
    `[${new Date().toISOString().slice(11, 19)}] Symbolic link /public/storage initialized successfully`,
    `[${new Date().toISOString().slice(11, 19)}] System secure session active: Sanctum gateway listening`
  ]);

  // Ref for Blog Editor Cursor control
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Autosave State & Stable Handler Ref
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [secondsSinceLastSave, setSecondsSinceLastSave] = useState<number>(0);
  
  // Inbox, SMTP, and dynamic form builder sub-states
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'all' | 'new' | 'open' | 'replied' | 'closed'>('all');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingSubmissionId, setReplyingSubmissionId] = useState<string | null>(null);
  const [smtpTestLogs, setSmtpTestLogs] = useState<string[]>([]);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'budget' | 'file' | 'image'>('text');

  // Sub-tabs for the restructured consolidated Global Website Settings
  const [settingsSubTab, setSettingsSubTab] = useState<'branding' | 'socials' | 'seo'>('branding');
  const [selectedSeoPage, setSelectedSeoPage] = useState<'home' | 'portfolio' | 'studio' | 'blog' | 'contact'>('home');

  const [currentServerTime, setCurrentServerTime] = useState<string>('');

  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Track seconds since last saved and current server time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentServerTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(() => {
      updateTime();
      if (lastSavedTime) {
        const seconds = Math.floor((new Date().getTime() - lastSavedTime.getTime()) / 1000);
        setSecondsSinceLastSave(seconds);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSavedTime]);

  // Handle automatic saving of any tempData changes
  useEffect(() => {
    const hasChanges = JSON.stringify(tempData) !== JSON.stringify(data);
    if (hasChanges) {
      setSaveStatus('dirty');
      
      const delayDebounceFn = setTimeout(async () => {
        setSaveStatus('saving');
        try {
          await onSaveRef.current(tempData);
          setSaveStatus('saved');
          setLastSavedTime(new Date());
          setSecondsSinceLastSave(0);
          logAction(`Autosave completed: content synchronized.`);
        } catch (err) {
          console.error('Autosave failed', err);
          setSaveStatus('dirty');
        }
      }, 4000); // 4 seconds debounce for stable user typing

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSaveStatus('saved');
    }
  }, [tempData, data]);

  // Synchronize state with incoming fresh data from server
  useEffect(() => {
    setTempData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  // Append new logs simulated for professional terminal feel
  const logAction = (msg: string) => {
    setSystemLogs(prev => [...prev.slice(-15), `[${new Date().toISOString().slice(11, 19)}] ${msg}`]);
  };

  const refreshMediaLibrary = async () => {
    const freshData = await fetchCMSDataFromServer();
    if (freshData && freshData.mediaLibrary) {
      setTempData(prev => ({ ...prev, mediaLibrary: freshData.mediaLibrary }));
    }
  };

  if (!isOpen) return null;

  // Handle Authentication submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthenticating(true);

    try {
      let response = await fetch('/goat02/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsLoggedIn(true);
          sessionStorage.setItem('cms_logged_in', 'true');
          logAction(`Admin authenticated: session token generated.`);
        } else {
          setLoginError(result.message || 'Access Denied.');
        }
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setLoginError('Could not reach backend authentication endpoint.');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('cms_logged_in');
  };

  const handleSave = async () => {
    onSave(tempData);
    logAction(`Committed database transactions successfully.`);
    alert('SUCCESS: CMS database tables updated and production node synchronized!');
  };

  const handleReset = () => {
    if (window.confirm('CRITICAL WARN: Are you sure you want to revert all CMS database records to original presets? This action overrides MySQL emulations.')) {
      onReset();
      logAction(`Rolled back local MySQL modifications to baseline seeds.`);
    }
  };

  const updateField = (section: keyof CMSData, field: string, value: any) => {
    setTempData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  // Re-order Layout sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const layout = [...(tempData.homepageLayout || [])];
    if (direction === 'up' && index > 0) {
      const temp = layout[index];
      layout[index] = layout[index - 1];
      layout[index - 1] = temp;
    } else if (direction === 'down' && index < layout.length - 1) {
      const temp = layout[index];
      layout[index] = layout[index + 1];
      layout[index + 1] = temp;
    }
    setTempData(prev => ({ ...prev, homepageLayout: layout }));
    logAction(`Homepage section layout indices updated.`);
  };

  const toggleSection = (index: number) => {
    const layout = [...(tempData.homepageLayout || [])];
    layout[index].enabled = !layout[index].enabled;
    setTempData(prev => ({ ...prev, homepageLayout: layout }));
    logAction(`Visibility toggled for homepage layout section: ${layout[index].label}`);
  };

  // Insert formatting template inside Blog markdown text editor at current cursor position
  const insertFormatting = (tagType: 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph' | 'bold' | 'italic' | 'underline' | 'list' | 'quote' | 'link' | 'image' | 'table') => {
    if (!textareaRef.current || !editingArticle) return;
    const txt = editingArticle.content;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = txt.substring(start, end);

    let insertion = '';
    switch (tagType) {
      case 'h1': insertion = `\n# ${selected || 'Heading 1'}\n`; break;
      case 'h2': insertion = `\n## ${selected || 'Heading 2'}\n`; break;
      case 'h3': insertion = `\n### ${selected || 'Heading 3'}\n`; break;
      case 'h4': insertion = `\n#### ${selected || 'Heading 4'}\n`; break;
      case 'paragraph': insertion = `\n${selected || 'This is a body paragraph.'}\n`; break;
      case 'bold': insertion = `**${selected || 'bold text'}**`; break;
      case 'italic': insertion = `*${selected || 'italic text'}*`; break;
      case 'underline': insertion = `<u>${selected || 'underlined text'}</u>`; break;
      case 'list': insertion = `\n- ${selected || 'List item 1'}\n- List item 2\n`; break;
      case 'quote': insertion = `\n> ${selected || 'This is an inspirational editorial quote.'}\n`; break;
      case 'link': {
        const displayText = window.prompt('Enter Link Display Text:', selected || 'Visit our Portfolio');
        if (displayText === null) return;
        const url = window.prompt('Enter Link URL (e.g., https://example.com):', 'https://example.com');
        if (!url) return;
        insertion = `[${displayText}](${url})`;
        break;
      }
      case 'image': insertion = `\n![Alt Description](${selected || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'})\n`; break;
      case 'table': insertion = `\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Value A | Value B |\n`; break;
    }

    const nextContent = txt.substring(0, start) + insertion + txt.substring(end);
    setEditingArticle(prev => prev ? { ...prev, content: nextContent } : null);
    
    // Reset focus and cursor position after insert
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + insertion.length, start + insertion.length);
      }
    }, 50);
  };

  // RENDER SECURITY LOGIN GATEWAY (Dark Theme)
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#070709] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#070709] to-black flex items-center justify-center p-6 z-[9999] overflow-y-auto">
        <div className="w-full max-w-lg bg-[#0e0e12] border border-neutral-800 p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle Ambient Accent Circle */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* SaaS Header */}
          <div className="flex items-center space-x-4 mb-8 bg-neutral-950/50 border border-neutral-900 p-4 rounded-xl">
            <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg text-orange-400">
              <Shield size={26} className="stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-orange-400 tracking-[0.25em] font-bold">KAIJU ENGINE PRO</span>
              <span className="font-mono text-[8px] text-neutral-500 leading-none mt-1">LARAVEL SANCTUM EMULATION v12.1</span>
            </div>
          </div>

          <h2 className="font-sans text-3xl font-black text-white tracking-tight mb-2 uppercase">ADMINISTRATIVE ACCESS</h2>
          <p className="font-sans text-xs text-neutral-400 mb-8 leading-relaxed">
            Welcome back. Access is protected by dual-phase state sync, secure storage routers, and live database emulations.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="font-mono text-[9px] font-bold uppercase text-neutral-500 tracking-wider">DATABASE USER EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-950 border border-neutral-800 focus:border-orange-500/50 px-4 py-3 text-sm text-white focus:outline-none transition-all rounded-xl font-sans w-full"
                placeholder="e.g. admin@kaijustudios.com"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[9px] font-bold uppercase text-neutral-500 tracking-wider">PASSWORD SECURE HASH</label>
                <span className="font-mono text-[8px] text-neutral-600 hover:text-neutral-400 cursor-help">Forgotten key?</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-neutral-950 border border-neutral-800 focus:border-orange-500/50 px-4 py-3 text-sm text-white focus:outline-none transition-all rounded-xl font-mono w-full"
                placeholder="••••••••••••"
              />
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center space-x-3 text-red-400 rounded-xl font-sans text-xs">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2"
            >
              {authenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>DECRYPTING VAULT...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>ESTABLISH SECURE LINK</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Helper */}
          <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col space-y-2">
            <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-wider">SECURE DEV CREDENTIALS</span>
            <div className="flex justify-between items-center bg-neutral-950/80 border border-neutral-900 rounded-lg p-2.5">
              <code className="text-[10px] text-orange-400 font-mono">admin@kaijustudios.com / admin-kaiju</code>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@kaijustudios.com');
                  setPassword('admin-kaiju');
                  logAction('Injected default developer secrets.');
                }}
                className="text-[9px] font-mono text-neutral-500 hover:text-white uppercase tracking-wider cursor-pointer transition-colors"
              >
                Auto-Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] text-neutral-200 flex flex-col z-[999] overflow-hidden">
      
      {/* 1. TOP HEADER / STATUS BAR */}
      <header className="bg-[#0e0e12] border-b border-neutral-800/80 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-5">
          <div className="bg-orange-500 text-black p-2 rounded-xl">
            <Sliders size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-sans text-lg font-black text-white tracking-tight uppercase leading-none">KAIJU ADMINISTRATIVE CONSOLE</h1>
            </div>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center space-x-3">
          {/* Real-time Save Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-xl">
            <span className={`w-1.5 h-1.5 rounded-full ${
              saveStatus === 'saved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
              saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' :
              'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
            }`} />
            <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider select-none">
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'dirty' && 'Unsaved changes'}
              {saveStatus === 'saved' && (
                lastSavedTime ? (
                  secondsSinceLastSave === 0 ? 'Saved just now' :
                  secondsSinceLastSave < 60 ? `Saved ${secondsSinceLastSave}s ago` :
                  `Saved ${Math.floor(secondsSinceLastSave / 60)}m ago`
                ) : 'Saved'
              )}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Save size={13} />
            <span>Save Website Changes</span>
          </button>

          <button
            onClick={handleReset}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 px-3 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer flex items-center space-x-1.5"
            title="Revert modifications to default settings"
          >
            <RotateCcw size={13} />
            <span>Reset to Default Settings</span>
          </button>

          <button
            onClick={() => window.open('/', '_blank')}
            className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Eye size={13} />
            <span>Live site</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT GRID (SIDEBAR + WORKSPACE) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-72 bg-[#0d0d10] border-r border-neutral-800/80 flex flex-col shrink-0 overflow-y-auto">
          
          {/* Section: Platform Navigation */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-7">
              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-3 px-3">OVERVIEW</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('dashboard'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Activity size={15} />
                    <span>Dashboard Metrics</span>
                  </button>
                </nav>
              </div>

              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-3 px-3">CORE EXPERIENCE</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('themes'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'themes'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Palette size={15} />
                    <span>Hero Themes</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('layout'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'layout'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Layout size={15} />
                    <span>Layout Builder</span>
                  </button>
                </nav>
              </div>

              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-3 px-3">DATABASE COLLECTIONS</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('portfolio'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'portfolio' || editingProject !== null
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Layers size={15} />
                    <span>Portfolio Director</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('blog'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'blog' || editingArticle !== null
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <BookOpen size={15} />
                    <span>Blog CMS Editor</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('studio'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'studio'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <FileText size={15} />
                    <span>About Us</span>
                  </button>
                </nav>
              </div>

              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-3 px-3">SOCIAL & OUTREACH</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('testimonials'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'testimonials'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <MessageSquare size={15} />
                    <span>Testimonials & FAQs</span>
                  </button>
                </nav>
              </div>

              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-3 px-3">CONTACT & COMMUNICATION</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('contact-cms'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'contact-cms'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Mail size={15} />
                    <span>Contact Page & Form Builder</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('inbox-cms'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'inbox-cms'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Inbox size={15} />
                    <span>Inquiry Inbox</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('smtp-settings'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'smtp-settings'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Server size={15} />
                    <span>SMTP & Auto-Responder</span>
                  </button>
                </nav>
              </div>

              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-3 px-3">SYSTEM FILES</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('media'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'media'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <FolderOpen size={15} />
                    <span>Media Storage Vault</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('settings'); setEditingArticle(null); setEditingProject(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <Settings size={15} />
                    <span>Global Website Settings</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* User Profile Banner */}
            <div className="pt-6 border-t border-neutral-900 mt-6 flex items-center space-x-3">
              <div className="bg-orange-500 text-black w-9 h-9 rounded-full flex items-center justify-center font-bold font-sans text-xs">
                KJ
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-sans font-bold text-white block truncate leading-none">Kaiju Administrator</span>
                <span className="text-[9px] font-mono text-neutral-500 block truncate mt-1">admin@kaijustudios.com</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DESKTOP WORKSPACE */}
        <main className="flex-1 bg-[#070709] overflow-y-auto">
          
          {/* RENDER ACTIVE TAB VIEW */}
          {activeTab === 'dashboard' && (() => {
            const logs = tempData.analytics?.dayLogs || [];
            
            // 1. Resolve date cutoff filters based on chosen dateRange
            const todayStr = '2026-06-26';
            const todayDate = new Date(todayStr + 'T12:00:00Z');
            
            let filteredLogs = logs;
            if (dateRange === 'today') {
              filteredLogs = logs.filter(l => l.date === todayStr);
            } else if (dateRange === 'yesterday') {
              const yesterday = new Date(todayDate);
              yesterday.setDate(todayDate.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];
              filteredLogs = logs.filter(l => l.date === yesterdayStr);
            } else if (dateRange === '7days') {
              const cutoff = new Date(todayDate);
              cutoff.setDate(todayDate.getDate() - 7);
              const cutoffStr = cutoff.toISOString().split('T')[0];
              filteredLogs = logs.filter(l => l.date >= cutoffStr && l.date <= todayStr);
            } else if (dateRange === '30days') {
              const cutoff = new Date(todayDate);
              cutoff.setDate(todayDate.getDate() - 30);
              const cutoffStr = cutoff.toISOString().split('T')[0];
              filteredLogs = logs.filter(l => l.date >= cutoffStr && l.date <= todayStr);
            } else if (dateRange === '90days') {
              const cutoff = new Date(todayDate);
              cutoff.setDate(todayDate.getDate() - 90);
              const cutoffStr = cutoff.toISOString().split('T')[0];
              filteredLogs = logs.filter(l => l.date >= cutoffStr && l.date <= todayStr);
            } else if (dateRange === 'custom') {
              filteredLogs = logs.filter(l => l.date >= startDate && l.date <= endDate);
            }
            
            // Safe fallback if logs are empty or mismatch
            if (filteredLogs.length === 0 && logs.length > 0) {
              filteredLogs = logs.slice(-7);
            }
            
            // 2. Dynamic aggregations over the filtered subset of days
            const totalVisits = filteredLogs.reduce((sum, d) => sum + d.visitors, 0);
            
            const pageViews = {
              home: filteredLogs.reduce((sum, d) => sum + (d.pageViews?.home || 0), 0),
              portfolio: filteredLogs.reduce((sum, d) => sum + (d.pageViews?.portfolio || 0), 0),
              studio: filteredLogs.reduce((sum, d) => sum + (d.pageViews?.studio || 0), 0),
              blog: filteredLogs.reduce((sum, d) => sum + (d.pageViews?.blog || 0), 0),
              contact: filteredLogs.reduce((sum, d) => sum + (d.pageViews?.contact || 0), 0),
            };
            const totalPageViews = pageViews.home + pageViews.portfolio + pageViews.studio + pageViews.blog + pageViews.contact;
            
            const clicks = {
              view_portfolio: filteredLogs.reduce((sum, d) => sum + (d.buttonClicks?.view_portfolio || 0), 0),
              book_a_call: filteredLogs.reduce((sum, d) => sum + (d.buttonClicks?.book_a_call || 0), 0),
              contact_us: filteredLogs.reduce((sum, d) => sum + (d.buttonClicks?.contact_us || 0), 0),
            };
            const totalClicks = clicks.view_portfolio + clicks.book_a_call + clicks.contact_us;
            
            const activeDates = new Set(filteredLogs.map(l => l.date));
            const contactFormCount = (tempData.submissions || []).filter(sub => {
              if (!sub.submittedAt) return false;
              const subDate = sub.submittedAt.slice(0, 10);
              return activeDates.has(subDate);
            }).length;

            const leads = {
              contactForm: contactFormCount,
              bookCall: filteredLogs.reduce((sum, d) => sum + (d.leads?.bookCall || 0), 0),
              newsletter: filteredLogs.reduce((sum, d) => sum + (d.leads?.newsletter || 0), 0),
            };
            const totalLeads = leads.contactForm + leads.bookCall + leads.newsletter;
            
            const avgTimeSpent = filteredLogs.length > 0
              ? Math.round(filteredLogs.reduce((sum, d) => sum + d.averageTimeSpent, 0) / filteredLogs.length)
              : 85;
              
            const conversionRate = totalVisits > 0 
              ? Number(((totalClicks / totalVisits) * 100).toFixed(1)) 
              : 0;
              
            // OS, Device, Browser Aggregators
            const deviceStats = {
              os: { Windows: 0, macOS: 0, Linux: 0, Android: 0, iOS: 0 },
              deviceType: { desktop: 0, mobile: 0, tablet: 0 },
              browser: { Chrome: 0, Edge: 0, Firefox: 0, Safari: 0, Opera: 0 }
            };
            
            filteredLogs.forEach(d => {
              if (d.devices) {
                Object.entries(d.devices.os || {}).forEach(([k, v]) => {
                  if (k in deviceStats.os) deviceStats.os[k as keyof typeof deviceStats.os] += (v as number) || 0;
                });
                Object.entries(d.devices.deviceType || {}).forEach(([k, v]) => {
                  if (k in deviceStats.deviceType) deviceStats.deviceType[k as keyof typeof deviceStats.deviceType] += (v as number) || 0;
                });
                Object.entries(d.devices.browser || {}).forEach(([k, v]) => {
                  if (k in deviceStats.browser) deviceStats.browser[k as keyof typeof deviceStats.browser] += (v as number) || 0;
                });
              }
            });
            
            // Countries Aggregator
            const countryCounts: Record<string, number> = {};
            filteredLogs.forEach(d => {
              if (d.countries) {
                Object.entries(d.countries).forEach(([c, v]) => {
                  countryCounts[c] = (countryCounts[c] || 0) + (v as number);
                });
              }
            });
            const sortedCountries = Object.entries(countryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([country, count]) => ({
                country,
                count,
                percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0
              }));
              
            // Project Views Aggregator
            const projectViewsCounts: Record<string, number> = {};
            filteredLogs.forEach(d => {
              if (d.projectViews) {
                Object.entries(d.projectViews).forEach(([pid, v]) => {
                  projectViewsCounts[pid] = (projectViewsCounts[pid] || 0) + (v as number);
                });
              }
            });
            const sortedProjectViews = Object.entries(projectViewsCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([pid, count]) => {
                const proj = tempData.portfolio?.projects?.find(p => p.id === pid);
                return {
                  id: pid,
                  title: proj ? proj.title : `Project ${pid}`,
                  count
                };
              });
              
            const mostViewed = sortedProjectViews[0] || null;
            const leastViewed = sortedProjectViews.length > 1 ? sortedProjectViews[sortedProjectViews.length - 1] : null;

            // Chart calculations
            const chartWidth = 740;
            const chartHeight = 160;
            const chartPadding = 20;
            const maxVal = Math.max(...filteredLogs.map(l => l.visitors), 10);
            
            const points = filteredLogs.map((l, idx) => {
              const x = chartPadding + (idx / (filteredLogs.length - 1 || 1)) * (chartWidth - chartPadding * 2);
              const y = chartHeight - chartPadding - (l.visitors / maxVal) * (chartHeight - chartPadding * 2);
              return { x, y, l };
            });
            
            const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            const areaPath = points.length > 0 
              ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - chartPadding} L ${points[0].x} ${chartHeight - chartPadding} Z` 
              : '';

            return (
              <div className="p-10 space-y-8 max-w-7xl mx-auto">
                
                {/* Header Banner Section */}
                <div className="bg-gradient-to-r from-orange-600/10 via-neutral-900/40 to-neutral-950 p-8 rounded-2xl border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">PRODUCTION CENTER</h2>
                    <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                      Real-time audience analytics and website performance metrics.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="bg-neutral-900/80 border border-neutral-800 px-4 py-3 rounded-xl flex items-center space-x-3">
                      <Clock size={16} className="text-orange-400" />
                      <div>
                        <span className="font-mono text-[9px] text-neutral-500 block uppercase">UTC Server Time</span>
                        <span className="font-mono text-xs text-white block font-bold">{currentServerTime || new Date().toUTCString().replace('GMT', 'UTC')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Filter & Sub-Tab Control Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider font-bold">DATE RANGE:</span>
                    <div className="flex flex-wrap gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
                      {(['today', 'yesterday', '7days', '30days', '90days', 'custom'] as const).map((range) => {
                        const labels = {
                          today: "Today",
                          yesterday: "Yesterday",
                          '7days': "7 Days",
                          '30days': "30 Days",
                          '90days': "90 Days",
                          custom: "Custom Range"
                        };
                        const isSelected = dateRange === range;
                        return (
                          <button
                            key={range}
                            onClick={() => {
                              setDateRange(range);
                              logAction(`Filtered analytics reports for: ${labels[range]}`);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              isSelected 
                                ? 'bg-orange-500 text-white font-bold shadow-[0_0_12px_rgba(249,115,22,0.35)]' 
                                : 'bg-transparent text-neutral-400 hover:text-white'
                            }`}
                          >
                            {labels[range]}
                          </button>
                        );
                      })}
                    </div>

                    {dateRange === 'custom' && (
                      <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
                        <input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            logAction(`Set custom start boundary: ${e.target.value}`);
                          }}
                          className="bg-transparent border-0 text-white font-mono text-[10px] focus:ring-0 p-0 w-24 outline-none"
                        />
                        <span className="text-neutral-600 font-mono text-xs">to</span>
                        <input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            logAction(`Set custom end boundary: ${e.target.value}`);
                          }}
                          className="bg-transparent border-0 text-white font-mono text-[10px] focus:ring-0 p-0 w-24 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizontal Navigation Sub-Tabs */}
                <div className="flex border-b border-neutral-900 overflow-x-auto scrollbar-none">
                  {([
                    { id: 'overview', name: 'Traffic Overview', icon: BarChart2 },
                    { id: 'visitors', name: 'Visitor Location', icon: Globe },
                    // { id: 'conversions', name: 'Conversion & Funnel', icon: Activity },
                    { id: 'portfolio', name: 'Portfolio performance', icon: Layers },
                    { id: 'leads', name: 'Lead submissions', icon: MessageSquare },
                    { id: 'devices', name: 'Device analytics', icon: Smartphone }
                  ] as const).map((tab) => {
                    const isSelected = dashboardSubTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDashboardSubTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-mono text-[10px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                          isSelected 
                            ? 'border-orange-500 text-orange-500 font-bold bg-orange-500/[0.02]' 
                            : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-800'
                        }`}
                      >
                        <Icon size={12} />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Aggregated Metric Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-[#0e0e12] border border-neutral-800/80 p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
                    <div className="flex justify-between items-center text-neutral-500">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-neutral-400">Total Visitors</span>
                      <User size={15} className="text-orange-500" />
                    </div>
                    <div>
                      <span className="text-4xl font-black text-white font-mono leading-none block">{totalVisits.toLocaleString()}</span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-1 block uppercase tracking-wider">Dynamic Period Sessions</span>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                  </div>

                  <div className="bg-[#0e0e12] border border-neutral-800/80 p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
                    <div className="flex justify-between items-center text-neutral-500">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-neutral-400">Avg. Stay Duration</span>
                      <Clock size={15} className="text-orange-500" />
                    </div>
                    <div>
                      <span className="text-4xl font-black text-white font-mono leading-none block">{avgTimeSpent}s</span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-1 block uppercase tracking-wider">Active Engagement Index</span>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                  </div>

                  <div className="bg-[#0e0e12] border border-neutral-800/80 p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
                    <div className="flex justify-between items-center text-neutral-500">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-neutral-400">Action CTR</span>
                      <Activity size={15} className="text-orange-500" />
                    </div>
                    <div>
                      <span className="text-4xl font-black text-white font-mono leading-none block">{conversionRate}%</span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-1 block uppercase tracking-wider">Conversion Click Ratio</span>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                  </div>

                  <div className="bg-[#0e0e12] border border-neutral-800/80 p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
                    <div className="flex justify-between items-center text-neutral-500">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-neutral-400">Warm Pitch Leads</span>
                      <MessageSquare size={15} className="text-orange-500" />
                    </div>
                    <div>
                      <span className="text-4xl font-black text-white font-mono leading-none block">{totalLeads}</span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-1 block uppercase tracking-wider">Forms, calls, newsletters</span>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                  </div>

                </div>

                {/* Sub-Tab Panel Views */}
                <div className="bg-[#09090c] border border-neutral-800/60 rounded-3xl p-8">
                  
                  {/* OVERVIEW PANEL */}
                  {dashboardSubTab === 'overview' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                        <div>
                          <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">TRAFFIC TRENDS & POPULAR PAGES</h3>
                          <p className="text-xs text-neutral-500">Daily visitor distribution and relative page views ranking.</p>
                        </div>
                        <span className="font-mono text-[9px] bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-neutral-400">Interactive Plot Matrix</span>
                      </div>

                      {/* Detailed Visitor Statistics Row */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-[#0e0e12]/80 border border-neutral-850 p-4 rounded-xl">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase block font-bold tracking-wider">TOTAL VISITORS</span>
                          <span className="text-xl font-bold text-white font-mono mt-1 block">{filteredLogs.reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#0e0e12]/80 border border-neutral-850 p-4 rounded-xl">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase block font-bold tracking-wider">DAILY VISITORS</span>
                          <span className="text-xl font-bold text-orange-500 font-mono mt-1 block">{(filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].visitors : 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#0e0e12]/80 border border-neutral-850 p-4 rounded-xl">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase block font-bold tracking-wider">WEEKLY VISITORS</span>
                          <span className="text-xl font-bold text-white font-mono mt-1 block">{filteredLogs.slice(-7).reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#0e0e12]/80 border border-neutral-850 p-4 rounded-xl">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase block font-bold tracking-wider">MONTHLY VISITORS</span>
                          <span className="text-xl font-bold text-white font-mono mt-1 block">{filteredLogs.slice(-30).reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#0e0e12]/80 border border-neutral-850 p-4 rounded-xl col-span-2 md:col-span-1">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase block font-bold tracking-wider">RETURNING VISITORS</span>
                          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">{Math.round(filteredLogs.reduce((sum, d) => sum + d.visitors, 0) * 0.285).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        
                        {/* Traffic Line Chart */}
                        <div className="xl:col-span-8 space-y-4">
                          <span className="font-mono text-[10px] text-neutral-400 font-bold block">AUDIENCE ATTRACTANCE INDEX</span>
                          
                          <div className="relative bg-[#0d0d11]/60 border border-neutral-800/60 rounded-2xl p-6 h-64 flex flex-col justify-between overflow-hidden">
                            {/* SVG Chart Wrapper */}
                            <div className="flex-1 relative">
                              {filteredLogs.length > 1 ? (
                                <svg 
                                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                                  className="w-full h-full overflow-visible"
                                  onMouseLeave={() => setHoveredPoint(null)}
                                >
                                  <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                                    </linearGradient>
                                  </defs>
                                  
                                  {/* Gridlines */}
                                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                    const yVal = chartPadding + ratio * (chartHeight - chartPadding * 2);
                                    return (
                                      <line 
                                        key={index}
                                        x1={chartPadding} 
                                        y1={yVal} 
                                        x2={chartWidth - chartPadding} 
                                        y2={yVal} 
                                        stroke="#1f1f23" 
                                        strokeWidth="1" 
                                        strokeDasharray="4 4"
                                      />
                                    );
                                  })}

                                  {/* Area Plot */}
                                  <path d={areaPath} fill="url(#chartGrad)" />
                                  
                                  {/* Line Plot */}
                                  <path 
                                    d={linePath} 
                                    fill="none" 
                                    stroke="#f97316" 
                                    strokeWidth="2.5" 
                                    strokeLinecap="round"
                                  />
                                  
                                  {/* Interactive circles */}
                                  {points.map((pt, index) => {
                                    // Plot points, downsample if list is huge to avoid clustering
                                    const shouldRenderPoint = filteredLogs.length < 35 || index % Math.ceil(filteredLogs.length / 25) === 0 || index === filteredLogs.length - 1;
                                    if (!shouldRenderPoint) return null;
                                    return (
                                      <circle
                                        key={index}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                        fill="#0e0e12"
                                        stroke="#f97316"
                                        strokeWidth="2"
                                        className="cursor-pointer hover:r-6 hover:fill-orange-500 transition-all duration-150"
                                        onMouseEnter={(e) => {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setHoveredPoint({
                                            x: pt.x,
                                            y: pt.y,
                                            visitors: pt.l.visitors,
                                            date: pt.l.date
                                          });
                                        }}
                                      />
                                    );
                                  })}
                                </svg>
                              ) : (
                                <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-500">
                                  Insufficient dataset logs for plotting. Add visits first.
                                </div>
                              )}

                              {/* Interactive Tooltip popup */}
                              {hoveredPoint && (
                                <div 
                                  className="absolute bg-neutral-950 border border-orange-500/40 p-2.5 rounded-lg shadow-2xl font-mono text-[9px] pointer-events-none z-10"
                                  style={{ 
                                    left: `${(hoveredPoint.x / chartWidth) * 100}%`, 
                                    top: `${(hoveredPoint.y / chartHeight) * 100 - 35}%`,
                                    transform: 'translateX(-50%)' 
                                  }}
                                >
                                  <span className="text-neutral-500 block">{hoveredPoint.date}</span>
                                  <span className="text-white block font-bold">Visitors: <span className="text-orange-500">{hoveredPoint.visitors}</span></span>
                                </div>
                              )}
                            </div>
                            
                            {/* X Axis boundaries */}
                            <div className="flex justify-between text-[8px] font-mono text-neutral-500 border-t border-neutral-900 pt-2">
                              <span>{filteredLogs[0]?.date || 'START'}</span>
                              <span>{filteredLogs[Math.floor(filteredLogs.length / 2)]?.date || 'MID'}</span>
                              <span>{filteredLogs[filteredLogs.length - 1]?.date || 'END'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Page Views Breakdown */}
                        <div className="xl:col-span-4 space-y-4">
                          <span className="font-mono text-[10px] text-neutral-400 font-bold block uppercase">Core page traffic weight</span>
                          
                          <div className="bg-[#0d0d11]/60 border border-neutral-800/60 rounded-2xl p-6 space-y-4 h-64 overflow-y-auto">
                            {[
                              { label: 'Homepage', count: pageViews.home, key: 'home' },
                              { label: 'Portfolio Catalog', count: pageViews.portfolio, key: 'portfolio' },
                              { label: 'Studio Agency Info', count: pageViews.studio, key: 'studio' },
                              { label: 'Insight Journal / Blog', count: pageViews.blog, key: 'blog' },
                              { label: 'Contact Coordinates', count: pageViews.contact, key: 'contact' },
                            ].map((p, idx) => {
                              const pct = totalPageViews > 0 ? Math.round((p.count / totalPageViews) * 100) : 0;
                              return (
                                <div key={idx} className="space-y-1.5">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-mono text-neutral-300 font-bold uppercase">{p.label}</span>
                                    <span className="font-mono text-neutral-400">{p.count} views ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                                      style={{ width: `${pct}%` }} 
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* VISITOR LOCATION PANEL */}
                  {dashboardSubTab === 'visitors' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">VISITOR DEMOGRAPHICS BY COUNTRY</h3>
                        <p className="text-xs text-neutral-500">Estimated global audience coordinates tracked via Accept-Language IP mapping dockets.</p>
                      </div>

                      <div className="overflow-x-auto border border-neutral-800 rounded-2xl">
                        <table className="w-full font-mono text-xs text-left">
                          <thead className="bg-neutral-900 text-[10px] text-neutral-400 uppercase border-b border-neutral-800">
                            <tr>
                              <th className="px-6 py-4">Rank</th>
                              <th className="px-6 py-4">Country coordinates</th>
                              <th className="px-6 py-4 text-right">Unique Visits</th>
                              <th className="px-6 py-4 text-right">Traffic Share</th>
                              <th className="px-6 py-4">Distribution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-900">
                            {sortedCountries.length > 0 ? sortedCountries.map((c, idx) => (
                              <tr key={idx} className="hover:bg-neutral-950/40">
                                <td className="px-6 py-4 font-bold text-neutral-500">#{idx + 1}</td>
                                <td className="px-6 py-4 text-white font-bold">{c.country}</td>
                                <td className="px-6 py-4 text-right text-orange-400 font-bold">{c.count.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-neutral-400">{c.percentage}%</td>
                                <td className="px-6 py-4 w-1/3">
                                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-orange-500 h-full rounded-full" 
                                      style={{ width: `${c.percentage}%` }} 
                                    />
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} className="text-center py-8 text-neutral-500">
                                  No visitor location coordinates recorded in database logs.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* CONVERSION & FUNNEL PANEL */}
                  {dashboardSubTab === 'conversions' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">CONVERSION METRIC FUNNELS</h3>
                        <p className="text-xs text-neutral-500">Analyze how users transition from initial raw page visits into qualified studio leads.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Clicks List */}
                        <div className="lg:col-span-5 space-y-6">
                          <span className="font-mono text-[10px] text-neutral-400 font-bold block uppercase">Core action button metrics</span>
                          
                          <div className="bg-[#0d0d11]/60 border border-neutral-800/60 rounded-2xl p-6 space-y-6">
                            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                              <span className="font-mono text-[10px] text-neutral-500 uppercase">Interactive Target</span>
                              <span className="font-mono text-[10px] text-neutral-500 uppercase">Interaction Count</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <span className="font-mono text-[11px] text-white block uppercase font-bold">"View Portfolio" click</span>
                                <span className="text-[10px] text-neutral-500 block">Hero work navigation shortcut</span>
                              </div>
                              <span className="font-mono text-sm text-white font-bold">{clicks.view_portfolio}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <span className="font-mono text-[11px] text-white block uppercase font-bold">"Book a Strategy Call" click</span>
                                <span className="text-[10px] text-neutral-500 block">Lead outreach trigger</span>
                              </div>
                              <span className="font-mono text-sm text-white font-bold">{clicks.book_a_call}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <span className="font-mono text-[11px] text-white block uppercase font-bold">"Contact Us" click</span>
                                <span className="text-[10px] text-neutral-500 block">General support interactions</span>
                              </div>
                              <span className="font-mono text-sm text-white font-bold">{clicks.contact_us}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Funnel */}
                        <div className="lg:col-span-7 space-y-6">
                          <span className="font-mono text-[10px] text-neutral-400 font-bold block uppercase">Agency conversion cascade</span>
                          
                          <div className="space-y-4 bg-[#0d0d11]/40 border border-neutral-800/60 p-8 rounded-2xl">
                            
                            {[
                              { label: 'Stage 1 // Raw Page Sessions', val: totalVisits, percent: 100, color: 'bg-orange-500' },
                              { label: 'Stage 2 // Portfolio catalog Views', val: pageViews.portfolio, percent: totalVisits > 0 ? Math.round((pageViews.portfolio / totalVisits) * 100) : 0, color: 'bg-orange-600' },
                              { label: 'Stage 3 // Conversion Button Clicks', val: totalClicks, percent: totalVisits > 0 ? Math.round((totalClicks / totalVisits) * 100) : 0, color: 'bg-orange-700' },
                              { label: 'Stage 4 // Dynamic Warm Pitch Leads', val: totalLeads, percent: totalVisits > 0 ? Math.round((totalLeads / totalVisits) * 100) : 0, color: 'bg-orange-800' },
                            ].map((stage, idx) => (
                              <div key={idx} className="relative space-y-2">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-neutral-400 uppercase font-bold">{stage.label}</span>
                                  <span className="text-white font-bold">{stage.val} units ({stage.percent}%)</span>
                                </div>
                                <div className="w-full bg-neutral-900/60 h-8 rounded-lg overflow-hidden relative flex items-center px-4">
                                  <div 
                                    className={`${stage.color} h-full absolute inset-y-0 left-0 rounded-r-lg opacity-40 transition-all duration-500`} 
                                    style={{ width: `${Math.max(3, stage.percent)}%` }}
                                  />
                                  <span className="relative z-10 font-mono text-[9px] text-orange-400 font-bold">
                                    {stage.percent}% Retention
                                  </span>
                                </div>
                                {idx < 3 && (
                                  <div className="flex justify-center my-1.5">
                                    <span className="text-neutral-600 text-xs">↓</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* PORTFOLIO PERFORMANCE PANEL */}
                  {dashboardSubTab === 'portfolio' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                        <div>
                          <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">PORTFOLIO DECK PERFORMANCE</h3>
                          <p className="text-xs text-neutral-500">Aesthetic project popularity ranking and view distribution tracking logs.</p>
                        </div>
                        <span className="font-mono text-[9px] bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-neutral-400">Total Project views: {pageViews.portfolio}</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        <div className="bg-[#0e0e12]/80 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-32">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">★ MOST POPULAR STUDIO TITLE</span>
                          {mostViewed ? (
                            <div>
                              <span className="font-sans text-lg font-black text-white block uppercase tracking-tight truncate">{mostViewed.title}</span>
                              <span className="font-mono text-xs text-orange-400 font-bold mt-1 block">{mostViewed.count} active clicks logged</span>
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-neutral-500 block">Insufficient records loaded.</span>
                          )}
                        </div>

                        <div className="bg-[#0e0e12]/80 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-32">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">▲ LOWEST SECTOR ENGAGEMENT</span>
                          {leastViewed ? (
                            <div>
                              <span className="font-sans text-lg font-black text-white block uppercase tracking-tight truncate">{leastViewed.title}</span>
                              <span className="font-mono text-xs text-neutral-500 mt-1 block">{leastViewed.count} views tracked</span>
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-neutral-500 block">Insufficient records loaded.</span>
                          )}
                        </div>

                      </div>

                      <div className="overflow-x-auto border border-neutral-800 rounded-2xl">
                        <table className="w-full font-mono text-xs text-left">
                          <thead className="bg-neutral-900 text-[10px] text-neutral-400 uppercase border-b border-neutral-800">
                            <tr>
                              <th className="px-6 py-4">Title ID</th>
                              <th className="px-6 py-4">Creative Title</th>
                              <th className="px-6 py-4 text-right">Logged Views</th>
                              <th className="px-6 py-4 text-right">Relative share</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-900">
                            {sortedProjectViews.length > 0 ? sortedProjectViews.map((p, idx) => {
                              const share = pageViews.portfolio > 0 ? Math.round((p.count / pageViews.portfolio) * 100) : 0;
                              return (
                                <tr key={idx} className="hover:bg-neutral-950/40">
                                  <td className="px-6 py-4 text-neutral-500 font-bold">{p.id}</td>
                                  <td className="px-6 py-4 text-white font-bold">{p.title}</td>
                                  <td className="px-6 py-4 text-right text-orange-400 font-bold">{p.count}</td>
                                  <td className="px-6 py-4 text-right text-neutral-400">{share}%</td>
                                </tr>
                              );
                            }) : (
                              <tr>
                                <td colSpan={4} className="text-center py-8 text-neutral-500">
                                  No portfolio catalog clicks tracked in logs database yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* LEAD SUBMISSIONS PANEL */}
                  {dashboardSubTab === 'leads' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                        <div>
                          <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">INQUIRY OUTREACH & LEADS</h3>
                          <p className="text-xs text-neutral-500">Real-time pitch dockets and client inquiries tracked through form portals.</p>
                        </div>
                        <span className="font-mono text-[9px] bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-neutral-400">Total Leads: {totalLeads}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-[#0d0d11] border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-neutral-400 uppercase font-bold">Pitch Form Inquiries</span>
                            <span className="text-[9px] font-mono text-green-400 bg-green-400/5 px-2 py-0.5 rounded-full">ACTIVE</span>
                          </div>
                          <div>
                            <span className="text-3xl font-black text-white font-mono">{leads.contactForm}</span>
                            <span className="text-[9px] text-neutral-500 font-mono block mt-1 uppercase tracking-wider">Submitted pitch forms</span>
                          </div>
                        </div>

                        <div className="bg-[#0d0d11] border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-neutral-400 uppercase font-bold">Call strategy Bookings</span>
                            <span className="text-[9px] font-mono text-green-400 bg-green-400/5 px-2 py-0.5 rounded-full">ACTIVE</span>
                          </div>
                          <div>
                            <span className="text-3xl font-black text-white font-mono">{leads.bookCall}</span>
                            <span className="text-[9px] text-neutral-500 font-mono block mt-1 uppercase tracking-wider">Booked pitch calendar calls</span>
                          </div>
                        </div>

                        <div className="bg-[#0d0d11] border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-neutral-400 uppercase font-bold">Newsletter Subscribers</span>
                            <span className="text-[9px] font-mono text-green-400 bg-green-400/5 px-2 py-0.5 rounded-full">ACTIVE</span>
                          </div>
                          <div>
                            <span className="text-3xl font-black text-white font-mono">{leads.newsletter}</span>
                            <span className="text-[9px] text-neutral-500 font-mono block mt-1 uppercase tracking-wider">Studio digest signups</span>
                          </div>
                        </div>

                      </div>

                      <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 space-y-4">
                        <span className="font-mono text-[10px] text-neutral-400 font-bold block uppercase">Visual channel distribution</span>
                        
                        <div className="space-y-4">
                          {[
                            { label: 'Pitch Inquiries', val: leads.contactForm, color: 'bg-orange-500' },
                            { label: 'Booked Calls', val: leads.bookCall, color: 'bg-amber-500' },
                            { label: 'Newsletter Signups', val: leads.newsletter, color: 'bg-neutral-400' },
                          ].map((item, idx) => {
                            const percent = totalLeads > 0 ? Math.round((item.val / totalLeads) * 100) : 0;
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span>{item.label}</span>
                                  <span>{item.val} units ({percent}%)</span>
                                </div>
                                <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden">
                                  <div 
                                    className={`${item.color} h-full rounded-full transition-all duration-500`} 
                                    style={{ width: `${percent}%` }} 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DEVICE ANALYTICS PANEL */}
                  {dashboardSubTab === 'devices' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">OPERATING SYSTEMS & USER AGENTS</h3>
                        <p className="text-xs text-neutral-500">Demographics breakdown of device hardware profiles and browser clients.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Device Types */}
                        <div className="bg-[#0d0d11]/80 border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                          <span className="font-mono text-[10px] text-orange-400 font-bold block uppercase tracking-wider">Device categories</span>
                          <div className="space-y-4">
                            {Object.entries(deviceStats.deviceType).map(([k, v]) => {
                              const pct = totalVisits > 0 ? Math.round((v / totalVisits) * 100) : 0;
                              return (
                                <div key={k} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span className="capitalize">{k}</span>
                                    <span>{v} ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Operating Systems */}
                        <div className="bg-[#0d0d11]/80 border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                          <span className="font-mono text-[10px] text-orange-400 font-bold block uppercase tracking-wider">Operating Systems</span>
                          <div className="space-y-3">
                            {Object.entries(deviceStats.os).map(([k, v]) => {
                              const pct = totalVisits > 0 ? Math.round((v / totalVisits) * 100) : 0;
                              return (
                                <div key={k} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span>{k}</span>
                                    <span>{v} ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Browsers */}
                        <div className="bg-[#0d0d11]/80 border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                          <span className="font-mono text-[10px] text-orange-400 font-bold block uppercase tracking-wider">Browsers</span>
                          <div className="space-y-3">
                            {Object.entries(deviceStats.browser).map(([k, v]) => {
                              const pct = totalVisits > 0 ? Math.round((v / totalVisits) * 100) : 0;
                              return (
                                <div key={k} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span>{k}</span>
                                    <span>{v} ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

                {/* Developer Terminal Logging Output Console */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Simulated Laravel Transaction Logs */}
                  <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 lg:col-span-2 flex flex-col h-72">
                    <div className="flex justify-between items-center mb-4 border-b border-neutral-900 pb-3">
                      <div className="flex items-center space-x-2">
                        <Terminal size={14} className="text-orange-400" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Relational Database Transactions</span>
                      </div>
                      <span className="font-mono text-[8px] text-neutral-600">admin.php router logger</span>
                    </div>
                    <div className="flex-1 font-mono text-[10px] space-y-1.5 overflow-y-auto text-neutral-400 scrollbar-thin select-text">
                      {systemLogs.map((log, index) => (
                        <div key={index} className="leading-relaxed">
                          <span className="text-neutral-600">&gt;&nbsp;</span>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fast shortcut panel */}
                  <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between h-72">
                    <div>
                      <h3 className="font-sans text-xs font-black text-white uppercase tracking-tight mb-2">QUICK SYSTEM SHORTCUTS</h3>
                      <p className="text-[10px] text-neutral-500 leading-relaxed mb-4">
                        Direct shortcuts to manage design, portfolio records, and content items.
                      </p>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => setActiveTab('themes')}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 text-left rounded-xl text-[10px] font-mono uppercase tracking-wider text-white flex justify-between items-center transition-colors cursor-pointer"
                        >
                          <span>Layout Builder</span>
                          <Palette size={12} className="text-orange-500" />
                        </button>
                        <button
                          onClick={() => setActiveTab('portfolio')}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 text-left rounded-xl text-[10px] font-mono uppercase tracking-wider text-white flex justify-between items-center transition-colors cursor-pointer"
                        >
                          <span>Portfolio Director</span>
                          <Plus size={12} className="text-orange-500" />
                        </button>
                        <button
                          onClick={() => setActiveTab('blog')}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 text-left rounded-xl text-[10px] font-mono uppercase tracking-wider text-white flex justify-between items-center transition-colors cursor-pointer"
                        >
                          <span>Blog CMS</span>
                          <BookOpen size={12} className="text-orange-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

          {/* THEMES & HERO SYSTEM CONFIGURATION */}
          {activeTab === 'themes' && (
            <div className="p-10 space-y-10 max-w-7xl mx-auto">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">HERO BACKGROUND THEME SYSTEM</h2>
                <p className="text-sm text-neutral-400">
                  Select and configure the global hero backdrop style. All theme transitions are instantly compiled and cached.
                </p>
              </div>

              {/* Theme Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {[
                  { id: 'theme-1', name: 'Theme 1', desc: '4K Gradient Image', preview: 'bg-gradient-to-tr from-indigo-950 via-purple-950 to-rose-950' },
                  { id: 'theme-2', name: 'Theme 2', desc: 'Starfield (Dense)', preview: 'bg-[#050510] border-t border-blue-500/20' },
                  { id: 'theme-3', name: 'Theme 3', desc: 'Starfield (Minimal)', preview: 'bg-[#000000] border-t border-sky-500/10' },
                  { id: 'theme-4', name: 'Theme 4', desc: 'Deep Black', preview: 'bg-[#000000] border border-neutral-900' }
                ].map((th) => {
                  const isActive = (tempData.hero.activeTheme || 'theme-2') === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        updateField('hero', 'activeTheme', th.id as 'theme-1' | 'theme-2' | 'theme-3' | 'theme-4');
                        logAction(`Switched active background theme to: ${th.name}`);
                      }}
                      className={`relative flex flex-col justify-between p-5 rounded-2xl h-44 text-left border cursor-pointer transition-all ${
                        isActive
                          ? 'border-orange-500 bg-[#0e0e12] shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                          : 'border-neutral-800 bg-[#0d0d10] hover:border-neutral-700'
                      }`}
                    >
                      {/* Theme Miniature Preview Block */}
                      <div className={`w-full h-16 rounded-lg ${th.preview} mb-4 relative overflow-hidden flex items-center justify-center`}>
                        {th.id === 'theme-2' && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_15%,_black_85%)] opacity-80" />}
                        {th.id === 'theme-3' && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_black_90%)] opacity-80" />}
                        {th.id === 'theme-4' && <span className="font-mono text-[9px] text-white">OLED</span>}
                        {th.id === 'theme-1' && <span className="font-mono text-[9px] text-white">4K</span>}
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-white block">{th.name}</span>
                        <span className="text-[10px] text-neutral-400 block truncate mt-1">{th.desc}</span>
                      </div>

                      {isActive && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-black rounded-full p-1 shadow-lg">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}

              </div>

              {/* Theme 1 - 4K Gradient Image Upload Area */}
              {(tempData.hero.activeTheme || 'theme-2') === 'theme-1' && (
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">THEME 1 - HERO BACKGROUND IMAGE</h3>
                    <p className="text-xs text-neutral-400">Upload or select a 4K high-quality gradient background image for Theme 1.</p>
                  </div>
                  <MediaPicker
                    value={tempData.hero.theme1CustomImage || ''}
                    onChange={(url) => {
                      updateField('hero', 'theme1CustomImage', url);
                      logAction(`Updated Theme 1 custom background image: ${url}`);
                    }}
                    mediaLibrary={tempData.mediaLibrary || []}
                    type="image"
                    onRefreshMedia={() => {}}
                  />
                </div>
              )}

              {/* Starfield Custom configuration if Theme 2 or Theme 3 are selected */}
              {((tempData.hero.activeTheme || 'theme-2') === 'theme-2' || (tempData.hero.activeTheme || 'theme-2') === 'theme-3') && (
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">STARFIELD CALIBRATION CONTROLS</h3>
                    <p className="text-xs text-neutral-400">Custom calibrate star count, velocity speed, star size, and cursor hover feedback.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono uppercase text-neutral-400 tracking-wider">Star Count</span>
                        <span className="font-mono text-orange-400 font-bold">{tempData.hero.starfield?.numStars || 100} stars</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="350"
                        step="5"
                        value={tempData.hero.starfield?.numStars || 100}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateField('hero', 'starfield', { ...(tempData.hero.starfield || {}), numStars: val });
                        }}
                        className="w-full accent-orange-500"
                      />
                      <span className="font-mono text-[8px] text-neutral-500 block">Drives rendering load and star density thresholds.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono uppercase text-neutral-400 tracking-wider">Velocity Speed</span>
                        <span className="font-mono text-orange-400 font-bold">{(tempData.hero.starfield?.speed || 1.5).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="8.0"
                        step="0.05"
                        value={tempData.hero.starfield?.speed || 1.5}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          updateField('hero', 'starfield', { ...(tempData.hero.starfield || {}), speed: val });
                        }}
                        className="w-full accent-orange-500"
                      />
                      <span className="font-mono text-[8px] text-neutral-500 block">Controls background traversal movement speed.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono uppercase text-neutral-400 tracking-wider">Star Maximum Size</span>
                        <span className="font-mono text-orange-400 font-bold">{(tempData.hero.starfield?.maxSize || 2.8).toFixed(1)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="8.0"
                        step="0.1"
                        value={tempData.hero.starfield?.maxSize || 2.8}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          updateField('hero', 'starfield', { ...(tempData.hero.starfield || {}), maxSize: val });
                        }}
                        className="w-full accent-orange-500"
                      />
                      <span className="font-mono text-[8px] text-neutral-500 block">Maximum scale dimension for rendering individual stars.</span>
                    </div>

                    <div className="space-y-2 flex flex-col justify-center">
                      <div className="flex items-center space-x-3 bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                        <input
                          type="checkbox"
                          id="cursor-interaction"
                          checked={tempData.hero.starfield?.enableHover !== false}
                          onChange={(e) => {
                            const val = e.target.checked;
                            updateField('hero', 'starfield', { ...(tempData.hero.starfield || {}), enableHover: val });
                          }}
                          className="h-4 w-4 accent-orange-500 cursor-pointer rounded"
                        />
                        <div className="flex flex-col">
                          <label htmlFor="cursor-interaction" className="text-xs font-mono uppercase text-white font-bold cursor-pointer">
                            Cursor Interaction
                          </label>
                          <span className="text-[8px] text-neutral-500 mt-0.5">
                            Allows stars and custom glowing dot to gently respond to cursor movements.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme 4 - Deep Black Controls with Star Toggle */}
              {(tempData.hero.activeTheme || 'theme-2') === 'theme-4' && (
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">THEME 4 - DEEP BLACK SETTINGS</h3>
                    <p className="text-xs text-neutral-400">Configure deep OLED black background controls with optional star particles.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center space-x-3 bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                      <input
                        type="checkbox"
                        id="theme4-stars-enable"
                        checked={tempData.hero.theme4Stars === true}
                        onChange={(e) => {
                          updateField('hero', 'theme4Stars', e.target.checked);
                        }}
                        className="h-4 w-4 accent-orange-500 cursor-pointer rounded"
                      />
                      <div className="flex flex-col">
                        <label htmlFor="theme4-stars-enable" className="text-xs font-mono uppercase text-white font-bold cursor-pointer">
                          Enable Stars Overlay
                        </label>
                        <span className="text-[8px] text-neutral-500 mt-0.5">
                          Toggles ambient moving starfield animation overlay on top of deep black.
                        </span>
                      </div>
                    </div>

                    {tempData.hero.theme4Stars && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono uppercase text-neutral-400 tracking-wider">Star Count</span>
                            <span className="font-mono text-orange-400 font-bold">{tempData.hero.starfield?.numStars || 80} stars</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="300"
                            step="5"
                            value={tempData.hero.starfield?.numStars || 80}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              updateField('hero', 'starfield', { ...(tempData.hero.starfield || {}), numStars: val });
                            }}
                            className="w-full accent-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono uppercase text-neutral-400 tracking-wider">Star Speed</span>
                            <span className="font-mono text-orange-400 font-bold">{(tempData.hero.starfield?.speed || 1.2).toFixed(2)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.05"
                            max="8.0"
                            step="0.05"
                            value={tempData.hero.starfield?.speed || 1.2}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              updateField('hero', 'starfield', { ...(tempData.hero.starfield || {}), speed: val });
                            }}
                            className="w-full accent-orange-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Hero details form */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">HERO TEXT CONTENT</h3>
                  <p className="text-xs text-neutral-400">Configure text badge, large typography title and actions buttons.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">HERO SPARKLE BADGE</label>
                    <input
                      type="text"
                      value={tempData.hero.badge}
                      onChange={(e) => updateField('hero', 'badge', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 focus:border-orange-500/50 px-4 py-3 text-sm text-white focus:outline-none transition-all rounded-xl w-full font-sans"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">HERO MAIN HEADLINE</label>
                    <input
                      type="text"
                      value={tempData.hero.title}
                      onChange={(e) => updateField('hero', 'title', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 focus:border-orange-500/50 px-4 py-3 text-sm text-white focus:outline-none transition-all rounded-xl w-full font-sans font-bold"
                    />
                  </div>

                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">HERO SUBTITLE DESCRIPTOR</label>
                    <textarea
                      rows={3}
                      value={tempData.hero.subtitle}
                      onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 focus:border-orange-500/50 px-4 py-3 text-sm text-white focus:outline-none transition-all rounded-xl w-full font-sans"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* LAYOUT BUILDER & HOMEPAGE ORDERING */}
          {activeTab === 'layout' && (() => {
            const renderSectionEditor = (sectionId: string) => {
              switch (sectionId) {
                case 'hero':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Badge Text</label>
                          <input
                            type="text"
                            value={tempData.hero.badge || ''}
                            onChange={(e) => updateField('hero', 'badge', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Main Title (H1)</label>
                          <input
                            type="text"
                            value={tempData.hero.title || ''}
                            onChange={(e) => updateField('hero', 'title', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Description (Subtitle)</label>
                        <textarea
                          value={tempData.hero.subtitle || ''}
                          onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                          rows={3}
                          className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0e0e12] border border-neutral-800 rounded-xl p-4 space-y-4">
                          <h4 className="font-mono text-[9px] text-orange-400 font-bold uppercase tracking-wider">Primary Button</h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-neutral-500 uppercase">Text</label>
                              <input
                                type="text"
                                value={(tempData.hero.buttons && tempData.hero.buttons[0]?.text) || tempData.hero.buttonText || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempData(prev => {
                                    const buttons = [...(prev.hero.buttons || [])];
                                    if (!buttons[0]) buttons[0] = { id: 'btn-1', text: '', url: '', style: 'primary' };
                                    buttons[0] = { ...buttons[0], text: val };
                                    return {
                                      ...prev,
                                      hero: { ...prev.hero, buttonText: val, buttons }
                                    };
                                  });
                                }}
                                className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-neutral-500 uppercase">Destination URL / Anchor</label>
                              <input
                                type="text"
                                value={(tempData.hero.buttons && tempData.hero.buttons[0]?.url) || tempData.hero.buttonUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempData(prev => {
                                    const buttons = [...(prev.hero.buttons || [])];
                                    if (!buttons[0]) buttons[0] = { id: 'btn-1', text: '', url: '', style: 'primary' };
                                    buttons[0] = { ...buttons[0], url: val };
                                    return {
                                      ...prev,
                                      hero: { ...prev.hero, buttonUrl: val, buttons }
                                    };
                                  });
                                }}
                                className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0e0e12] border border-neutral-800 rounded-xl p-4 space-y-4">
                          <h4 className="font-mono text-[9px] text-orange-400 font-bold uppercase tracking-wider">Secondary Button</h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-neutral-500 uppercase">Text</label>
                              <input
                                type="text"
                                value={(tempData.hero.buttons && tempData.hero.buttons[1]?.text) || tempData.hero.secondaryButtonText || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempData(prev => {
                                    const buttons = [...(prev.hero.buttons || [])];
                                    if (!buttons[1]) buttons[1] = { id: 'btn-2', text: '', url: '', style: 'secondary' };
                                    buttons[1] = { ...buttons[1], text: val };
                                    return {
                                      ...prev,
                                      hero: { ...prev.hero, secondaryButtonText: val, buttons }
                                    };
                                  });
                                }}
                                className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-neutral-500 uppercase">Destination URL / Anchor</label>
                              <input
                                type="text"
                                value={(tempData.hero.buttons && tempData.hero.buttons[1]?.url) || tempData.hero.secondaryButtonUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempData(prev => {
                                    const buttons = [...(prev.hero.buttons || [])];
                                    if (!buttons[1]) buttons[1] = { id: 'btn-2', text: '', url: '', style: 'secondary' };
                                    buttons[1] = { ...buttons[1], url: val };
                                    return {
                                      ...prev,
                                      hero: { ...prev.hero, secondaryButtonUrl: val, buttons }
                                    };
                                  });
                                }}
                                className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Hero Custom Background Image</label>
                        <MediaPicker
                          value={tempData.hero.theme1CustomImage || ''}
                          onChange={(url) => {
                            updateField('hero', 'theme1CustomImage', url);
                            logAction(`Updated Theme 1 custom background image: ${url}`);
                          }}
                          mediaLibrary={tempData.mediaLibrary || []}
                          type="image"
                          onRefreshMedia={() => {}}
                        />
                      </div>
                    </div>
                  );

                case 'showcase':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Section Badge/Subtitle</label>
                          <input
                            type="text"
                            value={tempData.showcase?.subtitle || 'CINEMATIC GALLERY STRIPS'}
                            onChange={(e) => updateField('showcase', 'subtitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Section Main Heading</label>
                          <input
                            type="text"
                            value={tempData.showcase?.title || 'STUDIO COMIC REEL'}
                            onChange={(e) => updateField('showcase', 'title', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-mono text-[10px] text-orange-400 font-bold uppercase tracking-wider block border-b border-neutral-800 pb-2">Comic Conveyor Strips</h4>
                        {['panel1', 'panel2', 'panel3'].map((panelKey, panelIdx) => {
                          const panel = (tempData.showcase as any)[panelKey] || { media: [], speed: 3, enabled: true };
                          return (
                            <div key={panelKey} className="bg-neutral-950 border border-neutral-800/60 rounded-xl p-5 space-y-4">
                              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                                <span className="font-sans text-xs text-white font-bold uppercase">Strip 0{panelIdx + 1} ({panelKey})</span>
                                <div className="flex items-center space-x-3">
                                  <label className="font-mono text-[9px] text-neutral-400 uppercase">Enabled</label>
                                  <button
                                    onClick={() => {
                                      const sc = { ...tempData.showcase };
                                      sc[panelKey] = { ...panel, enabled: !panel.enabled };
                                      updateField('showcase', panelKey, sc[panelKey]);
                                    }}
                                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${panel.enabled ? 'bg-orange-500' : 'bg-neutral-800'}`}
                                  >
                                    <div className={`w-4 h-4 rounded-full bg-black transform duration-200 ${panel.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] text-neutral-500 uppercase">Animation Duration / Speed (Lower = Faster, e.g. 1.5 - 5)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={panel.speed}
                                    onChange={(e) => {
                                      const sc = { ...tempData.showcase };
                                      sc[panelKey] = { ...panel, speed: parseFloat(e.target.value) || 3 };
                                      updateField('showcase', panelKey, sc[panelKey]);
                                    }}
                                    className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="font-mono text-[9px] text-neutral-400 uppercase block">Strip Artwork Images</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                  {panel.media?.map((item: any, itemIdx: number) => (
                                    <div key={item.id || itemIdx} className="relative aspect-[3/4] bg-black border border-neutral-800 rounded-lg overflow-hidden group">
                                      <img src={item.url} alt="Strip artwork" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                      <button
                                        onClick={() => {
                                          const sc = { ...tempData.showcase };
                                          const newMedia = panel.media.filter((_: any, i: number) => i !== itemIdx);
                                          sc[panelKey] = { ...panel, media: newMedia };
                                          updateField('showcase', panelKey, sc[panelKey]);
                                          logAction(`Removed artwork from showcase strip ${panelKey}`);
                                        }}
                                        className="absolute top-1 right-1 bg-black/85 hover:bg-red-500 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  ))}

                                  <label className="aspect-[3/4] border-2 border-dashed border-neutral-800 hover:border-orange-500 rounded-lg flex flex-col items-center justify-center p-3 text-center bg-black/30 hover:bg-neutral-900/30 transition-all cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        
                                        try {
                                          const response = await fetch('/api/media/upload', {
                                            method: 'POST',
                                            body: formData,
                                          });
                                          const result = await response.json();
                                          if (response.ok && result.success && result.url) {
                                            const sc = { ...tempData.showcase };
                                            const newMedia = [...(panel.media || []), { id: 'sc-item-' + Date.now(), url: result.url, type: 'image' }];
                                            sc[panelKey] = { ...panel, media: newMedia };
                                            updateField('showcase', panelKey, sc[panelKey]);
                                            logAction(`Uploaded and added artwork to showcase strip ${panelKey}`);
                                          }
                                        } catch (err) {
                                          console.error("Upload error", err);
                                        }
                                      }}
                                    />
                                    <Plus size={16} className="text-neutral-500 mb-1" />
                                    <span className="font-mono text-[9px] text-neutral-400 uppercase">Upload From Device</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );

                case 'services':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Scroll Speed (e.g. 1 - 10, default: 2.5)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={tempData.services?.speed || 2.5}
                            onChange={(e) => updateField('services', 'speed', parseFloat(e.target.value) || 2.5)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Marquee Keyword Tags</label>
                        <div className="space-y-2 max-h-60 overflow-y-auto border border-neutral-800 p-4 rounded-xl bg-black/40">
                          {(tempData.services?.keywords || []).map((keyword: string, kIdx: number) => (
                            <div key={kIdx} className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                  const words = [...tempData.services.keywords];
                                  words[kIdx] = e.target.value;
                                  updateField('services', 'keywords', words);
                                }}
                                className="flex-grow bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500/30"
                              />
                              <div className="flex space-x-1">
                                <button
                                  disabled={kIdx === 0}
                                  onClick={() => {
                                    const words = [...tempData.services.keywords];
                                    const temp = words[kIdx];
                                    words[kIdx] = words[kIdx - 1];
                                    words[kIdx - 1] = temp;
                                    updateField('services', 'keywords', words);
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-20 bg-neutral-950 border border-neutral-800 rounded transition-colors"
                                >
                                  <ArrowUp size={11} />
                                </button>
                                <button
                                  disabled={kIdx === tempData.services.keywords.length - 1}
                                  onClick={() => {
                                    const words = [...tempData.services.keywords];
                                    const temp = words[kIdx];
                                    words[kIdx] = words[kIdx + 1];
                                    words[kIdx + 1] = temp;
                                    updateField('services', 'keywords', words);
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-20 bg-neutral-950 border border-neutral-800 rounded transition-colors"
                                >
                                  <ArrowDown size={11} />
                                </button>
                                <button
                                  onClick={() => {
                                    const words = tempData.services.keywords.filter((_: any, i: number) => i !== kIdx);
                                    updateField('services', 'keywords', words);
                                    logAction(`Removed keyword from marquee: ${keyword}`);
                                  }}
                                  className="p-1.5 text-neutral-500 hover:text-red-500 bg-neutral-950 border border-neutral-800 rounded transition-colors"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const words = [...(tempData.services?.keywords || []), 'NEW SERVICE PROTOCOL'];
                              updateField('services', 'keywords', words);
                              logAction(`Added new keyword to marquee.`);
                            }}
                            className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-orange-400 font-mono text-[9px] uppercase tracking-wider px-3 py-2 rounded-lg flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Plus size={11} />
                            <span>Add Keyword Item</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );

                case 'portfolio':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Subtitle / Badge</label>
                          <input
                            type="text"
                            value={tempData.portfolio?.homepageSubtitle || 'CURATED EXCERPTS'}
                            onChange={(e) => updateField('portfolio', 'homepageSubtitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Main Heading</label>
                          <input
                            type="text"
                            value={tempData.portfolio?.homepageTitle || 'CREATIVE REGISTRY'}
                            onChange={(e) => updateField('portfolio', 'homepageTitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Optional Description</label>
                        <textarea
                          value={tempData.portfolio?.homepageDescription || ''}
                          onChange={(e) => updateField('portfolio', 'homepageDescription', e.target.value)}
                          rows={2}
                          className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">CTA Button Text</label>
                          <input
                            type="text"
                            value={tempData.portfolio?.homepageCtaText || 'View All Portfolio'}
                            onChange={(e) => updateField('portfolio', 'homepageCtaText', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">CTA Destination URL</label>
                          <input
                            type="text"
                            value={tempData.portfolio?.homepageCtaUrl || 'portfolio'}
                            onChange={(e) => updateField('portfolio', 'homepageCtaUrl', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Display Limit (Project Count)</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={tempData.portfolio?.homepageLimit || 6}
                            onChange={(e) => updateField('portfolio', 'homepageLimit', parseInt(e.target.value) || 6)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0e0e12] border border-neutral-800 rounded-xl p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-sans text-xs text-white font-bold block">Featured Projects Only</span>
                            <span className="font-mono text-[9px] text-neutral-500 block">Only display projects flagged as featured.</span>
                          </div>
                          <button
                            onClick={() => updateField('portfolio', 'homepageFeaturedOnly', !tempData.portfolio.homepageFeaturedOnly)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors outline-none cursor-pointer ${
                              tempData.portfolio.homepageFeaturedOnly ? 'bg-orange-500' : 'bg-neutral-800'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-black transform duration-200 ${tempData.portfolio.homepageFeaturedOnly ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <span className="font-sans text-xs text-white font-bold block">Rendered Categories Filter</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {tempData.portfolio.categories.map((cat: string) => {
                              const currentCats = tempData.portfolio.homepageCategories || [];
                              const isChecked = currentCats.length === 0 || currentCats.includes(cat);
                              return (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    let newCats = [...currentCats];
                                    if (newCats.includes(cat)) {
                                      newCats = newCats.filter(c => c !== cat);
                                    } else {
                                      newCats.push(cat);
                                    }
                                    updateField('portfolio', 'homepageCategories', newCats);
                                  }}
                                  className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded border transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-orange-500 border-orange-500 text-black font-bold'
                                      : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {cat}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                case 'process':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Workflow Main Heading</label>
                          <input
                            type="text"
                            value={tempData.process?.title || 'CREATIVE WORKFLOW PIPELINE'}
                            onChange={(e) => updateField('process', 'title', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Workflow Subtitle/Description</label>
                          <input
                            type="text"
                            value={tempData.process?.subtitle || ''}
                            onChange={(e) => updateField('process', 'subtitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                          <h4 className="font-mono text-[10px] text-orange-400 font-bold uppercase tracking-wider">Pipeline Execution Steps</h4>
                          <button
                            onClick={() => {
                              const newStep: ProcessStep = {
                                id: 'step-' + Date.now(),
                                stepNumber: `STEP 0${tempData.process.steps.length + 1}`,
                                title: 'NEW PIPELINE PHASE',
                                description: 'Custom detailed step explanation.',
                                icon: 'Layers'
                              };
                              updateField('process', 'steps', [...tempData.process.steps, newStep]);
                              logAction('Added new workflow step to timeline.');
                            }}
                            className="bg-[#0e0e12] hover:bg-neutral-900 border border-neutral-800 text-orange-400 font-mono text-[9px] uppercase tracking-wider px-3 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer"
                          >
                            <PlusCircle size={11} />
                            <span>Add Workflow Step</span>
                          </button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                          {(tempData.process?.steps || []).map((step: ProcessStep, stepIdx: number) => (
                            <div key={step.id || stepIdx} className="bg-[#0e0e12] border border-neutral-800 rounded-xl p-5 space-y-4 relative">
                              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                                <span className="font-mono text-[10px] text-orange-400 font-bold">STEP NODE {stepIdx + 1}</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    disabled={stepIdx === 0}
                                    onClick={() => {
                                      const steps = [...tempData.process.steps];
                                      const temp = steps[stepIdx];
                                      steps[stepIdx] = steps[stepIdx - 1];
                                      steps[stepIdx - 1] = temp;
                                      updateField('process', 'steps', steps);
                                    }}
                                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 bg-black border border-neutral-800 rounded transition-colors"
                                  >
                                    <ArrowUp size={11} />
                                  </button>
                                  <button
                                    disabled={stepIdx === tempData.process.steps.length - 1}
                                    onClick={() => {
                                      const Math_step = [...tempData.process.steps];
                                      const temp = Math_step[stepIdx];
                                      Math_step[stepIdx] = Math_step[stepIdx + 1];
                                      Math_step[stepIdx + 1] = temp;
                                      updateField('process', 'steps', Math_step);
                                    }}
                                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 bg-black border border-neutral-800 rounded transition-colors"
                                  >
                                    <ArrowDown size={11} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const steps = tempData.process.steps.filter((_: any, i: number) => i !== stepIdx);
                                      updateField('process', 'steps', steps);
                                      logAction(`Removed step: ${step.title}`);
                                    }}
                                    className="p-1 text-neutral-500 hover:text-red-500 bg-black border border-neutral-800 rounded transition-colors"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] text-neutral-500 uppercase">Step Number Tag</label>
                                  <input
                                    type="text"
                                    value={step.stepNumber}
                                    onChange={(e) => {
                                      const steps = [...tempData.process.steps];
                                      steps[stepIdx] = { ...step, stepNumber: e.target.value };
                                      updateField('process', 'steps', steps);
                                    }}
                                    className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] text-neutral-500 uppercase">Step Title</label>
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => {
                                      const steps = [...tempData.process.steps];
                                      steps[stepIdx] = { ...step, title: e.target.value };
                                      updateField('process', 'steps', steps);
                                    }}
                                    className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="font-mono text-[9px] text-neutral-500 uppercase">Icon (Lucide name, e.g. Layers, Palette, Users)</label>
                                  <input
                                    type="text"
                                    value={step.icon || 'Layers'}
                                    onChange={(e) => {
                                      const steps = [...tempData.process.steps];
                                      steps[stepIdx] = { ...step, icon: e.target.value };
                                      updateField('process', 'steps', steps);
                                    }}
                                    className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="font-mono text-[9px] text-neutral-500 uppercase">Description</label>
                                <textarea
                                  value={step.description}
                                  onChange={(e) => {
                                    const steps = [...tempData.process.steps];
                                    steps[stepIdx] = { ...step, description: e.target.value };
                                    updateField('process', 'steps', steps);
                                  }}
                                  rows={2}
                                  className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-3 py-2 rounded-lg focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );

                case 'metrics':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Benchmark Section Tagline</label>
                          <input
                            type="text"
                            value={tempData.metrics?.tagline || 'AGENCY BENCHMARK'}
                            onChange={(e) => updateField('metrics', 'tagline', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Benchmark Section Heading</label>
                          <input
                            type="text"
                            value={tempData.metrics?.heading || 'DELIVERING LEGENDARY VISUAL INTENSITY'}
                            onChange={(e) => updateField('metrics', 'heading', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Benchmark Section Description (Optional)</label>
                        <textarea
                          value={tempData.metrics?.description || ''}
                          onChange={(e) => updateField('metrics', 'description', e.target.value)}
                          rows={2}
                          className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Button Text (Optional)</label>
                          <input
                            type="text"
                            value={tempData.metrics?.buttonText || ''}
                            onChange={(e) => updateField('metrics', 'buttonText', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Button URL Destination</label>
                          <input
                            type="text"
                            value={tempData.metrics?.buttonUrl || ''}
                            onChange={(e) => updateField('metrics', 'buttonUrl', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Benchmark Background Featured Image</label>
                        <MediaPicker
                          value={tempData.metrics?.featuredImage || ''}
                          onChange={(url) => updateField('metrics', 'featuredImage', url)}
                          mediaLibrary={tempData.mediaLibrary || []}
                          type="image"
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-mono text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Benchmark Stat Counters</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(tempData.metrics?.stats || []).map((stat: MetricItem, statIdx: number) => (
                            <div key={stat.id || statIdx} className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-3">
                              <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5">
                                <span className="font-mono text-[9px] text-orange-400 uppercase font-bold">Counter 0{statIdx + 1}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1 col-span-2">
                                  <label className="font-mono text-[8px] text-neutral-500 uppercase">Label</label>
                                  <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => {
                                      const stats = [...tempData.metrics.stats];
                                      stats[statIdx] = { ...stat, label: e.target.value };
                                      updateField('metrics', 'stats', stats);
                                    }}
                                    className="w-full bg-black border border-neutral-800 text-white font-sans text-[11px] px-2 py-1.5 rounded"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="font-mono text-[8px] text-neutral-500 uppercase">Value</label>
                                  <input
                                    type="number"
                                    value={stat.value}
                                    onChange={(e) => {
                                      const stats = [...tempData.metrics.stats];
                                      stats[statIdx] = { ...stat, value: parseInt(e.target.value) || 0 };
                                      updateField('metrics', 'stats', stats);
                                    }}
                                    className="w-full bg-black border border-neutral-800 text-white font-sans text-[11px] px-2 py-1.5 rounded"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-[8px] text-neutral-500 uppercase">Value Suffix (e.g. +, %, K)</label>
                                <input
                                  type="text"
                                  value={stat.suffix}
                                  onChange={(e) => {
                                    const stats = [...tempData.metrics.stats];
                                    stats[statIdx] = { ...stat, suffix: e.target.value };
                                    updateField('metrics', 'stats', stats);
                                  }}
                                  className="w-full bg-black border border-neutral-800 text-white font-sans text-[11px] px-2 py-1.5 rounded"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );

                case 'testimonials':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Testimonials Tagline</label>
                          <input
                            type="text"
                            value={tempData.testimonials?.subtitle || 'PROVEN EXCELLENCE'}
                            onChange={(e) => updateField('testimonials', 'subtitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Testimonials Heading</label>
                          <input
                            type="text"
                            value={tempData.testimonials?.heading || 'CLIENT TESTIMONIALS'}
                            onChange={(e) => updateField('testimonials', 'heading', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Display Limit (Item Count)</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={tempData.testimonials?.homepageLimit || 3}
                            onChange={(e) => updateField('testimonials', 'homepageLimit', parseInt(e.target.value) || 3)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="text-neutral-400 text-xs">
                        * Note: The individual testimonial items, roles, quotes, ratings, and avatar assets are fully managed in the separate <strong className="text-white font-bold">Testimonials tab</strong> at the top of the Admin Panel.
                      </div>
                    </div>
                  );

                case 'faq':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage FAQ Badge/Subtitle</label>
                          <input
                            type="text"
                            value={tempData.faq?.subtitle || 'INFORMATION COUNTER'}
                            onChange={(e) => updateField('faq', 'subtitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage FAQ Main Heading</label>
                          <input
                            type="text"
                            value={tempData.faq?.heading || 'Frequently Asked Questions'}
                            onChange={(e) => updateField('faq', 'heading', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Display Limit (Item Count)</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={tempData.faq?.homepageLimit || 10}
                            onChange={(e) => updateField('faq', 'homepageLimit', parseInt(e.target.value) || 10)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="text-neutral-400 text-xs">
                        * Note: The individual FAQ questions and answers themselves are fully managed inside the <strong className="text-white font-bold">FAQ tab</strong> at the top of the Admin Panel.
                      </div>
                    </div>
                  );

                case 'inquiry':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Inquiry Section Tagline</label>
                          <input
                            type="text"
                            value={tempData.inquiry?.tagline || 'COLLABORATION DECK'}
                            onChange={(e) => updateField('inquiry', 'tagline', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Inquiry Section Title</label>
                          <input
                            type="text"
                            value={tempData.inquiry?.title || ''}
                            onChange={(e) => updateField('inquiry', 'title', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Inquiry Section Subtitle (Description)</label>
                        <textarea
                          value={tempData.inquiry?.subtitle || ''}
                          onChange={(e) => updateField('inquiry', 'subtitle', e.target.value)}
                          rows={2}
                          className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Artist Image Tag Text (e.g. CREATIVE HUB)</label>
                          <input
                            type="text"
                            value={tempData.inquiry?.designerTag || 'CREATIVE HUB'}
                            onChange={(e) => updateField('inquiry', 'designerTag', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Form Submit Button Text</label>
                          <input
                            type="text"
                            value={tempData.inquiry?.submitButtonText || 'TRANSMIT PROJECT INQUIRY'}
                            onChange={(e) => updateField('inquiry', 'submitButtonText', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Artist/Designer Featured Image</label>
                        <MediaPicker
                          value={tempData.inquiry?.designerImage || ''}
                          onChange={(url) => updateField('inquiry', 'designerImage', url)}
                          mediaLibrary={tempData.mediaLibrary || []}
                          type="image"
                        />
                      </div>

                      <div className="text-neutral-400 text-xs">
                        * Note: The collaboration form is dynamically compiled using fields configured in the <strong className="text-white font-bold">Inquiry Form Builder</strong> tab at the top of the Admin Panel.
                      </div>
                    </div>
                  );

                case 'blog':
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Articles Tagline/Subtitle</label>
                          <input
                            type="text"
                            value={tempData.blog?.homepageSubtitle || 'STUDIO WISDOM'}
                            onChange={(e) => updateField('blog', 'homepageSubtitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Homepage Articles Main Title</label>
                          <input
                            type="text"
                            value={tempData.blog?.homepageTitle || 'LATEST INSIGHTS'}
                            onChange={(e) => updateField('blog', 'homepageTitle', e.target.value)}
                            className="w-full bg-black border border-neutral-800 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2 col-span-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">CTA Button Text</label>
                          <input
                            type="text"
                            value={tempData.blog?.homepageCtaText || 'View All Articles'}
                            onChange={(e) => updateField('blog', 'homepageCtaText', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">CTA Destination URL</label>
                          <input
                            type="text"
                            value={tempData.blog?.homepageCtaUrl || 'blog'}
                            onChange={(e) => updateField('blog', 'homepageCtaUrl', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Display Limit (Article Count)</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={tempData.blog?.homepageLimit || 3}
                            onChange={(e) => updateField('blog', 'homepageLimit', parseInt(e.target.value) || 3)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">Sort Order</label>
                          <select
                            value={tempData.blog?.homepageSortOrder || 'newest'}
                            onChange={(e) => updateField('blog', 'homepageSortOrder', e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-neutral-400 text-xs">
                        * Note: The individual articles themselves, including rich content, slugs, images, and SEO bibles are fully managed in the separate <strong className="text-white font-bold">Articles (Blog)</strong> tab.
                      </div>
                    </div>
                  );

                default:
                  return <div className="text-neutral-500 text-xs font-mono">Custom CMS data not registered for this layout module.</div>;
              }
            };

            return (
              <div className="p-10 space-y-10 max-w-7xl mx-auto">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">HOMEPAGE LAYOUT SECTION COMPILER</h2>
                  <p className="text-sm text-neutral-400">
                    Toggle section visibility, drag-reorder structural sections, and click <strong className="text-white">Edit Content</strong> to manage each section's actual media and texts.
                  </p>
                </div>

                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div className="space-y-4">
                    {(tempData.homepageLayout || []).map((section, idx) => {
                      const isExpanded = expandedSectionId === section.id;
                      return (
                        <div
                          key={section.id}
                          className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300"
                        >
                          <div className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                            <div className="flex items-center space-x-4">
                              {/* Drag Indicators/Arrow controls */}
                              <div className="flex flex-col space-y-1">
                                <button
                                  onClick={() => moveSection(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 hover:text-orange-500 disabled:opacity-20 transition-colors cursor-pointer"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  onClick={() => moveSection(idx, 'down')}
                                  disabled={idx === (tempData.homepageLayout || []).length - 1}
                                  className="p-1 hover:text-orange-500 disabled:opacity-20 transition-colors cursor-pointer"
                                >
                                  <ArrowDown size={13} />
                                </button>
                              </div>

                              <div>
                                <span className="font-mono text-[10px] text-orange-400 block font-bold">SECTION 0{idx + 1}</span>
                                <span className="font-sans text-sm text-white font-bold block mt-0.5">{section.label || section.name}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="font-mono text-[9px] text-neutral-500 hidden sm:inline">ID: {section.id}</span>
                              
                              {/* Toggle switch */}
                              <button
                                onClick={() => toggleSection(idx)}
                                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none cursor-pointer ${
                                  section.enabled ? 'bg-orange-500' : 'bg-neutral-800'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full bg-black shadow-md transform duration-200 ${
                                    section.enabled ? 'translate-x-6' : 'translate-x-0'
                                  }`}
                                />
                              </button>

                              {/* Edit Content Button */}
                              <button
                                onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
                                className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider rounded border transition-all flex items-center space-x-1.5 cursor-pointer ${
                                  isExpanded
                                    ? 'bg-orange-500 text-black font-bold border-orange-500'
                                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                                }`}
                              >
                                <Sliders size={11} />
                                <span>{isExpanded ? 'Close' : 'Edit Content'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Expanded inline editor */}
                          {isExpanded && (
                            <div className="border-t border-neutral-800 bg-[#07070a]/70 p-6 space-y-6">
                              {renderSectionEditor(section.id)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* PORTFOLIO WORK DIRECTORY MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div className="p-10 space-y-10 max-w-7xl mx-auto">
              
              {/* Category Filter and Addition Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">PORTFOLIO SEQUENTIAL DIRECTORY</h2>
                  <p className="text-sm text-neutral-400">
                    Add categories, edit dynamic year tokens, cover media paths, and update showcase project indexes.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const newProj: PortfolioProject = {
                        id: 'project-' + Date.now(),
                        title: 'New Studio Masterpiece',
                        slug: 'new-studio-masterpiece',
                        category: tempData.portfolio.categories[0] || 'Branding',
                        year: new Date().getFullYear().toString(),
                        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                        tag: 'Interactive Creative Design',
                        description: 'Detailed interactive user experience case study.',
                        longDescription: 'Bespoke creative execution designed for dynamic high-end client interfaces.',
                        client: 'Kaiju Labs',
                        tags: ['Art Direction', 'UI/UX Design'],
                        galleryImages: [],
                        tools: ['Figma', 'React', 'Tailwind'],
                        visualDetails: ['Responsive layout grid', 'Immersive spatial context']
                      };
                      setEditingProject(newProj);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus size={14} />
                    <span>Create New Portfolio Project</span>
                  </button>
                </div>
              </div>

              {/* Manage Portfolio Categories Panel */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">MANAGE CLASSIFIED CATEGORIES</h3>
                  <p className="text-xs text-neutral-400">Classify portfolios dynamically for homepage tags filtering.</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {(tempData.portfolio.categories || []).map((cat) => (
                    <div
                      key={cat}
                      className="bg-neutral-950 border border-neutral-800 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-xs"
                    >
                      <span className="text-white font-sans">{cat}</span>
                      <button
                        onClick={() => {
                          const cats = tempData.portfolio.categories.filter(c => c !== cat);
                          updateField('portfolio', 'categories', cats);
                          logAction(`Removed portfolio category index: ${cat}`);
                        }}
                        className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete category index"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 max-w-md">
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl flex-1 font-sans"
                  />
                  <button
                    onClick={() => {
                      if (!newCatName.trim()) return;
                      if (tempData.portfolio.categories.includes(newCatName.trim())) return;
                      const cats = [...tempData.portfolio.categories, newCatName.trim()];
                      updateField('portfolio', 'categories', cats);
                      setNewCatName('');
                      logAction(`Registered new portfolio category index: ${newCatName.trim()}`);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Portfolio Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(tempData.portfolio.projects || []).map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#0e0e12] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-black border-b border-neutral-900">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-black/80 border border-neutral-800/80 font-mono text-[9px] text-orange-400 uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-sans text-base font-black text-white uppercase tracking-tight">{project.title}</h4>
                          <span className="font-mono text-[10px] text-neutral-500">{project.year}</span>
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>

                      <div className="flex space-x-2 pt-2 border-t border-neutral-900">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Edit Portfolio
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this project from catalog?')) {
                              const projects = tempData.portfolio.projects.filter(p => p.id !== project.id);
                              updateField('portfolio', 'projects', projects);
                              logAction(`Deleted portfolio project: ${project.title}`);
                            }
                          }}
                          className="p-2.5 bg-neutral-950 hover:bg-red-500/10 border border-neutral-900 rounded-xl text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Portfolio Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PROJECT FULL-SCREEN COMPREHENSIVE EDITOR DRAWER */}
              {editingProject && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-end z-[1000] p-6 animate-fade-in">
                  <div className="w-full max-w-3xl bg-[#0e0e12] border border-neutral-800 h-full rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-slide-left">
                    
                    {/* Header */}
                    <div className="px-8 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40 shrink-0">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-orange-500 tracking-widest font-bold">PORTFOLIO PROJECT EDITOR</span>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight max-w-[280px] md:max-w-md truncate">
                          {editingProject.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Form scroll container */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin select-text text-neutral-200">
                      
                      {/* 1. Basic Information Section */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-sans text-sm font-black text-orange-500 uppercase tracking-tight mb-1">1. Basic Information</h4>
                          <p className="text-xs text-neutral-400">Provide the primary metadata for the portfolio project.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-850">
                          <div className="flex flex-col space-y-2 md:col-span-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">PROJECT TITLE</label>
                            <input
                              type="text"
                              value={editingProject.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                const slugify = (text: string) => {
                                  return text
                                    .toString()
                                    .toLowerCase()
                                    .trim()
                                    .replace(/\s+/g, '-')           // Replace spaces with -
                                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
                                };
                                const oldTitleSlug = slugify(editingProject.title || '');
                                const currentSlug = editingProject.slug || '';
                                const newSlug = (currentSlug === '' || currentSlug === oldTitleSlug) ? slugify(newTitle) : currentSlug;
                                setEditingProject({ ...editingProject, title: newTitle, slug: newSlug });
                              }}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans"
                              placeholder="e.g. My Manga Volume One"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">CATEGORY</label>
                            <select
                              value={editingProject.category}
                              onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans cursor-pointer"
                            >
                              {(tempData.portfolio.categories || []).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SUBCATEGORY (OPTIONAL)</label>
                            <input
                              type="text"
                              value={editingProject.tag || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, tag: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans"
                              placeholder="e.g. Cyberpunk, Shonen, Fantasy"
                            />
                          </div>

                          <div className="flex flex-col space-y-2 md:col-span-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">PROJECT DESCRIPTION</label>
                            <textarea
                              rows={3}
                              value={editingProject.description}
                              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans resize-none"
                              placeholder="Bespoke case study description or brief summary..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Cover Image Section */}
                      <div className="space-y-6 pt-6 border-t border-neutral-900">
                        <div>
                          <h4 className="font-sans text-sm font-black text-orange-500 uppercase tracking-tight mb-1">2. Cover Image</h4>
                          <p className="text-xs text-neutral-400">Upload or select the primary cover image representing this portfolio project.</p>
                        </div>

                        <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-4">
                          <MediaPicker
                            value={editingProject.image}
                            onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                            mediaLibrary={tempData.mediaLibrary || []}
                            type="image"
                          />
                        </div>
                      </div>

                      {/* 3. Project Gallery Section */}
                      <div className="space-y-6 pt-6 border-t border-neutral-900">
                        <div>
                          <h4 className="font-sans text-sm font-black text-orange-500 uppercase tracking-tight mb-1">3. Project Gallery</h4>
                          <p className="text-xs text-neutral-400">Upload multiple additional illustrations, comic panels, or artworks for this project.</p>
                        </div>

                        <div className="space-y-4 bg-neutral-950 p-6 rounded-2xl border border-neutral-850">
                          {editingProject.galleryImages && editingProject.galleryImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {editingProject.galleryImages.map((imgUrl, index) => (
                                <div key={index} className="relative group aspect-square bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between">
                                  <img
                                    src={imgUrl}
                                    alt={`Gallery thumbnail ${index + 1}`}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 p-1">
                                    <button
                                      type="button"
                                      disabled={index === 0}
                                      onClick={() => {
                                        const arr = [...(editingProject.galleryImages || [])];
                                        const temp = arr[index];
                                        arr[index] = arr[index - 1];
                                        arr[index - 1] = temp;
                                        setEditingProject({ ...editingProject, galleryImages: arr });
                                      }}
                                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-white disabled:opacity-30 disabled:hover:bg-neutral-800 cursor-pointer"
                                      title="Move Left"
                                    >
                                      <ArrowLeft size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={index === (editingProject.galleryImages || []).length - 1}
                                      onClick={() => {
                                        const arr = [...(editingProject.galleryImages || [])];
                                        const temp = arr[index];
                                        arr[index] = arr[index + 1];
                                        arr[index + 1] = temp;
                                        setEditingProject({ ...editingProject, galleryImages: arr });
                                      }}
                                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-white disabled:opacity-30 disabled:hover:bg-neutral-800 cursor-pointer"
                                      title="Move Right"
                                    >
                                      <ArrowRight size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const arr = (editingProject.galleryImages || []).filter((_, i) => i !== index);
                                        setEditingProject({ ...editingProject, galleryImages: arr });
                                      }}
                                      className="p-1.5 bg-red-950 hover:bg-red-900 rounded text-red-400 cursor-pointer"
                                      title="Remove Image"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-[8px] font-mono text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">
                                    #{index + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs font-mono">
                              No gallery images added yet. Add some images below.
                            </div>
                          )}

                          {/* Trigger to add a new image */}
                          <div className="border-t border-neutral-900 pt-4 space-y-2">
                            <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Add Image to Gallery</span>
                            <MediaPicker
                              value=""
                              onChange={(url) => {
                                if (url) {
                                  const current = editingProject.galleryImages || [];
                                  setEditingProject({ ...editingProject, galleryImages: [...current, url] });
                                }
                              }}
                              mediaLibrary={tempData.mediaLibrary || []}
                              type="image"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Project Details Section */}
                      <div className="space-y-6 pt-6 border-t border-neutral-900">
                        <div>
                          <h4 className="font-sans text-sm font-black text-orange-500 uppercase tracking-tight mb-1">4. Project Details</h4>
                          <p className="text-xs text-neutral-400">Fill in deeper contextual attributes for dynamic portfolio presentation pages. Only URL Slug is mandatory.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-850">
                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider flex justify-between">
                              <span>URL SLUG (REQUIRED)</span>
                              <span className="text-orange-500 text-[8px] font-bold uppercase">Auto-generates from Title</span>
                            </label>
                            <input
                              type="text"
                              value={editingProject.slug || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-orange-400 focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-mono"
                              placeholder="e.g. my-manga-volume-one"
                              required
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">BRAND / CLIENT NAME (OPTIONAL)</label>
                            <input
                              type="text"
                              value={editingProject.client || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans"
                              placeholder="e.g. Shueisha, Tokyo Pop, Self-published"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">TOOLS USED (OPTIONAL, COMMA SEPARATED)</label>
                            <input
                              type="text"
                              value={(editingProject.tools || []).join(', ')}
                              onChange={(e) => setEditingProject({ 
                                ...editingProject, 
                                tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                              })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans"
                              placeholder="e.g. Clip Studio Paint, Photoshop, Wacom Cintiq"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">TAGS / KEYWORDS (OPTIONAL, COMMA SEPARATED)</label>
                            <input
                              type="text"
                              value={(editingProject.tags || []).join(', ')}
                              onChange={(e) => setEditingProject({ 
                                ...editingProject, 
                                tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                              })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans"
                              placeholder="e.g. Mecha, Shonen, Cyberpunk, 2026"
                            />
                          </div>

                          <div className="flex flex-col space-y-2 md:col-span-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">EXTENDED PROJECT NARRATIVE (OPTIONAL)</label>
                            <textarea
                              rows={5}
                              value={editingProject.longDescription || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans resize-none leading-relaxed"
                              placeholder="Write a comprehensive overview of the creative process, visual workflow, structural composition, storyboards..."
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">PRODUCTION YEAR (OPTIONAL)</label>
                            <input
                              type="text"
                              value={editingProject.year || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                              className="bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl w-full font-sans"
                              placeholder="e.g. 2026"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SYSTEM PROJECT UNIQUE ID</label>
                            <input
                              type="text"
                              value={editingProject.id}
                              disabled
                              className="bg-neutral-900/60 border border-neutral-800/80 px-4 py-3 text-sm text-neutral-500 rounded-xl w-full font-mono cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Footer drawer controls */}
                    <div className="px-8 py-5 border-t border-neutral-800 bg-neutral-950/40 shrink-0 flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 px-5 py-2.5 rounded-xl font-mono text-xs uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!editingProject.slug || !editingProject.slug.trim()) {
                            alert('URL Slug is required.');
                            return;
                          }
                          const existing = tempData.portfolio.projects.findIndex(p => p.id === editingProject.id);
                          const projects = [...tempData.portfolio.projects];
                          if (existing !== -1) {
                            projects[existing] = editingProject;
                          } else {
                            projects.push(editingProject);
                          }
                          updateField('portfolio', 'projects', projects);
                          logAction(`Updated portfolio project: ${editingProject.title}`);
                          setEditingProject(null);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.35)] cursor-pointer"
                      >
                        {!tempData.portfolio.projects.some(p => p.id === editingProject.id) ? 'Save Portfolio' : 'Update Portfolio'}
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* EDITORIAL JOURNAL CMS PUBLISHER */}
          {activeTab === 'blog' && (
            <div className="p-10 space-y-10 max-w-7xl mx-auto">
              
              {/* Category Filter and Addition Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">EDITORIAL BLOG CMS PUBLISHER</h2>
                  <p className="text-sm text-neutral-400">
                    Write articles, configure SEO optimization, organize categories, and publish blog posts.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const newArt: BlogArticle = {
                        id: 'article-' + Date.now(),
                        title: 'Modern Front-End Architectures',
                        excerpt: 'Explaining state syncing, SEO optimization protocols and Vite bundlers.',
                        content: '# Heading 1\n\nThis is an editorial article detailing modern CMS engines and node systems.\n\n## Sub Heading\n\n- Point 1\n- Point 2',
                        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        readTime: '4 min read',
                        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                        author: 'Kaiju Team',
                        category: tempData.blog.categories[0] || 'Engineering',
                        tags: ['Design', 'Development'],
                        seoTitle: 'Modern Front-End Architectures | Kaiju Studios',
                        seoDescription: 'Explaining state syncing, SEO optimization protocols and Vite bundlers in React.',
                        seoKeywords: 'CMS, React, Laravel, TypeScript',
                        ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
                      };
                      setEditingArticle(newArt);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus size={14} />
                    <span>Write Article</span>
                  </button>
                </div>
              </div>

              {/* Blog Categories indexing */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">Create Categories</h3>
                  <p className="text-xs text-neutral-400">Add or purge category filters dedicated for the journal archives index.</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {(tempData.blog.categories || []).map((cat) => (
                    <div
                      key={cat}
                      className="bg-neutral-950 border border-neutral-800 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-xs"
                    >
                      <span className="text-white font-sans">{cat}</span>
                      <button
                        onClick={() => {
                          const cats = tempData.blog.categories.filter(c => c !== cat);
                          updateField('blog', 'categories', cats);
                          logAction(`Purged blog topic category: ${cat}`);
                        }}
                        className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete topic"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 max-w-md">
                  <input
                    type="text"
                    placeholder="New topic index..."
                    value={newBlogCatName}
                    onChange={(e) => setNewBlogCatName(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl flex-1 font-sans"
                  />
                  <button
                    onClick={() => {
                      if (!newBlogCatName.trim()) return;
                      if (tempData.blog.categories.includes(newBlogCatName.trim())) return;
                      const cats = [...tempData.blog.categories, newBlogCatName.trim()];
                      updateField('blog', 'categories', cats);
                      setNewBlogCatName('');
                      logAction(`Registered new blog category index: ${newBlogCatName.trim()}`);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Articles lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(tempData.blog.articles || []).map((art) => (
                  <div
                    key={art.id}
                    className="bg-[#0e0e12] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-black border-b border-neutral-900">
                      <img
                        src={art.image}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-black/80 border border-neutral-800/80 font-mono text-[9px] text-orange-400 uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {art.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-sans text-base font-black text-white uppercase tracking-tight line-clamp-1">{art.title}</h4>
                          <span className="font-mono text-[9px] text-neutral-500 shrink-0">{art.readTime}</span>
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                      </div>

                      <div className="flex space-x-2 pt-2 border-t border-neutral-900">
                        <button
                          onClick={() => setEditingArticle(art)}
                          className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Modify Article
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this article from database?')) {
                              const articles = tempData.blog.articles.filter(a => a.id !== art.id);
                              updateField('blog', 'articles', articles);
                              logAction(`Deleted blog article: ${art.title}`);
                            }
                          }}
                          className="p-2.5 bg-neutral-950 hover:bg-red-500/10 border border-neutral-900 rounded-xl text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete article row"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DUAL-PANE ADVANCED CMS EDITOR WITH PREVIEW & SEO SIDEBAR */}
              {editingArticle && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1001] p-6 animate-fade-in">
                  <div className="w-full h-full max-w-[95vw] bg-[#0c0c0e] border border-neutral-800 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-slide-up">
                    
                    {/* Upper Action Bar */}
                    <div className="px-8 py-5 border-b border-neutral-800 bg-neutral-950/40 shrink-0 flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <span className="font-mono text-xs text-orange-500 tracking-wider font-bold">BLOG CMS WRITING ROOM</span>
                        <h3 className="text-base font-black text-white uppercase tracking-tight max-w-sm truncate">
                          {editingArticle.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setEditingArticle(null)}
                          className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 px-5 py-2.5 rounded-xl font-mono text-xs uppercase cursor-pointer transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => {
                            const existing = tempData.blog.articles.findIndex(a => a.id === editingArticle.id);
                            const articles = [...tempData.blog.articles];
                            if (existing !== -1) {
                              articles[existing] = editingArticle;
                            } else {
                              articles.push(editingArticle);
                            }
                            updateField('blog', 'articles', articles);
                            logAction(`Published blog article cache changes: ${editingArticle.title}`);
                            setEditingArticle(null);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer"
                        >
                          Save Article
                        </button>
                      </div>
                    </div>

                    {/* Step Tabs Navigation */}
                    <div className="flex border-b border-neutral-900 bg-neutral-950 px-8 py-3.5 space-x-6 shrink-0">
                      {[
                        { id: 'write', label: '1. Write Content', desc: 'SaaS Markdown Editor' },
                        { id: 'media', label: '2. Cover Image & Preview', desc: 'Layout & Cover photo' },
                        { id: 'seo', label: '3. SEO Configuration', desc: 'Google Snippet preview' }
                      ].map((step) => {
                        const isStepActive = blogStep === step.id;
                        return (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => setBlogStep(step.id as any)}
                            className={`text-left pb-1.5 transition-all border-b-2 cursor-pointer ${
                              isStepActive ? 'border-orange-500 text-white font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            <span className="block text-[10px] font-mono uppercase tracking-wider">{step.label}</span>
                            <span className="block text-[8px] text-neutral-600 font-sans mt-0.5">{step.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Editor Workspace Content */}
                    <div className="flex-1 flex overflow-hidden">
                      
                      {/* Hidden Input Files for Media Injection */}
                      <input
                        type="file"
                        id="rich-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
                            const result = await res.json();
                            if (result.success && result.url) {
                              const txt = editingArticle.content;
                              const start = textareaRef.current?.selectionStart || txt.length;
                              const end = textareaRef.current?.selectionEnd || txt.length;
                              const next = txt.substring(0, start) + `\n![Image](${result.url})\n` + txt.substring(end);
                              setEditingArticle({ ...editingArticle, content: next });
                            }
                          } catch (err) {
                            console.error('Failed to upload image', err);
                          }
                        }}
                      />
                      <input
                        type="file"
                        id="rich-video-upload"
                        className="hidden"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
                            const result = await res.json();
                            if (result.success && result.url) {
                              const txt = editingArticle.content;
                              const start = textareaRef.current?.selectionStart || txt.length;
                              const end = textareaRef.current?.selectionEnd || txt.length;
                              const next = txt.substring(0, start) + `\n<video src="${result.url}" controls className="w-full rounded-xl" />\n` + txt.substring(end);
                              setEditingArticle({ ...editingArticle, content: next });
                            }
                          } catch (err) {
                            console.error('Failed to upload video', err);
                          }
                        }}
                      />

                      {/* STEP 1: WRITE CONTENT */}
                      {blogStep === 'write' && (
                        <div className="flex-1 flex overflow-hidden">
                          {/* Left Column: Markdown Editor */}
                          <div className="w-1/2 border-r border-neutral-800/80 flex flex-col overflow-hidden h-full">
                            {/* Editor Toolbar */}
                            <div className="bg-neutral-950/80 border-b border-neutral-800 px-4 py-2 flex flex-wrap gap-1 shrink-0">
                              <button type="button" onClick={() => insertFormatting('h1')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all text-xs font-bold" title="Insert H1 Header">H1</button>
                              <button type="button" onClick={() => insertFormatting('h2')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all text-xs font-bold" title="Insert H2 Header">H2</button>
                              <button type="button" onClick={() => insertFormatting('h3')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all text-xs font-bold" title="Insert H3 Header">H3</button>
                              <button type="button" onClick={() => insertFormatting('h4')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all text-xs font-bold" title="Insert H4 Header">H4</button>
                              <div className="w-px h-6 bg-neutral-800 my-auto mx-1" />
                              <button type="button" onClick={() => insertFormatting('bold')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all" title="Bold Selected Text"><Bold size={13} /></button>
                              <button type="button" onClick={() => insertFormatting('italic')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all" title="Italic Selected Text"><Italic size={13} /></button>
                              <button type="button" onClick={() => insertFormatting('underline')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all font-mono text-xs font-bold" title="Underline Text">U</button>
                              <div className="w-px h-6 bg-neutral-800 my-auto mx-1" />
                              <button type="button" onClick={() => insertFormatting('list')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all" title="Unordered List"><List size={13} /></button>
                              <button type="button" onClick={() => insertFormatting('quote')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all" title="Insert Quote Block"><Quote size={13} /></button>
                              <button type="button" onClick={() => insertFormatting('link')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all" title="Insert Hyperlink"><LinkIcon size={13} /></button>
                              <button type="button" onClick={() => insertFormatting('table')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all" title="Insert Markdown Table"><Code size={13} /></button>
                              <div className="w-px h-6 bg-neutral-800 my-auto mx-1" />
                              <button type="button" onClick={() => document.getElementById('rich-image-upload')?.click()} className="p-1.5 hover:bg-neutral-800 rounded text-orange-400 hover:text-orange-300 transition-all flex items-center space-x-1" title="Upload Image From Device">
                                <ImageIcon size={13} />
                                <span className="text-[10px] font-mono">Image</span>
                              </button>
                              <button type="button" onClick={() => document.getElementById('rich-video-upload')?.click()} className="p-1.5 hover:bg-neutral-800 rounded text-cyan-400 hover:text-cyan-300 transition-all flex items-center space-x-1" title="Upload Video From Device">
                                <Video size={13} />
                                <span className="text-[10px] font-mono">Video</span>
                              </button>
                            </div>

                            {/* Inputs and textarea */}
                            <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto scrollbar-thin select-text bg-[#08080a]/30">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Article Title</span>
                                  <input
                                    type="text"
                                    value={editingArticle.title}
                                    onChange={(e) => {
                                      const newTitle = e.target.value;
                                      const generatedSlug = newTitle
                                        .toLowerCase()
                                        .replace(/[^a-z0-9\s-]/g, '')
                                        .trim()
                                        .replace(/\s+/g, '-')
                                        .replace(/-+/g, '-');
                                      const domain = window.location.origin;
                                      const generatedCanonical = `${domain}/blog/${generatedSlug}`;
                                      setEditingArticle({
                                        ...editingArticle,
                                        title: newTitle,
                                        slug: generatedSlug,
                                        canonicalUrl: generatedCanonical
                                      });
                                    }}
                                    className="bg-neutral-950 border border-neutral-850 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-lg font-sans font-bold"
                                  />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Category</span>
                                  <select
                                    value={editingArticle.category}
                                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                                    className="bg-neutral-950 border border-neutral-850 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-lg font-sans cursor-pointer"
                                  >
                                    {tempData.blog.categories.map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-1.5">
                                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Short Excerpt Summary</span>
                                <input
                                  type="text"
                                  value={editingArticle.excerpt}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                                  className="bg-neutral-950 border border-neutral-850 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-lg font-sans"
                                />
                              </div>

                              <div className="flex-1 flex flex-col space-y-1.5 min-h-[300px]">
                                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Rich Markdown Content Writer</span>
                                <textarea
                                  ref={textareaRef}
                                  value={editingArticle.content}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                                  className="bg-neutral-950 border border-neutral-850 px-4 py-3.5 text-xs text-neutral-300 focus:outline-none focus:border-orange-500/50 rounded-xl w-full flex-1 font-mono leading-relaxed resize-none scrollbar-thin select-text"
                                  placeholder="Compose article narrative in clean Markdown format..."
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Realtime Content Preview */}
                          <div className="w-1/2 p-8 overflow-y-auto h-full scrollbar-thin select-text bg-[#08080a] space-y-4">
                            <span className="font-mono text-[8px] text-orange-500 uppercase tracking-widest font-bold block border-b border-neutral-900 pb-2">REAL-TIME TEXT CONTENT PREVIEW</span>
                            
                            <div className="space-y-4 font-sans text-xs text-neutral-300">
                              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full block w-max">
                                {editingArticle.category || 'Category'}
                              </span>
                              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                                {editingArticle.title || 'Untitled Article'}
                              </h1>
                              <p className="font-sans italic text-xs text-neutral-400">
                                {editingArticle.excerpt || 'Article excerpt is empty.'}
                              </p>
                              <div className="border-t border-neutral-900 pt-4 space-y-3 prose prose-invert select-text leading-relaxed text-xs">
                                {renderRichContent(editingArticle.content)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 2: COVER IMAGE & PREVIEW */}
                      {blogStep === 'media' && (
                        <div className="flex-1 flex overflow-hidden">
                          {/* Left Column: Cover photo & OpenGraph Upload */}
                          <div className="w-1/2 p-6 border-r border-neutral-800 overflow-y-auto h-full space-y-6">
                            <div>
                              <h4 className="text-xs font-mono font-bold text-white uppercase mb-2">Featured Cover Photo</h4>
                              <p className="text-[10px] text-neutral-500 font-sans mb-3">Upload a premium high-resolution cover image for the list and header hero views.</p>
                              <MediaPicker
                                value={editingArticle.image}
                                onChange={(url) => setEditingArticle({ ...editingArticle, image: url })}
                                mediaLibrary={tempData.mediaLibrary || []}
                                type="image"
                                onRefreshMedia={refreshMediaLibrary}
                              />
                            </div>

                            <div className="border-t border-neutral-900 pt-6">
                              <h4 className="text-xs font-mono font-bold text-white uppercase mb-2">Social Share Graph (OG:Image)</h4>
                              <p className="text-[10px] text-neutral-500 font-sans mb-3">Select the asset rendered when sharing the link on X, LinkedIn, or Threads platforms.</p>
                              <MediaPicker
                                value={editingArticle.ogImage || ''}
                                onChange={(url) => setEditingArticle({ ...editingArticle, ogImage: url })}
                                mediaLibrary={tempData.mediaLibrary || []}
                                type="image"
                                onRefreshMedia={refreshMediaLibrary}
                              />
                            </div>
                          </div>

                          {/* Right Column: Complete Blog Layout Visual Preview */}
                          <div className="w-1/2 p-8 overflow-y-auto h-full bg-[#08080a] space-y-6">
                            <span className="font-mono text-[8px] text-orange-500 uppercase tracking-widest font-bold block border-b border-neutral-900 pb-2">COMPLETE LAYOUT VISUAL PREVIEW</span>
                            
                            <div className="max-w-xl mx-auto space-y-6">
                              {/* Hero Cover block */}
                              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                                {editingArticle.image ? (
                                  <img src={editingArticle.image} alt="Cover preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 text-xs font-mono space-y-1">
                                    <ImageIcon size={20} />
                                    <span>No Featured Image Uploaded</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3 font-sans">
                                <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full block w-max">
                                  {editingArticle.category || 'Category'}
                                </span>
                                <h1 className="text-2xl font-black text-white uppercase leading-tight tracking-tight">
                                  {editingArticle.title || 'Untitled Article'}
                                </h1>
                                <p className="font-sans italic text-xs text-neutral-400 leading-relaxed">
                                  {editingArticle.excerpt || 'Excerpt summary...'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: SEO CONFIGURATION */}
                      {blogStep === 'seo' && (
                        <div className="flex-1 flex overflow-hidden">
                          {/* Left Column: Form inputs */}
                          <div className="w-1/2 p-6 border-r border-neutral-800 overflow-y-auto h-full space-y-6 bg-[#08080a]/10">
                            <div className="space-y-4">
                              <span className="font-mono text-[10px] text-orange-400 font-bold uppercase tracking-wider block">SEO Configuration Tags</span>
                              
                              <div className="flex flex-col space-y-1.5">
                                <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SEO Title Tag Override</label>
                                <input
                                  type="text"
                                  value={editingArticle.seoTitle || ''}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, seoTitle: e.target.value })}
                                  className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                  placeholder="Meta title displayed in search bar tabs..."
                                />
                              </div>

                              <div className="flex flex-col space-y-1.5">
                                <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SEO Meta Description</label>
                                <textarea
                                  rows={3}
                                  value={editingArticle.seoDescription || ''}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, seoDescription: e.target.value })}
                                  className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                                  placeholder="Paragraph displayed under the link in google results..."
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                  <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SEO Target Keywords</label>
                                  <input
                                    type="text"
                                    value={editingArticle.seoKeywords || ''}
                                    onChange={(e) => setEditingArticle({ ...editingArticle, seoKeywords: e.target.value })}
                                    className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-mono"
                                    placeholder="e.g. manga, kaiju, react"
                                  />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                  <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">URL Seed Slug</label>
                                  <input
                                    type="text"
                                    value={editingArticle.slug || ''}
                                    onChange={(e) => {
                                      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                      const domain = window.location.origin;
                                      setEditingArticle({
                                        ...editingArticle,
                                        slug: newSlug,
                                        canonicalUrl: `${domain}/blog/${newSlug}`
                                      });
                                    }}
                                    className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-mono"
                                    placeholder="e.g. cyberpunk-future-design"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col space-y-1.5 pt-2 border-t border-neutral-900">
                                <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Canonical Link URL</label>
                                <input
                                  type="text"
                                  value={editingArticle.canonicalUrl || ''}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, canonicalUrl: e.target.value })}
                                  className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-mono"
                                  placeholder="https://kaijustudios.com/blog/slug"
                                />
                                <span className="text-[8px] text-neutral-500 font-mono">Forces search crawlers to map rankings to a single unique link index.</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Google Search Engine Preview */}
                          <div className="w-1/2 p-8 h-full bg-[#08080a] space-y-6">
                            <span className="font-mono text-[8px] text-orange-500 uppercase tracking-widest font-bold block border-b border-neutral-900 pb-2">GOOGLE SEARCH DESKTOP SNIPPET PREVIEW</span>
                            
                            <div className="bg-white border border-neutral-200 rounded-xl p-6 text-black select-text space-y-2">
                              {/* Search Result Box (Pixel perfect Google Desktop reproduction) */}
                              <div className="flex flex-col space-y-1 max-w-lg">
                                {/* Breadcrumb row */}
                                <div className="flex items-center space-x-1.5 text-xs text-[#202124] font-sans truncate">
                                  <span className="text-xs">https://kaijustudios.com</span>
                                  <span className="text-neutral-400 font-bold">›</span>
                                  <span className="text-xs truncate">blog</span>
                                  <span className="text-neutral-400 font-bold">›</span>
                                  <span className="text-xs text-neutral-500 truncate">{editingArticle.slug || 'untitled-slug'}</span>
                                </div>
                                
                                {/* Title tag */}
                                <h3 className="text-[20px] leading-tight text-[#1a0dab] hover:underline font-sans cursor-pointer">
                                  {editingArticle.seoTitle || editingArticle.title || 'Untitled Article Title - Kaiju Studio Blog'}
                                </h3>
                                
                                {/* Meta snippet */}
                                <p className="text-[14px] leading-snug text-[#4d5156] font-sans">
                                  <span className="text-neutral-500 mr-1">1 day ago —</span>
                                  {editingArticle.seoDescription || editingArticle.excerpt || 'Please provide a meta description to see how it renders here on Google Search Engine Results pages (SERPs).'}
                                </p>
                              </div>
                            </div>

                            <span className="font-mono text-[8px] text-neutral-500 block leading-normal uppercase">This preview simulates exactly how search engine crawlers process, index, and render your blog article within browser lookup indexes.</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STUDIO CMS PAGE BUILDER */}
          {activeTab === 'studio' && (() => {
            const studioLayout = tempData.studioPage?.layout || [
              { id: 'hero', name: 'Our Story & Manifesto Header', enabled: true },
              { id: 'image', name: 'Featured Studio Image', enabled: true },
              { id: 'philosophy', name: 'Creative Philosophy & Sub-Points', enabled: true },
              { id: 'manifesto', name: 'Strategic Pillars (Manifesto Grid)', enabled: true },
              { id: 'statistics', name: 'Studio Statistics & Scale', enabled: true },
              { id: 'cta', name: 'Portfolio Call-To-Action (CTA)', enabled: true }
            ];

            const philosophyParas = tempData.studioPage?.philosophyParagraphs || 
              (tempData.studioPage?.philosophyText ? [tempData.studioPage.philosophyText] : ['']);

            const philosophySubPoints = tempData.studioPage?.philosophySubPoints || [];
            const manifestoValues = tempData.studioPage?.values || [];
            const globalStats = tempData.metrics?.stats || [];

            const availableIcons = [
              'BookOpen', 'Users', 'Compass', 'Lightbulb', 'ShieldCheck', 'Award', 
              'Briefcase', 'Cpu', 'Layers', 'Globe', 'Heart', 'Zap', 'Sparkles', 
              'Star', 'Terminal', 'Target', 'TrendingUp', 'Video', 'Music', 'Code', 'Image'
            ];

            return (
              <div id="studio-cms-panel" className="p-10 space-y-12 max-w-7xl mx-auto text-white">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">About Us</h2>
                  <p className="text-sm text-neutral-400">
                    Manage the structure, content, and visibility of the entire About Us page dynamically.
                  </p>
                </div>

                {/* 10. LAYOUT CONTROLS */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1 flex items-center">
                      <Layout size={18} className="text-orange-500 mr-2" />
                      10. STUDIO PAGE SECTIONS & LAYOUT CONTROLS
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Show/hide, duplicate, or reorder the visual content blocks of the Studio (About) page.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {studioLayout.map((section, idx) => (
                      <div key={section.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-xl gap-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs text-neutral-500 font-bold">0{idx + 1}</span>
                          <span className="text-sm font-sans font-medium text-white">{section.name}</span>
                          <span className="font-mono text-[9px] text-orange-500/80 bg-orange-500/5 border border-orange-500/10 px-2.5 py-0.5 rounded uppercase font-semibold">
                            {section.id.split('-')[0]}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          {/* Reorder Up */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === 0) return;
                              const newLayout = [...studioLayout];
                              const temp = newLayout[idx];
                              newLayout[idx] = newLayout[idx - 1];
                              newLayout[idx - 1] = temp;
                              updateField('studioPage', 'layout', newLayout);
                            }}
                            disabled={idx === 0}
                            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded-xl disabled:opacity-30 transition-colors cursor-pointer"
                            title="Move Section Up"
                          >
                            <ArrowUp size={14} />
                          </button>

                          {/* Reorder Down */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === studioLayout.length - 1) return;
                              const newLayout = [...studioLayout];
                              const temp = newLayout[idx];
                              newLayout[idx] = newLayout[idx + 1];
                              newLayout[idx + 1] = temp;
                              updateField('studioPage', 'layout', newLayout);
                            }}
                            disabled={idx === studioLayout.length - 1}
                            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded-xl disabled:opacity-30 transition-colors cursor-pointer"
                            title="Move Section Down"
                          >
                            <ArrowDown size={14} />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => {
                              const newLayout = [...studioLayout];
                              const toClone = newLayout[idx];
                              const newSec = {
                                id: `${toClone.id.split('-')[0]}-copy-${Date.now()}`,
                                name: `${toClone.name.replace(/ \(Copy( \d+)?\)/, '')} (Copy)`,
                                enabled: true
                              };
                              newLayout.splice(idx + 1, 0, newSec);
                              updateField('studioPage', 'layout', newLayout);
                            }}
                            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded-xl transition-colors cursor-pointer"
                            title="Duplicate Section"
                          >
                            <Copy size={14} />
                          </button>

                          {/* Show/Hide Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              const newLayout = [...studioLayout];
                              newLayout[idx].enabled = !newLayout[idx].enabled;
                              updateField('studioPage', 'layout', newLayout);
                            }}
                            className={`p-2 border rounded-xl transition-colors cursor-pointer ${
                              section.enabled 
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20' 
                                : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-white'
                            }`}
                            title={section.enabled ? "Hide Section" : "Show Section"}
                          >
                            {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>

                          {/* Delete Duplicated Section */}
                          {section.id.includes('-copy-') && (
                            <button
                              type="button"
                              onClick={() => {
                                const newLayout = studioLayout.filter((_, sIdx) => sIdx !== idx);
                                updateField('studioPage', 'layout', newLayout);
                              }}
                              className="p-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer"
                              title="Delete Cloned Section"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. HERO / STORY SECTION */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1">
                      1. HERO / STORY CONFIGURATION
                    </h3>
                    <p className="text-xs text-neutral-400">Configure the top story block, headlines, badges, and button overrides.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Hero Section Badge</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.badge || ''}
                        onChange={(e) => updateField('studioPage', 'badge', e.target.value)}
                        placeholder="OUR STORY & MANIFESTO"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Main Heading Title</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.headline || ''}
                        onChange={(e) => updateField('studioPage', 'headline', e.target.value)}
                        placeholder="KAIJU STUDIOS"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2 md:col-span-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Subtitle Paragraph (Core Story)</label>
                      <textarea
                        rows={3}
                        value={tempData.studioPage?.subtitle || ''}
                        onChange={(e) => updateField('studioPage', 'subtitle', e.target.value)}
                        placeholder="Core manifesto subtitle..."
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans leading-relaxed resize-none"
                      />
                    </div>

                    <div className="flex flex-col space-y-2 md:col-span-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Secondary Description (Detailed Info)</label>
                      <textarea
                        rows={3}
                        value={tempData.studioPage?.description || ''}
                        onChange={(e) => updateField('studioPage', 'description', e.target.value)}
                        placeholder="Optional secondary detail paragraphs displayed directly below the subtitle story."
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* Hero CTA Controls */}
                  <div className="border-t border-neutral-800 pt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="heroShowCta"
                        checked={!!tempData.studioPage?.heroShowCta}
                        onChange={(e) => updateField('studioPage', 'heroShowCta', e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-orange-500 focus:ring-orange-500/30 accent-orange-500 cursor-pointer"
                      />
                      <label htmlFor="heroShowCta" className="font-mono text-[10px] font-bold text-white uppercase tracking-wider cursor-pointer">
                        Enable Hero Call-To-Action Button
                      </label>
                    </div>

                    {tempData.studioPage?.heroShowCta && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="flex flex-col space-y-2">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Button Label Text</label>
                          <input
                            type="text"
                            value={tempData.studioPage?.heroCtaText || ''}
                            onChange={(e) => updateField('studioPage', 'heroCtaText', e.target.value)}
                            placeholder="Contact Us"
                            className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-sans"
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Button Action (Page name / External URL)</label>
                          <input
                            type="text"
                            value={tempData.studioPage?.heroCtaUrl || ''}
                            onChange={(e) => updateField('studioPage', 'heroCtaUrl', e.target.value)}
                            placeholder="contact, portfolio, or https://example.com"
                            className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-sans"
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-6">
                          <input
                            type="checkbox"
                            id="heroCtaNewTab"
                            checked={!!tempData.studioPage?.heroCtaNewTab}
                            onChange={(e) => updateField('studioPage', 'heroCtaNewTab', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-orange-500 accent-orange-500 cursor-pointer"
                          />
                          <label htmlFor="heroCtaNewTab" className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider cursor-pointer">
                            Open in New Tab
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. FEATURED STUDIO IMAGE */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1">
                      2. FEATURED STUDIO COVER IMAGE
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Upload or select the high-fidelity Tokyo-style studio collaborative image displayed in Section 2.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Featured Image Top Label</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.bannerLabel || ''}
                        onChange={(e) => updateField('studioPage', 'bannerLabel', e.target.value)}
                        placeholder="01 // COLLABORATIVE WORKSPACE IN TOKYO"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Overlay Caption Badge</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.bannerCap || ''}
                        onChange={(e) => updateField('studioPage', 'bannerCap', e.target.value)}
                        placeholder="KAIJU CORE TEAM // PRODUCTION DECK"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Cover Art Image File</label>
                    <MediaPicker
                      value={tempData.studioPage?.bannerImage || ''}
                      onChange={(url) => updateField('studioPage', 'bannerImage', url)}
                      mediaLibrary={tempData.mediaLibrary || []}
                      type="image"
                    />
                  </div>
                </div>

                {/* 3. PHILOSOPHY SECTION */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-8">
                  <div>
                    <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1">
                      3. CREATIVE PHILOSOPHY & SUB-POINTS
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Manage title overlays, multi-paragraph bodies, and dynamic core values lists.
                    </p>
                  </div>

                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Philosophy Block Badge</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.philosophyBadge || ''}
                        onChange={(e) => updateField('studioPage', 'philosophyBadge', e.target.value)}
                        placeholder="02 // CREATIVE PHILOSOPHY"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Philosophy Title</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.philosophyTitle || ''}
                        onChange={(e) => updateField('studioPage', 'philosophyTitle', e.target.value)}
                        placeholder="A REFUSAL OF REPETITIVE TEMPLATES"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>
                  </div>

                  {/* Philosophy Multi-Paragraph System */}
                  <div className="border-t border-neutral-800 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="font-mono text-[10px] font-bold text-white uppercase tracking-wider block">
                          PHILOSOPHY STORY PARAGRAPHS
                        </label>
                        <span className="text-[10px] text-neutral-400">Add, delete, or rearrange paragraphs that describe your studio's methodology.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newParas = [...philosophyParas, ''];
                          updateField('studioPage', 'philosophyParagraphs', newParas);
                          updateField('studioPage', 'philosophyText', newParas.join('\n\n'));
                        }}
                        className="inline-flex items-center space-x-1 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold font-sans"
                      >
                        <Plus size={12} />
                        <span>Add Paragraph</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {philosophyParas.map((para, pIdx) => (
                        <div key={pIdx} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3 relative">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-orange-400 font-bold uppercase">PARAGRAPH 0{pIdx + 1}</span>
                            <div className="flex items-center space-x-1.5">
                              {/* Move Up */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (pIdx === 0) return;
                                  const newParas = [...philosophyParas];
                                  const temp = newParas[pIdx];
                                  newParas[pIdx] = newParas[pIdx - 1];
                                  newParas[pIdx - 1] = temp;
                                  updateField('studioPage', 'philosophyParagraphs', newParas);
                                  updateField('studioPage', 'philosophyText', newParas.join('\n\n'));
                                }}
                                disabled={pIdx === 0}
                                className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                              >
                                <ArrowUp size={12} />
                              </button>
                              {/* Move Down */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (pIdx === philosophyParas.length - 1) return;
                                  const newParas = [...philosophyParas];
                                  const temp = newParas[pIdx];
                                  newParas[pIdx] = newParas[pIdx + 1];
                                  newParas[pIdx + 1] = temp;
                                  updateField('studioPage', 'philosophyParagraphs', newParas);
                                  updateField('studioPage', 'philosophyText', newParas.join('\n\n'));
                                }}
                                disabled={pIdx === philosophyParas.length - 1}
                                className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                              >
                                <ArrowDown size={12} />
                              </button>
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  const newParas = philosophyParas.filter((_, sIdx) => sIdx !== pIdx);
                                  updateField('studioPage', 'philosophyParagraphs', newParas.length > 0 ? newParas : ['']);
                                  updateField('studioPage', 'philosophyText', (newParas.length > 0 ? newParas : ['']).join('\n\n'));
                                }}
                                className="p-1 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            value={para}
                            onChange={(e) => {
                              const newParas = [...philosophyParas];
                              newParas[pIdx] = e.target.value;
                              updateField('studioPage', 'philosophyParagraphs', newParas);
                              updateField('studioPage', 'philosophyText', newParas.join('\n\n'));
                            }}
                            placeholder="Write paragraph story..."
                            className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white focus:outline-none rounded-lg font-sans leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Philosophy Sub-Points (CORE VALUES & CULTURE) */}
                  <div className="border-t border-neutral-800 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="font-mono text-[10px] font-bold text-white uppercase tracking-wider block">
                          5. CORE VALUES & DESIGN MINDSET REPEATER
                        </label>
                        <span className="text-[10px] text-neutral-400">Configure value subsets shown in the philosophy column.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newSub = [...philosophySubPoints, { title: 'NEW MINDSET', desc: 'Add details here.', icon: 'Compass' }];
                          updateField('studioPage', 'philosophySubPoints', newSub);
                        }}
                        className="inline-flex items-center space-x-1 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold font-sans"
                      >
                        <Plus size={12} />
                        <span>Add Sub-Point</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {philosophySubPoints.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-4 relative">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-orange-400 font-bold uppercase">SUB-POINT 0{sIdx + 1}</span>
                            <div className="flex items-center space-x-1.5">
                              {/* Move Left/Up */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (sIdx === 0) return;
                                  const newSub = [...philosophySubPoints];
                                  const temp = newSub[sIdx];
                                  newSub[sIdx] = newSub[sIdx - 1];
                                  newSub[sIdx - 1] = temp;
                                  updateField('studioPage', 'philosophySubPoints', newSub);
                                }}
                                disabled={sIdx === 0}
                                className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                              >
                                <ArrowUp size={12} />
                              </button>
                              {/* Move Right/Down */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (sIdx === philosophySubPoints.length - 1) return;
                                  const newSub = [...philosophySubPoints];
                                  const temp = newSub[sIdx];
                                  newSub[sIdx] = newSub[sIdx + 1];
                                  newSub[sIdx + 1] = temp;
                                  updateField('studioPage', 'philosophySubPoints', newSub);
                                }}
                                disabled={sIdx === philosophySubPoints.length - 1}
                                className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                              >
                                <ArrowDown size={12} />
                              </button>
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  const newSub = philosophySubPoints.filter((_, idx) => idx !== sIdx);
                                  updateField('studioPage', 'philosophySubPoints', newSub);
                                }}
                                className="p-1 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col space-y-1">
                              <label className="font-mono text-[7px] text-neutral-500 uppercase tracking-wider">Sub Title</label>
                              <input
                                type="text"
                                value={sub.title || ''}
                                onChange={(e) => {
                                  const newSub = [...philosophySubPoints];
                                  newSub[sIdx].title = e.target.value;
                                  updateField('studioPage', 'philosophySubPoints', newSub);
                                }}
                                className="bg-neutral-950 border border-neutral-800 px-2.5 py-1 text-xs text-white focus:outline-none rounded-md font-sans"
                              />
                            </div>

                            <div className="flex flex-col space-y-1">
                              <label className="font-mono text-[7px] text-neutral-500 uppercase tracking-wider">Icon Type</label>
                              <select
                                value={sub.icon || 'Compass'}
                                onChange={(e) => {
                                  const newSub = [...philosophySubPoints];
                                  newSub[sIdx].icon = e.target.value;
                                  updateField('studioPage', 'philosophySubPoints', newSub);
                                }}
                                className="bg-neutral-950 border border-neutral-800 px-2.5 py-1 text-xs text-white focus:outline-none rounded-md font-mono"
                              >
                                {availableIcons.map(icon => (
                                  <option key={icon} value={icon}>{icon}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="font-mono text-[7px] text-neutral-500 uppercase tracking-wider">Short Description</label>
                            <textarea
                              rows={2}
                              value={sub.desc || ''}
                              onChange={(e) => {
                                const newSub = [...philosophySubPoints];
                                newSub[sIdx].desc = e.target.value;
                                updateField('studioPage', 'philosophySubPoints', newSub);
                              }}
                              className="bg-neutral-950 border border-neutral-800 p-2 text-xs text-white focus:outline-none rounded-lg font-sans leading-relaxed resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. MANIFESTO SECTION */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1">
                        4. THE KAIJU MANIFESTO / STRATEGIC PILLARS GRID
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Create fully dynamic high-contrast grids. Reorder, add, and change icons.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newManifesto = [...manifestoValues, { 
                          id: `val-${Date.now()}`, 
                          title: 'NEW MANIFESTO PILLAR', 
                          description: 'Strategic value description here.', 
                          icon: 'Compass' 
                        }];
                        updateField('studioPage', 'values', newManifesto);
                      }}
                      className="inline-flex items-center space-x-1 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold font-sans"
                    >
                      <Plus size={12} />
                      <span>Add Pillar Card</span>
                    </button>
                  </div>

                  {/* Section Title and Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-neutral-800">
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Manifesto Badge Title</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.manifestoBadge || ''}
                        onChange={(e) => updateField('studioPage', 'manifestoBadge', e.target.value)}
                        placeholder="03 // STRATEGIC PILLARS"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Manifesto Headline Title</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.manifestoTitle || ''}
                        onChange={(e) => updateField('studioPage', 'manifestoTitle', e.target.value)}
                        placeholder="THE KAIJU MANIFESTO"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>
                  </div>

                  {/* Manifesto Cards Repeater */}
                  <div className="space-y-4 pt-2">
                    {manifestoValues.map((item, idx) => (
                      <div key={item.id || idx} className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] text-orange-400 font-bold block uppercase">PILLAR CARD 0{idx + 1}</span>
                          <div className="flex items-center space-x-1.5">
                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === 0) return;
                                const newManifesto = [...manifestoValues];
                                const temp = newManifesto[idx];
                                newManifesto[idx] = newManifesto[idx - 1];
                                newManifesto[idx - 1] = temp;
                                updateField('studioPage', 'values', newManifesto);
                              }}
                              disabled={idx === 0}
                              className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                            >
                              <ArrowUp size={12} />
                            </button>
                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === manifestoValues.length - 1) return;
                                const newManifesto = [...manifestoValues];
                                const temp = newManifesto[idx];
                                newManifesto[idx] = newManifesto[idx + 1];
                                newManifesto[idx + 1] = temp;
                                updateField('studioPage', 'values', newManifesto);
                              }}
                              disabled={idx === manifestoValues.length - 1}
                              className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                            >
                              <ArrowDown size={12} />
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                const newManifesto = manifestoValues.filter((_, sIdx) => sIdx !== idx);
                                updateField('studioPage', 'values', newManifesto);
                              }}
                              className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Pillar Title</label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const newManifesto = [...manifestoValues];
                                newManifesto[idx].title = e.target.value;
                                updateField('studioPage', 'values', newManifesto);
                              }}
                              className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none rounded-lg font-sans"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Pillar Icon</label>
                            <select
                              value={item.icon || 'Compass'}
                              onChange={(e) => {
                                const newManifesto = [...manifestoValues];
                                newManifesto[idx].icon = e.target.value;
                                updateField('studioPage', 'values', newManifesto);
                              }}
                              className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none rounded-lg font-mono"
                            >
                              {availableIcons.map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col space-y-2 md:col-span-2">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Pillar Description</label>
                            <textarea
                              rows={2}
                              value={item.description || ''}
                              onChange={(e) => {
                                const newManifesto = [...manifestoValues];
                                newManifesto[idx].description = e.target.value;
                                updateField('studioPage', 'values', newManifesto);
                              }}
                              className="bg-neutral-950 border border-neutral-800 p-3 text-xs text-white focus:outline-none rounded-lg font-sans leading-relaxed resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. STUDIO STATISTICS (SYNCS TO GLOBAL METRICS) */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1">
                        6. STUDIO STATISTICS & ACHIEVEMENT COUNTERS
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Create, modify, and reorder statistics cards. Changes sync globally and work with the counter animation!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = [...globalStats, { 
                          id: `stat-${Date.now()}`, 
                          label: 'HAPPY CLIENTS', 
                          value: 100, 
                          suffix: '+' 
                        }];
                        updateField('metrics', 'stats', newStats);
                      }}
                      className="inline-flex items-center space-x-1 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold font-sans"
                    >
                      <Plus size={12} />
                      <span>Add New Stat</span>
                    </button>
                  </div>

                  {/* Stats Title and Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-neutral-800">
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Statistics Section Badge</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.statsBadge || ''}
                        onChange={(e) => updateField('studioPage', 'statsBadge', e.target.value)}
                        placeholder="04 // AUTHENTIC VERIFIED PERFORMANCE"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Statistics Title</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.statsTitle || ''}
                        onChange={(e) => updateField('studioPage', 'statsTitle', e.target.value)}
                        placeholder="STUDIO STATISTICS & SCALE"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>
                  </div>

                  {/* Statistics Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {globalStats.map((stat, idx) => (
                      <div key={stat.id || idx} className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-orange-400 font-bold block uppercase">STAT CARD 0{idx + 1}</span>
                          <div className="flex items-center space-x-1">
                            {/* Move Up/Left */}
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === 0) return;
                                const newStats = [...globalStats];
                                const temp = newStats[idx];
                                newStats[idx] = newStats[idx - 1];
                                newStats[idx - 1] = temp;
                                updateField('metrics', 'stats', newStats);
                              }}
                              disabled={idx === 0}
                              className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                            >
                              <ArrowUp size={11} />
                            </button>
                            {/* Move Down/Right */}
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === globalStats.length - 1) return;
                                const newStats = [...globalStats];
                                const temp = newStats[idx];
                                newStats[idx] = newStats[idx + 1];
                                newStats[idx + 1] = temp;
                                updateField('metrics', 'stats', newStats);
                              }}
                              disabled={idx === globalStats.length - 1}
                              className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer"
                            >
                              <ArrowDown size={11} />
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                const newStats = globalStats.filter((_, sIdx) => sIdx !== idx);
                                updateField('metrics', 'stats', newStats);
                              }}
                              className="p-1 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded cursor-pointer"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Stat Label Name</label>
                          <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => {
                              const newStats = [...globalStats];
                              newStats[idx].label = e.target.value;
                              updateField('metrics', 'stats', newStats);
                            }}
                            className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-sans font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Number Value</label>
                            <input
                              type="number"
                              value={stat.value || 0}
                              onChange={(e) => {
                                const newStats = [...globalStats];
                                newStats[idx].value = parseInt(e.target.value) || 0;
                                updateField('metrics', 'stats', newStats);
                              }}
                              className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-mono"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Suffix</label>
                            <input
                              type="text"
                              value={stat.suffix || ''}
                              onChange={(e) => {
                                const newStats = [...globalStats];
                                newStats[idx].suffix = e.target.value;
                                updateField('metrics', 'stats', newStats);
                              }}
                              placeholder="+, %, M"
                              className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. PORTFOLIO CTA SECTION */}
                <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-sans text-base font-black text-white uppercase tracking-tight mb-1">
                      9. PORTFOLIO CALL-TO-ACTION (CTA) SECTION
                    </h3>
                    <p className="text-xs text-neutral-400">Configure visual banner references, cover images, and customizable button overrides.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">CTA Section Badge</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.ctaBadge || ''}
                        onChange={(e) => updateField('studioPage', 'ctaBadge', e.target.value)}
                        placeholder="05 // VISUAL RECONNAISSANCE"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">CTA Headline Title</label>
                      <input
                        type="text"
                        value={tempData.studioPage?.ctaTitle || ''}
                        onChange={(e) => updateField('studioPage', 'ctaTitle', e.target.value)}
                        placeholder="HAVE A UNIVERSE TO BUILD?"
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-2 md:col-span-2">
                      <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">CTA Description Body</label>
                      <textarea
                        rows={3}
                        value={tempData.studioPage?.ctaDescription || ''}
                        onChange={(e) => updateField('studioPage', 'ctaDescription', e.target.value)}
                        placeholder="Collaborate on serialized manga or webtoon designs..."
                        className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* CTA Image */}
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">CTA Background Cover Image</label>
                    <MediaPicker
                      value={tempData.studioPage?.ctaImage || ''}
                      onChange={(url) => updateField('studioPage', 'ctaImage', url)}
                      mediaLibrary={tempData.mediaLibrary || []}
                      type="image"
                    />
                  </div>

                  {/* Button Configurations */}
                  <div className="border-t border-neutral-800 pt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="ctaBtnVisible"
                        checked={tempData.studioPage?.ctaBtnVisible !== false}
                        onChange={(e) => updateField('studioPage', 'ctaBtnVisible', e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-orange-500 focus:ring-orange-500/30 accent-orange-500 cursor-pointer"
                      />
                      <label htmlFor="ctaBtnVisible" className="font-mono text-[10px] font-bold text-white uppercase tracking-wider cursor-pointer">
                        Enable CTA Action Button
                      </label>
                    </div>

                    {tempData.studioPage?.ctaBtnVisible !== false && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="flex flex-col space-y-2">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Button Label Text</label>
                          <input
                            type="text"
                            value={tempData.studioPage?.ctaBtnText || ''}
                            onChange={(e) => updateField('studioPage', 'ctaBtnText', e.target.value)}
                            placeholder="View Full Portfolio"
                            className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-sans"
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Action / Destination Link</label>
                          <input
                            type="text"
                            value={tempData.studioPage?.ctaBtnUrl || ''}
                            onChange={(e) => updateField('studioPage', 'ctaBtnUrl', e.target.value)}
                            placeholder="portfolio, blog, contact, or external URL"
                            className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none rounded-lg font-sans"
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-6">
                          <input
                            type="checkbox"
                            id="ctaBtnNewTab"
                            checked={!!tempData.studioPage?.ctaBtnNewTab}
                            onChange={(e) => updateField('studioPage', 'ctaBtnNewTab', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-orange-500 accent-orange-500 cursor-pointer"
                          />
                          <label htmlFor="ctaBtnNewTab" className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider cursor-pointer">
                            Open in New Tab
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* TESTIMONIALS & FAQS */}
          {activeTab === 'testimonials' && (
            <div className="p-10 space-y-10 max-w-7xl mx-auto">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">TESTIMONIALS & FAQ CREDENTIALS</h2>
                <p className="text-sm text-neutral-400">Configure public reviews, ratings, user avatars, and accordion questions.</p>
              </div>

              {/* Testimonials List */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                  <div>
                    <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">CLIENT REVIEWS</h3>
                    <p className="text-xs text-neutral-400">Manage interactive reviews carousel content.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(tempData.testimonials?.items || [])];
                      list.push({
                        id: 'test-' + Date.now(),
                        author: 'Satoshi Nakamoto',
                        role: 'Blockchain Architect',
                        company: 'Bitcoin Network',
                        quote: 'Outstanding creative art direction, flawless vector files, and rapid node integration.',
                        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
                        rating: 5,
                        companyLogo: ''
                      });
                      updateField('testimonials', 'items', list);
                      logAction(`Added new client review template.`);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[10px] uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Add Review Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(tempData.testimonials?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="bg-neutral-950 border border-neutral-850 p-6 rounded-xl space-y-4">
                      {/* Card Header with Reorder, Duplicate, Delete actions */}
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                        <span className="font-mono text-[9px] text-orange-400 font-bold uppercase">CLIENT REVIEW 0{idx + 1}</span>
                        
                        <div className="flex items-center space-x-1.5">
                          {/* Reorder Up */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === 0) return;
                              const list = [...tempData.testimonials.items];
                              const temp = list[idx];
                              list[idx] = list[idx - 1];
                              list[idx - 1] = temp;
                              updateField('testimonials', 'items', list);
                              logAction(`Reordered testimonial up.`);
                            }}
                            disabled={idx === 0}
                            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          
                          {/* Reorder Down */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === tempData.testimonials.items.length - 1) return;
                              const list = [...tempData.testimonials.items];
                              const temp = list[idx];
                              list[idx] = list[idx + 1];
                              list[idx + 1] = temp;
                              updateField('testimonials', 'items', list);
                              logAction(`Reordered testimonial down.`);
                            }}
                            disabled={idx === tempData.testimonials.items.length - 1}
                            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...tempData.testimonials.items];
                              const toClone = list[idx];
                              const clonedItem = {
                                ...toClone,
                                id: 'test-' + Date.now() + '-copy',
                                author: `${toClone.author} (Copy)`
                              };
                              list.splice(idx + 1, 0, clonedItem);
                              updateField('testimonials', 'items', list);
                              logAction(`Duplicated testimonial card for ${toClone.author}.`);
                            }}
                            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-neutral-400 hover:text-white cursor-pointer transition-colors"
                            title="Duplicate Review"
                          >
                            <Copy size={12} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              const list = tempData.testimonials.items.filter((_, i) => i !== idx);
                              updateField('testimonials', 'items', list);
                              logAction(`Removed client review card.`);
                            }}
                            className="p-1.5 hover:text-red-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded text-neutral-400 hover:text-red-400 cursor-pointer transition-colors"
                            title="Purge Review"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Fields Form Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider font-bold">Client Name (Required)</label>
                          <input
                            type="text"
                            value={item.author || ''}
                            onChange={(e) => {
                              const list = [...tempData.testimonials.items];
                              list[idx].author = e.target.value;
                              updateField('testimonials', 'items', list);
                            }}
                            placeholder="e.g. Alistair Sterling"
                            className="bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-white rounded-lg font-sans w-full focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col space-y-1">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider font-bold">Company Name (Optional)</label>
                          <input
                            type="text"
                            value={item.company || ''}
                            onChange={(e) => {
                              const list = [...tempData.testimonials.items];
                              list[idx].company = e.target.value;
                              updateField('testimonials', 'items', list);
                            }}
                            placeholder="e.g. Nova Interactive"
                            className="bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-white rounded-lg font-sans w-full focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col space-y-1">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider font-bold">Client Position/Role (Required)</label>
                          <input
                            type="text"
                            value={item.role || ''}
                            onChange={(e) => {
                              const list = [...tempData.testimonials.items];
                              list[idx].role = e.target.value;
                              updateField('testimonials', 'items', list);
                            }}
                            placeholder="e.g. Lead Designer"
                            className="bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-white rounded-lg font-sans w-full focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col space-y-1">
                          <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider font-bold">Star Rating (Required)</label>
                          <select
                            value={item.rating || ''}
                            onChange={(e) => {
                              const list = [...tempData.testimonials.items];
                              list[idx].rating = e.target.value ? Number(e.target.value) : undefined;
                              updateField('testimonials', 'items', list);
                            }}
                            className="bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-white rounded-lg font-sans w-full focus:outline-none cursor-pointer"
                          >
                            <option value="">No Star Rating</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                      </div>

                      {/* Photo Pickers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900/50 pt-3">
                        <SimpleImageUpload
                          label="Client Photo"
                          value={item.image || ''}
                          onChange={(url) => {
                            const list = [...tempData.testimonials.items];
                            list[idx].image = url;
                            updateField('testimonials', 'items', list);
                          }}
                        />

                        <SimpleImageUpload
                          label="Company Logo (Optional)"
                          value={item.companyLogo || ''}
                          onChange={(url) => {
                            const list = [...tempData.testimonials.items];
                            list[idx].companyLogo = url;
                            updateField('testimonials', 'items', list);
                          }}
                        />
                      </div>

                      {/* Testimonial Quote Text */}
                      <div className="flex flex-col space-y-1 border-t border-neutral-900/50 pt-3">
                        <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider font-bold">Testimonial Quote / Text</label>
                        <textarea
                          rows={3}
                          value={item.quote || ''}
                          onChange={(e) => {
                            const list = [...tempData.testimonials.items];
                            list[idx].quote = e.target.value;
                            updateField('testimonials', 'items', list);
                          }}
                          placeholder="Type the review content that will be displayed inside the quote bubbles..."
                          className="w-full bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-neutral-300 rounded-lg font-sans resize-none focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Save & Publish buttons */}
                <div className="flex justify-between items-center border-t border-neutral-900 pt-6">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-xs text-neutral-400 font-sans">
                      {saveStatus === 'saved' ? 'All changes saved and live on production site' : 'Unsaved draft changes detected...'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-sans text-xs font-black uppercase px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                      Publish Testimonials
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQs accordion manager */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                  <div>
                    <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">ACCORDION INTERACTIVE FAQS</h3>
                    <p className="text-xs text-neutral-400">Publish or remove answers on structural FAQ tabs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(tempData.faq?.items || [])];
                      list.push({
                        id: 'faq-' + Date.now(),
                        question: 'What technologies are used in backend routing?',
                        answer: 'The system runs a modular Laravel 12 framework, integrated with an Express Node pipeline.'
                      });
                      updateField('faq', 'items', list);
                      logAction(`Added new FAQ accordion slot.`);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[10px] uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Add FAQ Card
                  </button>
                </div>

                <div className="space-y-4">
                  {(tempData.faq?.items || []).map((faq, idx) => (
                    <div key={faq.id || idx} className="bg-neutral-950 border border-neutral-850 p-5 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[8px] text-orange-400 font-bold uppercase">ACCORDION SLOT 0{idx + 1}</span>
                        
                        <div className="flex items-center space-x-1.5">
                          {/* Move Up */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === 0) return;
                              const list = [...tempData.faq.items];
                              const temp = list[idx];
                              list[idx] = list[idx - 1];
                              list[idx - 1] = temp;
                              updateField('faq', 'items', list);
                              logAction(`Reordered FAQ up.`);
                            }}
                            disabled={idx === 0}
                            className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          
                          {/* Move Down */}
                          <button
                            type="button"
                            onClick={() => {
                              if (idx === tempData.faq.items.length - 1) return;
                              const list = [...tempData.faq.items];
                              const temp = list[idx];
                              list[idx] = list[idx + 1];
                              list[idx + 1] = temp;
                              updateField('faq', 'items', list);
                              logAction(`Reordered FAQ down.`);
                            }}
                            disabled={idx === tempData.faq.items.length - 1}
                            className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded disabled:opacity-35 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={11} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              const list = tempData.faq.items.filter((_, i) => i !== idx);
                              updateField('faq', 'items', list);
                              logAction(`Removed FAQ slot.`);
                            }}
                            className="text-neutral-500 hover:text-red-400 p-1 bg-neutral-900 border border-neutral-850 rounded cursor-pointer transition-colors"
                            title="Purge FAQ"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-col space-y-1">
                          <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-wider font-bold">Question</span>
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => {
                              const list = [...tempData.faq.items];
                              list[idx].question = e.target.value;
                              updateField('faq', 'items', list);
                            }}
                            placeholder="e.g. What is the turn-around time?"
                            className="w-full bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-white font-sans font-bold rounded-lg focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col space-y-1">
                          <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-wider font-bold">Answer</span>
                          <textarea
                            rows={2}
                            value={faq.answer || ''}
                            onChange={(e) => {
                              const list = [...tempData.faq.items];
                              list[idx].answer = e.target.value;
                              updateField('faq', 'items', list);
                            }}
                            placeholder="Type the answer response here..."
                            className="w-full bg-neutral-950 border border-neutral-900 focus:border-orange-500/50 px-3 py-2 text-xs text-neutral-450 font-sans rounded-lg resize-none focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Save & Publish buttons */}
                <div className="flex justify-between items-center border-t border-neutral-900 pt-6">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-xs text-neutral-400 font-sans">
                      {saveStatus === 'saved' ? 'All FAQs saved and active on live site' : 'Unsaved FAQ draft changes detected...'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-sans text-xs font-black uppercase px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                      Publish FAQs
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* OUTREACH PIPELINES (SOCIALS, FOOTER, FAVICON) */}
          {activeTab === 'outreach' && (
            <div className="p-10 space-y-10 max-w-7xl mx-auto">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">BRANDING & SOCIAL LINKS</h2>
                <p className="text-sm text-neutral-400">Configure site favicons, company branding tags, and social networks.</p>
              </div>

              {/* Favicon Upload (PNG, ICO, SVG) */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-4">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">STUDIO FAVICON COMPILER</h3>
                  <p className="text-xs text-neutral-400">Replace current tab favicon. Supports PNG, ICO, or SVG vectors.</p>
                </div>

                <MediaPicker
                  value={tempData.navigation?.favicon || ''}
                  onChange={(url) => {
                    setTempData(prev => ({
                      ...prev,
                      navigation: { ...(prev.navigation || { logoText: 'KAIJU', logoSubtext: 'STUDIOS', links: [] }), favicon: url }
                    }));
                    logAction(`Favicon URL updated and cache refreshed.`);
                  }}
                  mediaLibrary={tempData.mediaLibrary || []}
                  type="image"
                />
              </div>

              {/* Branding details */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">BRAND LOGO CONFIGURATION</h3>
                  <p className="text-xs text-neutral-400">Branding parameters printed inside the sticky top navbar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">PRIMARY LOGO TEXT</label>
                    <input
                      type="text"
                      value={tempData.navigation?.logoText || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        navigation: { ...(prev.navigation || { logoText: '', logoSubtext: '', links: [] }), logoText: e.target.value }
                      }))}
                      className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">LOGO SUBTEXT ACCENT</label>
                    <input
                      type="text"
                      value={tempData.navigation?.logoSubtext || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        navigation: { ...(prev.navigation || { logoText: '', logoSubtext: '', links: [] }), logoSubtext: e.target.value }
                      }))}
                      className="bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels URLs */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">SOCIAL NETWORKS</h3>
                  <p className="text-xs text-neutral-400">Configure redirection links printed on the public footer segment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(tempData.footer?.socials || []).map((soc, idx) => (
                    <div key={idx} className="flex flex-col space-y-2 bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                      <label className="font-mono text-[9px] font-bold text-orange-400 uppercase tracking-wider">{soc.name} ENDPOINT URL</label>
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const list = [...tempData.footer.socials];
                          list[idx].url = e.target.value;
                          setTempData(prev => ({
                            ...prev,
                            footer: { ...(prev.footer || { logoText: 'KAIJU', copyright: '', description: '', socials: [] }), socials: list }
                          }));
                        }}
                        className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none rounded-lg font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CONTACT COORDINATES & DYNAMIC FORM BUILDER CMS */}
          {activeTab === 'contact-cms' && (
            <ContactCMSView
              tempData={tempData}
              setTempData={setTempData}
              logAction={logAction}
              newFieldName={newFieldName}
              setNewFieldName={setNewFieldName}
              newFieldType={newFieldType}
              setNewFieldType={setNewFieldType}
            />
          )}

          {/* INCOMING COORDINATES INBOX */}
          {activeTab === 'inbox-cms' && (
            <InboxCMSView
              tempData={tempData}
              setTempData={setTempData}
              logAction={logAction}
              inboxSearch={inboxSearch}
              setInboxSearch={setInboxSearch}
              inboxStatusFilter={inboxStatusFilter}
              setInboxStatusFilter={setInboxStatusFilter}
              selectedSubmissionId={selectedSubmissionId}
              setSelectedSubmissionId={setSelectedSubmissionId}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              replyingSubmissionId={replyingSubmissionId}
              setReplyingSubmissionId={setReplyingSubmissionId}
            />
          )}

          {/* SMTP SERVICE & AUTO CONFIRMATION BUILDER */}
          {activeTab === 'smtp-settings' && (
            <SMTPSettingsView
              tempData={tempData}
              setTempData={setTempData}
              logAction={logAction}
              smtpTestLogs={smtpTestLogs}
              setSmtpTestLogs={setSmtpTestLogs}
              testingSmtp={testingSmtp}
              setTestingSmtp={setTestingSmtp}
            />
          )}

          {/* MEDIA VAULT FILE SYSTEM MANAGER */}
          {activeTab === 'media' && (
            <div className="p-10 space-y-10 max-w-7xl mx-auto">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">MEDIA STORAGE VAULT</h2>
                  <p className="text-sm text-neutral-400">Manage Laravel file system uploads, external paths, and bulk assets.</p>
                </div>
              </div>

              {/* Large multi upload widget */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">FILE SYSTEM STREAM</h3>
                  <p className="text-xs text-neutral-400">Stream or ingest new assets directly to public disk emulations.</p>
                </div>

                <MediaPicker
                  value=""
                  onChange={(url) => {
                    logAction(`Added media asset to cache index: ${url}`);
                  }}
                  mediaLibrary={tempData.mediaLibrary || []}
                  onRefreshMedia={async () => {
                    const freshData = await fetchCMSDataFromServer();
                    if (freshData && freshData.mediaLibrary) {
                      setTempData(prev => ({ ...prev, mediaLibrary: freshData.mediaLibrary }));
                    }
                  }}
                />
              </div>

              {/* Complete Vault library catalog uploader */}
              <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">INGESTED VAULT ARCHIVE</h3>
                  <p className="text-xs text-neutral-400">Total registered database rows: {tempData.mediaLibrary?.length || 0} assets.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {(tempData.mediaLibrary || []).map((item) => {
                    const isCopied = copiedIndex === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="aspect-square bg-black rounded-lg overflow-hidden border border-neutral-900 relative">
                          {item.type === 'image' && (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {item.type === 'video' && (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-950">
                              <Film size={22} className="text-neutral-500" />
                            </div>
                          )}
                        </div>

                        <div className="mt-3 space-y-2">
                          <span className="font-mono text-[8px] text-neutral-400 block truncate" title={item.name}>
                            {item.name}
                          </span>
                          
                          <div className="flex space-x-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                setCopiedIndex(item.id);
                                logAction(`Copied path to clipboard: ${item.url}`);
                                setTimeout(() => setCopiedIndex(null), 1500);
                              }}
                              className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              {isCopied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                              <span>{isCopied ? 'Copied' : 'Path'}</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Purge this asset from disk cache?`)) {
                                  const library = tempData.mediaLibrary.filter(i => i.id !== item.id);
                                  setTempData(prev => ({ ...prev, mediaLibrary: library }));
                                  logAction(`Purged asset row: ${item.name}`);
                                }
                              }}
                              className="p-1.5 bg-neutral-950 hover:bg-red-500/10 border border-neutral-900 rounded-lg text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* GLOBAL WEBSITE SETTINGS COMMANDS */}
          {activeTab === 'settings' && (() => {
            const settings = tempData.globalSettings || {
              websiteName: 'STUDIO KAIJU',
              studioName: 'Kaiju Studios',
              appName: 'Kaiju CMS',
              logoUrl: '',
              faviconUrl: '',
              browserTitle: 'STUDIO KAIJU | Premium Comic Art & Manga Agency',
              defaultTimezone: 'GMT+1',
              contactEmail: 'contact@kaijustudios.com',
              contactPhone: '+44 20 7946 0192',
              companyAddress: '42 Shoreditch High St, London, E1 6JJ, United Kingdom'
            };
            
            const handleSettingChange = (key: keyof GlobalSettings, value: any) => {
              const updated = { ...settings, [key]: value };
              setTempData({ ...tempData, globalSettings: updated });
            };

            const handleSocialPlatformChange = (id: string, field: 'enabled' | 'url' | 'displayName', val: any) => {
              const platforms = settings.socialPlatforms || [];
              const updatedPlatforms = platforms.map(p => {
                if (p.id === id) {
                  return { ...p, [field]: val };
                }
                return p;
              });
              handleSettingChange('socialPlatforms', updatedPlatforms);
            };

            const handlePageSeoChange = (page: string, field: string, val: any) => {
              const pageSeo = settings.pageSeo || {};
              const specificPage = pageSeo[page as any] || {};
              const updatedSpecific = { ...specificPage, [field]: val };
              const updatedPageSeo = { ...pageSeo, [page]: updatedSpecific };
              handleSettingChange('pageSeo', updatedPageSeo);
            };

            const selectedPageOverride = settings.pageSeo?.[selectedSeoPage] || {};

            return (
              <div className="p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-6">
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">GLOBAL WEBSITE SETTINGS</h2>
                    <p className="text-sm text-neutral-400">Configure global website identity, theme colors, social channels, and sitemap/robots.txt SEO rules.</p>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        onSave(tempData);
                        logAction("Successfully saved global website settings configuration.");
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <Save size={14} />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </div>

                {/* Secondary Horizontal Tabs for 3-Section Restructure */}
                <div className="flex flex-col md:flex-row gap-3 border-b border-neutral-900 pb-6">
                  {[
                    { id: 'branding', label: '1. BRANDING & THEMES', desc: 'Identity, admin console & color palette' },
                    { id: 'socials', label: '2. SOCIAL MEDIA', desc: 'Centralized 15-platform link manager' },
                    { id: 'seo', label: '3. SEO & SEARCH ENGINE', desc: 'Meta tags, sitemaps, robots & schemas' }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSettingsSubTab(sub.id as any)}
                      className={`flex-1 text-left px-5 py-3 rounded-xl border transition-all cursor-pointer ${
                        settingsSubTab === sub.id
                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                          : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white'
                      }`}
                    >
                      <span className="block font-mono text-xs font-bold uppercase tracking-wider">{sub.label}</span>
                      <span className="block text-[10px] text-neutral-500 mt-0.5 font-sans">{sub.desc}</span>
                    </button>
                  ))}
                </div>

                {/* SubTab 1: Branding & Themes */}
                {settingsSubTab === 'branding' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      
                      {/* Website Branding */}
                      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                        <div>
                          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Website Branding</h3>
                          <p className="text-xs text-neutral-500">Configure public naming, graphical vector logo, and high-density shortcut favicons.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Website Display Name</label>
                            <input
                              type="text"
                              value={settings.websiteName}
                              onChange={(e) => handleSettingChange('websiteName', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
                              placeholder="e.g. STUDIO KAIJU"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Website Logo</label>
                              <MediaPicker
                                value={settings.logoUrl}
                                onChange={(url) => handleSettingChange('logoUrl', url)}
                                mediaLibrary={tempData.mediaLibrary || []}
                                type="image"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Website Favicon</label>
                              <MediaPicker
                                value={settings.faviconUrl}
                                onChange={(url) => handleSettingChange('faviconUrl', url)}
                                mediaLibrary={tempData.mediaLibrary || []}
                                type="image"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Panel Branding */}
                      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                        <div>
                          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Admin Panel Branding</h3>
                          <p className="text-xs text-neutral-500">Completely rebrand and customize the control cockpit with a custom logo, title and favicon.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Admin Panel Name</label>
                            <input
                              type="text"
                              value={settings.adminPanelName || 'Kaiju Administrative Console'}
                              onChange={(e) => handleSettingChange('adminPanelName', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
                              placeholder="e.g. Kaiju Administrative Console"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Admin Logo</label>
                              <MediaPicker
                                value={settings.adminLogoUrl || ''}
                                onChange={(url) => handleSettingChange('adminLogoUrl', url)}
                                mediaLibrary={tempData.mediaLibrary || []}
                                type="image"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Admin Favicon</label>
                              <MediaPicker
                                value={settings.adminFaviconUrl || ''}
                                onChange={(url) => handleSettingChange('adminFaviconUrl', url)}
                                mediaLibrary={tempData.mediaLibrary || []}
                                type="image"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Theme Customization Design System */}
                    <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                      <div>
                        <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Global Design Palette & CSS Variables</h3>
                        <p className="text-xs text-neutral-500">Fine-tune the theme colors used across the public website directly. Color inputs immediately compile into CSS custom variables.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                          { key: 'primaryColor', label: 'Primary Colour', def: '#f97316' },
                          { key: 'secondaryColor', label: 'Secondary Colour', def: '#1c1917' },
                          { key: 'accentColor', label: 'Accent Colour', def: '#f97316' },
                          { key: 'backgroundColor', label: 'Background Colour', def: '#0c0a09' },
                          { key: 'surfaceColor', label: 'Surface Colour', def: '#1c1917' },
                          { key: 'textColor', label: 'Text Colour', def: '#ffffff' },
                          { key: 'borderColor', label: 'Border Colour', def: '#292524' },
                          { key: 'hoverColor', label: 'Hover Accent Colour', def: '#ea580c' },
                          { key: 'buttonColor', label: 'Button Fill Colour', def: '#f97316' }
                        ].map((colorItem) => (
                          <div key={colorItem.key} className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{colorItem.label}</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={(settings as any)[colorItem.key] || colorItem.def}
                                onChange={(e) => handleSettingChange(colorItem.key as any, e.target.value)}
                                className="w-9 h-9 rounded-lg border border-neutral-800 bg-neutral-950 cursor-pointer p-1"
                              />
                              <input
                                type="text"
                                value={(settings as any)[colorItem.key] || colorItem.def}
                                onChange={(e) => handleSettingChange(colorItem.key as any, e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-mono flex-1 uppercase"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Builder Customizer */}
                    <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                      <div>
                        <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Footer Builder & Visual Content</h3>
                        <p className="text-xs text-neutral-500">Completely customize and configure the global bottom website footer content.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Footer Branding Title</label>
                            <input
                              type="text"
                              value={settings.footerTitle || 'STUDIO KAIJU'}
                              onChange={(e) => handleSettingChange('footerTitle', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
                              placeholder="e.g. STUDIO KAIJU"
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Footer About Description</label>
                            <textarea
                              rows={3}
                              value={settings.footerDescription || ''}
                              onChange={(e) => handleSettingChange('footerDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Write supporting footer summary text..."
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Copyright Footnote Text</label>
                            <input
                              type="text"
                              value={settings.copyrightText || '© 2026 Studio Kaiju. All rights reserved.'}
                              onChange={(e) => handleSettingChange('copyrightText', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                              placeholder="© 2026 Studio Kaiju. All rights reserved."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Newsletter Invitation Copy</label>
                            <textarea
                              rows={2}
                              value={settings.footerNewsletterText || ''}
                              onChange={(e) => handleSettingChange('footerNewsletterText', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Stay connected. Subscribe to receive our high-fidelity sequential arts..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-neutral-900">
                        <div className="space-y-2">
                          <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Footer Logo Asset</label>
                          <MediaPicker
                            value={settings.footerLogoUrl || ''}
                            onChange={(url) => handleSettingChange('footerLogoUrl', url)}
                            mediaLibrary={tempData.mediaLibrary || []}
                            type="image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SubTab 2: Social Media Manager */}
                {settingsSubTab === 'socials' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8">
                      <div className="mb-6">
                        <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Centralized Social Media Channels</h3>
                        <p className="text-xs text-neutral-500">Configure links, display tags, and activation statuses for 15 platforms. Enabled channels instantly render across the website footer and contact channels.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(settings.socialPlatforms || []).map((platform) => (
                          <div
                            key={platform.id}
                            className={`p-5 rounded-2xl border transition-all ${
                              platform.enabled
                                ? 'bg-neutral-900/60 border-orange-500/20'
                                : 'bg-[#0a0a0d] border-neutral-900/70 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800/40">
                              <div className="flex items-center space-x-2.5">
                                <span className="font-sans text-xs font-bold text-white uppercase tracking-wide">{platform.name}</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={platform.enabled}
                                  onChange={(e) => handleSocialPlatformChange(platform.id, 'enabled', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500 peer-checked:after:bg-black peer-checked:after:border-black" />
                              </label>
                            </div>

                            <div className="space-y-3">
                              <div className="flex flex-col space-y-1">
                                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Channel Full Link (URL)</span>
                                <input
                                  type="text"
                                  disabled={!platform.enabled}
                                  value={platform.url}
                                  onChange={(e) => handleSocialPlatformChange(platform.id, 'url', e.target.value)}
                                  className="bg-neutral-950 border border-neutral-850 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans disabled:opacity-40"
                                  placeholder={`https://${platform.id}.com/...`}
                                />
                              </div>

                              <div className="flex flex-col space-y-1">
                                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Custom Display Name (Optional)</span>
                                <input
                                  type="text"
                                  disabled={!platform.enabled}
                                  value={platform.displayName || ''}
                                  onChange={(e) => handleSocialPlatformChange(platform.id, 'displayName', e.target.value)}
                                  className="bg-neutral-950 border border-neutral-850 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans disabled:opacity-40"
                                  placeholder={platform.displayName ? `@username` : 'Visual text display label'}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SubTab 3: SEO & Search Engine */}
                {settingsSubTab === 'seo' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      
                      {/* Global Metadata Tags */}
                      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                        <div>
                          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Global Metadata Overrides</h3>
                          <p className="text-xs text-neutral-500">Provide default browser headers, canonical domains, and default keyword strings indexing catalog items.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SEO Global Meta Title</label>
                            <input
                              type="text"
                              value={settings.seoTitle || ''}
                              onChange={(e) => handleSettingChange('seoTitle', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
                              placeholder="e.g. STUDIO KAIJU | Premium Comic Art & Manga Agency"
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Global Meta Description</label>
                            <textarea
                              rows={3}
                              value={settings.seoDescription || ''}
                              onChange={(e) => handleSettingChange('seoDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Specialized production agency crafting high-fidelity sequential art..."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Global Keywords</label>
                              <input
                                type="text"
                                value={settings.seoKeywords || ''}
                                onChange={(e) => handleSettingChange('seoKeywords', e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                placeholder="comic art, storyboards"
                              />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Global Canonical URL</label>
                              <input
                                type="text"
                                value={settings.seoCanonicalUrl || ''}
                                onChange={(e) => handleSettingChange('seoCanonicalUrl', e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                placeholder="https://kaijustudios.com"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Social Graph Sharing Tags (Open Graph & Twitter) */}
                      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                        <div>
                          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Open Graph & Twitter Sharing Tags</h3>
                          <p className="text-xs text-neutral-500">Formulate precise card titles and summary text displayed on Twitter, Slack, and Discord links.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Open Graph Share Title</label>
                              <input
                                type="text"
                                value={settings.seoOgTitle || ''}
                                onChange={(e) => handleSettingChange('seoOgTitle', e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                placeholder="Studio Kaiju sequential arts preview"
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Twitter Card Title</label>
                              <input
                                type="text"
                                value={settings.seoTwitterTitle || ''}
                                onChange={(e) => handleSettingChange('seoTwitterTitle', e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                placeholder="Twitter preview card title..."
                              />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Open Graph Description</label>
                            <textarea
                              rows={2}
                              value={settings.seoOgDescription || ''}
                              onChange={(e) => handleSettingChange('seoOgDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Enter social share description..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Twitter Card Description</label>
                            <textarea
                              rows={2}
                              value={settings.seoTwitterDescription || ''}
                              onChange={(e) => handleSettingChange('seoTwitterDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Enter Twitter preview description..."
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Meta Images assets */}
                    <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                      <div>
                        <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Social Share Card Images</h3>
                        <p className="text-xs text-neutral-500">Provide fallback preview dimensions for graphical posts shared on interactive messaging boards.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Default Share Card Image</label>
                          <MediaPicker
                            value={settings.seoShareImageUrl || ''}
                            onChange={(url) => handleSettingChange('seoShareImageUrl', url)}
                            mediaLibrary={tempData.mediaLibrary || []}
                            type="image"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Open Graph Image (og:image)</label>
                          <MediaPicker
                            value={settings.seoOgImageUrl || ''}
                            onChange={(url) => handleSettingChange('seoOgImageUrl', url)}
                            mediaLibrary={tempData.mediaLibrary || []}
                            type="image"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Twitter Card Large Image</label>
                          <MediaPicker
                            value={settings.seoTwitterImageUrl || ''}
                            onChange={(url) => handleSettingChange('seoTwitterImageUrl', url)}
                            mediaLibrary={tempData.mediaLibrary || []}
                            type="image"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Search Engine Files & Indexing */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      <div className="lg:col-span-1 bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">Indexing & Robot Directives</h3>
                            <p className="text-xs text-neutral-500">Configure global search bot crawling preferences to either indexing standard catalogs or disabling robots.</p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-900">
                              <div className="flex flex-col">
                                <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">Index Pages (index)</span>
                                <span className="text-[10px] text-neutral-500 mt-0.5">Let search engines list this site</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.seoIndex !== false}
                                  onChange={(e) => handleSettingChange('seoIndex', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500 peer-checked:after:bg-black peer-checked:after:border-black" />
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-900">
                              <div className="flex flex-col">
                                <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">Follow Links (follow)</span>
                                <span className="text-[10px] text-neutral-500 mt-0.5">Let crawlers track outbound links</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.seoFollow !== false}
                                  onChange={(e) => handleSettingChange('seoFollow', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500 peer-checked:after:bg-black peer-checked:after:border-black" />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-neutral-900">
                          <div className="flex flex-col space-y-1">
                            <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Schema.org Default JSON-LD</span>
                            <textarea
                              rows={5}
                              value={settings.seoDefaultSchema || ''}
                              onChange={(e) => handleSettingChange('seoDefaultSchema', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 p-3 text-[10px] text-orange-400 font-mono rounded-xl focus:outline-none focus:border-orange-500/50 resize-none leading-normal"
                              placeholder='{ "@context": "https://schema.org" }'
                            />
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                        <div>
                          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1.5">robots.txt & sitemap.xml Overrides</h3>
                          <p className="text-xs text-neutral-500">Directly override the search crawler routing rules and sitemap contents served on standard /robots.txt and /sitemap.xml routes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">/robots.txt plain-text override</label>
                            <textarea
                              rows={10}
                              value={settings.seoRobotsTxt || ''}
                              onChange={(e) => handleSettingChange('seoRobotsTxt', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 p-4 text-[11px] text-emerald-400 font-mono rounded-xl focus:outline-none focus:border-orange-500/50 resize-y leading-relaxed"
                              placeholder="User-agent: *..."
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">/sitemap.xml XML code override</label>
                            <textarea
                              rows={10}
                              value={settings.seoXmlSitemap || ''}
                              onChange={(e) => handleSettingChange('seoXmlSitemap', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 p-4 text-[11px] text-sky-400 font-mono rounded-xl focus:outline-none focus:border-orange-500/50 resize-y leading-relaxed"
                              placeholder="<?xml version='1.0' encoding='UTF-8'?>..."
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Page-level SEO Overrides */}
                    <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
                        <div>
                          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">Page-Level SEO Custom Overrides</h3>
                          <p className="text-xs text-neutral-500 font-sans">Inherits general metadata values, with the ability to define unique meta keywords and description overrides per landing route.</p>
                        </div>
                        <select
                          value={selectedSeoPage}
                          onChange={(e) => setSelectedSeoPage(e.target.value as any)}
                          className="bg-neutral-950 border border-neutral-850 px-4 py-2.5 text-xs text-white font-mono rounded-xl focus:outline-none cursor-pointer hover:border-neutral-700 transition-all uppercase"
                        >
                          <option value="home">Homepage (/)</option>
                          <option value="portfolio">Portfolio Catalog (/portfolio)</option>
                          <option value="studio">Studio/About Page (/studio)</option>
                          <option value="blog">Blog Chronicles (/blog)</option>
                          <option value="contact">Contact Coordinates (/contact)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Meta Title Override ({selectedSeoPage})</label>
                            <input
                              type="text"
                              value={selectedPageOverride.metaTitle || ''}
                              onChange={(e) => handlePageSeoChange(selectedSeoPage, 'metaTitle', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                              placeholder="Leave blank to inherit global meta defaults..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Meta Description Override</label>
                            <textarea
                              rows={3}
                              value={selectedPageOverride.metaDescription || ''}
                              onChange={(e) => handlePageSeoChange(selectedSeoPage, 'metaDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Leave blank to inherit global meta defaults..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Keywords Override</label>
                            <input
                              type="text"
                              value={selectedPageOverride.keywords || ''}
                              onChange={(e) => handlePageSeoChange(selectedSeoPage, 'keywords', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                              placeholder="Inherits global keywords if empty..."
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Open Graph Title Override</label>
                              <input
                                type="text"
                                value={selectedPageOverride.ogTitle || ''}
                                onChange={(e) => handlePageSeoChange(selectedSeoPage, 'ogTitle', e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                placeholder="Social title override..."
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Twitter Card Title Override</label>
                              <input
                                type="text"
                                value={selectedPageOverride.twitterTitle || ''}
                                onChange={(e) => handlePageSeoChange(selectedSeoPage, 'twitterTitle', e.target.value)}
                                className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                                placeholder="Twitter title override..."
                              />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Open Graph Description Override</label>
                            <textarea
                              rows={2}
                              value={selectedPageOverride.ogDescription || ''}
                              onChange={(e) => handlePageSeoChange(selectedSeoPage, 'ogDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Social description override..."
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Twitter Description Override</label>
                            <textarea
                              rows={2}
                              value={selectedPageOverride.twitterDescription || ''}
                              onChange={(e) => handlePageSeoChange(selectedSeoPage, 'twitterDescription', e.target.value)}
                              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
                              placeholder="Twitter description override..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-900 mt-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Canonical URL Override</label>
                          <input
                            type="text"
                            value={selectedPageOverride.canonicalUrl || ''}
                            onChange={(e) => handlePageSeoChange(selectedSeoPage, 'canonicalUrl', e.target.value)}
                            className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
                            placeholder="https://kaijustudios.com/..."
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Structured Schema JSON-LD Override</label>
                          <textarea
                            rows={3}
                            value={selectedPageOverride.structuredData || ''}
                            onChange={(e) => handlePageSeoChange(selectedSeoPage, 'structuredData', e.target.value)}
                            className="bg-neutral-950 border border-neutral-850 p-3 text-[10px] text-amber-400 font-mono rounded-xl focus:outline-none focus:border-orange-500/50 resize-none leading-normal"
                            placeholder='{ "@context": "https://schema.org", "@type": "WebPage" }'
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })()}

        </main>

      </div>

    </div>
  );
}
