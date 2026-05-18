import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Check, Home, Clock, Sparkles, MessageCircle } from 'lucide-react';

export default function Confirmation() {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1];
      setOrderNumber((lastOrder as any).orderId || lastOrder.id);
    }
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#1a110d] flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans" dir="rtl">
      {/* Immersive Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#2a1810]" />
        <div className="absolute inset-0 bg-[#c07446]/5 blur-[120px] rounded-full scale-110" />
      </div>

      <div className="max-w-xl w-full relative z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mb-10 relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 bg-[#c07446] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-[#c07446]/20 border border-white/10"
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#c07446]/20 rounded-[3rem] border-dashed"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-serif text-[#faf7f2] mb-4 tracking-tight">
              شكراً لاختيارك لنا
            </h1>
            <p className="text-[#c07446] text-sm font-bold uppercase tracking-[0.3em] mb-12">
              Order Confirmed
            </p>
          </motion.div>

          {/* Order ID Card */}
          {orderNumber && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-10 mb-8 shadow-2xl"
            >
              <p className="text-[#faf7f2]/30 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">كود الطلب الخاص بك</p>
              <p className="text-6xl font-serif font-bold text-[#faf7f2] tracking-widest break-all" dir="ltr">
                {orderNumber}
              </p>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 text-[#c07446] mb-12 bg-white/5 py-3 rounded-full border border-white/5"
          >
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest leading-none">جاهز خلال 5-10 دقائق</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <div className="flex flex-col gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              onClick={() => navigate('/menu')}
              className="btn-luxury w-full py-5 bg-[#c07446] hover:bg-[#d18455]"
            >
              <Home className="w-5 h-5" />
              <span>العودة للقائمة</span>
            </motion.button>
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              href="https://wa.me/96800000000" // Replace with real Omani number
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#faf7f2]/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest py-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              تواصل معنا عبر واتساب
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute top-12 left-12 bottom-12 w-px bg-white/5" />
      <div className="absolute top-12 right-12 bottom-12 w-px bg-white/5" />
    </div>
  );
}
