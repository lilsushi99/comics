import React, { useState } from 'react';
import { Upload, Check, Copy, AlertCircle, Film, Music } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  mediaLibrary?: MediaItem[];
  type?: 'image' | 'video' | 'audio';
  onRefreshMedia?: () => void;
}

export default function MediaPicker({ 
  value, 
  onChange, 
  mediaLibrary, 
  type = 'image', 
  onRefreshMedia 
}: MediaPickerProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const uploadAccept = type === 'video' ? 'video/*' : type === 'audio' ? 'audio/*' : 'image/*';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setProgress(5);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 85) {
          clearInterval(progressInterval);
          return p;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        const rawText = await response.text();
        throw new Error(rawText.substring(0, 150) || 'Upload server error (invalid response format).');
      }

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload file.');
      }
      if (result.success && result.url) {
        setProgress(100);
        setTimeout(() => {
          onChange(result.url);
          if (onRefreshMedia) onRefreshMedia();
          setUploading(false);
          setProgress(0);
        }, 200);
      } else {
        throw new Error(result.message || 'Upload returned unsuccessful state.');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setUploadError(err.message || 'Error uploading file.');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4">
      {/* PREVIEW MODE (When value is present) */}
      {value ? (
        <div className="space-y-3">
          <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center max-h-[220px] p-2">
            {type === 'image' && (
              <img
                src={value}
                alt="Selected Asset"
                className="max-h-[180px] w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            )}
            {type === 'video' && (
              <video
                src={value}
                controls
                className="max-h-[180px] w-full rounded-lg"
              />
            )}
            {type === 'audio' && (
              <div className="py-6 flex flex-col items-center space-y-2 w-full">
                <Music className="text-orange-400" size={28} />
                <audio src={value} controls className="w-full max-w-xs" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="bg-neutral-900/80 hover:bg-neutral-900 p-2 text-white rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                title="Copy Path URL"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                onChange('');
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer"
            >
              <span>REMOVE ASSET</span>
            </button>
          </div>
        </div>
      ) : (
        /* UPLOAD MODE (When value is empty) */
        <div className="space-y-4">
          {!uploading ? (
            <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-neutral-800 hover:border-orange-500 rounded-xl bg-neutral-950 cursor-pointer group transition-all">
              <div className="flex flex-col items-center justify-center pt-3 pb-4">
                <Upload size={22} className="text-neutral-500 group-hover:text-orange-400 mb-1.5 transition-colors" />
                <p className="font-sans text-[11px] text-neutral-400 group-hover:text-white transition-colors">
                  CHOOSE A FILE OR DRAG IT HERE
                </p>
                <p className="font-mono text-[7px] text-neutral-600 mt-1 uppercase">
                  {type === 'video' ? 'MP4, WEBM (MAX 50MB)' : type === 'audio' ? 'MP3, WAV (MAX 50MB)' : 'JPEG, PNG, WEBP, SVG (MAX 50MB)'}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept={uploadAccept}
              />
            </label>
          ) : (
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>UPLOADING TO CONTENT REPOSITORY...</span>
                <span className="text-orange-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-150" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          {uploadError && (
            <div className="text-red-500 flex items-center space-x-1.5 font-mono text-[9px] bg-red-950/20 p-2.5 rounded-lg border border-red-900/30">
              <AlertCircle size={12} />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
