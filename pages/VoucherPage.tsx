
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Ticket, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const VoucherPage: React.FC = () => {
  const { user, verifyVoucher } = useAppContext();
  const [verifyingVoucher, setVerifyingVoucher] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleVerify = () => {
    if (verifyingVoucher && verifyVoucher(verifyingVoucher, pinInput)) {
      setVerifyingVoucher(null);
      setPinInput('');
      setShowPin(false);
    } else {
      alert('家长管理密码错误！');
    }
  };

  return (
    <div className="h-full bg-orange-50 p-4 pb-24 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-game text-orange-800">特工口袋</h1>
        <div className="bg-white px-4 py-2 rounded-full border-2 border-orange-200 flex items-center gap-2 shadow-sm">
            <span className="text-xl">🎟️</span>
            <span className="font-bold text-orange-600">{(user.vouchers || []).filter(v => !v.isUsed).length} 张可用</span>
        </div>
      </div>

      {(user.vouchers || []).length > 0 ? (
        <div className="space-y-4">
          {user.vouchers.map(voucher => (
            <motion.div
              layout
              key={voucher.id}
              className={`relative bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all ${voucher.isUsed ? 'border-gray-200 opacity-60 grayscale' : 'border-orange-100 shadow-orange-100'}`}
            >
              <div className="flex h-32">
                <div className="w-1/3 h-full overflow-hidden">
                  <img src={voucher.image} alt={voucher.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-gray-800 text-lg leading-tight mb-1 truncate">{voucher.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold">获得时间: {voucher.redeemedAt}</p>
                  </div>
                  
                  {!voucher.isUsed ? (
                    <button
                      onClick={() => setVerifyingVoucher(voucher.id)}
                      className="self-start bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all"
                    >
                      请家长核销
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-green-500 font-bold text-xs italic">
                      <CheckCircle2 className="w-4 h-4" /> 奖励已兑现
                    </div>
                  )}
                </div>
                {/* 装饰性票据锯齿 */}
                <div className="absolute top-0 bottom-0 left-[33.33%] w-[1px] border-l-2 border-dashed border-gray-100"></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-6xl mb-4 opacity-30">🎟️</div>
          <p className="text-orange-400 font-bold">还没有获得任何兑换券</p>
          <p className="text-[10px] text-orange-300 mt-2">快去商城用金币兑换心仪的礼物吧！</p>
        </div>
      )}

      {/* Verification Modal */}
      <AnimatePresence>
        {verifyingVoucher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border-4 border-orange-200"
            >
              <button 
                onClick={() => {setVerifyingVoucher(null); setPinInput(''); setShowPin(false);}}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">家长核销确认</h3>
                <p className="text-xs text-gray-400 mb-6 font-bold leading-relaxed px-4">
                  特工正在兑换奖励：<br/>
                  <span className="text-orange-600 text-sm">“{user.vouchers.find(v => v.id === verifyingVoucher)?.title}”</span><br/>
                  请家长输入管理密码完成核销
                </p>
                
                <div className="relative w-full mb-6">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="管理密码"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:border-orange-400 focus:bg-orange-50 transition-all pr-12"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-200 hover:text-orange-400"
                  >
                    {showPin ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
                
                <button
                  onClick={handleVerify}
                  className="w-full bg-orange-600 text-white font-game text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  确认核销
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoucherPage;
