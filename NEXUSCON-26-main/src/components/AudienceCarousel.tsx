import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const audienceItems = [
  { title: "Software Engineers", icon: "💻" },
  { title: "Cloud Architects", icon: "☁️" },
  { title: "AI/ML Practitioners", icon: "🤖" },
  { title: "CTOs / VPs", icon: "🚀" },
  { title: "Product Managers", icon: "📊" },
  { title: "Startup Founders", icon: "💡" },
  { title: "Ambitious Students", icon: "🎓" },
];

const Card = ({ item, index, total }: { item: typeof audienceItems[0], index: number, total: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group w-64 h-80 flex-shrink-0 cursor-pointer"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#DE638A]/20 to-[#4A3267]/20 rounded-[30px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glass Card */}
      <div className="relative h-full w-full bg-white/30 backdrop-blur-xl border border-white/40 rounded-[24px] p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl">
        {/* Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
          {item.icon}
        </div>
        <h3 className="text-xl font-black text-[#4A3267] leading-tight">
          {item.title}
        </h3>
        
        {/* Subtle Number */}
        <div className="absolute top-4 right-6 text-[#4A3267]/10 font-black text-4xl">
          0{index + 1}
        </div>
      </div>
    </motion.div>
  );
};

export default function AudienceCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-[#4A3267] neon-white"
        >
          A community of <span className="text-[#DE638A]">elite practitioners.</span>
        </motion.h2>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-8 px-[10vw] pb-12 overflow-x-auto no-scrollbar mask-fade"
        style={{ perspective: "1500px" }}
      >
        {audienceItems.map((item, i) => (
          <Card key={i} item={item} index={i} total={audienceItems.length} />
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </section>
  );
}
