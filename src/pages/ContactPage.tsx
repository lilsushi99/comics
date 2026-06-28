import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Heart, 
  Upload, 
  Paperclip, 
  Loader2, 
  X, 
  FileText, 
  CheckCircle,
  Facebook,
  Youtube,
  MessageSquare,
  Globe
} from 'lucide-react';
import { CMSData } from '../types';
import { motion } from 'motion/react';

interface ContactPageProps {
  data: CMSData;
}

export default function ContactPage({ data }: ContactPageProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; size: number }[]>([]);

  // Get dynamic settings or fallback to presets
  const inquiry = data.inquiry || ({} as any);
  const badgeText = inquiry.badge || '06 // ALIGNMENT CORRIDORS';
  const mainTitle = inquiry.title || 'START THE PIPELINE';
  const pageDescription = inquiry.description || 'Ready to bring your intellectual property into definitive physical lines? Fill out the pitch dockets below, or reach out directly to our production deck.';
  
  const emails = inquiry.emails || [
    { id: 'email-1', label: 'GENERAL INQUIRIES & PITCHES', email: data.footer?.email || 'contact@kaijustudios.com' }
  ];
  const phones = inquiry.phones || [
    { id: 'phone-1', label: 'STUDIO DIRECT LINE', phone: data.footer?.phone || '+44 20 7946 0192' }
  ];
  const hours = inquiry.hours || [
    { id: 'hr-1', days: 'Monday - Friday', hours: '10:00 AM - 7:00 PM EST' },
    { id: 'hr-2', days: 'Saturday', hours: '11:00 AM - 4:00 PM EST' },
    { id: 'hr-3', days: 'Sunday', hours: 'Creative Hiatus', closed: true }
  ];
  const officeAddress = inquiry.address || data.footer?.address || '42 Shoreditch High St, London, E1 6JJ, United Kingdom';
  const fields = inquiry.fields || [];

  const handleFormChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const currentValues = formValues[fieldId] || [];
    let updated: string[];
    if (checked) {
      updated = [...currentValues, option];
    } else {
      updated = currentValues.filter((v: string) => v !== option);
    }
    handleFormChange(fieldId, updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/contact/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.files) {
          setUploadedFiles(prev => [...prev, ...result.files]);
        } else {
          setUploadError(result.message || 'Failed to upload attachments.');
        }
      } else {
        setUploadError('Failed to upload file(s). (Max file size 50MB).');
      }
    } catch (err) {
      setUploadError('Network error during upload.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extract core fields to show in the Admin inbox lists
    let submitterName = '';
    let submitterEmail = '';
    let submitterPhone = '';
    let submitterMessage = '';

    // Search fields for name, email, phone, and textarea message
    fields.forEach(f => {
      const val = formValues[f.id];
      if (!val) return;
      if (f.type === 'email') submitterEmail = val;
      if (f.type === 'phone') submitterPhone = val;
      if (f.type === 'textarea') submitterMessage = val;
      if (f.id === 'field-1' || f.label.toLowerCase().includes('name')) submitterName = val;
    });

    const payload = {
      name: submitterName || 'Anonymous Submitter',
      email: submitterEmail || 'visitor@example.com',
      phone: submitterPhone || '',
      message: submitterMessage || 'Pitch specifications uploaded in form details.',
      fieldsData: formValues,
      uploadedFiles: uploadedFiles
    };

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if ((window as any).trackAnalyticsEvent) {
          (window as any).trackAnalyticsEvent({ type: 'lead', leadType: 'contact_form' });
        }
        setFormSubmitted(true);
        setFormValues({});
        setUploadedFiles([]);
      } else {
        alert('Server communication error. Could not register submission.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Unable to dispatch pitch coordinates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Maps custom icons from database string to React components
  const getSocialIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'instagram': return <Instagram size={16} />;
      case 'twitter':
      case 'x': return <Twitter size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'facebook': return <Facebook size={16} />;
      case 'youtube': return <Youtube size={16} />;
      case 'whatsapp': return <MessageSquare size={16} />;
      default: return <Globe size={16} />;
    }
  };

  return (
    <div id="contact-page" className="bg-transparent text-inherit min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="border-b border-neutral-900 pb-12 mb-16 text-center md:text-left">
          <span className="font-mono text-xs text-neutral-500 tracking-[0.2em] uppercase block mb-3">
            {badgeText}
          </span>
          <h1 className="stretched-text text-4xl sm:text-6xl font-black text-white uppercase tracking-tight scale-x-105 origin-left leading-none mb-6">
            {mainTitle}
          </h1>
          <p className="font-sans text-neutral-400 text-sm max-w-2xl leading-relaxed">
            {pageDescription}
          </p>
        </div>

        {/* Split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Specs */}
          <div className="lg:col-span-5 space-y-8 bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
            <div>
              <span className="font-mono text-xs text-orange-500 block mb-2">GET IN TOUCH</span>
              <h2 className="font-sans text-2xl font-bold uppercase tracking-tight text-white mb-3">
                THE PRODUCTION DECK
              </h2>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-6">
                {inquiry.subtitle || 'Looking to turn an epic vision into custom artwork, a serialized graphic novel, or high-fidelity character sheets? Pitch us your universe.'}
              </p>
              
              <div className="space-y-6">
                {/* Office Emails list */}
                {emails.map((e, index) => (
                  <div key={e.id || index} className="flex items-start space-x-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-3 rounded-xl shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest leading-none mb-1">
                        {e.label}
                      </span>
                      <a href={`mailto:${e.email}`} className="font-sans text-sm font-semibold text-white hover:text-orange-400 hover:underline transition-colors break-all">
                        {e.email}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Office Phones list */}
                {phones.map((p, index) => (
                  <div key={p.id || index} className="flex items-start space-x-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-3 rounded-xl shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest leading-none mb-1">
                        {p.label}
                      </span>
                      <a href={`tel:${p.phone}`} className="font-sans text-sm font-semibold text-white hover:text-orange-400 hover:underline transition-colors">
                        {p.phone}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Office Address */}
                {officeAddress && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-3 rounded-xl shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest leading-none mb-1">
                        HQ PHYSICAL ARCHIVE
                      </span>
                      <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                        {officeAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hours list */}
            {hours.length > 0 && (
              <div className="border-t border-white/5 pt-8">
                <span className="font-mono text-xs text-orange-500 block mb-3">STUDIO HOURS</span>
                <div className="font-sans text-xs text-neutral-400 space-y-1.5">
                  {hours.map((h, index) => (
                    <p key={h.id || index} className="flex justify-between">
                      <span>{h.days}</span> 
                      <span className={`font-semibold ${h.closed ? 'text-neutral-600' : 'text-white'}`}>
                        {h.hours}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Socials - Pulls dynamically from database */}
            {(() => {
              const socialsToRender = data.globalSettings?.socialPlatforms 
                ? data.globalSettings.socialPlatforms.filter(p => p.enabled)
                : data.footer?.socials?.filter(s => s.visible).map(s => ({ id: s.id, name: s.name, url: s.url, displayName: s.name })) ?? [];
              
              if (socialsToRender.length === 0) return null;

              return (
                <div className="border-t border-white/5 pt-8">
                  <span className="font-mono text-xs text-orange-500 block mb-4">CONNECT WITH US</span>
                  <div className="flex flex-wrap gap-3">
                    {socialsToRender.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        title={social.displayName || social.name}
                        className="bg-neutral-900/60 hover:bg-orange-500 hover:text-white border border-white/10 p-3 rounded-none text-neutral-400 transition-colors cursor-pointer"
                      >
                        {getSocialIcon(social.id)}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right: Custom dynamic Form Builder */}
          <div className="lg:col-span-7 bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-2xl shadow-2xl">
            <span className="font-mono text-xs text-orange-500 block mb-2">PITCH DOCKET FORM</span>
            <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-white mb-6">
              {inquiry.formTitle || 'PITCH YOUR UNIVERSE'}
            </h3>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-neutral-900/40 border border-orange-500/20 rounded-2xl text-center flex flex-col items-center justify-center space-y-4 py-16"
              >
                <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center rounded-full font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  ✓
                </div>
                <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-white">
                  Pitch Docket Registered Successfully
                </h3>
                <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                  Our Senior Narrative Producer has received your coordinate parameters. An email confirmation has been dispatched. Expect alignment coordinates inside your inbox within 24 working hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-mono text-xs uppercase cursor-pointer transition-colors"
                >
                  Submit Another Pitch
                </button>
              </motion.div>
            ) : (
              <form id="contact-page-form" onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => {
                  const isHalfWidth = field.width === 'half';
                  const containerClass = isHalfWidth ? "col-span-1" : "col-span-1 md:col-span-2";

                  return (
                    <div key={field.id} className={`${containerClass} flex flex-col space-y-1.5`}>
                      <label className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest flex items-center justify-between">
                        <span>
                          {field.label} {field.required && <span className="text-orange-500">*</span>}
                        </span>
                        {field.helpText && <span className="text-[8px] text-neutral-500 lowercase">({field.helpText})</span>}
                      </label>

                      {/* Text/Email/Phone/Date/Number Input Types */}
                      {(field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'date' || field.type === 'number') && (
                        <input
                          type={field.type === 'phone' ? 'tel' : field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          defaultValue={field.defaultValue}
                          value={formValues[field.id] !== undefined ? formValues[field.id] : ''}
                          onChange={(e) => handleFormChange(field.id, e.target.value)}
                          className="bg-black border border-white/10 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors w-full"
                        />
                      )}

                      {/* Dropdown Select Type */}
                      {(field.type === 'select' || field.type === 'budget') && (
                        <select
                          required={field.required}
                          value={formValues[field.id] !== undefined ? formValues[field.id] : ''}
                          onChange={(e) => handleFormChange(field.id, e.target.value)}
                          className="bg-black border border-white/10 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors w-full cursor-pointer"
                        >
                          <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                          {field.options?.map((opt: string, i: number) => (
                            <option key={i} value={opt} className="bg-neutral-950 text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Textarea Field */}
                      {field.type === 'textarea' && (
                        <textarea
                          required={field.required}
                          placeholder={field.placeholder}
                          defaultValue={field.defaultValue}
                          rows={5}
                          value={formValues[field.id] !== undefined ? formValues[field.id] : ''}
                          onChange={(e) => handleFormChange(field.id, e.target.value)}
                          className="bg-black border border-white/10 focus:border-orange-500/50 text-white font-sans text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors resize-none w-full"
                        />
                      )}

                      {/* Checkbox Set */}
                      {field.type === 'checkbox' && (
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                          {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                value={opt}
                                checked={(formValues[field.id] || []).includes(opt)}
                                onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                                className="w-4 h-4 rounded bg-neutral-900 border-neutral-800 text-orange-500 focus:ring-orange-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Radio buttons Set */}
                      {field.type === 'radio' && (
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                          {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer select-none">
                              <input
                                type="radio"
                                name={`radio-${field.id}`}
                                value={opt}
                                checked={formValues[field.id] === opt}
                                onChange={() => handleFormChange(field.id, opt)}
                                className="w-4 h-4 rounded-full bg-neutral-900 border-neutral-800 text-orange-500 focus:ring-orange-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* File / Image Upload Field */}
                      {(field.type === 'file' || field.type === 'image') && (
                        <div className="space-y-3">
                          <div className="relative border-2 border-dashed border-neutral-800 hover:border-orange-500/40 p-6 rounded-xl text-center cursor-pointer bg-neutral-950/20 hover:bg-neutral-950/40 transition-all flex flex-col items-center justify-center space-y-2">
                            <input
                              type="file"
                              multiple
                              accept={field.type === 'image' ? 'image/*' : '.pdf,.zip,.doc,.docx,image/*'}
                              onChange={handleFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {isUploading ? (
                              <Loader2 className="animate-spin text-orange-500 h-6 w-6" />
                            ) : (
                              <Upload className="text-neutral-500 h-6 w-6" />
                            )}
                            <div className="text-xs font-semibold text-neutral-300">
                              {isUploading ? 'Uploading files...' : 'Drag & drop or click to upload'}
                            </div>
                            <p className="text-[10px] text-neutral-500">
                              {field.type === 'image' ? 'Supported formats: JPG, PNG, GIF, WebP' : 'Supported formats: PDF, ZIP, DOCX, Images (Max 50MB)'}
                            </p>
                          </div>

                          {uploadError && (
                            <p className="text-[10px] font-mono font-bold text-red-500 uppercase">{uploadError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* File Attachment Pill List (Linked Globally) */}
                {uploadedFiles.length > 0 && (
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <span className="font-mono text-[8px] text-orange-500 uppercase tracking-widest font-bold">Attached Pitches / Files ({uploadedFiles.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-neutral-950/80 border border-neutral-900 rounded-lg text-xs">
                          <div className="flex items-center space-x-2 truncate">
                            <Paperclip size={12} className="text-orange-500" />
                            <span className="text-neutral-300 font-sans font-medium truncate" title={f.name}>{f.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(i)}
                            className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form submit button */}
                <div className="col-span-1 md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 hover:tracking-[0.12em] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        <span>ALIGNING PARAMETERS...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>TRANSMIT PROJECT INQUIRY</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
