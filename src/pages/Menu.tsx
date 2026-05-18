import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Product, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, User, Coffee, LucideIcon } from 'lucide-react';

const categoryLabels: Record<Category, string> = {
  coffee: 'قهوة مختصة',
  cold: 'مشروبات باردة',
  dessert: 'حلويات فاخرة',
  extras: 'إضافات',
};

const categoryIcons: Record<string, LucideIcon> = {
  All: Coffee,
  coffee: Coffee,
  cold: Coffee, // You could use specific icons like IceCream if available
  dessert: Coffee,
  extras: Plus,
};

const Menu = () => {
  const navigate = useNavigate();
  const { products: items, addToCart, settings } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const categories = ['All', 'coffee', 'cold', 'dessert', 'extras'] as const;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-32">
      {/* Luxury Header */}
      <header className="glass-header px-6 pt-10 pb-6 rounded-b-[3rem] shadow-[0_10px_40px_rgba(42,24,16,0.03)] z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex justify-between items-center w-full md:w-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-[#2a1810] rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-xl p-0.5">
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-cover rounded-[1.4rem]" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#2a1810] leading-none mb-1">
                  {settings.storeName}
                </h1>
                <p className="text-[10px] text-[#c07446] font-bold uppercase tracking-[0.3em]">
              
                </p>
              </div>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2a1810] shadow-sm border border-[#2a1810]/5 transition-all hover:bg-[#2a1810] hover:text-white md:hidden"
            >
              <User size={22} strokeWidth={1.5} />
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#c07446]/50" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن مشروبك .." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/50 border border-[#2a1810]/5 rounded-3xl py-3 pr-12 pl-6 focus:ring-2 focus:ring-[#c07446]/20 transition-all font-medium text-[#2a1810] placeholder-[#2a1810]/30 shadow-inner text-sm"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="hidden md:flex w-12 h-12 bg-white rounded-2xl items-center justify-center text-[#2a1810] shadow-sm border border-[#2a1810]/5 transition-all hover:bg-[#2a1810] hover:text-white"
            >
              <User size={22} strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-start md:justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full whitespace-nowrap font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2
                  ${selectedCategory === cat 
                    ? 'bg-[#c07446] text-white shadow-lg shadow-[#c07446]/20' 
                    : 'bg-white text-[#2a1810]/40 border border-[#2a1810]/5 hover:bg-[#2a1810]/5'}`}
              >
                {cat === 'All' ? 'الكل' : categoryLabels[cat as Category]}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              key={item.id}
              className="luxury-card group overflow-hidden flex flex-col"
            >
              <div className="relative h-40 md:h-56 overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#fdfaf5]">
                    <Coffee className="w-12 h-12 text-[#c07446]/20" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xl px-3 py-1 rounded-full text-xs font-black text-[#2a1810] shadow-xl border border-white/50">
                  {item.price} <span className="text-[10px] opacity-60">ر.ع</span>
                </div>
              </div>
              
              <div className="p-4 md:p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1 md:mb-3">
                    <span className="w-1 h-1 rounded-full bg-[#c07446]" />
                    <span className="text-[8px] md:text-[10px] font-bold text-[#c07446] uppercase tracking-wider">
                      {categoryLabels[item.category]}
                    </span>
                  </div>
                  <h3 className="text-base md:text-xl font-serif font-bold text-[#2a1810] mb-0.5 md:mb-1 leading-tight group-hover:text-[#c07446] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[#2a1810]/30 text-[10px] md:text-xs font-medium tracking-tight mb-4 md:mb-6 line-clamp-1">
                    {item.nameEn}
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  className="btn-luxury w-full !py-2.5 !px-2 md:!py-4 text-xs md:text-sm"
                >
                  <Plus size={16} strokeWidth={3} className="md:w-5 md:h-5" />
                  <span>أضف للسلة</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 text-center px-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search className="w-10 h-10 text-[#c07446]/20" />
          </div>
          <h2 className="text-2xl font-serif text-[#2a1810] mb-2">عذراً، لم نجد ما تبحث عنه</h2>
          <p className="text-[#2a1810]/40 max-w-xs text-sm leading-relaxed">
            جرب البحث عن شيء آخر أو استكشف الأقسام المتوفرة
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
