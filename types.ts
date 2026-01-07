
export type TaskCategory = 'study' | 'homework' | 'sports' | 'review' | 'special' | 'custom';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  points: number;
  xp: number;
  recurringDays: number[]; // 0-6 代表周日到周六，空数组代表单次任务
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  image: string;
}

export interface Voucher {
  id: string;
  rewardId: string;
  title: string;
  image: string;
  redeemedAt: string;
  isUsed: boolean;
}

export type ElementType = 'wind' | 'wood' | 'water' | 'fire' | 'earth' | 'none';

export interface UserState {
  isLoggedIn: boolean;
  username: string;
  loginPassword: string;
  parentPin: string;
  avatarUrl?: string;
  points: number;
  xp: number;
  level: number;
  element: ElementType;
  customCategoryName?: string;
  dailyCompletions: Record<string, string[]>;
  vouchers: Voucher[]; // 用户拥有的兑换券
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  study: '学习习惯',
  homework: '家庭作业',
  sports: '运动类',
  review: '复习类',
  special: '特殊任务',
  custom: '自定义',
};

export const LEVEL_THRESHOLD = 1000;
