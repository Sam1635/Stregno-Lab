import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Unlock, BarChart3, 
  ArrowLeft, Zap, Activity, Fingerprint, Layers
} from 'lucide-react';

const Section = ({ title, subtitle, children }) => (
  <div className="mb-20">
    <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{title}</h2>
    {subtitle && <p className="text-slate-400 dark:text-slate-700 dark:text-slate-400 mb-8 italic">{subtitle}</p>}
    {children}
  </div>
);

const LSBInteractivePlane = () => {
  const [activeBit, setActiveBit] = useState(7);
  
  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-300 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
        <Activity className="text-blue-500 animate-pulse" />
      </div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-black italic text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
          <Layers className="text-blue-600" /> Bit-Plane Analysis
        </h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
          Dual-Layer Security: Layer 2 Mapping
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end h-40 gap-2 px-2">
          {[128, 64, 32, 16, 8, 4, 2, 1].map((weight, i) => (
            <motion.div 
              key={i}
              className={`flex-1 rounded-t-xl transition-all duration-500 flex flex-col items-center justify-end pb-3 text-[10px] font-mono relative
                ${activeBit === i 
                  ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.7)]' 
                  : 'bg-slate-100 dark:bg-slate-800 opacity-30 hover:opacity-60'}`}
              initial={{ height: 0 }}
              animate={{ height: `${(weight / 128) * 100}%` }}
              onMouseEnter={() => setActiveBit(i)}
            >
              <span className={`text-slate-900 dark:text-white font-bold transition-transform ${activeBit === i ? 'scale-110' : 'scale-100'}`}>
                {weight}
              </span>
              
              {i === 0 && <span className="absolute -top-6 text-[8px] text-slate-500 font-bold uppercase">MSB</span>}
              {i === 7 && <span className="absolute -top-6 text-[8px] text-blue-500 font-bold uppercase animate-pulse">LSB</span>}
            </motion.div>
          ))}
        </div>
        
        <div className="p-6 bg-white dark:bg-black/60 rounded-2xl border border-slate-300 dark:border-white/5 relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBit}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">
                {activeBit === 7 ? "Stealth Injection Zone" : `Bit Plane ${7 - activeBit}`}
              </h4>
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-300 font-sans italic">
                {activeBit === 7 ? (
                  <>
                    <strong className="text-slate-900 dark:text-white">Bit 0 (Least Significant Bit):</strong> In a medical MRI, changing this bit shifts the grayscale intensity by only <span className="text-blue-400">0.39%</span>. This is statistically invisible, ensuring that radiologists see no artifacts during diagnosis.
                  </>
                ) : (
                  <>
                    <strong className="text-slate-900 dark:text-white">Weight {Math.pow(2, 7 - activeBit)}:</strong> This plane carries high-energy visual data. Altering bits at this level would create "Salt and Pepper" noise, potentially masking confidential medical anomalies.
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const BinaryRain = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-500 font-mono text-xs whitespace-pre select-none"
          initial={{ y: -1000, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000) }}
          animate={{ y: typeof window !== 'undefined' ? window.innerHeight + 1000 : 2000 }}
          transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 60 }).map(() => Math.round(Math.random())).join('\n')}
        </motion.div>
      ))}
      <motion.div 
        className="absolute w-full h-1 bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,1)] opacity-30"
        animate={{ top: ['-10%', '110%', '-10%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

const SteganoLab = () => {
  const [activeTab, setActiveTab] = useState('embedding');
  const navigate = useNavigate();

  const frameworkDetails = {
    embedding: {
      title: "Dual-Layer Embedding",
      desc: "The process of concealing a medical secret. ",
      button: "Initiate Secure Embedding",
      icon: <Lock className="text-blue-500" />,
      path: '/embedd'
    },
    extracting: {
      title: "Secure Extraction",
      desc: "The recovery phase. The system retrieves the modified bitstream from the stego-image and performs the inverse of the bit-shuffling algorithm to reconstruct the original medical data.",
      button: "Initiate Secure Extraction",
      icon: <Unlock className="text-emerald-500" />,
      path: '/extract'
    },
    analysis: {
      title: "Integrity Analysis",
      desc: "Mathematical verification of the stego-image. We calculate the difference between the original cover and the modified image to ensure no diagnostic information was lost.",
      button: "Generate Analysis Report",
      icon: <BarChart3 className="text-purple-500" />,
      path: '/analysis'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500/30 relative"
    >
      <BinaryRain />
      <div className="relative z-10">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.2em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Overview
        </button>
        <div className="flex items-center gap-3 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-500/20">
          <ShieldCheck size={16} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Framework Status: Encrypted</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        {/* Core Project Explanation */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white mb-6">
            Dual Layer <span className="text-blue-600 italic">Security Framework</span>
          </h1>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <p className="text-slate-400 dark:text-slate-700 dark:text-slate-400 text-lg font-light leading-relaxed italic border-l-2 border-blue-600 pl-6">
              Our system ensures the privacy of <span className="text-slate-900 dark:text-white">Confidential Medical Images</span> through a two-stage defense. 
              By manipulating the bitstream architecture before embedding, we create a non-standardized hidden layer that resists traditional steganalysis.
            </p>
          </div>
        </header>
        
        

        {/* The Three Functional Buttons (Tabs) */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {['embedding', 'extracting', 'analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all border-2 ${
                activeTab === tab 
                ? 'bg-blue-600 border-blue-500 text-slate-900 dark:text-white shadow-[0_0_40px_rgba(37,99,235,0.25)] scale-105' 
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-white/5 text-slate-600 hover:border-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Detailed Explanation Panel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-300 dark:border-white/10 p-12 rounded-[3.5rem] shadow-3xl"
          >
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-4">
                {frameworkDetails[activeTab].icon} {frameworkDetails[activeTab].title}
              </h2>
              <p className="text-slate-400 dark:text-slate-700 dark:text-slate-400 mb-10 text-lg leading-relaxed italic border-b border-slate-300 dark:border-white/5 pb-8">
                {frameworkDetails[activeTab].desc}
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(frameworkDetails[activeTab].path)}
                className="px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3"
              >
                {frameworkDetails[activeTab].button} <Zap size={18} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-32">
        <Section title="The LSB Protocol" subtitle="How Layer 2 achieves near-perfect concealment.">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <LSBInteractivePlane />
          <div className="space-y-10 text-left">
            {[
              { num: 1, t: "Binary Scrambling", d: "Secret patient data is first encrypted using AES-256 and converted into bitstream." },
              { num: 2, t: "Intensity Mapping", d: "Pixels with high variance are selected to hide bits, ensuring natural color camouflage." },
              { num: 3, t: "Bit Replacement", d: "The 8th bit of each RGB channel is replaced by a secret bit, changing intensity by 0.39%." }
            ].map((s) => (
              <div key={s.num} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full border border-blue-500 flex items-center justify-center text-blue-400 font-black italic flex-shrink-0">{s.num}</div>
                <div><h4 className="text-xl font-bold mb-1 italic tracking-tight">{s.t}</h4><p className="text-slate-400 dark:text-slate-700 dark:text-slate-400 text-sm leading-relaxed">{s.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      </div>
        {/* Framework Status Monitoring */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 italic opacity-60">
           <div className="flex items-center gap-4 bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-300 dark:border-white/5">
              <Activity className="text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">System awaiting medical data input for {activeTab} stage.</p>
           </div>
           <div className="flex items-center gap-4 bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-300 dark:border-white/5">
              <Fingerprint className="text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Embedding process in progress...</p>
           </div>
        </div>
      </main>

      <footer className="mt-32 text-center opacity-20 text-[8px] font-black uppercase tracking-[0.5em]">
        Securing Confidential Medical Images &bull; Dual-Layer Framework &bull; 2026
      </footer>
      </div>
    </motion.div>
    
  );
};

export default SteganoLab;