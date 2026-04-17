/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Wifi } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 px-6 font-sans select-none overflow-hidden">
      {/* Glitch Environment Layer */}
      <div className="noise-overlay" />
      <div className="crt-lines" />
      
      {/* Background elements */}
      <div className="fixed top-20 left-10 w-64 h-64 border-2 border-glitch-magenta/10 -rotate-12 pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 border-2 border-glitch-cyan/10 rotate-12 pointer-events-none" />

      {/* Header - Terminal Style */}
      <header className="mb-12 text-center space-y-4 relative z-10 w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4 bg-glitch-cyan text-black px-4 py-2 font-display text-sm font-bold skew-x-[-15deg]">
            <Cpu size={20} />
            <span>SYST3M_SYNTH</span>
          </div>
          <h1 
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white glitch-text" 
            data-text="GLITCH_SN_KE"
          >
            GLITCH_SN_KE
          </h1>
        </motion.div>
        
        <div className="flex items-center justify-center gap-4 font-mono text-[10px] text-glitch-magenta uppercase tracking-widest font-bold">
           <span className="animate-pulse">BOOT_SEQ::SUCCESS</span>
           <span className="text-white opacity-20">|</span>
           <span className="text-glitch-cyan animate-pulse delay-75">ADDR::0x7F0001</span>
        </div>
      </header>

      {/* Main Grid Interface */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start relative z-10">
        
        {/* Unit 01: Core Grid */}
        <section className="flex flex-col items-center p-4 border-2 border-dashed border-neutral-800 bg-neutral-900/10">
          <div className="w-full mb-4 flex justify-between items-center px-4">
             <span className="text-glitch-cyan font-mono text-[10px] flex items-center gap-2">
               <Wifi size={12} /> NET_STATUS: ENCRYPTED
             </span>
             <span className="text-neutral-500 font-mono text-[8px]">UNIT_01_GRID</span>
          </div>
          <SnakeGame />
        </section>

        {/* Unit 02: Frequency Engine */}
        <section className="flex flex-col gap-12">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-glitch-yellow font-bold">FREQ_M_DUL_TOR</h2>
              <div className="flex gap-1">
                 {[1,2,3,4].map(i => (
                   <motion.div 
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-glitch-magenta"
                   />
                 ))}
              </div>
            </div>
            <MusicPlayer />
          </div>

          {/* Machine Readouts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black border-2 border-neutral-800 p-4 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-glitch-cyan group-hover:bg-white transition-colors" />
              <h3 className="text-[8px] font-mono uppercase text-neutral-500 tracking-tighter">Memory Leak</h3>
              <p className="text-glitch-cyan font-display text-[10px] font-bold">0.032GB</p>
              <div className="w-full h-1 bg-neutral-900">
                 <div className="w-1/4 h-full bg-glitch-cyan animate-pulse" />
              </div>
            </div>
            <div className="bg-black border-2 border-neutral-800 p-4 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-glitch-magenta group-hover:bg-white transition-colors" />
              <h3 className="text-[8px] font-mono uppercase text-neutral-500 tracking-tighter">Clock Speed</h3>
              <p className="text-glitch-magenta font-display text-[10px] font-bold">4.20 GHZ</p>
              <div className="w-full h-1 bg-neutral-900">
                 <div className="w-3/4 h-full bg-glitch-magenta animate-glitch-skew" />
              </div>
            </div>
          </div>

          <div className="bg-glitch-magenta/5 border border-glitch-magenta/20 p-4">
             <p className="text-[8px] font-mono text-neutral-400 uppercase leading-relaxed text-justify">
               CAUTION: Unauthorized access to the pulse grid may result in temporal displacement. Ensure frequency patterns match oscillation keys. Failure to sync will trigger purge protocol.
             </p>
          </div>
        </section>
      </main>

      {/* Footer Readout */}
      <footer className="mt-20 relative z-10 w-full border-t border-neutral-800 py-6">
        <div className="flex justify-between items-center text-[8px] font-mono text-neutral-600 uppercase tracking-[0.5em]">
           <span>SYSTEM_TIME::2026_04_16</span>
           <span className="text-glitch-cyan animate-pulse">CRYPTIC_CORE_V3.1</span>
           <span>LOG_OFF::0</span>
        </div>
      </footer>
    </div>
  );
}
