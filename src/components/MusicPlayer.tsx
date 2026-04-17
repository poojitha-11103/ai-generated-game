/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'GLITCH_PULSE_01',
    artist: 'M_CHINE_SYNTH',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7395a.mp3',
    cover: 'https://picsum.photos/seed/cyber1/300/300',
  },
  {
    id: '2',
    title: 'VOID_WALKER_X',
    artist: 'USER_NULL',
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_1e3e0d8677.mp3',
    cover: 'https://picsum.photos/seed/neon2/300/300',
  },
  {
    id: '3',
    title: 'CRITICAL_ERROR',
    artist: 'SYST3M_F_ILURE',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff2406.mp3',
    cover: 'https://picsum.photos/seed/grid3/300/300',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="bg-black border-4 border-glitch-cyan p-6 relative overflow-hidden">
      {/* Jagged decorative elements */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-glitch-cyan transform translate-x-4 -translate-y-4 rotate-45" />
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-glitch-magenta transform -translate-x-4 translate-y-4 rotate-45" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 border-2 border-glitch-magenta p-1 shrink-0 bg-neutral-900 overflow-hidden">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale invert contrast-150"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-display text-glitch-cyan glitch-text mb-1 uppercase leading-tight"
              data-text={currentTrack.title}
            >
              {currentTrack.title}
            </h3>
            <p className="text-glitch-magenta text-[10px] font-mono animate-pulse font-bold">{`USR::${currentTrack.artist}`}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-4 w-full bg-neutral-900 border border-neutral-700 relative">
            <motion.div 
              className="h-full bg-glitch-cyan" 
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[8px] font-mono text-black font-bold tracking-widest uppercase">Syncing...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={handlePrev} className="text-glitch-cyan hover:text-white transition-colors">
              <SkipBack size={24} />
            </button>
            <button onClick={togglePlay} className="text-glitch-magenta hover:text-white transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={handleNext} className="text-glitch-cyan hover:text-white transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-glitch-yellow animate-bounce">
            <Volume2 size={16} />
            <span className="text-[8px] font-mono whitespace-nowrap">HIGH_FREQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
