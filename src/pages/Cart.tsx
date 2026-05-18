import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-8 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#2a1810]/5">
            <ShoppingBag className="w-12 h-12 text-[#c07446]/20" />
          </div>
          <h2 className="text-3xl font-serif text-[#2a1810] mb-4">السلة فارغة</h2>
          <p className="text-[#2a1810]/40 mb-10 max-w-xs mx-auto leading-relaxed">
            يبدو أنك لم تختر مشروبك المفضل بعد. استكشف قائمتنا المختارة بعناية.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="btn-luxury"
          >
            تصفح القائمة
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-44" dir="rtl">
      {/* Luxury Header */}
      <header className="glass-header px-6 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/menu')}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2a1810] shadow-sm border border-[#2a1810]/5"
          >
            <ArrowRight size={22} className="text-[#c07446]" />
          </motion.button>
          <h1 className="text-xl font-serif font-bold text-[#2a1810]">سلة المشتريات</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Cart Items */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {cart.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              key={item.product.id}
              className="luxury-card p-5 flex items-center gap-5"
            >
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-sm border border-[#2a1810]/5">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-[#fdfaf5] flex items-center justify-center text-[#c07446]/20">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-serif font-bold text-[#2a1810] text-lg mb-1">{item.product.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#c07446] font-bold mb-3">{item.product.nameEn}</p>
                <p className="text-[#2a1810] font-bold text-sm">
                  {item.product.price} <span className="text-[10px] opacity-40">ر.ع</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 bg-[#faf7f2] rounded-full p-1 border border-[#2a1810]/5" dir="ltr">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      item.quantity === 1
                        ? removeFromCart(item.product.id)
                        : updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-9 h-9 bg-white text-[#2a1810] rounded-full flex items-center justify-center shadow-sm hover:bg-[#2a1810] hover:text-white transition-all"
                  >
                    {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                  </motion.button>
                  <span className="w-6 text-center font-bold text-[#2a1810] text-sm">
                    {item.quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-9 h-9 bg-[#2a1810] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#2a1810]/20"
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ opacity: 0.7 }}
          onClick={clearCart}
          className="w-full py-4 text-[#c07446] text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          إفراغ السلة بالكامل
        </motion.button>
      </main>

      {/* Luxury Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="max-w-4xl mx-auto luxury-card p-6 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-[10px] text-[#2a1810]/40 font-bold uppercase tracking-widest mb-1">الإجمالي المستحق</p>
              <h2 className="text-3xl font-serif font-bold text-[#2a1810]">
                {total} <span className="text-sm opacity-40">ر.ع</span>
              </h2>
            </div>
            <div className="text-left" dir="ltr">
               <p className="text-[10px] text-[#c07446] font-bold uppercase tracking-widest">{cart.length} ITEMS</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/checkout')}
            className="btn-luxury w-full py-5 text-lg"
          >
            <span>إتمام الطلب الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
