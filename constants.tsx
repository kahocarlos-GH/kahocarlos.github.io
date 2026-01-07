
import React from 'react';
import { 
  BookOpen, 
  Pencil, 
  Dumbbell, 
  RotateCcw, 
  Star, 
  Settings 
} from 'lucide-react';
import { TaskCategory } from './types';

export const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  study: <BookOpen className="w-5 h-5" />,
  homework: <Pencil className="w-5 h-5" />,
  sports: <Dumbbell className="w-5 h-5" />,
  review: <RotateCcw className="w-5 h-5" />,
  special: <Star className="w-5 h-5" />,
  custom: <Settings className="w-5 h-5" />,
};

export const STAGES = [
  { minLevel: 1, name: '种子', img: '🌱' },
  { minLevel: 6, name: '幼苗', img: '🌿' },
  { minLevel: 11, name: '大树', img: '🌳' },
  { minLevel: 16, name: '果实', img: '🍎' },
  { minLevel: 21, name: '灵力进化', img: '✨' },
];
