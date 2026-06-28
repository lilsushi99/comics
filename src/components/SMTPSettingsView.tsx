import React, { useState, useEffect } from 'react';
import { Terminal, Loader2, Save, Upload, Eye, FileText } from 'lucide-react';
import { CMSData } from '../types';

interface SMTPSettingsViewProps {
  tempData: CMSData;
  setTempData: React.Dispatch<React.SetStateAction<CMSData>>;
  logAction: (action: string) => void;
  smtpTestLogs: string[];
  setSmtpTestLogs: React.Dispatch<React.SetStateAction<string[]>>;
  testingSmtp: boolean;
  setTestingSmtp: (val: boolean) => void;
}

export default function SMTPSettingsView({
  tempData,
  setTempData,
  logAction,
  smtpTestLogs,
  setSmtpTestLogs,
  testingSmtp,
  setTestingSmtp
}: SMTPSettingsViewProps) {
  // Local states to prevent autosave on typing
  const [localSmtp, setLocalSmtp] = useState<any>(() => JSON.parse(JSON.stringify(tempData.smtpSettings || {})));
  const [localAutoResponse, setLocalAutoResponse] = useState<any>(() => JSON.parse(JSON.stringify(tempData.autoResponseSettings || {})));
  const [localSignature, setLocalSignature] = useState<any>(() => JSON.parse(JSON.stringify(tempData.emailSignatureSettings || {})));
  const [uploadingLogo, setUploadingLogo] = useState<'auto' | 'sig' | null>(null);
  const [signaturePreviewTab, setSignaturePreviewTab] = useState<'html' | 'text'>('html');

  // Sync state if external changes happen
  useEffect(() => {
    if (tempData.smtpSettings) {
      setLocalSmtp(JSON.parse(JSON.stringify(tempData.smtpSettings)));
    }
    if (tempData.autoResponseSettings) {
      setLocalAutoResponse(JSON.parse(JSON.stringify(tempData.autoResponseSettings)));
    }
    if (tempData.emailSignatureSettings) {
      setLocalSignature(JSON.parse(JSON.stringify(tempData.emailSignatureSettings)));
    }
  }, [tempData.smtpSettings, tempData.autoResponseSettings, tempData.emailSignatureSettings]);

  // Determine if there are unsaved changes
  const hasUnsavedChanges = 
    JSON.stringify(localSmtp) !== JSON.stringify(tempData.smtpSettings) ||
    JSON.stringify(localAutoResponse) !== JSON.stringify(tempData.autoResponseSettings) ||
    JSON.stringify(localSignature) !== JSON.stringify(tempData.emailSignatureSettings);

  const handleSaveAll = () => {
    setTempData(prev => ({
      ...prev,
      smtpSettings: localSmtp,
      autoResponseSettings: localAutoResponse,
      emailSignatureSettings: localSignature
    }));
    logAction("Successfully saved and committed SMTP, Auto-Responder and Email Signature configurations.");
    alert("SUCCESS: SMTP server credentials, auto-responder configurations, and email signatures have been saved securely.");
  };

  const handleTestConnection = async () => {
    if (hasUnsavedChanges) {
      alert("WARNING: Please save your SMTP changes first using the 'Save SMTP Settings' button before running connection tests.");
      return;
    }

    setTestingSmtp(true);
    setSmtpTestLogs([
      `[${new Date().toLocaleTimeString()}] Querying MX / DNS records for: "${localSmtp.host || 'unknown'}"...`
    ]);

    try {
      const response = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSmtp)
      });

      const result = await response.json();
      if (result.logs) {
        setSmtpTestLogs(result.logs);
      } else {
        setSmtpTestLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Connection check finished.`
        ]);
      }

      if (result.success) {
        alert("SUCCESS: SMTP Server Connection & Authentication Successful! The server is fully operational.");
      } else {
        alert(`SMTP TEST FAILED: ${result.message || 'Verification rejected by mail server.'}`);
      }
    } catch (error: any) {
      console.error(error);
      setSmtpTestLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Error: Failed to communicate with server backend. ${error.message}`
      ]);
      alert("ERROR: Unable to communicate with the SMTP test verification proxy on the server.");
    } finally {
      setTestingSmtp(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'auto' | 'sig') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(target);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        const uploadedUrl = result.files?.[0]?.url || result.url;
        if (uploadedUrl) {
          if (target === 'auto') {
            setLocalAutoResponse(prev => ({ ...prev, companyLogoUrl: uploadedUrl }));
            logAction("Uploaded new Auto-Responder Company Logo.");
          } else {
            setLocalSignature(prev => ({ ...prev, companyLogoUrl: uploadedUrl }));
            logAction("Uploaded new Email Signature Company Logo.");
          }
        } else {
          alert("Failed to parse uploaded image URL.");
        }
      } else {
        alert("Server rejected logo image upload.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image logo.");
    } finally {
      setUploadingLogo(null);
    }
  };

  const generateSignatureHtmlPreview = (sig: any) => {
    if (!sig) return '';
    const logoHtml = sig.companyLogoUrl 
      ? `<img src="${sig.companyLogoUrl}" alt="${sig.companyName || ''}" style="max-height: 44px; width: auto; margin-right: 12px; border-radius: 4px; display: inline-block; vertical-align: top;" />` 
      : '';
    
    return `
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #d1d1d6; margin-top: 15px; border-top: 1px solid #262626; padding-top: 15px; width: 100%;">
        <tr>
          <td valign="top" style="padding-right: 12px; width: 56px;">
            ${logoHtml}
          </td>
          <td valign="top" style="line-height: 1.5; text-align: left;">
            <div style="font-weight: bold; font-size: 14px; color: #ffffff;">${sig.senderName || 'Staff Name'}</div>
            <div style="color: #a3a3a3; font-style: italic; margin-bottom: 2px; font-size: 12px;">${sig.jobTitle || 'Job Title'}</div>
            <div style="font-weight: bold; color: #f97316; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">${sig.companyName || 'Company Name'}</div>
            <div style="margin-top: 5px; color: #a3a3a3; font-size: 11px;">
              <span style="color: #f97316; text-decoration: none;">${sig.website || 'website.com'}</span>
              ${sig.phoneNumber ? ` | <span style="color: #737373;">${sig.phoneNumber}</span>` : ''}
              ${sig.senderEmail ? ` | <span style="color: #737373;">${sig.senderEmail}</span>` : ''}
            </div>
            ${sig.officeAddress ? `<div style="margin-top: 3px; color: #737373; font-size: 11px;">${sig.officeAddress}</div>` : ''}
            ${sig.socialLinks ? `<div style="margin-top: 3px; font-size: 10px; color: #f97316; font-family: monospace; opacity: 0.85;">${sig.socialLinks}</div>` : ''}
          </td>
        </tr>
      </table>
    `;
  };

  const generateSignatureTextPreview = (sig: any) => {
    if (!sig) return '';
    return `--\n${sig.senderName || 'Staff Name'}\n${sig.jobTitle || 'Job Title'}\n${sig.companyName || 'Company Name'}\nWebsite: ${sig.website || ''}\nPhone: ${sig.phoneNumber || ''}\nEmail: ${sig.senderEmail || ''}\nAddress: ${sig.officeAddress || ''}\nSocials: ${sig.socialLinks || ''}`;
  };

  return (
    <div id="smtp-settings-portal" className="p-10 space-y-10 max-w-7xl mx-auto">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-6 text-left">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">SMTP MAIL SERVER & AUTO-RESPONDER</h2>
          <p className="text-sm text-neutral-400">Configure outbound SMTP server credentials, design automatic validation templates, and build dynamic email signatures.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {hasUnsavedChanges && (
            <span className="font-sans text-[10px] text-amber-400 uppercase tracking-wider font-semibold bg-amber-500/10 px-3 py-1.5 border border-amber-500/20 rounded-xl animate-pulse">
              ⚠️ Unsaved SMTP Draft Changes
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-2 shrink-0 cursor-pointer transition-colors"
          >
            <Save size={13} />
            <span>Save SMTP Settings</span>
          </button>
        </div>
      </div>

      {/* SMTP Credentials Section */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div>
            <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1">A. SMTP MAIL PIPELINE GATEWAY</h3>
            <p className="text-xs text-neutral-400 font-sans">Outbound mail pipeline validated through secure SSL/TLS. Saves credentials first before running authentication tests.</p>
          </div>
          
          <div className="flex flex-col items-end space-y-1.5">
            <button
              type="button"
              disabled={testingSmtp || hasUnsavedChanges}
              onClick={handleTestConnection}
              className={`px-4 py-2 rounded-xl font-mono text-[10px] uppercase tracking-wider flex items-center space-x-2 shrink-0 cursor-pointer transition-all border ${
                hasUnsavedChanges 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-500 opacity-60 cursor-not-allowed' 
                  : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20'
              }`}
            >
              {testingSmtp ? (
                <>
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  <span>TESTING ROUTE...</span>
                </>
              ) : (
                <>
                  <Terminal size={12} />
                  <span>Test Mail Connection</span>
                </>
              )}
            </button>
            {hasUnsavedChanges && (
              <span className="text-[9px] font-mono text-amber-500/80">Save settings first to enable connection testing</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Mail Connection Driver</label>
            <input
              type="text"
              value={localSmtp.driver || 'smtp'}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, driver: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-mono focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">SMTP Mail Server Host</label>
            <input
              type="text"
              placeholder="e.g. smtp.gmail.com"
              value={localSmtp.host || ''}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, host: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">SMTP Secure Port</label>
            <input
              type="number"
              placeholder="465"
              value={localSmtp.port || 465}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, port: parseInt(e.target.value) || 0 }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-mono focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Secure Port Encryption</label>
            <select
              value={localSmtp.encryption || 'ssl'}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, encryption: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40 cursor-pointer"
            >
              <option value="ssl">SSL Secure Tunneling</option>
              <option value="tls">TLS/STARTTLS Handshake</option>
              <option value="none">None (Insecure, No Encryption)</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">SMTP Mail Authenticated Username</label>
            <input
              type="text"
              placeholder="contact@samcomics.com"
              value={localSmtp.username || ''}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, username: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">SMTP Secured Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={localSmtp.password || ''}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, password: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-mono focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Display From Name</label>
            <input
              type="text"
              placeholder="Sam Comics Studio"
              value={localSmtp.fromName || ''}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, fromName: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Sender From Email</label>
            <input
              type="email"
              placeholder="contact@samcomics.com"
              value={localSmtp.fromEmail || ''}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, fromEmail: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Reply-To Address</label>
            <input
              type="email"
              placeholder="contact@samcomics.com"
              value={localSmtp.replyToEmail || ''}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, replyToEmail: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
            />
          </div>
        </div>

        {/* SMTP Testing Terminal logs */}
        {smtpTestLogs.length > 0 && (
          <div className="border border-neutral-850 bg-neutral-950/60 p-5 rounded-xl font-mono text-[10px] space-y-1 text-left select-text">
            <span className="text-orange-400 uppercase font-bold tracking-widest block mb-2 font-mono text-[8px]">CONNECTION DIAGNOSTICS TERMINAL</span>
            {smtpTestLogs.map((log, lIdx) => (
              <p key={lIdx} className="text-neutral-400 font-mono">
                {log}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Auto Responder Template Editor */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-6">
        <div className="text-left">
          <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">B. AUTO-RESPONDER EMAIL CONFIGURATION</h3>
          <p className="text-xs text-neutral-400 font-sans">Configure automated client acknowledgement receipts sent instantly after submission. Supports dual-mode plain-text and rich HTML rendering.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Mode Switch Toggle */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Email Transmit Mode</label>
            <div className="flex space-x-3">
              {(['html', 'text'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setLocalAutoResponse(prev => ({ ...prev, mode: m }))}
                  className={`px-4 py-2 rounded-xl border text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    (localAutoResponse.mode || 'html') === m
                      ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                      : 'bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {m === 'html' ? '★ HTML Rich Text Email' : '✎ Plain Text Fallback Email'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Email Subject Line</label>
            <input
              type="text"
              placeholder="e.g., [Inquiry Received] Thanks for reaching out!"
              value={localAutoResponse.subject || ''}
              onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, subject: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">HTML Email Body (Rich Text Support)</label>
            <textarea
              placeholder="e.g., <p>Thank you for contacting us...</p>"
              value={localAutoResponse.htmlBody || ''}
              rows={8}
              onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, htmlBody: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 p-3 text-xs text-white focus:outline-none rounded-lg font-mono resize-none leading-relaxed focus:border-orange-500/40"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Plain Text Fallback (No-HTML Clients)</label>
            <textarea
              placeholder="Plain text description..."
              value={localAutoResponse.plainText || ''}
              rows={8}
              onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, plainText: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 p-3 text-xs text-white focus:outline-none rounded-lg font-sans resize-none leading-relaxed focus:border-orange-500/40"
            />
          </div>

          {/* Logo upload with custom input */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Company Logo Image</label>
            <div className="flex items-center space-x-3.5">
              <input
                type="text"
                placeholder="https://domain.com/logo.png"
                value={localAutoResponse.companyLogoUrl || ''}
                onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, companyLogoUrl: e.target.value }))}
                className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40 flex-1"
              />
              <label className="relative flex items-center justify-center p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shrink-0">
                {uploadingLogo === 'auto' ? (
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                ) : (
                  <Upload size={13} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, 'auto')}
                  className="hidden"
                  disabled={uploadingLogo !== null}
                />
              </label>
            </div>
            {localAutoResponse.companyLogoUrl && (
              <img
                src={localAutoResponse.companyLogoUrl}
                alt="Logo Preview"
                className="max-h-12 max-w-[120px] rounded border border-neutral-800 object-contain p-1 mt-2 bg-neutral-950"
              />
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Company Address</label>
            <input
              type="text"
              placeholder="e.g. 42 Shoreditch High St, London"
              value={localAutoResponse.companyAddress || ''}
              onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, companyAddress: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Company Contact Info Line</label>
            <input
              type="text"
              placeholder="e.g. contact@kaijustudios.com | +44 20 7946 0192"
              value={localAutoResponse.contactInfo || ''}
              onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, contactInfo: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Email Footer Text / Copyright</label>
            <input
              type="text"
              placeholder="e.g. © 2026 Studio Kaiju. All rights reserved."
              value={localAutoResponse.footerText || ''}
              onChange={(e) => setLocalAutoResponse(prev => ({ ...prev, footerText: e.target.value }))}
              className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Outgoing Email Signature Configuration */}
      <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          <div>
            <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight mb-2">C. PROFESSIONAL EMAIL SIGNATURE</h3>
            <p className="text-xs text-neutral-400 font-sans">Build interactive email signatures dynamically appended to automatic responder copies and direct admin responses.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Left Panel: Form Input Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Staff Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Keiji Sato"
                  value={localSignature.senderName || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, senderName: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Professional Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Creative Director / Studio Lead"
                  value={localSignature.jobTitle || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., Studio Kaiju"
                  value={localSignature.companyName || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, companyName: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Website URL</label>
                <input
                  type="text"
                  placeholder="e.g., https://kaijustudios.com"
                  value={localSignature.website || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, website: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Direct Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g., +44 20 7946 0192"
                  value={localSignature.phoneNumber || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g., contact@kaijustudios.com"
                  value={localSignature.senderEmail || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, senderEmail: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none focus:border-orange-500/40"
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Office Address</label>
                <input
                  type="text"
                  placeholder="e.g. 42 Shoreditch High St, London"
                  value={localSignature.officeAddress || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, officeAddress: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Social Platforms Display</label>
                <input
                  type="text"
                  placeholder="Twitter • Instagram • ArtStation"
                  value={localSignature.socialLinks || ''}
                  onChange={(e) => setLocalSignature(prev => ({ ...prev, socialLinks: e.target.value }))}
                  className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Company Logo Upload</label>
                <div className="flex items-center space-x-3.5">
                  <input
                    type="text"
                    placeholder="https://domain.com/logo.png"
                    value={localSignature.companyLogoUrl || ''}
                    onChange={(e) => setLocalSignature(prev => ({ ...prev, companyLogoUrl: e.target.value }))}
                    className="bg-neutral-950 border border-neutral-850 px-3 py-2.5 text-xs text-white rounded-lg font-sans focus:outline-none flex-1"
                  />
                  <label className="relative flex items-center justify-center p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shrink-0">
                    {uploadingLogo === 'sig' ? (
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                    ) : (
                      <Upload size={13} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'sig')}
                      className="hidden"
                      disabled={uploadingLogo !== null}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Interactive Preview */}
          <div className="lg:col-span-5 bg-neutral-950/40 border border-neutral-850 rounded-2xl p-6 flex flex-col justify-between h-full min-h-[350px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                <span className="font-mono text-[8px] text-orange-400 uppercase tracking-widest font-bold flex items-center space-x-1">
                  <Eye size={10} />
                  <span>Interactive Live Preview</span>
                </span>
                
                {/* Preview tab switcher */}
                <div className="flex space-x-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-850">
                  <button
                    type="button"
                    onClick={() => setSignaturePreviewTab('html')}
                    className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                      signaturePreviewTab === 'html'
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignaturePreviewTab('text')}
                    className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                      signaturePreviewTab === 'text'
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Plain Text
                  </button>
                </div>
              </div>

              {/* Live Preview Canvas Container */}
              <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-5 min-h-[160px] flex flex-col justify-center select-all">
                {signaturePreviewTab === 'html' ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: generateSignatureHtmlPreview(localSignature) }} 
                    className="w-full overflow-x-auto text-left"
                  />
                ) : (
                  <pre className="font-mono text-[10px] text-neutral-400 text-left whitespace-pre-wrap select-all bg-neutral-950/50 p-3 rounded border border-neutral-900 leading-normal">
                    {generateSignatureTextPreview(localSignature)}
                  </pre>
                )}
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 leading-relaxed text-center font-sans mt-4">
              This signature is automatically compiled and appended to every auto-responder copy and direct manual reply transmitted through the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
