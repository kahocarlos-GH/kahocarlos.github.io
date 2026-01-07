
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import BreedingGame from '../components/BreedingGame';
import FloatingFeedback from '../components/FloatingFeedback';
import { TaskCategory, Task, CATEGORY_LABELS } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, tasks, completeTask, updateUser, isTaskCompletedToday } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('study');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  
  // 用于顶部金币栏的跳动特效
  const coinControls = useAnimation();
  const xpControls = useAnimation();

  const todayDay = new Date().getDay();

  const handleComplete = async (task: Task, event: React.MouseEvent) => {
    if (isTaskCompletedToday(task.id)) return;
    
    const feedbackId = Date.now();
    const newFeedbacks = [
        ...feedbacks,
        { id: feedbackId + 1, type: 'points', value: task.points, x: event.clientX, y: event.clientY },
        { id: feedbackId + 2, type: 'xp', value: task.xp, x: event.clientX + 30, y: event.clientY - 20 }
    ];
    setFeedbacks(newFeedbacks);
    completeTask(task);

    // 延时触发顶部图标的跳动感
    setTimeout(() => {
        coinControls.start({
            scale: [1, 1.3, 1],
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.4 }
        });
    }, 700);

    setTimeout(() => {
        xpControls.start({
            scale: [1, 1.1, 1],
            transition: { duration: 0.3 }
        });
    }, 600);
  };

  const removeFeedback = (id: number) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const categoryTasks = tasks.filter(t => {
    const isCategory = t.category === activeCategory;
    const isScheduledToday = t.recurringDays.length === 0 || t.recurringDays.includes(todayDay);
    return isCategory && isScheduledToday;
  });

  const unfinishedTasks = categoryTasks.filter(t => !isTaskCompletedToday(t.id));
  const finishedTasks = categoryTasks.filter(t => isTaskCompletedToday(t.id));

  return (
    <div className="flex flex-col h-full bg-green-50 overflow-x-hidden">
      {/* Top Header - Animated Points Display */}
      <div className="p-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
            <motion.div 
                animate={xpControls}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 shadow-sm shrink-0 bg-green-50 flex items-center justify-center"
            >
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xl">🕵️</span>
                )}
            </motion.div>
            <div>
                <p className="text-[10px] text-gray-400 leading-none">特工代号</p>
                <p className="font-bold text-green-800 text-sm mt-1 truncate max-w-[120px]">{user.username || '匿名特工'}</p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <motion.div 
                animate={coinControls}
                className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 shadow-sm"
            >
                <span className="text-sm">🪙</span>
                <span className="text-sm font-black text-yellow-700">{user.points}</span>
            </motion.div>
            <p className="text-[9px] font-game text-green-600 mt-1">LV.{user.level} 特工</p>
        </div>
      </div>

      <div className="p-4 overflow-y-auto pb-24 flex-1 no-scrollbar">
        {/* Breeding Game Section */}
        <section className="mb-6">
            <BreedingGame 
                level={user.level} 
                xp={user.xp} 
                element={user.element} 
                onElementSelect={(el) => updateUser({ element: el })}
            />
        </section>

        {/* Task Categories Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all shadow-sm border-2 ${
                activeCategory === cat 
                ? 'bg-green-500 text-white border-green-400 scale-105 z-10 shadow-green-200' 
                : 'bg-white text-gray-400 border-gray-50'
              }`}
            >
              <div className={`mb-1 transition-transform ${activeCategory === cat ? 'scale-110' : ''}`}>
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-1">
                {cat === 'custom' && user.customCategoryName ? user.customCategoryName : CATEGORY_LABELS[cat]}
              </span>
            </button>
          ))}
        </div>

        {/* Task List - Unfinished */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest">今日行动</h2>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">{unfinishedTasks.length}</span>
          </div>
          
          <AnimatePresence mode="popLayout">
            {unfinishedTasks.length > 0 ? (
                unfinishedTasks.map(task => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ 
                            opacity: 0, 
                            scale: 0.8, 
                            x: 50,
                            transition: { duration: 0.3 }
                        }}
                        className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all"
                    >
                        <div className="flex-1 mr-4 min-w-0">
                            <h3 className="font-bold text-gray-800 text-base truncate">{task.title}</h3>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                            <div className="flex gap-3 mt-2">
                                <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50/50 px-2 py-0.5 rounded-lg">🪙 {task.points}</span>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-lg">✨ {task.xp}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => handleComplete(task, e)}
                            className="bg-green-500 text-white font-game px-5 py-2.5 rounded-2xl shadow-lg shadow-green-100 active:scale-90 transition-all text-sm shrink-0"
                        >
                            完成
                        </button>
                    </motion.div>
                ))
            ) : (
              unfinishedTasks.length === 0 && finishedTasks.length === 0 ? (
                <div className="text-center py-10 bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-[10px] font-bold">指挥官，今日暂无排期任务</p>
                </div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Task List - Finished */}
        {finishedTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 px-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">已达成的进化</h2>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {finishedTasks.map(task => (
                  <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-100/50 p-4 rounded-[1.5rem] border border-gray-100 flex items-center justify-between grayscale opacity-60"
                  >
                      <div className="flex-1 mr-4 min-w-0">
                          <h3 className="font-bold text-gray-500 text-sm line-through decoration-gray-300">{task.title}</h3>
                          <div className="flex gap-3 mt-2">
                              <span className="text-[9px] font-bold text-gray-400">🪙 {task.points} 已领</span>
                              <span className="text-[9px] font-bold text-gray-400">✨ {task.xp} 已得</span>
                          </div>
                      </div>
                      <div className="bg-green-100/50 p-2 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                  </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {feedbacks.map(f => (
        <FloatingFeedback key={f.id} {...f} onComplete={removeFeedback} />
      ))}
    </div>
  );
};

export default Dashboard;
