import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Coffee, ShoppingBag, ClipboardList, Home } from 'lucide-react';
import { motion } from 'motion/react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useStore();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    
    { icon: Coffee, label: 'المنيو', path: '/menu' },
    { icon: ShoppingBag, label: 'السلة', path: '/cart', badge: cartItemCount },
    { icon: ClipboardList, label: 'طلبك', path: '/confirmation' },
  ];

  // Don't show bottom nav on splash or management or checkout flow
  const hidePaths = ['/', '/admin', '/staff', '/login', '/cart', '/checkout'];
  if (hidePaths.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div className="w-full max-w-lg pointer-events-auto">
        <div className="bg-[#faf7f2]/80 backdrop-blur-2xl border-t border-[#2a1810]/5 px-6 pb-8 pt-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(42,24,16,0.1)] md:rounded-t-[2.5rem] md:border-x">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1.5 transition-all duration-300"
            >
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                ${isActive 
                  ? 'bg-[#2a1810] text-white shadow-xl shadow-[#2a1810]/20 scale-110 -translate-y-2' 
                  : 'text-[#2a1810]/30 hover:text-[#2a1810]'}`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c07446] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#faf7f2] shadow-lg">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-[#2a1810] opacity-100' : 'text-[#2a1810]/30 opacity-0'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-[#2a1810] rounded-full"
                />
              )}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
