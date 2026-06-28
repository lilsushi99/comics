import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, X, Mail } from 'lucide-react';
import { CMSData } from '../types';

interface ContactCMSViewProps {
  tempData: CMSData;
  setTempData: React.Dispatch<React.SetStateAction<CMSData>>;
  logAction: (action: string) => void;
  newFieldName: string;
  setNewFieldName: (val: string) => void;
  newFieldType: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'budget' | 'file' | 'image';
  setNewFieldType: (val: any) => void;
}

export default function ContactCMSView({
  tempData,
  setTempData,
  logAction,
  newFieldName,
  setNewFieldName,
  newFieldType,
  setNewFieldType
}: ContactCMSViewProps) {
  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2 text-left">CONTACT & FORM BUILDER</h2>
        <p className="text-sm text-neutral-400 text-left">Manage office communications, physical addresses, opening days, socials, and structure custom inquiry forms.</p>
      </div>

      {/* SECTION A: Contact Page Header Details */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div>
          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2 text-left">A. PAGE MARKETING CONTENT</h3>
          <p className="text-xs text-neutral-400 text-left">Headings, badges, and introductory descriptive texts displayed on the public contact page.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">SECTION BADGE</label>
            <input
              type="text"
              value={tempData.inquiry?.badge || ''}
              onChange={(e) => {
                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), badge: e.target.value }
                }));
                logAction(`Updated page section badge.`);
              }}
              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">MAIN HEADING (H1)</label>
            <input
              type="text"
              value={tempData.inquiry?.title || ''}
              onChange={(e) => {
                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), title: e.target.value }
                }));
                logAction(`Updated page primary heading.`);
              }}
              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">DIRECTORY SUBTITLE</label>
            <input
              type="text"
              value={tempData.inquiry?.subtitle || ''}
              onChange={(e) => {
                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), subtitle: e.target.value }
                }));
                logAction(`Updated directory subtitle.`);
              }}
              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">FORM CARD HEADING</label>
            <input
              type="text"
              value={tempData.inquiry?.formTitle || ''}
              onChange={(e) => {
                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), formTitle: e.target.value }
                }));
                logAction(`Updated form card heading.`);
              }}
              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans font-bold"
            />
          </div>

          <div className="flex flex-col space-y-2 md:col-span-2">
            <label className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-wider">PAGE DESCRIPTIVE OUTLINE</label>
            <textarea
              value={tempData.inquiry?.description || ''}
              rows={3}
              onChange={(e) => {
                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), description: e.target.value }
                }));
                logAction(`Updated contact description.`);
              }}
              className="bg-neutral-950 border border-neutral-850 p-4 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans resize-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION B: Communications Directory */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div>
          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2 text-left">B. COMMUNICATIONS DIRECTORY</h3>
          <p className="text-xs text-neutral-400 text-left">Configure multiple phone coordinates, contact emails, and physical location coordinates.</p>
        </div>

        <div className="space-y-6 text-left">
          {/* Emails List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-wider">OFFICE EMAILS</span>
              <button
                type="button"
                onClick={() => {
                  const emails = [...(tempData.inquiry?.emails || [])];
                  emails.push({ id: `email-${Date.now()}`, label: 'NEW DECK INQUIRY', email: 'hello@studio.com' });
                  setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), emails } }));
                  logAction(`Added contact email container.`);
                }}
                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Plus size={10} />
                <span>Add Email Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(tempData.inquiry?.emails || []).map((e, idx) => (
                <div key={e.id} className="flex items-center space-x-3 bg-neutral-950/60 border border-neutral-850 p-3 rounded-xl">
                  <input
                    type="text"
                    placeholder="Email Label (e.g., PITCH OUTREACH)"
                    value={e.label}
                    onChange={(ev) => {
                      const list = [...(tempData.inquiry?.emails || [])];
                      list[idx].label = ev.target.value;
                      setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), emails: list } }));
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-mono flex-1"
                  />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={e.email}
                    onChange={(ev) => {
                      const list = [...(tempData.inquiry?.emails || [])];
                      list[idx].email = ev.target.value;
                      setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), emails: list } }));
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-sans flex-1"
                  />
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const list = [...(tempData.inquiry?.emails || [])];
                        const [moved] = list.splice(idx, 1);
                        list.splice(idx - 1, 0, moved);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), emails: list } }));
                      }}
                      className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (tempData.inquiry?.emails || []).length - 1}
                      onClick={() => {
                        const list = [...(tempData.inquiry?.emails || [])];
                        const [moved] = list.splice(idx, 1);
                        list.splice(idx + 1, 0, moved);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), emails: list } }));
                      }}
                      className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (tempData.inquiry?.emails || []).filter((_, i) => i !== idx);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), emails: list } }));
                        logAction(`Deleted contact email container.`);
                      }}
                      className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phones List */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-wider">OFFICE PHONES</span>
              <button
                type="button"
                onClick={() => {
                  const phones = [...(tempData.inquiry?.phones || [])];
                  phones.push({ id: `phone-${Date.now()}`, label: 'MAIN DESK', phone: '+44 20 7946 0192' });
                  setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), phones } }));
                  logAction(`Added contact phone line.`);
                }}
                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Plus size={10} />
                <span>Add Phone Line</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(tempData.inquiry?.phones || []).map((p, idx) => (
                <div key={p.id} className="flex items-center space-x-3 bg-neutral-950/60 border border-neutral-850 p-3 rounded-xl">
                  <input
                    type="text"
                    placeholder="Phone Label (e.g., STUDIO DIRECT)"
                    value={p.label}
                    onChange={(ev) => {
                      const list = [...(tempData.inquiry?.phones || [])];
                      list[idx].label = ev.target.value;
                      setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), phones: list } }));
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-mono flex-1"
                  />
                  <input
                    type="text"
                    placeholder="+44 20 7946 0192"
                    value={p.phone}
                    onChange={(ev) => {
                      const list = [...(tempData.inquiry?.phones || [])];
                      list[idx].phone = ev.target.value;
                      setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), phones: list } }));
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-sans flex-1"
                  />
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const list = [...(tempData.inquiry?.phones || [])];
                        const [moved] = list.splice(idx, 1);
                        list.splice(idx - 1, 0, moved);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), phones: list } }));
                      }}
                      className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (tempData.inquiry?.phones || []).length - 1}
                      onClick={() => {
                        const list = [...(tempData.inquiry?.phones || [])];
                        const [moved] = list.splice(idx, 1);
                        list.splice(idx + 1, 0, moved);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), phones: list } }));
                      }}
                      className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (tempData.inquiry?.phones || []).filter((_, i) => i !== idx);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), phones: list } }));
                        logAction(`Deleted contact phone line.`);
                      }}
                      className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HQ Physical Address */}
          <div className="flex flex-col space-y-2 border-t border-white/5 pt-6">
            <label className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-wider">HQ PHYSICAL ADDRESS</label>
            <input
              type="text"
              value={tempData.inquiry?.address || ''}
              onChange={(e) => {
                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), address: e.target.value }
                }));
                logAction(`Updated studio physical headquarters address.`);
              }}
              className="bg-neutral-950 border border-neutral-850 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans"
            />
          </div>

          {/* Business Opening Hours */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-wider">OFFICE OPENING HOURS</span>
              <button
                type="button"
                onClick={() => {
                  const hours = [...(tempData.inquiry?.hours || [])];
                  hours.push({ id: `hr-${Date.now()}`, days: 'Saturday', hours: '11:00 AM - 4:00 PM EST' });
                  setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours } }));
                  logAction(`Added custom office hour segment.`);
                }}
                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Plus size={10} />
                <span>Add Hour Segment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(tempData.inquiry?.hours || []).map((h, idx) => (
                <div key={h.id} className="flex items-center space-x-3 bg-neutral-950/60 border border-neutral-850 p-3 rounded-xl">
                  <input
                    type="text"
                    placeholder="Days Segment (e.g. Monday - Friday)"
                    value={h.days}
                    onChange={(ev) => {
                      const list = [...(tempData.inquiry?.hours || [])];
                      list[idx].days = ev.target.value;
                      setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours: list } }));
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-mono flex-1"
                  />
                  <input
                    type="text"
                    placeholder="10:00 AM - 7:00 PM EST"
                    value={h.hours}
                    disabled={h.closed}
                    onChange={(ev) => {
                      const list = [...(tempData.inquiry?.hours || [])];
                      list[idx].hours = ev.target.value;
                      setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours: list } }));
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-sans flex-1 disabled:opacity-40"
                  />
                  <label className="flex items-center space-x-2 shrink-0 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!h.closed}
                      onChange={(ev) => {
                        const list = [...(tempData.inquiry?.hours || [])];
                        list[idx].closed = ev.target.checked;
                        if (ev.target.checked) list[idx].hours = 'Closed';
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours: list } }));
                        logAction(`Toggled closed status for hours segment.`);
                      }}
                      className="rounded bg-neutral-900 border-neutral-800 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="font-mono text-[9px] text-neutral-400 uppercase font-bold">Closed</span>
                  </label>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const list = [...(tempData.inquiry?.hours || [])];
                        const [moved] = list.splice(idx, 1);
                        list.splice(idx - 1, 0, moved);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours: list } }));
                      }}
                      className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (tempData.inquiry?.hours || []).length - 1}
                      onClick={() => {
                        const list = [...(tempData.inquiry?.hours || [])];
                        const [moved] = list.splice(idx, 1);
                        list.splice(idx + 1, 0, moved);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours: list } }));
                      }}
                      className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (tempData.inquiry?.hours || []).filter((_, i) => i !== idx);
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), hours: list } }));
                        logAction(`Deleted hours segment.`);
                      }}
                      className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: Social Networks Manager */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div>
            <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">C. SOCIAL MEDIA NETWORK ROUTING</h3>
            <p className="text-xs text-neutral-400 font-sans">Choose which centralized social media platforms to display on your public pages. Brand links are managed centrally in Global Website Settings.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const socials = [...(tempData.footer?.socials || [])];
              const defaultPlatform = tempData.globalSettings?.socialPlatforms?.[0] || { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/kaiju' };
              socials.push({ id: defaultPlatform.id, name: defaultPlatform.name, icon: defaultPlatform.id, url: defaultPlatform.url, visible: true });
              setTempData(prev => ({ ...prev, footer: { ...(prev.footer || { aboutText: '', email: '', phone: '', address: '', copyright: '', socials: [] }), socials } }));
              logAction(`Added social platform routing reference.`);
            }}
            className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <Plus size={10} />
            <span>Add Social Platform</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left">
          {(tempData.footer?.socials || []).map((soc, idx) => {
            const matchedPlatform = (tempData.globalSettings?.socialPlatforms || []).find(p => p.id === soc.id);
            const currentUrl = matchedPlatform ? matchedPlatform.url : soc.url || '';

            return (
              <div key={soc.id || idx} className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 bg-neutral-950/60 border border-neutral-850 p-4 rounded-xl">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Social Platform</label>
                    <select
                      value={soc.id || 'instagram'}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const list = [...tempData.footer.socials];
                        const matched = (tempData.globalSettings?.socialPlatforms || []).find(p => p.id === selectedId);
                        list[idx].id = selectedId;
                        list[idx].name = matched ? matched.name : selectedId;
                        list[idx].icon = selectedId;
                        list[idx].url = matched ? matched.url : '';
                        setTempData(prev => ({ ...prev, footer: { ...(prev.footer || { aboutText: '', email: '', phone: '', address: '', copyright: '', socials: [] }), socials: list } }));
                        logAction(`Routed social channel to centralized platform: ${selectedId}`);
                      }}
                      className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg font-sans font-semibold cursor-pointer focus:outline-none focus:border-orange-500/40"
                    >
                      {(tempData.globalSettings?.socialPlatforms || []).map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Centralized Endpoint URL (Read Only)</label>
                    <input
                      type="text"
                      readOnly
                      value={currentUrl}
                      className="bg-neutral-900/40 border border-neutral-850/80 text-xs text-neutral-500 px-3 py-2 rounded-lg font-mono focus:outline-none select-all"
                      placeholder="No URL configured in Global Settings"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                  <label className="flex items-center space-x-1.5 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!soc.visible}
                      onChange={(e) => {
                        const list = [...tempData.footer.socials];
                        list[idx].visible = e.target.checked;
                        setTempData(prev => ({ ...prev, footer: { ...(prev.footer || { aboutText: '', email: '', phone: '', address: '', copyright: '', socials: [] }), socials: list } }));
                        logAction(`Toggled social platform visibility.`);
                      }}
                      className="rounded bg-neutral-900 border-neutral-800 text-orange-500 focus:ring-orange-500 animate-none cursor-pointer"
                    />
                    <span className="font-mono text-[9px] text-neutral-400 uppercase font-bold">Visible</span>
                  </label>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const list = [...tempData.footer.socials];
                      const [moved] = list.splice(idx, 1);
                      list.splice(idx - 1, 0, moved);
                      setTempData(prev => ({ ...prev, footer: { ...(prev.footer || { aboutText: '', email: '', phone: '', address: '', copyright: '', socials: [] }), socials: list } }));
                    }}
                    className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === tempData.footer.socials.length - 1}
                    onClick={() => {
                      const list = [...tempData.footer.socials];
                      const [moved] = list.splice(idx, 1);
                      list.splice(idx + 1, 0, moved);
                      setTempData(prev => ({ ...prev, footer: { ...(prev.footer || { aboutText: '', email: '', phone: '', address: '', copyright: '', socials: [] }), socials: list } }));
                    }}
                    className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const list = tempData.footer.socials.filter((_, i) => i !== idx);
                      setTempData(prev => ({ ...prev, footer: { ...(prev.footer || { aboutText: '', email: '', phone: '', address: '', copyright: '', socials: [] }), socials: list } }));
                      logAction(`Deleted social network link.`);
                    }}
                    className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* SECTION D: Dynamic Form Builder */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div>
          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2 text-left">D. INTUITIVE CONTACT FORM BUILDER</h3>
          <p className="text-xs text-neutral-400 text-left font-sans">Design dynamic fields on the pitch form. Support required constraints, widths, help texts, and 12 field categories.</p>
        </div>

        {/* Form Field Addition controls */}
        <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-xl space-y-4 text-left">
          <span className="font-mono text-[9px] font-bold text-orange-400 uppercase tracking-widest block">COMPILE NEW FIELD COMPONENT</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[8px] text-neutral-400 uppercase font-bold tracking-wider">FIELD DISPLAY LABEL</label>
              <input
                type="text"
                placeholder="e.g. Telephone Coordinates"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[8px] text-neutral-400 uppercase font-bold tracking-wider">INPUT CATEGORY</label>
              <select
                value={newFieldType}
                onChange={(e: any) => setNewFieldType(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 rounded-lg cursor-pointer font-sans"
              >
                <option value="text">Text Input (Single Line)</option>
                <option value="email">Email Address Input</option>
                <option value="phone">Phone / WhatsApp Input</option>
                <option value="textarea">Textarea (Multiline Box)</option>
                <option value="select">Dropdown Menu Select</option>
                <option value="checkbox">Checkbox Options List</option>
                <option value="radio">Radio Buttons List</option>
                <option value="date">Calendar Date Input</option>
                <option value="number">Numeric Input Range</option>
                <option value="budget">Project Budget Select</option>
                <option value="file">File Attachment Upload</option>
                <option value="image">Image Reference Upload</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!newFieldName.trim()) {
                  alert('Please enter a display label for the field.');
                  return;
                }
                const fieldsList = [...(tempData.inquiry?.fields || [])];
                const newId = `field-${Date.now()}`;
                const defaults: string[] = ['select', 'checkbox', 'radio', 'budget'].includes(newFieldType) ? ['Option A', 'Option B', 'Option C'] : [];
                
                fieldsList.push({
                  id: newId,
                  label: newFieldName.trim(),
                  type: newFieldType,
                  placeholder: `Enter ${newFieldName.toLowerCase()}...`,
                  required: false,
                  options: defaults.length > 0 ? defaults : undefined,
                  width: 'full',
                  helpText: '',
                  defaultValue: ''
                });

                setTempData(prev => ({
                  ...prev,
                  inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: fieldsList }
                }));
                setNewFieldName('');
                logAction(`Added dynamic form field "${newFieldName.trim()}".`);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-lg shrink-0 sm:self-end h-9.5 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Plus size={12} />
              <span>Assemble Component</span>
            </button>
          </div>
        </div>

        {/* Form Fields list editor */}
        <div className="space-y-4 text-left">
          <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">ACTIVE FORM SCHEMA GRAPH</span>
          <div className="space-y-3">
            {(tempData.inquiry?.fields || []).map((f, idx) => (
              <div key={f.id} className="bg-neutral-950 border border-neutral-850 p-5 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 p-2 rounded-lg font-mono text-[10px] uppercase tracking-wider">
                      {f.type.toUpperCase()}
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white font-sans">{f.label || 'No Label'}</span>
                      <span className="block text-[8px] font-mono text-neutral-500 lowercase">db_column_id: {f.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                    {/* Width Selector */}
                    <select
                      value={f.width || 'full'}
                      onChange={(e: any) => {
                        const list = [...(tempData.inquiry?.fields || [])];
                        list[idx].width = e.target.value;
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                      }}
                      className="bg-neutral-900 border border-neutral-800 text-[10px] text-white px-2 py-1 rounded cursor-pointer font-mono focus:outline-none"
                    >
                      <option value="full">Width: 100%</option>
                      <option value="half">Width: 50%</option>
                    </select>

                    {/* Required state */}
                    <label className="flex items-center space-x-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!f.required}
                        onChange={(e) => {
                          const list = [...(tempData.inquiry?.fields || [])];
                          list[idx].required = e.target.checked;
                          setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                        }}
                        className="rounded bg-neutral-900 border-neutral-800 text-orange-500 focus:ring-orange-500 scale-90 animate-none cursor-pointer"
                      />
                      <span className="font-mono text-[8px] text-neutral-400 font-bold uppercase">Required</span>
                    </label>

                    <div className="flex items-center space-x-0.5 border-l border-white/5 pl-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const list = [...(tempData.inquiry?.fields || [])];
                          const [moved] = list.splice(idx, 1);
                          list.splice(idx - 1, 0, moved);
                          setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                        }}
                        className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (tempData.inquiry?.fields || []).length - 1}
                        onClick={() => {
                          const list = [...(tempData.inquiry?.fields || [])];
                          const [moved] = list.splice(idx, 1);
                          list.splice(idx + 1, 0, moved);
                          setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                        }}
                        className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const list = (tempData.inquiry?.fields || []).filter((_, i) => i !== idx);
                          setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                          logAction(`Removed dynamic form field container.`);
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Options Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Field Name Label</label>
                    <input
                      type="text"
                      value={f.label}
                      onChange={(e) => {
                        const list = [...(tempData.inquiry?.fields || [])];
                        list[idx].label = e.target.value;
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                      }}
                      className="bg-neutral-900 border border-neutral-850 text-xs text-white px-3 py-1.5 rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Field Placeholder</label>
                    <input
                      type="text"
                      value={f.placeholder}
                      onChange={(e) => {
                        const list = [...(tempData.inquiry?.fields || [])];
                        list[idx].placeholder = e.target.value;
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                      }}
                      className="bg-neutral-900 border border-neutral-850 text-xs text-white px-3 py-1.5 rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Help Text / Instruction</label>
                    <input
                      type="text"
                      placeholder="Instructions shown inside labels..."
                      value={f.helpText || ''}
                      onChange={(e) => {
                        const list = [...(tempData.inquiry?.fields || [])];
                        list[idx].helpText = e.target.value;
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                      }}
                      className="bg-neutral-900 border border-neutral-850 text-xs text-white px-3 py-1.5 rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Default Field Value</label>
                    <input
                      type="text"
                      placeholder="Preset input data if empty..."
                      value={f.defaultValue || ''}
                      onChange={(e) => {
                        const list = [...(tempData.inquiry?.fields || [])];
                        list[idx].defaultValue = e.target.value;
                        setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                      }}
                      className="bg-neutral-900 border border-neutral-850 text-xs text-white px-3 py-1.5 rounded-lg"
                    />
                  </div>
                </div>

                {/* Option tags */}
                {['select', 'checkbox', 'radio', 'budget'].includes(f.type) && (
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] text-orange-400 font-bold uppercase tracking-wider">Configure Option Tags</span>
                      <button
                        type="button"
                        onClick={() => {
                          const list = [...(tempData.inquiry?.fields || [])];
                          const options = [...(list[idx].options || [])];
                          options.push(`Option ${options.length + 1}`);
                          list[idx].options = options;
                          setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                        }}
                        className="bg-neutral-900 hover:bg-neutral-850 text-orange-400 border border-neutral-800 px-2 py-1 rounded text-[8px] font-mono uppercase cursor-pointer text-center"
                      >
                        + Add Option Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(f.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center bg-neutral-900 border border-neutral-800 text-xs text-white px-2 py-1.5 rounded-lg">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const list = [...(tempData.inquiry?.fields || [])];
                              const options = [...(list[idx].options || [])];
                              options[optIdx] = e.target.value;
                              list[idx].options = options;
                              setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                            }}
                            className="bg-transparent text-white text-xs px-1 border-none focus:outline-none w-24"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(tempData.inquiry?.fields || [])];
                              const options = (list[idx].options || []).filter((_, i) => i !== optIdx);
                              list[idx].options = options;
                              setTempData(prev => ({ ...prev, inquiry: { ...(prev.inquiry || { designerImage: '', title: '', subtitle: '', fields: [] }), fields: list } }));
                            }}
                            className="p-0.5 hover:text-red-400 text-neutral-500 shrink-0 cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
