import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Phone, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Login = () => {
  const navigate = useNavigate();
  const { login, settings, userPhone, currentRole } = useStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (userPhone) {
      if (currentRole === 'admin') navigate('/admin');
      else if (currentRole === 'staff') navigate('/staff');
      else navigate('/');
    }
  }, [userPhone, currentRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(phone, password);
      if (success) {
        const state = useStore.getState();
        if (state.currentRole === 'admin') {
          navigate('/admin');
        } else if (state.currentRole === 'staff') {
          navigate('/staff');
        } else {
          navigate('/');
        }
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c07446]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2a1810]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center relative z-10"
      >
        <div className="mb-12">
          <div className="w-24 h-24 bg-[#2a1810] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl p-0.5">
            <img 
              src={settings.logoUrl} 
              alt="Logo" 
              className="w-full h-full object-cover rounded-[2.4rem]" 
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#2a1810] mb-2 tracking-tight">
            {settings.storeName}
          </h1>
          <p className="text-[#c07446] font-bold uppercase tracking-[0.3em] text-[10px]">
            Portal Authentication
          </p>
        </div>

        <div className="luxury-card p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-[#c07446]/40 group-focus-within:text-[#c07446] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#faf7f2]/50 border border-[#2a1810]/5 rounded-2xl py-4 pr-14 pl-6 focus:ring-2 focus:ring-[#c07446]/20 transition-all font-bold text-[#2a1810] placeholder-[#2a1810]/20 text-center tracking-widest"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#c07446]/40 group-focus-within:text-[#c07446] transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#faf7f2]/50 border border-[#2a1810]/5 rounded-2xl py-4 pr-14 pl-6 focus:ring-2 focus:ring-[#c07446]/20 transition-all font-bold text-[#2a1810] placeholder-[#2a1810]/20 text-center tracking-widest"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full btn-luxury py-5 shadow-xl shadow-[#2a1810]/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>تسجيل الدخول</span>
                  <LogIn size={20} />
                </div>
              )}
            </motion.button>
          </form>
        </div>

        <motion.button 
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="mt-12 flex items-center gap-3 text-[#2a1810]/40 font-bold text-[10px] hover:text-[#2a1810] transition-all uppercase tracking-[0.3em] mx-auto"
        >
          <ArrowRight size={16} />
          Back to storefront
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
