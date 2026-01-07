
import React, { useState, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { TaskCategory, CATEGORY_LABELS, Task, Reward } from '../types';
import { Plus, Trash2, Camera, ShieldCheck, X, ImagePlus, KeyRound, LogOut, Calendar, Eye, EyeOff } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

const AdminPage: React.FC = () => {
  const { user, tasks, rewards, addTask, removeTask, addReward, removeReward, updateUser, logout } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  
  // Visibility states
  const [showAuthPin, setShowAuthPin] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [showProfilePin, setShowProfilePin] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  // Task form state
  const [newTask, setNewTask] = useState<Partial<Task>>({
    category: 'study',
    points: 1,
    xp: 100,
    title: '',
    description: '',
    recurringDays: []
  });

  const DAYS_SHORT = ['日', '一', '二', '三', '四', '五', '六'];

  // Reward form state
  const [newReward, setNewReward] = useState<Partial<Reward>>({
    title: '',
    description: '',
    points: 10,
    image: 'https://picsum.photos/seed/gift/200/200'
  });

  const handleAuth = () => {
    if (pinInput === user.parentPin) {
      setIsAuthenticated(true);
    } else {
      alert('家长管理密码错误！');
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewReward(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateUser({ avatarUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleDayToggle = (day: number) => {
    setNewTask(prev => {
        const days = prev.recurringDays || [];
        if (days.includes(day)) {
            return { ...prev, recurringDays: days.filter(d => d !== day) };
        } else {
            return { ...prev, recurringDays: [...days, day].sort() };
        }
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.description) {
      addTask({
        id: Date.now().toString(),
        title: newTask.title!,
        description: newTask.description!,
        category: newTask.category as TaskCategory,
        points: newTask.points!,
        xp: newTask.xp!,
        recurringDays: newTask.recurringDays || []
      });
      setShowTaskForm(false);
      setNewTask({ category: 'study', points: 1, xp: 100, title: '', description: '', recurringDays: [] });
    }
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReward.title && newReward.description) {
      addReward({
        id: Date.now().toString(),
        title: newReward.title!,
        description: newReward.description!,
        points: newReward.points!,
        image: newReward.image!
      });
      setShowRewardForm(false);
      setNewReward({ title: '', description: '', points: 10, image: 'https://picsum.photos/seed/gift/200/200' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-50">
        <div className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-slate-200">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-blue-500" />
                </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-2 text-slate-800">指挥中心授权</h2>
            <p className="text-[10px] text-slate-400 text-center mb-6 px-4 uppercase font-bold tracking-widest leading-relaxed">请输入初始化时设置的<br/>家长管理密码</p>
            <div className="relative mb-4">
              <input
                  type={showAuthPin ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="家长密码"
                  className="w-full p-4 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue-300 text-center text-2xl tracking-widest font-mono pr-12"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  autoFocus
              />
              <button
                type="button"
                onClick={() => setShowAuthPin(!showAuthPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                {showAuthPin ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
            <button
                onClick={handleAuth}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md"
            >
                验证授权
            </button>
            <button 
              onClick={logout}
              className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-3 h-3" /> 退出当前账号
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 p-4 pb-24 no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-game text-slate-800">特工指挥中心</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          锁定后台
        </button>
      </div>

      {/* Identity Management Plate */}
      <section className="bg-white rounded-[2rem] p-5 mb-8 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            👤 特工档案管理
        </h2>
        <div className="flex items-center gap-5 mb-4 pb-4 border-b border-slate-50">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                    {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" />}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-lg border-2 border-white shadow-sm">
                    <Camera className="w-2.5 h-2.5" />
                </div>
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpdate} />
            </div>
            <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-400 mb-1 block uppercase tracking-wider">特工代号 (昵称)</label>
                <input 
                    type="text" 
                    value={user.username} 
                    onChange={(e) => updateUser({ username: e.target.value })}
                    className="w-full p-2 bg-slate-50 border-b-2 border-transparent focus:border-green-300 outline-none text-sm font-bold text-slate-700 transition-colors"
                />
            </div>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="text-[9px] font-bold text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  <KeyRound className="w-2.5 h-2.5" /> 修改特工登录密码
                </label>
                <div className="relative">
                    <input 
                        type={showProfilePassword ? "text" : "password"} 
                        value={user.loginPassword} 
                        onChange={(e) => updateUser({ loginPassword: e.target.value })}
                        className="w-full p-2.5 pr-10 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-green-300 outline-none text-xs font-bold text-slate-700"
                        placeholder="重设登录密码"
                    />
                    <button
                        type="button"
                        onClick={() => setShowProfilePassword(!showProfilePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                        {showProfilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            <div>
                <label className="text-[9px] font-bold text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> 修改家长管理密码
                </label>
                <div className="relative">
                    <input 
                        type={showProfilePin ? "text" : "password"} 
                        value={user.parentPin} 
                        onChange={(e) => updateUser({ parentPin: e.target.value })}
                        className="w-full p-2.5 pr-10 bg-blue-50/50 border-2 border-blue-50 rounded-xl focus:border-blue-300 outline-none text-xs font-bold text-slate-700"
                        placeholder="重设家长密码"
                    />
                    <button
                        type="button"
                        onClick={() => setShowProfilePin(!showProfilePin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500"
                    >
                        {showProfilePin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                📋 任务库
            </h2>
            <button onClick={() => setShowTaskForm(true)} className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95">
                <Plus className="w-4 h-4" /> 添加任务
            </button>
        </div>

        <div className="grid grid-cols-1 gap-3 px-1">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold shrink-0">
                      {task.category === 'custom' && user.customCategoryName ? user.customCategoryName : CATEGORY_LABELS[task.category]}
                    </span>
                    <h3 className="font-bold text-slate-800 truncate text-sm">{task.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.recurringDays.length > 0 ? (
                        task.recurringDays.map(d => (
                            <span key={d} className="text-[8px] bg-slate-50 text-slate-400 border border-slate-100 px-1 rounded">周{DAYS_SHORT[d]}</span>
                        ))
                    ) : (
                        <span className="text-[8px] bg-blue-50 text-blue-400 border border-blue-100 px-1 rounded">单次任务</span>
                    )}
                </div>
                <div className="mt-2 flex gap-3">
                    <span className="text-[9px] font-bold text-yellow-600">🪙 {task.points}</span>
                    <span className="text-[9px] font-bold text-blue-600">✨ {task.xp}</span>
                </div>
              </div>
              <button onClick={() => removeTask(task.id)} className="text-red-300 hover:text-red-500 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Rewards Grid */}
      <section className="px-1">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                🎁 奖励库
            </h2>
            <button onClick={() => setShowRewardForm(true)} className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95">
                <Plus className="w-4 h-4" /> 新增奖品
            </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {rewards.map(reward => (
                <div key={reward.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col relative group">
                    <img src={reward.image} alt={reward.title} className="w-full h-24 object-cover" />
                    <button onClick={() => removeReward(reward.id)} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-400 hover:text-red-600 shadow-md">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-2.5 flex-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate mb-1">{reward.title}</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{reward.points} 🪙</span>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* New Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
                    <h3 className="text-xl font-game text-slate-800">发布新任务</h3>
                    <button onClick={() => setShowTaskForm(false)} className="text-slate-400 p-2"><X /></button>
                </div>
                <form onSubmit={handleAddTask} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 mb-3 block uppercase tracking-widest px-1">任务大类</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setNewTask({...newTask, category: cat})}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${newTask.category === cat ? 'border-green-500 bg-green-50 text-green-700 shadow-md scale-105 z-10' : 'border-slate-50 bg-slate-50/50 text-slate-300 hover:border-slate-200'}`}
                                >
                                    <div className="mb-1.5">{CATEGORY_ICONS[cat]}</div>
                                    <span className="text-[9px] font-bold text-center leading-tight truncate w-full px-1">
                                      {cat === 'custom' && user.customCategoryName ? user.customCategoryName : CATEGORY_LABELS[cat]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Picker */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 mb-3 block uppercase tracking-widest px-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> 重复排期 (不选则为单次)
                        </label>
                        <div className="flex justify-between gap-1">
                            {[1, 2, 3, 4, 5, 6, 0].map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayToggle(day)}
                                    className={`w-9 h-9 rounded-xl text-[10px] font-bold transition-all border-2 ${
                                        newTask.recurringDays?.includes(day)
                                        ? 'bg-blue-500 text-white border-blue-400'
                                        : 'bg-slate-50 text-slate-400 border-slate-50'
                                    }`}
                                >
                                    {DAYS_SHORT[day]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {newTask.category === 'custom' && (
                        <div className="animate-in slide-in-from-top-2">
                             <input
                                type="text"
                                value={user.customCategoryName || ''}
                                onChange={(e) => updateUser({ customCategoryName: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-green-300 text-sm font-bold"
                                placeholder="输入自定义名称..."
                             />
                        </div>
                    )}
                    <div className="space-y-4">
                        <input
                            required
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-green-300 text-sm font-bold"
                            placeholder="任务标题"
                        />
                        <textarea
                            required
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-green-300 h-24 resize-none text-sm"
                            placeholder="任务详细说明..."
                        />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                              <span className="text-[10px] font-bold text-slate-400">金币奖励</span>
                              <span className="text-[10px] font-bold text-yellow-600">{newTask.points} 🪙</span>
                            </div>
                            <input
                                type="range" min="1" max="50" step="1"
                                value={newTask.points}
                                onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                              <span className="text-[10px] font-bold text-slate-400">成长经验</span>
                              <span className="text-[10px] font-bold text-blue-600">{newTask.xp} ✨</span>
                            </div>
                            <input
                                type="range" min="100" max="1000" step="50"
                                value={newTask.xp}
                                onChange={(e) => setNewTask({...newTask, xp: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-400"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-green-500 text-white font-game text-xl py-4 rounded-2xl shadow-xl active:scale-95 transition-all">
                        确认发布任务
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* New Reward Modal */}
      {showRewardForm && (
        <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
                    <h3 className="text-xl font-game text-blue-800">上架新奖品</h3>
                    <button onClick={() => setShowRewardForm(false)} className="text-slate-400 p-2"><X /></button>
                </div>
                <form onSubmit={handleAddReward} className="space-y-5">
                    <div className="flex flex-col items-center">
                        <div 
                          className="relative group cursor-pointer w-44 h-32 overflow-hidden rounded-2xl border-4 border-slate-50 shadow-md bg-slate-50 flex flex-col items-center justify-center"
                          onClick={handleImageClick}
                        >
                            {newReward.image ? (
                                <img src={newReward.image} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-300 flex flex-col items-center">
                                  <Camera className="w-8 h-8 mb-1" />
                                  <span className="text-[10px] font-bold">上传实物照</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ImagePlus className="text-white w-6 h-6" />
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-4">
                        <input
                            required
                            type="text"
                            value={newReward.title}
                            onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-300 text-sm font-bold"
                            placeholder="奖品名称"
                        />
                        <input
                            required
                            type="number"
                            value={newReward.points}
                            onChange={(e) => setNewReward({...newReward, points: parseInt(e.target.value)})}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-300 text-sm font-bold"
                            placeholder="兑换所需金币"
                        />
                        <textarea
                            required
                            value={newReward.description}
                            onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-300 h-20 resize-none text-sm"
                            placeholder="奖品详细说明..."
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-game text-xl py-4 rounded-2xl shadow-xl active:scale-95 transition-all">
                        确认上架奖品
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
