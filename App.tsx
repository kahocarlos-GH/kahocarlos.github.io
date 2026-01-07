
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import ShopPage from './pages/ShopPage';
import VoucherPage from './pages/VoucherPage';
import GameInteractions from './pages/GameInteractions';
import { LayoutGrid, ShoppingBag, Gamepad2, Settings as SettingsIcon, Ticket, Wifi, BatteryFull, Signal } from 'lucide-react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 flex justify-between items-center text-[10px] font-bold text-gray-700 z-[100] border-b border-gray-100">
      <div className="flex items-center gap-1">
        <span>{formatTime(time)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <div className="flex items-center gap-0.5">
          <span className="text-[8px]">100%</span>
          <BatteryFull className="w-3 h-3 text-green-500" />
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { user } = useAppContext();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'shop' | 'game' | 'vouchers' | 'admin'>('dashboard');

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto h-screen bg-gray-50 flex flex-col relative overflow-hidden shadow-2xl">
        <StatusBar />
        <div className="flex-1 overflow-y-auto">
          <LoginPage />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <Dashboard />;
      case 'shop': return <ShopPage />;
      case 'game': return <GameInteractions />;
      case 'vouchers': return <VoucherPage />;
      case 'admin': return <AdminPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-50 flex flex-col relative overflow-hidden shadow-2xl">
      <StatusBar />
      
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation (WeChat Mini Program style) */}
      <nav className="bg-white border-t border-gray-100 flex justify-around py-2 px-2 safe-area-bottom z-[90]">
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'dashboard' ? 'text-green-500 scale-110' : 'text-gray-400'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-black">任务</span>
        </button>
        <button 
          onClick={() => setCurrentTab('game')}
          className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'game' ? 'text-purple-500 scale-110' : 'text-gray-400'}`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-black">馆</span>
        </button>
        <button 
          onClick={() => setCurrentTab('shop')}
          className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'shop' ? 'text-yellow-500 scale-110' : 'text-gray-400'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-black">商城</span>
        </button>
        <button 
          onClick={() => setCurrentTab('vouchers')}
          className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'vouchers' ? 'text-orange-500 scale-110' : 'text-gray-400'}`}
        >
          <div className="relative">
            <Ticket className="w-5 h-5" />
            {user.vouchers?.some(v => !v.isUsed) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </div>
          <span className="text-[9px] mt-1 font-black">卡包</span>
        </button>
        <button 
          onClick={() => setCurrentTab('admin')}
          className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'admin' ? 'text-slate-800 scale-110' : 'text-gray-400'}`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-black">控制</span>
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
