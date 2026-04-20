import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Zap, Image as ImageIcon, 
  Lock, RefreshCcw, ArrowRightLeft, Download, CheckCircle2 
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

const EmbeddingPage = () => {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);
  const [secretImage, setSecretImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [secretFile, setSecretFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleProcess = async () => {
    if (!coverFile || !secretFile) return alert("Please upload both images!");
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('cover_image', coverFile);
      formData.append('secret_image', secretFile);

      const response = await fetch('http://localhost:8000/api/embed', {
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

  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'cover') setCoverFile(file);
      else setSecretFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'cover') setCoverImage(reader.result);
        else setSecretImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500/30 overflow-hidden">
      <RadarRings color="blue" />
      <div className="relative z-10">
      {/* Header */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <button onClick={() => navigate('/stegno')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Back to Lab
        </button>
        <div className="text-blue-500 font-black uppercase text-[10px] tracking-[0.3em]">
          Embedding Phase: Step 1-6
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Dual-Layer Embedding</h1>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Applying custom bit-shuffling & LSB substitution</p>
        </header>

        {/* Upload Container */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Box 1: Cover Image */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Upload size={12}/> Step 1: Medical Cover Image</label>
              <div className="relative h-64 bg-slate-100 dark:bg-black/40 border-2 border-dashed border-slate-300 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-blue-500/50">
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <>
                    <ImageIcon className="text-slate-400 dark:text-slate-700 dark:text-slate-400 dark:text-slate-700 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Click to upload X-Ray/MRI</p>
                  </>
                )}
                <input type="file" onChange={(e) => handleUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            {/* Box 2: Secret Image */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Upload size={12}/> Step 1: Confidential Secret</label>
              <div className="relative h-64 bg-slate-100 dark:bg-black/40 border-2 border-dashed border-slate-300 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-blue-500/50">
                {secretImage ? (
                  <img src={secretImage} alt="Secret" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <>
                    <Lock className="text-slate-400 dark:text-slate-700 dark:text-slate-400 dark:text-slate-700 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Click to upload metadata image</p>
                  </>
                )}
                <input type="file" onChange={(e) => handleUpload(e, 'secret')} className="absolute inset-0 opacity-0 cursor-pointer" />
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
                  isProcessing ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-600 text-slate-900 dark:text-white hover:bg-blue-500 shadow-blue-500/20'
                }`}
              >
                {isProcessing ? "Processing Algorithm..." : "Initiate Layer 1 & 2"} <Zap size={18} />
              </motion.button>
            ) : (
              <motion.a
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                href={resultUrl} // Using actual processed blob URL
                download="stego_medical_image.png"
                className="px-16 py-5 bg-emerald-600 text-slate-900 dark:text-white rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl shadow-emerald-500/20"
              >
                Download Stego-Image <Download size={18} />
              </motion.a>
            )}
          </div>

          {/* Algorithm Status Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
              >
                <RefreshCcw className="text-blue-500 animate-spin mb-6" size={48} />
                <div className="space-y-4">
                  <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-widest text-xl">Executing Security Framework</p>
                  <div className="flex flex-col gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>Step 2: 8-Bit Binary Conversion...</motion.p>
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}>Step 3: Bit Sequence Reversal...</motion.p>
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }} className="flex items-center gap-1 justify-center"><ArrowRightLeft size={10}/> Step 4: Pair Swapping (0↔1, 2↔3...)...</motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Success Message */}
        {isDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex items-center justify-center gap-3 text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
            <CheckCircle2 size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest">Framework successfully applied. Stego-image ready for forwarding.</p>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 text-center opacity-20 text-[8px] font-black uppercase tracking-[0.5em]">
        Securing Confidential Medical Images &bull; Embedding Pipeline &bull; 2026
      </footer>
      </div>
    </div>
  );
};

export default EmbeddingPage;