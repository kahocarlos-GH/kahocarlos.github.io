
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const ShopPage: React.FC = () => {
  const { user, rewards, redeemReward } = useAppContext();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRedeem = (reward: any) => {
    if (redeemReward(reward)) {
      setSuccessMsg(`兑换成功！已放入“卡包”电子券。`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      alert('积分不足，快去完成任务赚取积分吧！');
    }
  };

  return (
    <div className="h-full bg-blue-50 p-4 pb-24 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-game text-blue-800">特工补给站</h1>
        <div className="bg-white px-4 py-2 rounded-full border-2 border-yellow-200 flex items-center gap-2 shadow-sm">
            <span className="text-xl">🪙</span>
            <span className="font-bold text-yellow-600 font-game">{user.points}</span>
        </div>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-24 left-6 right-6 bg-green-600 text-white p-4 rounded-3xl shadow-2xl z-50 text-center font-bold flex flex-col items-center gap-1 border-2 border-white"
          >
            <span className="text-2xl">🎉</span>
            <span>{successMsg}</span>
            <span className="text-[10px] opacity-80 mt-1 font-normal">请在底部导航点击“卡包”查看</span>
          </motion.div>
        )}
      </AnimatePresence>

      {rewards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {rewards.map(reward => (
            <motion.div
              key={reward.id}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border-2 border-white flex flex-col transition-all active:shadow-inner"
            >
              <div className="h-32 relative overflow-hidden">
                <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                   {reward.points} 🪙
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-black text-gray-800 text-sm mb-1 truncate">{reward.title}</h3>
                    <p className="text-[9px] text-gray-400 leading-tight mb-3 line-clamp-2">{reward.description}</p>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  className={`w-full py-2.5 rounded-2xl font-game text-sm shadow-sm transition-all ${
                    user.points >= reward.points 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-100'
                  }`}
                >
                  {user.points >= reward.points ? '立即兑换' : '积分不足'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 flex flex-col items-center">
          <div className="text-7xl mb-6 grayscale opacity-20">🎁</div>
          <p className="text-blue-300 font-bold mb-1">补给站暂时空仓</p>
          <p className="text-[10px] text-blue-200">去控制中心上架一些超酷的奖品吧！</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
