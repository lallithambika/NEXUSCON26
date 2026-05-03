import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Users, Clock, Zap } from 'lucide-react';

export interface BentoCardProps {
  title: string;
  description: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
  color?: string;
}

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const GLOW_RGB = '111, 209, 215'; // #6FD1D7
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string = GLOW_RGB): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 0.8);
    box-shadow: 0 0 8px rgba(${color}, 0.4);
    pointer-events: none;
    z-index: 10;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  particleCount?: number;
  enableTilt?: boolean;
}> = ({
  children,
  className = '',
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, GLOW_RGB)
    );
    particlesInitialized.current = true;
  }, [particleCount]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        onComplete: () => particle.remove()
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          duration: 3 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });
      }, index * 150);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      gsap.to(element, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(element, {
        rotateX,
        rotateY,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, enableTilt]);

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden cursor-target`} style={style}>
      {children}
    </div>
  );
};

export const MagicBento: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const eventData: BentoCardProps[] = [
    {
      label: "DATE",
      title: "June 2026",
      description: "A mid-year convergence of India's brightest tech minds.",
      icon: <Calendar className="w-5 h-5" />,
      className: "col-span-1"
    },
    {
      label: "VENUE",
      title: "NIMHANS Convention Centre",
      description: "A premium, accessible space in the heart of Bengaluru.",
      icon: <MapPin className="w-5 h-5" />,
      className: "col-span-1"
    },
    {
      label: "EXPERIENCE",
      title: "The Practitioner's Edge",
      description: "Moving beyond surface-level trends to real, deployable architecture. Engage with elite builders in an environment designed for maximum signal.",
      icon: <Sparkles className="w-5 h-5" />,
      className: "col-span-1 md:col-span-2 md:row-span-1 lg:col-span-2"
    },
    {
      label: "CAPACITY",
      title: "~450 Professionals",
      description: "A highly curated audience ensuring every conversation counts. We prioritize depth of expertise over sheer volume.",
      icon: <Users className="w-5 h-5" />,
      className: "col-span-1 md:col-span-2 lg:col-span-2"
    },
    {
      label: "FORMAT",
      title: "Full-day experience",
      description: "Intensive talks, workshops, and high-value networking.",
      icon: <Clock className="w-5 h-5" />,
      className: "col-span-1"
    },
    {
      label: "FOCUS",
      title: "AI · Cloud · DevTools",
      description: "The three pillars of modern engineering excellence.",
      icon: <Zap className="w-5 h-5" />,
      className: "col-span-1"
    }
  ];

  useEffect(() => {
    if (!gridRef.current || isMobile) return;

    const cards = gridRef.current.querySelectorAll('.bento-card');
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      cards.forEach(card => {
        const element = card as HTMLElement;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        const proximity = DEFAULT_SPOTLIGHT_RADIUS;
        let intensity = 0;
        if (distance < proximity) {
          intensity = 1 - (distance / proximity);
        }
        
        updateCardGlowProperties(element, e.clientX, e.clientY, intensity, DEFAULT_SPOTLIGHT_RADIUS);
      });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isMobile]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <style>{`
        .bento-card {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 300px;
        }
        .bento-card::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), 
            rgba(${GLOW_RGB}, calc(var(--glow-intensity) * 0.6)) 0%, 
            transparent 70%);
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
      
      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
      >
        {eventData.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={card.className}
          >
            <ParticleCard
              className="bento-card h-full glass-card group flex flex-col p-8 transition-all duration-500"
              enableTilt={!isMobile}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-2.5 rounded-xl bg-[#6FD1D7]/10 text-[#6FD1D7]">
                  {card.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#093C5D]/40 uppercase">
                  {card.label}
                </span>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-2xl font-bold text-[#093C5D] mb-3 group-hover:text-[#6FD1D7] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#093C5D]/70">
                  {card.description}
                </p>
              </div>

              {/* Hover Highlight Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6FD1D7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </ParticleCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MagicBento;
