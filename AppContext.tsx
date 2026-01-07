
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserState, Task, Reward, TaskCategory, Voucher } from './types';

interface AppContextType {
  user: UserState;
  tasks: Task[];
  rewards: Reward[];
  login: (username: string, loginPassword: string) => boolean;
  register: (username: string, loginPassword: string, parentPin: string, avatarUrl?: string) => void;
  updateUser: (updates: Partial<UserState>) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  addReward: (reward: Reward) => void;
  removeReward: (id: string) => void;
  completeTask: (task: Task) => void;
  redeemReward: (reward: Reward) => boolean;
  verifyVoucher: (voucherId: string, pin: string) => boolean;
  logout: () => void;
  isTaskCompletedToday: (taskId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. 初始化用户信息（包含补全逻辑，防止旧版本数据因缺少字段报错）
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('agent_user');
    const defaultState: UserState = {
      isLoggedIn: false,
      username: '',
      loginPassword: '',
      parentPin: '',
      avatarUrl: '',
      points: 0,
      xp: 0,
      level: 1,
      element: 'none',
      dailyCompletions: {},
      vouchers: [],
    };
    if (!saved) return defaultState;
    try {
      const parsed = JSON.parse(saved);
      // 深度补全：确保旧用户也有新的字段
      return {
        ...defaultState,
        ...parsed,
        dailyCompletions: parsed.dailyCompletions || {},
        vouchers: parsed.vouchers || [],
      };
    } catch (e) {
      console.error("Failed to parse user data", e);
      return defaultState;
    }
  });

  // 2. 初始化任务库
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('agent_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. 初始化奖品库
  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('agent_rewards');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. 数据实时监听持久化
  useEffect(() => {
    localStorage.setItem('agent_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('agent_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('agent_rewards', JSON.stringify(rewards));
  }, [rewards]);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const isTaskCompletedToday = (taskId: string) => {
    const today = getTodayStr();
    return (user.dailyCompletions[today] || []).includes(taskId);
  };

  const login = (username: string, loginPassword: string) => {
    if (user.username === username && user.loginPassword === loginPassword) {
      setUser(prev => ({ ...prev, isLoggedIn: true }));
      return true;
    }
    return false;
  };

  const register = (username: string, loginPassword: string, parentPin: string, avatarUrl?: string) => {
    // 注册新用户时保留原有的任务和奖励库（如果已有）
    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      username,
      loginPassword,
      parentPin,
      avatarUrl: avatarUrl || prev.avatarUrl,
      // 如果是全新初始化，则清空记录，否则保留
      dailyCompletions: prev.dailyCompletions || {},
      vouchers: prev.vouchers || [],
      points: prev.points || 0,
      xp: prev.xp || 0,
      level: prev.level || 1,
    }));
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  const updateUser = (updates: Partial<UserState>) => {
    setUser(prev => {
        // 计算新的 XP
        let currentXp = prev.xp + (updates.xp !== undefined ? updates.xp : 0);
        let currentPoints = prev.points + (updates.points !== undefined ? updates.points : 0);
        
        // 等级进化逻辑补强
        let nextLevel = prev.level;
        while (currentXp >= 1000) {
            currentXp -= 1000;
            nextLevel += 1;
        }
        if (currentXp < 0) currentXp = 0;

        // 构建最终状态
        const newState = { 
            ...prev, 
            ...updates, 
            xp: currentXp, 
            level: nextLevel,
            points: currentPoints
        };
        return newState;
    });
  };

  const addTask = (task: Task) => setTasks(prev => [...prev, task]);
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const addReward = (reward: Reward) => setRewards(prev => [...prev, reward]);
  const removeReward = (id: string) => setRewards(prev => prev.filter(r => r.id !== id));

  const completeTask = (task: Task) => {
    if (isTaskCompletedToday(task.id)) return;
    const today = getTodayStr();
    
    // 同时更新用户信息和完成记录
    setUser(prev => {
      let nextXp = prev.xp + task.xp;
      let nextLevel = prev.level;
      while (nextXp >= 1000) {
        nextXp -= 1000;
        nextLevel += 1;
      }

      return {
        ...prev,
        points: prev.points + task.points,
        xp: nextXp,
        level: nextLevel,
        dailyCompletions: {
          ...prev.dailyCompletions,
          [today]: [...(prev.dailyCompletions[today] || []), task.id]
        }
      };
    });
  };

  const redeemReward = (reward: Reward) => {
    if (user.points >= reward.points) {
      const newVoucher: Voucher = {
        id: `v-${Date.now()}`,
        rewardId: reward.id,
        title: reward.title,
        image: reward.image,
        redeemedAt: new Date().toLocaleString(),
        isUsed: false,
      };
      
      setUser(prev => ({ 
        ...prev, 
        points: prev.points - reward.points,
        vouchers: [newVoucher, ...(prev.vouchers || [])]
      }));
      return true;
    }
    return false;
  };

  const verifyVoucher = (voucherId: string, pin: string) => {
    if (pin === user.parentPin) {
      setUser(prev => ({
        ...prev,
        vouchers: prev.vouchers.map(v => v.id === voucherId ? { ...v, isUsed: true } : v)
      }));
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{ 
        user, tasks, rewards, login, register, logout, updateUser, 
        addTask, removeTask, addReward, removeReward, completeTask, redeemReward,
        verifyVoucher, isTaskCompletedToday
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
