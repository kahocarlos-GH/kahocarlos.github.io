
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES } from '../constants';
import { ElementType } from '../types';

interface BreedingGameProps {
  level: number;
  xp: number;
  element: ElementType;
  onElementSelect?: (element: ElementType) => void;
}

const BreedingGame: React.FC<BreedingGameProps> = ({ level, xp, element, onElementSelect }) => {
  const stage = STAGES.reduce((acc, curr) => (level >= curr.minLevel ? curr : acc), STAGES[0]);
  const progressPercent = (xp / 1000) * 100;

  const getElementColor = (el: ElementType) => {
    switch (el) {
      case 'fire': return 'bg-red-400';
      case 'water': return 'bg-blue-400';
      case 'wood': return 'bg-green-500';
      case 'earth': return 'bg-yellow-700';
      case 'wind': return 'bg-teal-300';
      default: return 'bg-gray-200';
    }
  };

  const getElementLabel = (el: ElementType) => {
    const labels = { fire: '火', water: '水', wood: '木', earth: '土', wind: '风', none: '' };
    return labels[el];
  };

  return (
    <div className="relative w-full h-48 bg-gradient-to-b from-blue-100 to-green-50 rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden border-2 border-white shadow-inner">
      {/* Background elements */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-200 rounded-b-xl opacity-50" />
      
      {/* Pet Visual */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          key={stage.img + element}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-6xl mb-2 drop-shadow-lg"
        >
          {level >= 21 ? (
              <div className="relative">
                  <span className="text-7xl">🐱</span>
                  {element !== 'none' && (
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${getElementColor(element)} border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                          {getElementLabel(element)}
                      </div>
                  )}
              </div>
          ) : stage.img}
        </motion.div>

        {/* Level & Stage Info */}
        <div className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm border border-green-100">
          Lv.{level} {stage.name}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-2 left-4 right-4 z-20">
        <div className="h-4 bg-white/50 rounded-full border border-white overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
          />
        </div>
        <div className="flex justify-between mt-0.5 px-1 text-[10px] font-bold text-green-800">
          <span>EXP</span>
          <span>{xp} / 1000</span>
        </div>
      </div>

      {/* Element Selector Modal for Level 21+ */}
      {level >= 21 && element === 'none' && onElementSelect && (
        <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center p-4">
          <p className="text-sm font-bold text-green-800 mb-3">恭喜进化！选择你的灵力属性：</p>
          <div className="flex gap-2">
            {(['wind', 'wood', 'water', 'fire', 'earth'] as ElementType[]).map((el) => (
              <button
                key={el}
                onClick={() => onElementSelect(el)}
                className={`w-10 h-10 rounded-full ${getElementColor(el)} text-white flex items-center justify-center shadow-md active:scale-95 transition-transform`}
              >
                {getElementLabel(el)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingGame;

