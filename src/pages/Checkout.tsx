import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Phone, Car, CreditCard, Banknote, Check, Coffee, ArrowLeft } from 'lucide-react';
import type { PaymentMethod } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, addOrder } = useStore();
  const total = getCartTotal();
  const [phone, setPhone] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone || !carPlate || cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = Math.random().toString(36).substring(2, 6).toUpperCase();
      await addOrder({
        orderId,
        phone,
        carPlate,
        items: cart.map(i => ({ 
          product: i.product,
          quantity: i.quantity, 
        })),
        total,
        paymentMethod,
        status: 'pending',
      });

      navigate('/confirmation', { state: { orderPlaced: true, orderId } });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = phone.length >= 8 && carPlate.length >= 3;

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-44" dir="rtl">
      {/* Luxury Header */}
      <header className="glass-header px-6 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/cart')}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2a1810] shadow-sm border border-[#2a1810]/5"
          >
            <ArrowRight size={22} className="text-[#c07446]" />
          </motion.button>
          <h1 className="text-xl font-serif font-bold text-[#2a1810]">تأكيد الطلب</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Order Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-[#faf7f2] rounded-full flex items-center justify-center text-[#c07446]">
                <Coffee size={20} />
             </div>
             <h2 className="font-serif font-bold text-[#2a1810] text-xl">ملخص الطلب</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="text-[#2a1810] font-bold">{item.product.name}</span>
                  <span className="text-[10px] text-[#2a1810]/30 font-bold uppercase tracking-widest">{item.product.nameEn}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-[#2a1810]/40">×{item.quantity}</span>
                  <span className="font-bold text-[#2a1810]">
                    {item.product.price * item.quantity} <span className="text-[10px] opacity-40">ر.ع</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#2a1810]/5 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-[#2a1810]/40 font-bold uppercase tracking-widest mb-1">المجموع النهائي</p>
              <span className="text-3xl font-serif font-bold text-[#2a1810]">{total} <span className="text-sm opacity-40">ر.ع</span></span>
            </div>
          </div>
        </motion.div>

        {/* Input Form */}
        <div className="space-y-6">
          <div className="luxury-card p-8">
            <label className="flex items-center gap-3 font-serif font-bold text-[#2a1810] text-lg mb-6">
              <Phone className="w-5 h-5 text-[#c07446]" />
              رقم التواصل
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="xxxxxxxx"
              className="w-full bg-[#faf7f2] border border-[#2a1810]/5 rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#c07446]/20 transition-all font-bold text-[#2a1810] placeholder-[#2a1810]/20 text-center text-xl tracking-widest"
              required
            />
          </div>

          <div className="luxury-card p-8">
            <label className="flex items-center gap-3 font-serif font-bold text-[#2a1810] text-lg mb-6">
              <Car className="w-5 h-5 text-[#c07446]" />
              بيانات السيارة
            </label>
            <input
              type="text"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
              placeholder="أ ب ج 1234"
              className="w-full bg-[#faf7f2] border border-[#2a1810]/5 rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#c07446]/20 transition-all font-bold text-[#2a1810] placeholder-[#2a1810]/20 text-center text-xl tracking-widest"
              required
            />
            <p className="text-[10px] text-center mt-4 text-[#2a1810]/30 font-bold uppercase tracking-widest">لتسهيل التعرف على طلبك عند الوصول</p>
          </div>

          <div className="luxury-card p-8">
            <label className="flex items-center gap-3 font-serif font-bold text-[#2a1810] text-lg mb-6">
              <CreditCard className="w-5 h-5 text-[#c07446]" />
              طريقة الدفع الفضلى
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden ${
                  paymentMethod === 'cash'
                    ? 'border-[#c07446] bg-[#c07446] text-white shadow-xl shadow-[#c07446]/20'
                    : 'border-[#2a1810]/5 bg-white text-[#2a1810]/40 hover:bg-[#2a1810]/5'
                }`}
              >
                <Banknote className="w-8 h-8" strokeWidth={1} />
                <span className="font-bold text-sm">الدفع نقداً</span>
                {paymentMethod === 'cash' && (
                  <motion.div layoutId="selection" className="absolute top-4 right-4"><Check size={16} /></motion.div>
                )}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setPaymentMethod('visa')}
                className={`p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden ${
                  paymentMethod === 'visa'
                    ? 'border-[#c07446] bg-[#c07446] text-white shadow-xl shadow-[#c07446]/20'
                    : 'border-[#2a1810]/5 bg-white text-[#2a1810]/40 hover:bg-[#2a1810]/5'
                }`}
              >
                <CreditCard className="w-8 h-8" strokeWidth={1} />
                <span className="font-bold text-sm">بطاقة ائتمان</span>
                {paymentMethod === 'visa' && (
                  <motion.div layoutId="selection" className="absolute top-4 right-4"><Check size={16} /></motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="max-w-4xl mx-auto luxury-card p-6"
        >
          <motion.button
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`w-full btn-luxury py-5 text-lg ${
              isValid && !isSubmitting ? 'opacity-100' : 'opacity-40 grayscale cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري المعالجة...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>تأكيد الطلب الآن</span>
                <Check className="w-5 h-5" />
              </div>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
