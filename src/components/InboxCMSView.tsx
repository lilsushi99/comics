import React from 'react';
import { Inbox, Paperclip, Trash2, Send, FileText, Loader2 } from 'lucide-react';
import { CMSData } from '../types';

interface InboxCMSViewProps {
  tempData: CMSData;
  setTempData: React.Dispatch<React.SetStateAction<CMSData>>;
  logAction: (action: string) => void;
  inboxSearch: string;
  setInboxSearch: (val: string) => void;
  inboxStatusFilter: 'all' | 'new' | 'open' | 'replied' | 'closed';
  setInboxStatusFilter: (val: any) => void;
  selectedSubmissionId: string | null;
  setSelectedSubmissionId: (val: string | null) => void;
  replyMessage: string;
  setReplyMessage: (val: string) => void;
  replyingSubmissionId: string | null;
  setReplyingSubmissionId: (val: string | null) => void;
}

export default function InboxCMSView({
  tempData,
  setTempData,
  logAction,
  inboxSearch,
  setInboxSearch,
  inboxStatusFilter,
  setInboxStatusFilter,
  selectedSubmissionId,
  setSelectedSubmissionId,
  replyMessage,
  setReplyMessage,
  replyingSubmissionId,
  setReplyingSubmissionId
}: InboxCMSViewProps) {
  const list = tempData.submissions || [];

  // Apply searches and status filters
  const filteredSubmissions = list.filter(sub => {
    const query = inboxSearch.toLowerCase();
    const matchesQuery = !query || 
      (sub.name || '').toLowerCase().includes(query) ||
      (sub.email || '').toLowerCase().includes(query) ||
      (sub.message || '').toLowerCase().includes(query);
    const matchesStatus = inboxStatusFilter === 'all' || sub.status === inboxStatusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-6 text-left">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">INCOMING COORDINATES INBOX</h2>
          <p className="text-sm text-neutral-400">Review project dockets, review attachments, update process milestones, and reply directly via secure mail pipelines.</p>
        </div>
      </div>

      {/* Filters Action Header Bar */}
      <div className="bg-[#0e0e12] border border-neutral-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search submissions by submitter name, email, pitch outline..."
            value={inboxSearch}
            onChange={(e) => setInboxSearch(e.target.value)}
            className="bg-neutral-950 border border-neutral-850 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans w-full"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0 self-start md:self-center">
          {([
            { id: 'all', label: 'All Inquiries' },
            { id: 'new', label: 'New/Unread' },
            { id: 'open', label: 'Open Discussions' },
            { id: 'replied', label: 'Replied' },
            { id: 'closed', label: 'Archived/Closed' }
          ] as const).map((btn) => (
            <button
              key={btn.id}
              onClick={() => setInboxStatusFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                inboxStatusFilter === btn.id
                  ? 'bg-orange-500 border-orange-600 text-white font-bold'
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Submissions Grid list */}
        <div className="lg:col-span-5 space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-[#0e0e12]/40 border border-neutral-800 p-12 text-center rounded-2xl">
              <Inbox size={24} className="text-neutral-600 mx-auto mb-3" />
              <h4 className="font-sans text-xs font-bold text-neutral-400 uppercase">Inbox coordinates clear</h4>
              <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">No inquiry dockets found matching current parameters.</p>
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const isSelected = selectedSubmissionId === sub.id;
              
              const statusColors = {
                new: 'bg-orange-500/10 text-orange-400 border-orange-500/20 font-bold',
                open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                closed: 'bg-neutral-850 text-neutral-500 border-neutral-800'
              };

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubmissionId(sub.id);
                    if (sub.status === 'new') {
                      const listCopy = [...tempData.submissions!];
                      const index = listCopy.findIndex(s => s.id === sub.id);
                      if (index !== -1) {
                        listCopy[index].status = 'open';
                        setTempData(prev => ({ ...prev, submissions: listCopy }));
                        fetch(`/api/contact/submissions/${sub.id}/status`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'open' })
                        }).catch(e => console.error(e));
                      }
                    }
                  }}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-500/[0.02] border-orange-500 shadow-lg'
                      : 'bg-[#0e0e12]/60 border-neutral-850 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2.5">
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white uppercase tracking-tight truncate max-w-[200px]">{sub.name}</h4>
                      <span className="block font-mono text-[8px] text-neutral-500 lowercase mt-0.5">{sub.email}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider border shrink-0 ${statusColors[sub.status] || ''}`}>
                      {sub.status}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {sub.message || 'No written narrative summary pitch attached.'}
                  </p>

                  <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 border-t border-white/5 pt-3">
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    {sub.uploadedFiles && sub.uploadedFiles.length > 0 && (
                      <span className="text-orange-400 flex items-center space-x-1 font-bold">
                        <Paperclip size={9} />
                        <span>{sub.uploadedFiles.length} file(s)</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Pitch inspection sheet */}
        <div className="lg:col-span-7 bg-[#0e0e12] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6 min-h-[500px] flex flex-col justify-between">
          {(() => {
            const sub = list.find(s => s.id === selectedSubmissionId);
            if (!sub) {
              return (
                <div className="flex flex-col items-center justify-center text-center py-24 flex-1">
                  <FileText size={32} className="text-neutral-700 mb-3" />
                  <h4 className="font-sans text-xs font-bold text-neutral-400 uppercase font-bold">Docket Inspector Mode</h4>
                  <p className="text-[10px] text-neutral-500 mt-1 max-w-xs leading-relaxed font-sans">Select an incoming pitch submission card from the left panel to examine field parameters, download secure references, or deploy direct SMTP replies.</p>
                </div>
              );
            }

            return (
              <div className="space-y-6 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-6">
                  {/* Submitter details header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-4">
                    <div>
                      <span className="font-mono text-[8px] text-orange-400 uppercase tracking-widest font-bold">PITCH INSPECTION GRAPH</span>
                      <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-white mt-1">{sub.name}</h3>
                      <p className="font-mono text-[10px] text-neutral-500 mt-0.5">{sub.email} • {sub.phone || 'No phone'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Status direct selector */}
                      <select
                        value={sub.status}
                        onChange={(e: any) => {
                          const nextStatus = e.target.value;
                          const listCopy = [...tempData.submissions!];
                          const index = listCopy.findIndex(s => s.id === sub.id);
                          if (index !== -1) {
                            listCopy[index].status = nextStatus;
                            setTempData(prev => ({ ...prev, submissions: listCopy }));
                            fetch(`/api/contact/submissions/${sub.id}/status`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: nextStatus })
                            }).catch(err => console.error(err));
                            logAction(`Marked submission status as "${nextStatus}".`);
                          }
                        }}
                        className="bg-neutral-950 border border-neutral-800 text-[10px] text-white px-2.5 py-1.5 rounded-lg cursor-pointer font-mono focus:outline-none"
                      >
                        <option value="new">Mark as Unread</option>
                        <option value="open">Mark as Open</option>
                        <option value="replied">Mark as Replied</option>
                        <option value="closed">Archive / Close</option>
                      </select>

                      {/* Delete / purge archive */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm('CRITICAL ACTION: Are you absolutely sure you want to delete this submission permanently from MySQL files? This action is irreversible.')) {
                            try {
                              const res = await fetch(`/api/contact/submissions/${sub.id}`, { method: 'DELETE' });
                              if (res.ok) {
                                const listCopy = tempData.submissions!.filter(s => s.id !== sub.id);
                                setTempData(prev => ({ ...prev, submissions: listCopy }));
                                setSelectedSubmissionId(null);
                                logAction(`Submission coordinates completely purged from MySQL archive.`);
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="bg-red-500/15 hover:bg-red-500/25 text-red-400 p-2 rounded-lg transition-colors border border-red-500/20 cursor-pointer"
                        title="Delete Permanent"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Core pitch paragraph */}
                  <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-xl">
                    <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">NARRATIVE SCOPE STATEMENT</span>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed mt-2.5 whitespace-pre-line select-text">
                      {sub.message || 'No narrative pitch attached.'}
                    </p>
                  </div>

                  {/* Form fields raw key values */}
                  <div className="space-y-3.5">
                    <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-bold">CUSTOM SCHEMA RECORD VALUES ({Object.keys(sub.fieldsData || {}).length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {Object.entries(sub.fieldsData || {}).map(([key, val]) => {
                        const matchingField = tempData.inquiry?.fields?.find(f => f.id === key);
                        const label = matchingField ? matchingField.label : key;
                        const formattedValue = Array.isArray(val) ? val.join(', ') : String(val);

                        return (
                          <div key={key} className="bg-neutral-950/60 border border-neutral-850 px-4 py-3 rounded-xl">
                            <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-wider">{label}</span>
                            <span className="block text-xs font-semibold text-white mt-1 break-words select-text">{formattedValue || '—'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attachments List */}
                  {sub.uploadedFiles && sub.uploadedFiles.length > 0 && (
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <span className="font-mono text-[8px] text-orange-400 uppercase tracking-widest font-bold font-mono">ATTACHED REFERENCE VAULT</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sub.uploadedFiles.map((file: any, index: number) => (
                          <a
                            key={index}
                            href={file.url}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-850 rounded-xl hover:border-neutral-750 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <Paperclip size={12} className="text-orange-500 shrink-0" />
                              <span className="text-neutral-300 font-sans text-xs truncate font-medium group-hover:text-white transition-colors">{file.name}</span>
                            </div>
                            <span className="font-mono text-[8px] text-neutral-500 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Replies log history */}
                  {sub.replies && sub.replies.length > 0 && (
                    <div className="space-y-4 border-t border-white/5 pt-5">
                      <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-widest font-bold">OUTGOING SMTP CORRESPONDENCE THREAD ({sub.replies.length})</span>
                      <div className="space-y-3">
                        {sub.replies.map((rep: any) => (
                          <div key={rep.id} className="bg-emerald-500/[0.01] border border-emerald-500/10 p-4 rounded-xl space-y-2 text-left">
                            <div className="flex justify-between items-center font-mono text-[8px] text-neutral-500">
                              <span className="text-emerald-400 uppercase font-bold font-mono">SENT VIA DECK SMTP</span>
                              <span>{new Date(rep.sentAt).toLocaleString()}</span>
                            </div>
                            <p className="font-sans text-xs text-neutral-300 leading-relaxed select-text">
                              {rep.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct email composer container */}
                <div className="border-t border-white/5 pt-6 mt-6 space-y-3.5 bg-neutral-950/20 p-4 rounded-xl border border-white/5">
                  <span className="font-mono text-[9px] font-bold text-orange-400 uppercase tracking-widest block font-mono text-left">DISPATCH DIRECT REPLY MESSAGE VIA SMTP</span>
                  <div className="relative">
                    <textarea
                      value={replyMessage}
                      rows={3}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder={`Write secure correspondence to <${sub.email}>...`}
                      className="bg-neutral-950 border border-neutral-850 p-3 text-xs text-white focus:outline-none focus:border-orange-500/50 rounded-xl font-sans w-full resize-none pr-12 leading-relaxed"
                    />
                    <button
                      type="button"
                      disabled={!replyMessage.trim() || replyingSubmissionId === sub.id}
                      onClick={async () => {
                        setReplyingSubmissionId(sub.id);
                        try {
                          const res = await fetch(`/api/contact/reply/${sub.id}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: replyMessage.trim() })
                          });

                          if (res.ok) {
                            const result = await res.json();
                            if (result.success && result.replies) {
                              const listCopy = [...tempData.submissions!];
                              const index = listCopy.findIndex(s => s.id === sub.id);
                              if (index !== -1) {
                                listCopy[index].replies = result.replies;
                                listCopy[index].status = result.status;
                                setTempData(prev => ({ ...prev, submissions: listCopy }));
                              }
                              setReplyMessage('');
                              logAction(`Outgoing reply dispatched via secure SMTP connection to ${sub.email}`);
                              alert(`SUCCESS: Reply securely dispatched to client <${sub.email}> and status updated to Replied.`);
                            }
                          } else {
                            alert('Failed to transmit message through server.');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Failed to connect to backend SMTP proxy.');
                        } finally {
                          setReplyingSubmissionId(null);
                        }
                      }}
                      className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white p-2 rounded-lg shrink-0 transition-colors cursor-pointer"
                      title="Transmit Email"
                    >
                      {replyingSubmissionId === sub.id ? (
                        <Loader2 className="animate-spin h-4 w-4 text-white" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
