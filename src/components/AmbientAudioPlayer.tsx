import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface AmbientAudioPlayerProps {
  audioUrl: string;
  enabledGlobally: boolean;
}

export default function AmbientAudioPlayer({ audioUrl, enabledGlobally }: AmbientAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Playable volume on first click
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync state with audio element src
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      // Do NOT autoplay under any circumstances when URL changes
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioUrl]);

  // Adjust volume / mute on changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // If globally disabled, force stop
  useEffect(() => {
    if (!enabledGlobally && isPlaying) {
      handlePause();
    }
  }, [enabledGlobally]);

  const handlePlay = () => {
    if (!enabledGlobally || !audioUrl) return;
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('Playback block or fail:', err);
          setIsPlaying(false);
        });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVol === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  if (!enabledGlobally || !audioUrl) return null;

  return (
    <div
      id="comic-showcase-audio-player"
      className="bg-neutral-950/95 border border-white/10 rounded-none p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md w-full shadow-2xl transition-all duration-300 hover:border-orange-500/30"
    >
      {/* Hidden audio tag with explicit preload none/auto (no autoplay) */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="metadata"
        className="hidden"
      />

      {/* Info & Sound wave simulation */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className={`w-9 h-9 flex items-center justify-center border transition-all duration-500 rounded-none ${
          isPlaying ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-neutral-900 border-white/5 text-neutral-500'
        }`}>
          <Music size={14} className={isPlaying ? 'animate-bounce' : ''} />
        </div>
        <div>
          <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-widest leading-none">
            SHOWCASE SOUNDTRACK
          </span>
          <span className="font-sans text-xs text-white font-medium">
            Comic Reel Atmosphere
          </span>
        </div>
        {/* Animated Sound waves */}
        {isPlaying && (
          <div className="flex items-end space-x-0.5 h-3">
            <span className="w-[1.5px] bg-orange-500 animate-[pulse_0.6s_infinite]" style={{ height: '35%' }} />
            <span className="w-[1.5px] bg-orange-500 animate-[pulse_0.4s_infinite_0.1s]" style={{ height: '100%' }} />
            <span className="w-[1.5px] bg-orange-500 animate-[pulse_0.8s_infinite_0.2s]" style={{ height: '55%' }} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 rounded-none ${
            isPlaying
              ? 'bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]'
          }`}
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
        </button>

        {/* Volume controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 accent-orange-500 h-1 bg-neutral-800 cursor-pointer focus:outline-none rounded-none"
          />
        </div>
      </div>
    </div>
  );
}
