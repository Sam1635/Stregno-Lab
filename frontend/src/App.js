import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import {
  Image as ImageIcon, Music, Video, Type, ChevronDown,
  ShieldCheck, AlertTriangle, Layers, Cpu, Zap, Eye, Search, Lock, Activity, ArrowRight
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SteganoLab from './stegno';
import EmbeddingPage from './embedd';
import ExtractionPage from './extract';
import AnalysisPage from './analysis';
import ThemeToggle from './components/ThemeToggle';

/**
 * FINAL YEAR PROJECT 2026: 
 * Securing Confidential Medical Images using Dual layer of security Frameworks
 */

// --- 1. Animation Variants ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVar = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
};

// --- 2. Supporting Components ---

const Section = ({ children, title, subtitle, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} ref={ref} className="py-24 px-6 max-w-7xl mx-auto relative">
      <motion.div variants={containerVar} initial="hidden" animate={isInView ? "visible" : "hidden"}>
        {title && (
          <div className="mb-16 text-center">
            <motion.h2 variants={itemVar} className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-slate-500 italic uppercase tracking-tighter">
              {title}
            </motion.h2>
            <motion.div variants={itemVar} className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-6" />
            <motion.p variants={itemVar} className="text-slate-700 dark:text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</motion.p>
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
};



const StegoScanner = () => {
  const [scanning, setScanning] = useState(false);
  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 shadow-2xl">
      <img src="https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=1000&auto=format&fit=crop" className={`w-full h-full object-cover transition-all duration-1000 ${scanning ? 'grayscale blur-sm' : ''}`} alt="Medical MRI" />
      <AnimatePresence>
        {scanning && (
          <>
            <motion.div className="absolute inset-0 bg-blue-500/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]" animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
            <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="bg-white dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-blue-500/50 text-center">
                <Search className="mx-auto mb-2 text-blue-400 animate-bounce" />
                <p className="font-mono text-[10px] text-blue-300 uppercase tracking-widest">Scanning Medical Metadata...</p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-2 tracking-tighter">AES_ENCRYPTED_ID_882.bin</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <button onClick={() => setScanning(!scanning)} className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-slate-900 dark:text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2">
        {scanning ? <Zap size={18} /> : <Search size={18} />} {scanning ? "Stop Analysis" : "Analyze Medical Image"}
      </button>
    </div>
  );
};

const DetailModal = ({ type, onClose }) => {
  if (!type) return null;

  const details = {
    img: {
      title: "Image Steganography",
      tech: "LSB & DCT Manipulation",
      explanation: "The core of our Layer-2 security. It hides encrypted medical data by replacing the least significant bits of pixel color values. In 24-bit medical scans, each pixel has 3 bytes (RGB). Changing 1 bit per byte allows for massive data storage without human-perceivable color shifts, preserving diagnostic integrity.",
      process: ["Binary Conversion", "Pixel Traversal", "LSB Substitution", "Lossless Compression (PNG/BMP)"]
    },
    aud: {
      title: "Audio Steganography",
      tech: "Low-Bit Encoding & Echo Hiding",
      explanation: "Utilized for securing clinical voice notes. Data is hidden in the 'masking' threshold of sound waves or by adding a very slight echo that represents a bit of data, making the secret clinical instructions undetectable to unauthorized listeners.",
      process: ["Sampling rate analysis", "Frequency masking", "Phase coding", "Echo resonance injection"]
    },
    vid: {
      title: "Video Steganography",
      tech: "H.264/AVC Bitstream Embedding",
      explanation: "The ultimate carrier for large medical databases. Since surgical videos are sequences of frames, we can hide different parts of an encrypted patient history in different frames or even in the motion vectors between frames.",
      process: ["Frame decomposition", "Intra-frame LSB", "Inter-frame motion vectoring", "Re-multiplexing"]
    },
    txt: {
      title: "Text Steganography",
      tech: "Whitespace & Semantic Coding",
      explanation: "The most subtle form for protecting EHR (Electronic Health Records). Hides sensitive keys in plain text reports by adding extra spaces at the end of lines or using invisible zero-width characters that don't affect the document's appearance.",
      process: ["Zero-width character mapping", "Whitespace encoding", "Synonym substitution", "Line-shift coding"]
    }
  };

  const data = details[type.id];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white dark:bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 p-8 md:p-12 rounded-[3rem] max-w-2xl w-full relative overflow-hidden shadow-2xl font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
        <div className="flex justify-between items-start mb-8 text-slate-900 dark:text-white text-left">
          <div>
            <span className="text-blue-500 font-mono text-xs uppercase tracking-widest">{data.tech}</span>
            <h3 className="text-4xl font-black mt-2 italic tracking-tighter uppercase leading-none">
              {data.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400 dark:text-slate-700 dark:text-slate-400">
            <Zap size={24} className="rotate-45" />
          </button>
        </div>
        <p className="text-slate-800 dark:text-slate-400 leading-relaxed mb-8 text-lg font-light italic text-left">
          {data.explanation}
        </p>
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-500 tracking-[0.2em] mb-4 text-left"> Technical Execution Process </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-900 dark:text-white">
            {data.process.map((step, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-200 dark:bg-white/5 p-4 rounded-2xl border border-slate-300 dark:border-white/5 group hover:border-blue-500/50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-black italic">{i + 1}</div>
                <span className="text-xs font-bold uppercase tracking-wider">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MetricModal = ({ metric, onClose }) => {
  if (!metric) return null;
  const metricDetails = {
    MSE: { formula: "MSE = (1 / (M * N)) * Σ Σ [C(i,j) - S(i,j)]²", explanation: "Mean Squared Error: Measures average squared difference between Cover and Stego image.", target: "Near 0" },
    RMSE: { formula: "RMSE = √MSE", explanation: "Root Mean Squared Error: Error in standard pixel intensity units.", target: "Low" },
    PSNR: { formula: "PSNR = 10 * log10( MAX² / MSE )", explanation: "Peak Signal-to-Noise Ratio: Measures visibility of hidden data.", target: "> 30dB" },
    Entropy: { formula: "H = -Σ P(xi) * log2( P(xi) )", explanation: "Measures randomness. Significant spikes reveal hidden data.", target: "Stable" },
    Correlation: { formula: "r = Cov(C, S) / (σC * σS)", explanation: "Linear relationship between original and stego pixels.", target: "1.0" },
    NPCR: { formula: "NPCR = [ Σ D(i,j) / (W * H) ] * 100%", explanation: "Percentage of different pixels between images.", target: "< 0.5%" },
    SC: { formula: "SC = Σ C(i,j)² / Σ S(i,j)²", explanation: "Verifies preservation of image structural energy.", target: "1.0" },
    UACI: { formula: "UACI = (1/WH) * Σ [|Ci,j - Si,j|/255] * 100%", explanation: "Average intensity change sensitivity analysis.", target: "Low" }
  };
  const data = metricDetails[metric.title];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950/90 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-slate-900 border border-blue-500/30 p-8 rounded-[2.5rem] max-w-xl w-full shadow-2xl relative overflow-hidden font-sans text-left" onClick={e => e.stopPropagation()}>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]" />
        <div className="flex justify-between items-start mb-8 text-slate-900 dark:text-white uppercase italic tracking-tighter">
          <h3 className="text-4xl font-black leading-none">{metric.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 bg-slate-200 dark:bg-white/5 rounded-full"><Zap size={20} /></button>
        </div>
        <div className="space-y-6 relative z-10">
          <div><h4 className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Mathematical Foundation</h4>
            <div className="p-6 bg-white dark:bg-black/50 rounded-2xl border border-slate-300 dark:border-white/5 font-mono text-blue-400 text-lg md:text-xl text-center shadow-inner overflow-x-auto">{data.formula}</div>
          </div>
          <div className="p-5 bg-slate-200 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5"><h4 className="text-slate-900 dark:text-white text-[10px] font-bold mb-2 uppercase opacity-40 tracking-widest">Technical Definition</h4>
            <p className="text-slate-800 dark:text-slate-300 text-sm leading-relaxed italic">{data.explanation}</p>
          </div>
          <div className="p-5 bg-blue-600/10 rounded-2xl border-l-4 border-blue-600"><h4 className="text-blue-400 text-[10px] font-bold mb-1 uppercase tracking-widest">Optimal Result</h4>
            <p className="text-slate-900 dark:text-white text-md font-bold italic tracking-tight uppercase">{data.target}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 3.5 Animated Background Effects ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      if (
        target.tagName?.toLowerCase() === 'button' ||
        target.closest('button') ||
        target.tagName?.toLowerCase() === 'a' ||
        target.closest('a') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', updateMousePosition);
      return () => window.removeEventListener('mousemove', updateMousePosition);
    }
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] border-2 border-blue-500/40 dark:border-blue-400/40"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 30, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'tween', duration: 0 }}
      />
    </>
  );
};

const AntigravityBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // The "Gravity" center follows the mouse
    let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      origin.x = e.clientX;
      origin.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    class Particle {
      constructor() {
        this.init(true); // Initial spawn scattered across screen
      }

      init(firstSpawn = false) {
        this.angle = Math.random() * Math.PI * 2;
        // If first spawn, fill screen; otherwise, start at center
        this.dist = firstSpawn ? Math.random() * canvas.width : Math.random() * 20;
        this.speed = 0.1;
        this.accel = 1.015 + Math.random() * 0.001; // Exponential liftoff
        this.width = Math.random() * 1.5 + 1;

        // --- Google Color Zones Logic ---
        // Blue on the left, Red/Rose on the right, Purple/Yellow in between
        const xDir = Math.cos(this.angle);
        if (xDir < -0.3) {
          this.color = `rgba(66, 133, 244, ${Math.random() * 0.4 + 0.4})`; // Google Blue
        } else if (xDir > 0.3) {
          this.color = `rgba(234, 67, 53, ${Math.random() * 0.4 + 0.4})`;  // Google Red
        } else {
          this.color = `rgba(168, 85, 247, ${Math.random() * 0.4 + 0.4})`; // Purple/Mixed
        }
      }

      update() {
        // Save old position to draw the "dash" stretch
        this.oldX = origin.x + Math.cos(this.angle) * this.dist;
        this.oldY = origin.y + Math.sin(this.angle) * this.dist;

        // Move outward exponentially
        this.dist *= this.accel;
        this.dist += this.speed;

        this.x = origin.x + Math.cos(this.angle) * this.dist;
        this.y = origin.y + Math.sin(this.angle) * this.dist;

        // Reset if off-screen
        if (this.x < -100 || this.x > canvas.width + 100 ||
          this.y < -100 || this.y > canvas.height + 100) {
          this.init(false);
        }
      }

      draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';

        ctx.beginPath();
        // This creates the motion blur effect from your reference
        ctx.moveTo(this.oldX, this.oldY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
    }

    // Populate the galaxy
    for (let i = 0; i < 450; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
      style={{ background: 'transparent' }}
    />
  );
};
// --- 4. Main Views ---

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const scrollToStart = () => document.getElementById('framework-intro').scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-200 selection:bg-blue-600/40 min-h-screen font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 origin-left z-[100]" style={{ scaleX }} />
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden text-center px-4">
        <AntigravityBackground />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="z-10 mt-16 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-100 dark:bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]"><Activity size={14} className="animate-pulse" /> Digital Cryptography & Steganography</div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-400 mb-2 uppercase tracking-widest opacity-80 italic">Securing Confidential Medical Images using</h2>
          <h1 className="text-[4rem] md:text-[7rem] lg:text-[8rem] font-black tracking-tighter leading-none mb-10 text-slate-900 dark:text-white uppercase italic">STEGANO <span className="text-blue-600 tracking-tight not-italic">LAB.</span></h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/stegno')} className="px-8 py-3.5 bg-blue-600 dark:bg-blue-500 text-white rounded-full font-black uppercase tracking-widest text-[13px] flex items-center gap-2 transition-shadow shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Lock size={16} /> Enter the Lab
            </motion.button>
            <motion.button whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.98 }} onClick={scrollToStart} className="px-8 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold uppercase tracking-widest text-[13px] transition-colors hover:text-slate-900 dark:hover:text-white">
              Explore architecture
            </motion.button> 
          </div> 
        </motion.div> 
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 cursor-pointer hover:text-blue-500 transition-colors" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} onClick={scrollToStart}><ChevronDown /></motion.div>
      </section> 

      <Section id="framework-intro" title="Double Defense" subtitle="Architecture for Healthcare Data Integrity">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h3 className="text-3xl font-black italic text-slate-900 dark:text-white flex items-center gap-3"><Layers className="text-blue-500" /> Hybrid Security</h3>
            <p className="text-slate-800 dark:text-slate-400 text-lg leading-relaxed font-light italic">Protecting medical images requires more than encryption. Our <span className="text-blue-400 font-bold">Dual-Layer Framework</span> first encrypts patient metadata (Layer 1) and then conceals that ciphertext within the pixels of the medical image (Layer 2).</p>
            <div className="grid grid-cols-2 gap-4"> 
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5"><Eye className="text-blue-500 mb-2" /><p className="text-2xl font-black text-slate-900 dark:text-white italic">0.0%</p><p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Visual Loss</p></div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5"><ShieldCheck className="text-blue-500 mb-2" /><p className="text-2xl font-black text-slate-900 dark:text-white italic">K-LSB</p><p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Encryption Standard</p></div>
            </div> 
          </div> 
          <StegoScanner /> 
        </div> 
      </Section> 

      <Section title="Carrier Mediums" subtitle="Medical data types supported by our security suite.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'img', title: 'MRI/X-Ray', icon: <ImageIcon />, color: 'blue', desc: 'LSB embedding in medical imaging pixels.' },
            { id: 'aud', title: 'Clinical Audio', icon: <Music />, color: 'purple', desc: 'Hidden data in diagnostic voice records.' },
            { id: 'vid', title: 'Surgery Video', icon: <Video />, color: 'cyan', desc: 'Concealing data in intra-operative feeds.' },
            { id: 'txt', title: 'EHR Reports', icon: <Type />, color: 'rose', desc: 'Invisible mapping in patient text files.' },
          ].map((type) => (
            <motion.div key={type.id} whileHover={{ y: -10 }} onClick={() => setSelectedType(type)} className="p-8 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-[2.5rem] cursor-pointer group relative overflow-hidden shadow-xl text-left">
              <div className={`text-${type.color}-500 mb-6 group-hover:scale-110 transition-transform`}>{type.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">{type.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{type.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Deep Dive <ArrowRight size={10} /></div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>{selectedType && <DetailModal type={selectedType} onClose={() => setSelectedType(null)} />}</AnimatePresence>
      </Section>


      <Section title="Quality Metrics" subtitle="Rigorous mathematical analysis of steganographic success.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["MSE", "RMSE", "PSNR", "Entropy", "Correlation", "NPCR", "SC", "UACI"].map((m, i) => (
            <motion.div key={i} whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.8)" }} onClick={() => setSelectedMetric({ title: m })} className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-300 dark:border-white/5 text-center cursor-pointer group transition-all shadow-lg">
              <h4 className="text-blue-500 font-black text-2xl group-hover:text-blue-400 tracking-tighter uppercase italic">{m}</h4>
              <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-1">View Formula</p>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>{selectedMetric && <MetricModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />}</AnimatePresence>
      </Section>

      <footer className="py-40 text-center relative border-t border-slate-300 dark:border-white/5 bg-slate-100 dark:bg-slate-950/50">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-2xl mx-auto px-4">
          <Lock className="mx-auto mb-6 text-blue-600 opacity-50" size={60} />
          <h2 className="text-5xl font-black mb-4 italic tracking-tighter uppercase text-slate-900 dark:text-white">Security Redefined</h2>
          <p className="text-slate-500 text-lg font-light leading-relaxed mb-10 flex items-center justify-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> Confidentiality is not an option; it is a clinical requirement.
          </p>
          <div className="h-px w-20 bg-blue-600 mx-auto mb-6" />
          <p className="text-[10px] text-slate-800 dark:text-slate-400 uppercase font-bold tracking-[0.5em] flex items-center justify-center gap-2">
            <Cpu size={12} className="text-blue-500" /> Project SteganoLab &bull; CS Final Year &bull; 2026
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

// --- 5. Main Wrapper ---
export default function App() {
  return (
    <Router>
      <CustomCursor />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/stegno" element={<SteganoLab />} />

        {/* --- ADD THESE NEW ROUTES --- */}
        <Route path="/embedd" element={<EmbeddingPage />} />
        <Route path="/extract" element={<ExtractionPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </Router>
  );
}