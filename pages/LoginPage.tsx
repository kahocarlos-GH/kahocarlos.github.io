
import React, { useState, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { User, Lock, MessageCircle, Phone, Loader2, X, Camera, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage: React.FC = () => {
  const { user, login, register } = useAppContext();
  const [username, setUsername] = useState(user.username || '');
  const [password, setPassword] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState<'manual' | 'wechat' | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>(user.username ? 'login' : 'register');
  
  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // WeChat Setup State
  const [showWeChatForm, setShowWeChatForm] = useState(false);
  const [wechatAvatar, setWechatAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=agent');
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const handleManualAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn('manual');

    setTimeout(() => {
      if (mode === 'login') {
        const success = login(username, password);
        if (!success) {
          alert('特工代号或登录密码错误！');
          setIsLoggingIn(null);
        }
      } else {
        if (!username || !password || !parentPin) {
          alert('请完整填写所有信息！');
          setIsLoggingIn(null);
          return;
        }
        register(username, password, parentPin);
      }
    }, 800);
  };

  const startWeChatAuth = () => {
    setIsLoggingIn('wechat');
    setTimeout(() => {
      setIsLoggingIn(null);
      setShowWeChatForm(true);
    }, 1200);
  };

  const handleWeChatComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && parentPin) {
      register(username, password, parentPin, wechatAvatar);
    } else {
      alert('请完整设置您的特工信息和家长密码！');
    }
  };

  const handleAvatarClick = () => avatarFileRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setWechatAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 pb-24 overflow-hidden relative">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-8 border-4 border-green-200 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
            <span className="text-3xl">🕵️‍♂️</span>
          </div>
          <h1 className="text-2xl font-game text-green-800">学习特工</h1>
          <div className="flex bg-slate-100 p-1 rounded-xl mt-4 w-full">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
            >
              特工登录
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
            >
              新兵入伍
            </button>
          </div>
        </div>

        {!showWeChatForm ? (
          <>
            <form onSubmit={handleManualAction} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-green-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="特工代号"
                  className="w-full pl-10 pr-4 py-3 bg-green-50 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-400 text-sm font-bold"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-green-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="登录密码"
                  className="w-full pl-10 pr-12 py-3 bg-green-50 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-400 text-sm font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-green-300 hover:text-green-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {mode === 'register' && (
                <div className="relative animate-in slide-in-from-top-2">
                  <ShieldCheck className="absolute left-3 top-3.5 text-blue-400 w-5 h-5" />
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="初始化家长管理密码"
                    className="w-full pl-10 pr-12 py-3 bg-blue-50 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-bold"
                    value={parentPin}
                    onChange={(e) => setParentPin(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3 text-blue-300 hover:text-blue-500"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <p className="text-[9px] text-blue-400 mt-1 ml-1 font-bold">* 该密码仅用于进入家长后台</p>
                </div>
              )}

              <button
                disabled={!!isLoggingIn}
                type="submit"
                className="w-full bg-green-500 text-white font-game text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-all mt-6"
              >
                {isLoggingIn === 'manual' ? <Loader2 className="animate-spin mx-auto" /> : mode === 'login' ? '开始行动' : '创建档案'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-green-100">
                <p className="text-center text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-widest">其他接入方式</p>
                <div className="flex justify-center items-center">
                    <button onClick={startWeChatAuth} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 border border-green-100 shadow-sm">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">微信一键授权</span>
                    </button>
                </div>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <h3 className="text-center font-bold text-slate-700 mb-4">补全特工档案</h3>
             <form onSubmit={handleWeChatComplete} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                    <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
                        <img src={wechatAvatar} className="w-16 h-16 rounded-full border-4 border-green-100 object-cover shadow-md" />
                        <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="text-white w-4 h-4" />
                        </div>
                        <input type="file" ref={avatarFileRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-2">点击更换头像</p>
                </div>
                <input
                  required
                  type="text"
                  placeholder="特工昵称"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-green-400 text-sm font-bold"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="设置登录密码"
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-green-400 text-sm font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-300 hover:text-slate-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="space-y-1 relative">
                  <input
                    required
                    type={showPin ? "text" : "password"}
                    placeholder="设置家长管理密码 (必填)"
                    className="w-full pl-4 pr-12 py-3 bg-blue-50 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-bold"
                    value={parentPin}
                    onChange={(e) => setParentPin(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3 text-blue-300 hover:text-blue-500"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <p className="text-[9px] text-blue-400 font-bold px-1">该密码用于访问指挥中心后台</p>
                </div>
                <div className="flex gap-2 mt-4">
                    <button type="button" onClick={() => setShowWeChatForm(false)} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl font-bold text-sm">返回</button>
                    <button type="submit" className="flex-[2] bg-green-500 text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95">提交档案</button>
                </div>
             </form>
          </motion.div>
        )}
      </div>

      <p className="fixed bottom-6 text-[10px] text-green-800/40 font-bold text-center w-full px-10">
        特工系统已就绪 | 请确保家长已知晓管理密码
      </p>
    </div>
  );
};

export default LoginPage;
