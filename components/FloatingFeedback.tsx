
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingFeedbackProps {
  id: number;
  type: 'points' | 'xp';
  value: number;
  x: number;
  y: number;
  onComplete: (id: number) => void;
}

const FloatingFeedback: React.FC<FloatingFeedbackProps> = ({ id, type, value, x, y, onComplete }) => {
  // 生成3-5个小粒子
  const particles = Array.from({ length: type === 'points' ? 5 : 3 });
  
  // 目标位置（大致对应右上角金币栏和中间经验条）
  const targetX = type === 'points' ? window.innerWidth - 60 : window.innerWidth / 2;
  const targetY = type === 'points' ? 40 : 180;

  return (
    <>
      {particles.map((_, i) => (
        <motion.div
          key={`${id}-${i}`}
          initial={{ 
            opacity: 1, 
            x: x - 10, 
            y: y - 10, 
            scale: 0.5 
          }}
          animate={{ 
            // 先爆炸扩散，再飞向目标
            x: [x, x + (Math.random() - 0.5) * 100, targetX],
            y: [y, y + (Math.random() - 0.5) * 100, targetY],
            scale: [0.5, 1.2, 0.4],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            times: [0, 0.2, 1],
            delay: i * 0.05 
          }}
          onAnimationComplete={i === particles.length - 1 ? () => onComplete(id) : undefined}
          className="fixed pointer-events-none z-[9999] text-xl"
          style={{ top: 0, left: 0 }}
        >
          {type === 'points' ? '🪙' : '✨'}
        </motion.div>
      ))}
      {/* 飘起的数值文字 */}
      <motion.div
        initial={{ opacity: 1, x: x, y: y }}
        animate={{ opacity: 0, y: y - 60 }}
        transition={{ duration: 1 }}
        className={`fixed pointer-events-none z-[9999] font-game font-bold text-lg ${type === 'points' ? 'text-yellow-500' : 'text-blue-500'}`}
        style={{ top: 0, left: 0 }}
      >
        +{value}
      </motion.div>
    </>
  );
};

export default FloatingFeedback;
