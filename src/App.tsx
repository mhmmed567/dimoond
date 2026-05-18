import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Splash from './pages/Splash';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import StaffPanel from './pages/StaffPanel';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/RoleSelector';
import BottomNav from './components/BottomNav';

function App() {
  const { initSync, currentRole, userPhone } = useStore();

  useEffect(() => {
    const unsub = initSync();
    return () => unsub();
  }, [initSync]);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#faf7f2]">
        {/* Main App Container */}
        <div className="min-h-screen bg-transparent relative overflow-x-hidden pb-16 md:pb-0">
          <Routes>
            {/* Customer Flow */}
            <Route path="/" element={<Splash />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            
            {/* Staff & Admin Routes */}
            <Route 
              path="/staff" 
              element={userPhone && (currentRole === 'staff' || currentRole === 'admin') ? <StaffPanel /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={userPhone && currentRole === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} 
            />
            
            {/* Login Page */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
