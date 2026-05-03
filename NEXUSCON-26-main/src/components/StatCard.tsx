import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Reveal from './Reveal';

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for tilt and glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth, non-rigid feel
  const springConfig = { stiffness: 100, damping: 20 };
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.03);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Reveal delay={delay} y={40}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
        className="cursor-target relative group px-8 py-12 rounded-[28px] bg-white/10 backdrop-blur-[20px] border border-white/15 shadow-[0_10px_40px_rgba(9,60,93,0.1)] overflow-hidden transition-colors duration-500 hover:bg-white/15"
      >
        {/* Inner Glow Follow */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]: any) => `radial-gradient(600px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(111, 209, 215, 0.15), transparent 40%)`
            ),
          }}
        />

        {/* Glass Shine Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isHovered ? {
            background: [
              "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%, transparent 100%)",
              "linear-gradient(110deg, transparent 100%, transparent 100%, rgba(255,255,255,0.1) 100%, transparent 100%, transparent 100%)"
            ],
            x: ["-100%", "100%"]
          } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        <div className="relative z-10 text-center">
          <div className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-[#093C5D] via-[#3B7597] to-[#5DF8D8] bg-clip-text text-transparent mb-4 drop-shadow-sm">
            {value}
          </div>
          <div className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-[#093C5D]/60">
            {label}
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
};

export default StatCard;
