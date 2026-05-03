import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Carousel from './Carousel';

const stories = [
  {
    title: "A premium gathering...",
    desc: "NexusCon is more than just a conference; it's a curated environment where elite practitioners converge to share high-signal architecture and engineering depth.",
    color: "from-[#DE638A]/20 to-[#4A3267]/20",
    type: "story"
  },
  {
    title: "Practitioners First",
    desc: "Built for developers, AI practitioners, and cloud architects who are actually building the future. Every session is designed for technical depth over marketing fluff.",
    color: "from-[#4A3267]/20 to-[#DE638A]/20",
    type: "story"
  },
  {
    title: "Curated Excellence",
    desc: "Every talk, workshop, and networking session is hand-picked to ensure maximum signal-to-noise ratio. We prioritize quality over sheer volume of attendees.",
    color: "from-[#DE638A]/20 to-[#C6BADE]/20",
    type: "story"
  },
  {
    title: "The Community",
    desc: "An elite group of practitioners across all domains of engineering. From startups to scale-ups, we gather the most ambitious builders in India.",
    color: "from-[#C6BADE]/20 to-[#DE638A]/20",
    type: "carousel"
  }
];

const StoryCard = ({ story, index, total, scrollYProgress }: { story: any, index: number, total: number, scrollYProgress: any }) => {
  const scale = useTransform(scrollYProgress, [index / total, (index + 0.5) / total, (index + 1) / total], [1, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [index / total, (index + 0.8) / total, (index + 1) / total], [1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [index / total, (index + 1) / total], [0, -80]);

  const isCarousel = story.type === 'carousel';

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        top: `calc(12vh + ${index * 32}px)`,
        zIndex: index + 1,
      }}
      className={`sticky w-full ${isCarousel ? 'max-w-6xl' : 'max-w-5xl'} mx-auto mb-[12vh]`}
    >
      <div className={`relative p-10 md:p-14 rounded-[40px] bg-white/40 backdrop-blur-3xl border border-white/30 shadow-[0_32px_128px_-16px_rgba(74,50,103,0.1)] overflow-hidden group transition-all duration-700`}>
        {/* Animated Glow Background */}
        <div className={`absolute -inset-40 bg-gradient-to-br ${story.color} blur-[120px] opacity-30 group-hover:opacity-40 transition-opacity duration-1000`} />
        
        <div className="relative z-10">
          {!isCarousel && (
            <div className="text-[10px] font-black tracking-[0.5em] text-[#DE638A] mb-8 uppercase opacity-60">
              CHAPTER 0{index + 1}
            </div>
          )}
          
          {!isCarousel ? (
            <div className="max-w-3xl">
              <h3 className="text-4xl md:text-6xl font-black text-[#4A3267] mb-10 leading-[1.1] neon-white-soft">
                {story.title}
              </h3>
              <p className="text-lg md:text-xl text-[#4A3267]/70 leading-relaxed">
                {story.desc}
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              {/* LEFT SIDE */}
              <div className="flex-1 text-left max-w-[500px]">
                <div className="text-[10px] font-black tracking-[0.5em] text-[#DE638A] mb-6 uppercase opacity-80">
                  THE AUDIENCE
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-[#4A3267] mb-8 leading-[1.1] neon-white">
                  {story.title}
                </h3>
                <p className="text-lg text-[#4A3267]/70 leading-relaxed mb-12">
                  {story.desc}
                </p>
                <div className="flex gap-4">
                  <div className="px-7 py-3.5 rounded-full bg-[#4A3267] text-white font-bold text-[13px] shadow-xl shadow-[#4A3267]/20 uppercase tracking-wider">
                    7+ Roles
                  </div>
                  <div className="px-7 py-3.5 rounded-full bg-[#DE638A] text-white font-bold text-[13px] shadow-xl shadow-[#DE638A]/20 uppercase tracking-wider">
                    Elite Tier
                  </div>
                </div>
              </div>
              
              {/* RIGHT SIDE */}
              <div className="w-full lg:w-[520px] flex justify-center items-center">
                <Carousel baseWidth={460} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function StoryStack() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[450vh] py-24 px-6">
      <div className="sticky top-[8vh] left-0 right-0 text-center mb-24 z-0 pointer-events-none">
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.15]) }}
        >
          <h2 className="text-[10px] font-black tracking-[0.8em] text-[#DE638A] uppercase mb-4 opacity-50">
            THE NEXUS EXPERIENCE
          </h2>
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#DE638A]/40 to-transparent mx-auto" />
        </motion.div>
      </div>
      
      <div className="relative">
        {stories.map((story, i) => (
          <StoryCard 
            key={i} 
            story={story} 
            index={i} 
            total={stories.length} 
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Subtle Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#DE638A]/3 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4A3267]/3 rounded-full blur-[150px] animate-blob animation-delay-2000" />
      </div>
    </section>
  );
}
