import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, BarChart3, Image as ImageIcon, 
  Zap, Activity, CheckCircle2, Calculator, Info
} from 'lucide-react';

const FloatingMath = () => {
  const symbols = ['∑', '∫', 'σ', '√', 'Δ', 'π', 'μ', 'θ', 'λ', 'ρ', 'MSE', 'PSNR'];
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-500/20 dark:text-purple-400/10 font-black italic select-none"
          style={{ fontSize: Math.random() * 40 + 20 + 'px' }}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            rotate: Math.random() * 360
          }}
          animate={{
            y: [null, Math.random() * -500],
            rotate: [null, Math.random() * 360],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {symbols[Math.floor(Math.random() * symbols.length)]}
        </motion.div>
      ))}
    </div>
  );
};

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);
  const [stegoImage, setStegoImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [stegoFile, setStegoFile] = useState(null);
  const [allMetrics, setAllMetrics] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('MSE');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);

  const metricsData = {
    MSE: { name: "Mean Squared Error", target: "Lower is better (Ideally < 0.5)", formula: "MSE = (1/MN) ΣΣ [C(i,j) - S(i,j)]²" },
    RMSE: { name: "Root Mean Squared Error", target: "Lower is better", formula: "RMSE = √MSE" },
    PSNR: { name: "Peak Signal-to-Noise Ratio", target: "Higher is better (> 30dB)", formula: "PSNR = 10 * log10(MAX² / MSE)" },
    Entropy: { name: "Information Entropy", target: "Should remain stable", formula: "H = -Σ P(xi) log2 P(xi)" },
    "Correlation": { name: "Correlation Coefficient", target: "Ideally 1.0", formula: "r = Cov(C, S) / (σC σS)" },
    NPCR: { name: "Number of Pixels Change Rate", target: "Resistance to attacks (< 0.5%)", formula: "NPCR = [Σ D(i,j) / (W*H)] * 100%" },
    SC: { name: "Structural Content", target: "Ideally 1.0", formula: "SC = Σ C(i,j)² / Σ S(i,j)²" },
    UACI: { name: "Unified Avg Changed Intensity", target: "Lower sensitivity is better", formula: "UACI = [1/WH Σ |Ci,j - Si,j| / 255] * 100%" }
  };

  const handleCalculate = async () => {
    if (!coverFile || !stegoFile) return alert("Please upload both images for comparison!");
    
    setIsCalculating(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('cover_image', coverFile);
      formData.append('stego_image', stegoFile);

      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data = await response.json();
      setAllMetrics(data);
      setResult(data[selectedMetric]);
      setIsCalculating(false);
    } catch (error) {
      setIsCalculating(false);
      alert("Error: " + error.message);
    }
  };

  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'cover') setCoverFile(file);
      else setStegoFile(file);
      const reader = new FileReader();
      reader.onload = () => type === 'cover' ? setCoverImage(reader.result) : setStegoImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 p-6 md:p-12 font-sans overflow-hidden">
      <FloatingMath />
      <div className="relative z-10">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <button onClick={() => navigate('/stegno')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Back to Lab
        </button>
        <div className="text-purple-500 font-black uppercase text-[10px] tracking-[0.3em]">
          Integrity Phase: Statistical Audit
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Framework Analysis</h1>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Evaluating diagnostic invisibility & mathematical error</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Uploaders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Upload size={12}/> Cover Image (Original)</label>
                <div className="relative h-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-purple-500/50">
                  {coverImage ? <img src={coverImage} alt="Selected Cover Medical Data" className="w-full h-full object-cover opacity-40" /> : <ImageIcon className="text-slate-400 dark:text-slate-700 dark:text-slate-400 dark:text-slate-700" size={24} />}
                  <input type="file" onChange={(e) => handleUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Upload size={12}/> Stego Image (Modified)</label>
                <div className="relative h-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-purple-500/50">
                  {stegoImage ? <img src={stegoImage} alt="Stego Image" className="w-full h-full object-cover opacity-40" /> : <BarChart3 className="text-slate-400 dark:text-slate-700 dark:text-slate-400 dark:text-slate-700" size={24} />}
                  <input type="file" onChange={(e) => handleUpload(e, 'stego')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Metric Selection Grid */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calculator size={14}/> Select Evaluation Metric
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(metricsData).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMetric(m); setResult(allMetrics ? allMetrics[m] : null); }}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedMetric === m ? 'bg-purple-600 border-purple-500 text-slate-900 dark:text-white' : 'bg-slate-200 dark:bg-black/20 border-slate-300 dark:border-white/5 text-slate-500 hover:border-white/20'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 p-8 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 dark:bg-purple-600/10 rounded-full blur-3xl" />
            
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-slate-900 dark:text-white font-black italic text-2xl uppercase tracking-tighter">{selectedMetric}</h4>
                <p className="text-purple-500 text-[10px] font-bold uppercase tracking-widest">{metricsData[selectedMetric].name}</p>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-300 dark:border-white/5 font-mono text-[11px] text-blue-400">
                {metricsData[selectedMetric].formula}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Info size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ideal Target</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-300 italic">{metricsData[selectedMetric].target}</p>
              </div>

              <div className="pt-6 border-t border-slate-300 dark:border-white/5">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-6">
                      <Activity className="text-purple-500 animate-pulse mb-2" />
                      <span className="text-[10px] font-black uppercase text-slate-500 animate-bounce">Computing...</span>
                    </motion.div>
                  ) : result ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 bg-purple-100 dark:bg-purple-600/10 rounded-3xl border border-purple-500/20">
                      <p className="text-[10px] font-black text-purple-500 uppercase mb-1 tracking-widest flex items-center justify-center gap-1"><CheckCircle2 size={12}/> Calculated Value</p>
                      <p className="text-4xl font-black text-slate-900 dark:text-white italic">{result}</p>
                    </motion.div>
                  ) : (
                    <div className="py-10 text-center opacity-20 italic text-xs">Awaiting data...</div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-500 hover:text-white transition-all shadow-xl mt-6 flex items-center justify-center gap-2"
            >
              Execute Audit <Zap size={16}/>
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center opacity-20 text-[8px] font-black uppercase tracking-[0.5em]">
        Medical Integrity Framework &bull; Quality Analysis Module &bull; 2026
      </footer>
      </div>
    </div>
  );
};

export default AnalysisPage;