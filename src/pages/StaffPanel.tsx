import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, Truck, Phone, Car, CreditCard, Banknote, User, Package, LogOut, ArrowLeft } from 'lucide-react';
import type { OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  pending: { label: 'انتظار', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: Clock },
  preparing: { label: 'تجهيز', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Clock },
  ready: { label: 'جاهز', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: CheckCircle },
  delivered: { label: 'تم', color: 'text-zinc-400', bgColor: 'bg-zinc-50', icon: Truck },
};

export default function StaffPanel() {
  const navigate = useNavigate();
  const { updateOrderStatus, getActiveOrders, getCompletedOrders, settings, logout } = useStore();
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const activeOrders = getActiveOrders();
  const completedOrders = getCompletedOrders();
  const displayedOrders = filter === 'active' ? activeOrders : completedOrders;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'delivered';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case 'pending': return 'بدء التجهيز';
      case 'preparing': return 'تم التجهيز';
      case 'ready': return 'تم التسليم';
      default: return '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans" dir="rtl">
      {/* Luxury Header */}
      <header className="glass-header px-6 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2a1810] rounded-2xl overflow-hidden shadow-xl p-0.5">
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-[1.1rem]" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#2a1810]">لوحة الموظفين</h1>
              <p className="text-[10px] text-[#c07446] font-bold uppercase tracking-widest">{settings.storeName}</p>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-50"
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-[#2a1810]/5 flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-4 px-6 rounded-full font-bold text-sm transition-all relative overflow-hidden ${
              filter === 'active' 
                ? 'bg-[#2a1810] text-white shadow-xl shadow-[#2a1810]/10' 
                : 'text-[#2a1810]/40'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Package size={16} />
              <span>نشطة</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'active' ? 'bg-white/20' : 'bg-[#2a1810]/5'}`}>
                {activeOrders.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-4 px-6 rounded-full font-bold text-sm transition-all relative overflow-hidden ${
              filter === 'completed' 
                ? 'bg-[#2a1810] text-white shadow-xl shadow-[#2a1810]/10' 
                : 'text-[#2a1810]/40'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              <span>مكتملة</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'completed' ? 'bg-white/20' : 'bg-[#2a1810]/5'}`}>
                {completedOrders.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {displayedOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Package className="w-10 h-10 text-[#2a1810]/10" />
              </div>
              <h2 className="text-xl font-serif text-[#2a1810] opacity-30">لا توجد طلبات {filter === 'active' ? 'نشطة' : 'مكتملة'}</h2>
            </motion.div>
          ) : (
            displayedOrders.map((order, idx) => {
              const statusInfo = statusConfig[order.status as OrderStatus] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;
              const nextStatus = getNextStatus(order.status as OrderStatus);

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="luxury-card overflow-hidden"
                >
                  <div className="p-6 border-b border-[#2a1810]/5 flex items-center justify-between bg-[#fdfbf9]">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-serif font-black text-[#2a1810] tracking-tighter" dir="ltr">
                        #{(order as any).orderId || order.id.substring(0, 4)}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon size={12} strokeWidth={2.5} />
                        {statusInfo.label}
                      </div>
                    </div>
                    <div className="text-[#2a1810]/40 text-xs font-bold font-mono">
                      {new Date(order.createdAt).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-[#faf7f2]/50 p-3 rounded-2xl border border-[#2a1810]/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                              {item.product?.image ? (
                                <img src={item.product.image} alt="" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                              ) : (
                                <Package className="w-5 h-5 text-[#2a1810]/10" />
                              )}
                            </div>
                            <div>
                               <p className="font-bold text-[#2a1810] text-sm">{item.product?.name || item.name}</p>
                               <p className="text-[10px] text-[#c07446] font-bold">× {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold text-[#2a1810] text-sm">
                            {(item.product?.price || item.price || 0) * item.quantity} <span className="text-[10px] opacity-40">ر.ع</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="luxury-card !bg-white/50 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#c07446] uppercase tracking-widest">
                           <Phone size={12} />
                           رقم التواصل
                        </div>
                        <p className="font-bold text-[#2a1810] text-sm">{order.phone}</p>
                      </div>
                      <div className="luxury-card !bg-white/50 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#c07446] uppercase tracking-widest">
                           <Car size={12} />
                           بيانات السيارة
                        </div>
                        <p className="font-bold text-[#2a1810] text-sm uppercase">{order.carPlate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#faf7f2] rounded-2xl border border-[#2a1810]/5">
                      <div className="flex items-center gap-3">
                        {order.paymentMethod === 'cash' ? (
                          <Banknote size={16} className="text-emerald-500" />
                        ) : (
                          <CreditCard size={16} className="text-blue-500" />
                        )}
                        <span className="text-xs font-bold text-[#2a1810]">
                          {order.paymentMethod === 'cash' ? 'دفع كاش' : 'دفع إلكتروني'}
                        </span>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] text-[#2a1810]/40 font-bold uppercase tracking-widest block">الإجمالي</span>
                         <span className="text-xl font-serif font-black text-[#2a1810]">{order.total} <span className="text-xs opacity-40">ر.ع</span></span>
                      </div>
                    </div>

                    {nextStatus && filter === 'active' && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusChange(order.id, nextStatus)}
                        className="w-full btn-luxury py-5 text-base flex items-center justify-center gap-3"
                      >
                        <span>{getNextStatusLabel(order.status as OrderStatus)}</span>
                        <ArrowLeft size={18} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
