import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Product, Category, User as UserType } from '../types';
import { 
  Settings, Package, ShoppingBag, BarChart3, Plus, Edit2, Trash2, 
  X, Save, DollarSign, CreditCard, Banknote, User, Users, LogOut,
  ArrowRight, Search, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categoryLabels: Record<Category, string> = {
  coffee: 'قهوة',
  cold: 'مشروبات باردة',
  dessert: 'حلويات',
  extras: 'إضافات',
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reports' | 'staff' | 'settings'>('products');
  const { products, addProduct, updateProduct, deleteProduct, orders, settings, updateSettings, staff, addStaff, deleteStaff, logout } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameEn: '',
    price: 0,
    category: 'coffee' as Category,
    image: '',
    description: '',
    available: true
  });

  const [newStaff, setNewStaff] = useState({ phone: '', password: '', name: '' });
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const [tempSettings, setTempSettings] = useState(settings);

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const cashOrders = orders.filter((o) => o.paymentMethod === 'cash');
  const visaOrders = orders.filter((o) => o.paymentMethod === 'visa');
  const cashTotal = cashOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const visaTotal = visaOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, editingProduct);
        setEditingProduct(null);
      } else if (newProduct.name && newProduct.price > 0) {
        await addProduct(newProduct as any);
        setNewProduct({ name: '', nameEn: '', price: 0, category: 'coffee', image: '', description: '', available: true });
        setIsAddingProduct(false);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await deleteProduct(id);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.phone || !newStaff.password) return;
    await addStaff({ ...newStaff, role: 'staff' });
    setNewStaff({ phone: '', password: '', name: '' });
    setIsAddingStaff(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-32 font-sans" dir="rtl">
      {/* Luxury Header */}
      <header className="glass-header px-6 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => navigate('/')}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2a1810] shadow-sm border border-[#2a1810]/5"
            >
              <User size={20} className="text-[#c07446]" />
            </motion.button>
            <div className="w-12 h-12 bg-[#2a1810] rounded-2xl overflow-hidden shadow-xl p-0.5">
              <img src={settings.logoUrl} alt={settings.storeName} className="w-full h-full object-cover rounded-[1.1rem]" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#2a1810]">الإدارة المركزية</h1>
              <p className="text-[10px] text-[#c07446] font-bold uppercase tracking-widest">Admin Control Center</p>
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

      {/* Luxury Navigation */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-[#2a1810]/5 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'products', label: 'المنتجات', icon: Package },
            { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
            { id: 'staff', label: 'الموظفين', icon: Users },
            { id: 'reports', label: 'التقارير', icon: BarChart3 },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[110px] py-4 px-6 rounded-full font-bold text-sm transition-all relative flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-[#2a1810] text-white shadow-xl shadow-[#2a1810]/10' 
                  : 'text-[#2a1810]/40 hover:bg-[#2a1810]/5'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabAdmin"
                  className="absolute inset-0 bg-[#2a1810] rounded-full -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        {activeTab === 'staff' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <button
              onClick={() => setIsAddingStaff(true)}
              className="btn-luxury flex items-center justify-center gap-3 py-5 px-8 w-full shadow-2xl"
            >
              <Plus size={20} />
              <span>إضافة موظف للمقهى</span>
            </button>

            {isAddingStaff && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="luxury-card p-8 space-y-6 bg-white overflow-hidden shadow-2xl border-none"
              >
                <div className="flex items-center justify-between border-b border-[#2a1810]/5 pb-4">
                  <div className="flex items-center gap-3">
                     <Users size={20} className="text-[#c07446]" />
                     <h3 className="font-serif font-bold text-[#2a1810] text-xl">بيانات الموظف الجديد</h3>
                  </div>
                  <button onClick={() => setIsAddingStaff(false)}>
                    <X size={20} className="text-[#2a1810]/40" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">الاسم الكامل</label>
                    <input
                      type="text"
                      placeholder="محمد علي"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">رقم الهاتف</label>
                    <input
                      type="text"
                      placeholder="05xxxxxxx"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-mono font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">كلمة المرور</label>
                    <input
                      type="password"
                      placeholder="********"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddStaff}
                  className="w-full btn-luxury bg-[#c07446] !border-[#c07446] hover:bg-white hover:text-[#c07446] py-5 text-base flex items-center justify-center gap-3"
                >
                  <Save size={20} />
                  <span>تأكيد الإضافة</span>
                </button>
              </motion.div>
            )}

            <div className="luxury-card overflow-hidden bg-white border border-[#2a1810]/5">
              <div className="p-6 bg-[#fdfbf9] border-b border-[#2a1810]/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Users className="w-5 h-5 text-[#c07446]" />
                   <span className="font-serif font-black text-[#2a1810]">فريق العمل الحالي</span>
                </div>
                <span className="px-3 py-1 bg-[#2a1810]/5 rounded-full text-[10px] font-bold">{staff.length} موظف</span>
              </div>
              <div className="divide-y divide-[#2a1810]/5">
                {staff.map((s) => (
                  <div key={s.id} className="p-6 flex items-center justify-between group hover:bg-[#faf7f2] transition-all">
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-12 h-12 rounded-2xl bg-[#2a1810]/5 flex items-center justify-center text-[#2a1810] font-serif font-bold text-lg">
                        {s.name?.[0] || 'M'}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2a1810] text-base">{s.name || 'موظف'}</h4>
                        <p className="text-[11px] font-mono font-bold text-[#c07446]">{s.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => confirm('هل أنت متأكد من حذف هذا الموظف؟') && deleteStaff(s.id!)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {staff.length === 0 && (
                  <div className="p-20 text-center text-[#2a1810]/20 font-serif font-black uppercase tracking-widest text-lg">
                     لا يوجد موظفين مسجلين
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="relative flex-1 w-full md:max-w-md">
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2a1810]/30 w-5 h-5" />
                 <input 
                   type="text" 
                   placeholder="البحث عن منتج..." 
                   className="w-full bg-white border border-[#2a1810]/5 rounded-2xl py-4 pr-12 pl-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#c07446]/20 transition-all outline-none text-right"
                 />
               </div>
               <button
                 onClick={() => setIsAddingProduct(true)}
                 className="btn-luxury flex items-center justify-center gap-2 py-4 px-8 w-full md:w-auto"
               >
                 <Plus className="w-5 h-5" />
                 إضافة منتج
               </button>
            </div>

            <AnimatePresence>
              {(isAddingProduct || editingProduct) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="luxury-card p-8 bg-white border-none shadow-2xl space-y-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[#2a1810]/5 pb-4">
                    <h3 className="font-serif font-bold text-[#2a1810] text-xl">
                      {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج فاخر جديد'}
                    </h3>
                    <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}>
                      <X className="w-5 h-5 text-[#2a1810]/40" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">الاسم بالعربي</label>
                       <input
                         type="text"
                         value={editingProduct ? editingProduct.name : newProduct.name}
                         onChange={(e) => editingProduct 
                           ? setEditingProduct({ ...editingProduct, name: e.target.value })
                           : setNewProduct({ ...newProduct, name: e.target.value })
                         }
                         className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">الاسم بالانجليزي</label>
                       <input
                         type="text"
                         value={editingProduct ? editingProduct.nameEn : newProduct.nameEn}
                         onChange={(e) => editingProduct 
                           ? setEditingProduct({ ...editingProduct, nameEn: e.target.value })
                           : setNewProduct({ ...newProduct, nameEn: e.target.value })
                         }
                         className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none font-mono"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">السعر</label>
                       <input
                         type="number"
                         value={editingProduct ? editingProduct.price : (newProduct.price || '')}
                         onChange={(e) => editingProduct 
                           ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                           : setNewProduct({ ...newProduct, price: Number(e.target.value) })
                         }
                         className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-serif font-black outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">التصنيف</label>
                       <select
                         value={editingProduct ? editingProduct.category : newProduct.category}
                         onChange={(e) => editingProduct 
                           ? setEditingProduct({ ...editingProduct, category: e.target.value as Category })
                           : setNewProduct({ ...newProduct, category: e.target.value as Category })
                         }
                         className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none appearance-none"
                       >
                         {Object.entries(categoryLabels).map(([key, label]) => (
                           <option key={key} value={key}>{label}</option>
                         ))}
                       </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">رابط الصورة</label>
                       <input
                         type="text"
                         value={editingProduct ? editingProduct.image : newProduct.image}
                         onChange={(e) => editingProduct 
                           ? setEditingProduct({ ...editingProduct, image: e.target.value })
                           : setNewProduct({ ...newProduct, image: e.target.value })
                         }
                         className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none"
                       />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="block text-[10px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">الوصف (اختياري)</label>
                       <textarea
                         value={editingProduct ? (editingProduct.description || '') : (newProduct as any).description || ''}
                         onChange={(e) => editingProduct 
                           ? setEditingProduct({ ...editingProduct, description: e.target.value })
                           : setNewProduct({ ...newProduct, description: e.target.value } as any)
                         }
                         rows={2}
                         className="w-full p-4 bg-[#faf7f2] border border-[#2a1810]/5 rounded-2xl focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-medium outline-none resize-none"
                         placeholder="أضف وصفاً فاخراً للمنتج..."
                       />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProduct}
                    className="w-full btn-luxury bg-[#c07446] !border-[#c07446] hover:bg-white hover:text-[#c07446] py-5 text-base flex items-center justify-center gap-3"
                  >
                    <Save size={20} />
                    <span>{editingProduct ? 'حفظ التغييرات' : 'تأكيد الإضافة'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="luxury-card overflow-hidden bg-white border border-[#2a1810]/5 flex flex-col group h-full shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#faf7f2]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                       <button
                         onClick={() => {
                           setEditingProduct(product);
                         }}
                         className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-[#2a1810] shadow-lg hover:bg-[#2a1810] hover:text-white transition-all transform hover:scale-110"
                       >
                         <Edit2 size={16} strokeWidth={2.5} />
                       </button>
                       <button
                         onClick={() => confirm('هل تريد حذف هذا المنتج؟') && deleteProduct(product.id)}
                         className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                       >
                         <Trash2 size={16} strokeWidth={2.5} />
                       </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl ${product.available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                         {product.available ? 'متوفر' : 'نفذ'}
                       </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-4 text-right">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c07446] mb-1">{categoryLabels[product.category]}</p>
                        <h3 className="font-serif font-bold text-[#2a1810] text-xl leading-tight group-hover:text-[#c07446] transition-colors">{product.name}</h3>
                        <p className="text-[10px] text-[#2a1810]/40 font-bold uppercase tracking-widest font-mono">{product.nameEn}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-serif font-black text-[#2a1810] text-2xl tracking-tighter">{product.price}</p>
                        <p className="text-[10px] font-bold text-[#2a1810]/40 uppercase">ر.ع</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#2a1810]/60 line-clamp-2 leading-relaxed font-medium">
                      {product.description || 'وصف فاخر لهذا المنتج المميز من ديموند كوفي.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {orders.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border border-[#2a1810]/5 luxury-card">
                <div className="w-24 h-24 bg-[#faf7f2] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-[#2a1810]/10" />
                </div>
                <h3 className="text-xl font-serif text-[#2a1810] opacity-30">قائمة الطلبات فارغة</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <motion.div 
                    layout
                    key={order.id} 
                    className="luxury-card overflow-hidden bg-white border border-[#2a1810]/5 flex flex-col"
                  >
                    <div className="p-6 bg-[#fdfbf9] border-b border-[#2a1810]/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-serif font-black text-[#2a1810]">#{order.orderId || order.id.slice(-4)}</span>
                        <div className="px-3 py-1 bg-[#c07446]/10 text-[#c07446] rounded-full text-[10px] font-black uppercase tracking-widest">
                           {order.status === 'delivered' ? 'مكتمل' : 'قيد المعالجة'}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-[#2a1810]/40 font-bold uppercase tracking-widest block mb-0.5">التاريخ</p>
                        <p className="text-xs font-bold text-[#2a1810] font-mono">
                          {new Date(order.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-1">
                      <div className="space-y-3">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-[#faf7f2]/50 p-3 rounded-xl border border-[#2a1810]/5">
                            <span className="text-sm font-bold text-[#2a1810] text-right">{item.name} <span className="text-[#c07446]">× {item.quantity}</span></span>
                            <span className="text-sm font-serif font-black text-[#2a1810]">{item.price * item.quantity} <span className="text-[10px] opacity-40">ر.ع</span></span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a1810]/5">
                         <div className="space-y-1">
                           <p className="text-[9px] text-[#2a1810]/30 font-bold uppercase tracking-widest text-right">العميل</p>
                           <p className="text-xs font-bold text-[#2a1810] text-right">{order.phone}</p>
                         </div>
                         <div className="space-y-1">
                           <p className="text-[9px] text-[#2a1810]/30 font-bold uppercase tracking-widest text-right">لوحة السيارة</p>
                           <p className="text-xs font-bold text-[#2a1810] text-right uppercase">{order.carPlate}</p>
                         </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[#faf7f2]/50 border-t border-[#2a1810]/5 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          {order.paymentMethod === 'cash' ? <Banknote size={14} className="text-emerald-500" /> : <CreditCard size={14} className="text-blue-500" />}
                          <span className="text-[10px] font-bold text-[#2a1810] uppercase tracking-widest">{order.paymentMethod === 'cash' ? 'دفع نقدي' : 'دفع إلكتروني'}</span>
                       </div>
                       <div className="text-left">
                          <p className="text-[9px] text-[#2a1810]/30 font-bold uppercase tracking-widest">إجمالي المبلغ</p>
                          <p className="text-xl font-serif font-black text-[#2a1810]">{order.total} <span className="text-xs opacity-40">ر.ع</span></p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-right"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="luxury-card p-8 bg-gradient-to-br from-[#c07446] to-[#8b4e2e] text-white">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                   <DollarSign className="w-6 h-6" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">إجمالي المبيعات</p>
                <p className="text-3xl font-serif font-black">{totalSales} <span className="text-sm opacity-60">ر.س</span></p>
              </div>
              
              <div className="luxury-card p-8 bg-white border border-[#2a1810]/5">
                <div className="w-12 h-12 bg-[#2a1810]/5 rounded-2xl flex items-center justify-center mb-4 text-[#2a1810]">
                   <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#2a1810]/40 mb-1">عدد الطلبات</p>
                <p className="text-3xl font-serif font-black text-[#2a1810]">{totalOrders}</p>
              </div>

              <div className="luxury-card p-8 bg-white border border-[#2a1810]/5">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                   <Banknote className="w-6 h-6" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600/40 mb-1">مبيعات الكاش</p>
                <p className="text-3xl font-serif font-black text-[#2a1810]">{cashTotal} <span className="text-sm opacity-60">ر.س</span></p>
              </div>

              <div className="luxury-card p-8 bg-white border border-[#2a1810]/5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                   <CreditCard className="w-6 h-6" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-600/40 mb-1">مبيعات الفيزا</p>
                <p className="text-3xl font-serif font-black text-[#2a1810]">{visaTotal} <span className="text-sm opacity-60">ر.س</span></p>
              </div>
            </div>

            <div className="luxury-card p-8 bg-white border border-[#2a1810]/5">
              <div className="flex items-center gap-3 mb-8">
                 <Activity className="w-5 h-5 text-[#c07446]" />
                 <h3 className="font-serif font-bold text-[#2a1810] text-xl">تحليل طرق الدفع</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                   <div className="flex-1">
                      <div className="flex justify-between mb-2">
                         <span className="text-sm font-bold text-[#2a1810]">كاش</span>
                         <span className="text-sm text-[#2a1810]/40">{Math.round((cashTotal / (totalSales || 1)) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-[#faf7f2] rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(cashTotal / (totalSales || 1)) * 100}%` }}
                           className="h-full bg-emerald-500" 
                         />
                      </div>
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between mb-2">
                         <span className="text-sm font-bold text-[#2a1810]">إلكتروني</span>
                         <span className="text-sm text-[#2a1810]/40">{Math.round((visaTotal / (totalSales || 1)) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-[#faf7f2] rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(visaTotal / (totalSales || 1)) * 100}%` }}
                           className="h-full bg-blue-500" 
                         />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="luxury-card p-10 bg-white border-none shadow-2xl space-y-10">
              <div className="flex items-center gap-4 border-b border-[#2a1810]/5 pb-6">
                 <div className="w-14 h-14 bg-[#faf7f2] rounded-2xl flex items-center justify-center text-[#c07446]">
                    <Settings size={28} />
                 </div>
                 <div className="text-right">
                    <h3 className="font-serif font-bold text-[#2a1810] text-2xl">إعدادات العلامة التجارية</h3>
                    <p className="text-[10px] text-[#2a1810]/40 font-bold uppercase tracking-widest">Brand Configuration</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">اسم المجر أو المقهى</label>
                  <input
                    type="text"
                    value={tempSettings.storeName}
                    onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                    className="w-full p-5 bg-[#faf7f2] border border-[#2a1810]/5 rounded-[2rem] focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold text-lg outline-none"
                    placeholder="Diamond Coffee"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-[#c07446] uppercase tracking-[0.2em] px-2 text-right">رابط شعار العلامة (Logo URL)</label>
                  <input
                    type="text"
                    value={tempSettings.logoUrl}
                    onChange={(e) => setTempSettings({ ...tempSettings, logoUrl: e.target.value })}
                    className="w-full p-5 bg-[#faf7f2] border border-[#2a1810]/5 rounded-[2rem] focus:ring-2 focus:ring-[#c07446]/20 transition-all text-right font-bold outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-[#2a1810]/5">
                 <div className="flex items-center gap-4 bg-[#faf7f2] p-8 rounded-3xl border border-[#2a1810]/5">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shadow-xl p-0.5">
                       <img 
                         src={tempSettings.logoUrl} 
                         alt="Preview" 
                         className="w-full h-full object-cover rounded-[1.1rem]" 
                         onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')}
                       />
                    </div>
                    <div className="text-right">
                       <p className="font-serif font-bold text-[#2a1810] text-xl mb-1">{tempSettings.storeName}</p>
                       <span className="px-3 py-1 bg-[#2a1810]/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#c07446]">معاينة الشعار الحالي</span>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-6">
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={async () => {
                     await updateSettings(tempSettings);
                     alert('تم حفظ الإعدادات بنجاح');
                   }}
                   className="btn-luxury py-5 px-12 text-base flex items-center justify-center gap-3 w-full md:w-auto shadow-2xl"
                 >
                   <Save size={20} />
                   <span>حفظ كافة الإعدادات</span>
                 </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
