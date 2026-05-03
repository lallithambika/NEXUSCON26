import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import React, { JSX } from 'react';
import { Monitor, Cloud, Zap, Rocket, BarChart, Lightbulb, GraduationCap } from 'lucide-react';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
  image?: string;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const base = import.meta.env.BASE_URL;

const NEXUS_ITEMS: CarouselItem[] = [
  {
    title: 'Software Engineers',
    description: 'Elite builders crafting high-performance architecture.',
    id: 1,
    icon: <Monitor className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/engineers.png`
  },
  {
    title: 'Cloud Architects',
    description: 'Scaling the future on distributed systems.',
    id: 2,
    icon: <Cloud className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/cloud.png`
  },
  {
    title: 'AI Practitioners',
    description: 'Implementing real-world foundation models.',
    id: 3,
    icon: <Zap className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/ai.png`
  },
  {
    title: 'CTOs / VPs',
    description: 'Technical leaders shaping the next decade.',
    id: 4,
    icon: <Rocket className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/leadership.png`
  },
  {
    title: 'Product Managers',
    description: 'Bridge builders between depth and delivery.',
    id: 5,
    icon: <BarChart className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/product.png`
  },
  {
    title: 'Startup Founders',
    description: 'Visionaries launching at the frontier.',
    id: 6,
    icon: <Lightbulb className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/founders.png`
  },
  {
    title: 'Ambitious Students',
    description: 'The next generation of engineering excellence.',
    id: 7,
    icon: <GraduationCap className="h-[20px] w-[20px] text-white" />,
    image: `${base}images/community/engineers.png` // Fallback to engineers for now
  }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 24;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 400, damping: 40 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
  activeIndex: number;
}

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition, activeIndex }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [8, 0, -8]; // Subtle ±8deg rotation
  const rotateY = useTransform(x, range, outputRange, { clamp: false });
  
  // Logic to determine if this card is the center/active one in the track
  const isActive = activeIndex === index;
  const opacity = isActive ? 1 : 0.6;
  const scale = isActive ? 1.03 : 0.95;

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className="relative shrink-0 flex flex-col items-start justify-between bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] overflow-hidden cursor-grab active:cursor-grabbing shadow-xl transition-all duration-500 cursor-target"
      style={{
        width: itemWidth,
        height: '100%',
        rotateY: rotateY,
        opacity,
        scale,
        zIndex: isActive ? 10 : 0,
        transformStyle: "preserve-3d"
      }}
      transition={transition}
    >
      {/* Background Image with Overlay */}
      {item.image && (
        <div className="absolute inset-0 z-0">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#EBFDFC] via-[#EBFDFC]/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-7 pb-0">
        <span className="flex h-[48px] w-[48px] items-center justify-center rounded-xl bg-[#6FD1D7] shadow-lg shadow-[#6FD1D7]/20">
          {item.icon}
        </span>
      </div>
      <div className="relative z-10 p-7">
        <div className="mb-2 font-black text-2xl text-[#093C5D] leading-tight line-clamp-1">{item.title}</div>
        <p className="text-sm text-[#093C5D]/70 leading-relaxed line-clamp-2">{item.description}</p>
      </div>
      
      {/* Light Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}

export default function Carousel({
  items = NEXUS_ITEMS,
  baseWidth = 460, // Optimized for 420-520px container
  autoplay = true,
  autoplayDelay = 4000,
  pauseOnHover = true,
  loop = true,
  round = false
}: CarouselProps): JSX.Element {
  const itemWidth = baseWidth;
  const trackItemOffset = itemWidth + GAP;
  
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate index for indicators and state
  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => prev + 1);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[32px]"
      style={{ width: `${baseWidth}px` }}
    >
      <div className="relative h-[320px] w-full p-4 flex items-center">
        <motion.div
          className="flex h-full items-center"
          drag={isAnimating ? false : 'x'}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 2000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item?.id ?? index}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              round={false}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={effectiveTransition}
              activeIndex={position} // Using the actual track position for correct center detection
            />
          ))}
        </motion.div>
      </div>
      
      {/* Visual Indicators */}
      <div className="flex w-full justify-center mt-10">
        <div className="flex gap-2.5">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                activeIndex === index
                  ? 'w-8 bg-[#6FD1D7]'
                  : 'w-2 bg-[#093C5D]/20 hover:bg-[#093C5D]/40'
              }`}
              onClick={() => setPosition(loop ? index + 1 : index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
