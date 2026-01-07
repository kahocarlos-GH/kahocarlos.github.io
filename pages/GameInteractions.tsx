
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const GameInteractions: React.FC = () => {
  const { user, updateUser } = useAppContext();
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const skills = [
    { id: 1, name: '学习之光', icon: '💡', cost: 500, desc: '发散思维，加快作业速度' },
    { id: 2, name: '专注护盾', icon: '🛡️', cost: 800, desc: '隔绝一切电子产品干扰' },
    { id: 3, name: '晨练旋风', icon: '🌪️', cost: 1200, desc: '充满活力，提升体能' },
    { id: 4, name: '记忆宫殿', icon: '🏰', cost: 2000, desc: '大幅提升复习类任务产出' },
  ];

  const handleLearnSkill = (skill: typeof skills[0]) => {
    if (user.xp >= skill.cost) {
      // Logic for "spending" XP on skill
      updateUser({ xp: -skill.cost }); 
      setMsg({ text: `恭喜！成功习得 [${skill.name}]`, type: 'success' });
      setTimeout(() => setMsg(null), 3000);
    } else {
      setMsg({ text: `经验不足，还需要 ${skill.cost - user.xp} 点经验`, type: 'error' });
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <div className="h-full bg-purple-50 p-4 pb-24 overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-game text-purple-800">特工技能馆</h1>
        <div className="bg-white px-4 py-2 rounded-full border-2 border-purple-200 flex items-center gap-2 shadow-sm">
            <span className="text-xl">✨</span>
            <span className="font-bold text-purple-600">{user.xp} 经验</span>
        </div>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-16 left-4 right-4 p-4 rounded-2xl shadow-xl z-50 text-center font-bold text-white ${msg.type === 'success' ? 'bg-green-500' : 'bg-red-400'}`}
          >
            {msg.type === 'success' ? '🎖️ ' : '❌ '}{msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 mb-6 flex flex-col items-center">
        <div className="text-6xl mb-4 relative">
          <span>🐱</span>
          {user.element !== 'none' && (
             <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-[10px] border-2 border-white font-bold">
               {user.element === 'fire' ? '火' : user.element === 'water' ? '水' : user.element === 'wood' ? '木' : user.element === 'earth' ? '土' : '风'}
             </div>
          )}
        </div>
        <h2 className="text-lg font-bold text-purple-900">特工代号: {user.username}</h2>
        <p className="text-xs text-purple-400 mt-1">
          等级: Lv.{user.level} | 属性: {user.element === 'none' ? '未觉醒' : '灵力已觉醒'}
        </p>
      </div>

      <h3 className="font-bold text-purple-800 mb-4 px-2">可习得技能</h3>
      <div className="grid grid-cols-1 gap-4">
        {skills.map(skill => (
          <motion.div
            key={skill.id}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-4 rounded-2xl flex items-center border border-purple-100 shadow-sm"
          >
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mr-4 shrink-0">
              {skill.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-purple-900 truncate">{skill.name}</h4>
              <p className="text-[10px] text-gray-400 line-clamp-1">{skill.desc}</p>
              <div className="mt-2 text-xs font-bold text-purple-500">
                消耗: {skill.cost} XP
              </div>
            </div>
            <button 
              onClick={() => handleLearnSkill(skill)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-90 transition-all ${user.xp >= skill.cost ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
            >
              学习
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 bg-purple-900/5 p-6 rounded-3xl border-2 border-dashed border-purple-200">
        <p className="text-center text-sm text-purple-700 font-bold italic">“唯有专注，方能觉醒更强大的力量”</p>
      </div>
    </div>
  );
};

export default GameInteractions;
