import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export default function Splash() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => navigate('/menu'), 5000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1a110d] flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Decorative background elements for desktop */}
      <div className="absolute inset-0 opacity-10 pointer-events-none origin-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c07446] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c07446] rounded-full blur-[160px]" />
      </div>

      <div className="text-center px-8 w-full max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl p-1 bg-white/5 backdrop-blur-sm">
            <img 
              src={settings.logoUrl} 
              alt={settings.storeName} 
              className="w-full h-full object-cover rounded-[2.3rem]"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl font-serif text-[#faf7f2] mb-2 tracking-tight">
            {settings.storeName}
          </h1>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-1 bg-white/5 rounded-full relative overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#c07446]"
            />
          </div>
          <span className="text-[10px] text-[#faf7f2]/20 font-bold uppercase tracking-widest">جاري التحميل</span>
        </div>
      </div>
    </div>
  );
}
