import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, User, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'motion/react';

const Navbar = () => {
  const { cart, currentRole } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto">
      <NavLink 
        to="/menu" 
        className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-orange-600' : 'text-gray-500'}`}
      >
        <UtensilsCrossed size={24} />
        <span className="text-[10px] font-medium uppercase tracking-wider">Menu</span>
      </NavLink>

      <NavLink 
        to="/cart" 
        className={({ isActive }) => `flex flex-col items-center gap-1 relative ${isActive ? 'text-orange-600' : 'text-gray-500'}`}
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
          >
            {cartCount}
          </motion.span>
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider">Cart</span>
      </NavLink>

      {currentRole === 'staff' && (
        <NavLink 
          to="/staff" 
          className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-orange-600' : 'text-gray-500'}`}
        >
          <ClipboardList size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Staff</span>
        </NavLink>
      )}

      {currentRole === 'admin' && (
        <NavLink 
          to="/admin" 
          className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-orange-600' : 'text-gray-500'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Admin</span>
        </NavLink>
      )}

      <NavLink 
        to="/role" 
        className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-orange-600' : 'text-gray-500'}`}
      >
        <User size={24} />
        <span className="text-[10px] font-medium uppercase tracking-wider">Role</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
