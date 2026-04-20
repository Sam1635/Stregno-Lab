import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Unlock, RefreshCcw, Download, CheckCircle2, Search
} from 'lucide-react';

const RadarRings = ({ color }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full border border-${color}-500/30`}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: '150vw', height: '150vw', opacity: 0 }}
          transition={{ duration: 10, repeat: Infinity, delay: i * 2.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const ExtractionPage = () => {
  const navigate = useNavigate();
  const [stegoImage, setStegoImage] = useState(null);
  const [stegoFile, setStegoFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleProcess = async () => {
    if (!stegoFile) return alert("Please upload the stego-image first!");
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('stego_image', stegoFile);

      const response = await fetch('http://localhost:8000/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      
      setIsProcessing(false);
      setIsDone(true);
    } catch (error) {
      setIsProcessing(false);
      alert("Error: " + error.message);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStegoFile(file);
      const reader = new FileReader();
      reader.onload = () => setStegoImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 p-6 md:p-12 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <RadarRings color="emerald" />
      <div className="relative z-10">
      {/* Header Navigation */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <button onClick={() => navigate('/stegno')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Back to Lab
        </button>
        <div className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.3em]">
          Extraction Phase: Restoration Logic
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Secure Extraction</h1>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest italic">Reversing Bit Shuffling & Restoring Medical Secrets</p>
        </header>

        {/* Upload Container */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="max-w-md mx-auto mb-10">
            <div className="space-y-4 text-center">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Input: Stego Medical Image</label>
              <div className="relative h-80 bg-slate-100 dark:bg-black/40 border-2 border-dashed border-slate-300 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-emerald-500/50">
                {stegoImage ? (
                  <img src={stegoImage} alt="Stego" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <>
                    <Search className="text-slate-400 dark:text-slate-700 dark:text-slate-400 dark:text-slate-700 mb-3 group-hover:text-emerald-500 transition-colors" size={40} />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-[180px]">Drag & Drop stego-image to begin extraction</p>
                  </>
                )}
                <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            {!isDone ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProcess}
                disabled={isProcessing}
                className={`px-16 py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl transition-all ${
                  isProcessing ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-500 shadow-emerald-500/20'
                }`}
              >
                {isProcessing ? "Analyzing Bitplanes..." : "Start Extraction"} <Unlock size={18} />
              </motion.button>
            ) : (
              <motion.a
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                href={resultUrl} // Link to extracted blob
                download="extracted_secret_medical_data.png"
                className="px-16 py-5 bg-blue-600 text-slate-900 dark:text-white rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl shadow-blue-500/20"
              >
                Download Hidden Image <Download size={18} />
              </motion.a>
            )}
          </div>

          {/* Inverse Algorithm Status Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
              >
                <RefreshCcw className="text-emerald-500 animate-spin mb-6" size={48} />
                <div className="space-y-4">
                  <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-widest text-xl">Reversing Security Layers</p>
                  <div className="flex flex-col gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>Accessing LSB Bitstream...</motion.p>
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}>Undoing Bit Pair Swaps...</motion.p>
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}>Reversing 8-bit Pixel Sequences...</motion.p>
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.9 }}>Reconstructing Secret Image...</motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Success Message */}
        {isDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex items-center justify-center gap-3 text-blue-400 bg-blue-400/10 p-4 rounded-2xl border border-blue-400/20">
            <CheckCircle2 size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest">Secret Restoration Complete. Metadata recovered successfully.</p>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 text-center opacity-20 text-[8px] font-black uppercase tracking-[0.5em]">
        Securing Confidential Medical Images &bull; Extraction Pipeline &bull; 2026
      </footer>
      </div>
    </div>
  );
};

export default ExtractionPage;