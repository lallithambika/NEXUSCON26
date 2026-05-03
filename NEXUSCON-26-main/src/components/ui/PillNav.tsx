import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  isCTA?: boolean;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  initialLoadAnimation = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { 
          scale: 1.2, 
          xPercent: -50, 
          duration: 0.5, 
          ease: "power3.out" 
        }, 0);

        if (label) {
          tl.to(label, { 
            y: -(h + 8), 
            duration: 0.5, 
            ease: "power3.out" 
          }, 0);
        }

        if (white) {
          gsap.set(white, { y: h + 20, opacity: 0 });
          tl.to(white, { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            ease: "power3.out" 
          }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (initialLoadAnimation) {
      gsap.fromTo(navContainerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.6,
      ease: "power2.out",
      overwrite: 'auto'
    });
  };

  const handleLogoLeave = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    logoTweenRef.current = gsap.to(img, {
      rotate: 0,
      duration: 0.4,
      ease: "power2.in",
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    const menu = mobileMenuRef.current;
    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu,
          { opacity: 0, y: 10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
        );
      } else {
        gsap.to(menu, {
          opacity: 0, y: 10, scale: 0.95, duration: 0.3, ease: "power3.in",
          onComplete: () => gsap.set(menu, { visibility: 'hidden' })
        });
      }
    }
  };

  return (
    <div 
      ref={navContainerRef}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-4xl px-4 pointer-events-none ${className}`}
    >
      <nav
        className="relative flex items-center justify-between p-1.5 backdrop-blur-xl bg-white/15 border border-white/30 rounded-full shadow-[0_8px_32px_rgba(74,50,103,0.15)] pointer-events-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))'
        }}
      >
        {/* Logo Section */}
        <Link
          to="/"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
          ref={logoRef}
          className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#DE638A] to-[#4A3267] shadow-lg shadow-pink-500/20"
        >
          <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-6 h-6 object-contain" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1.5 ml-2">
          {items.filter(item => !item.isCTA).map((item, i) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                to={item.href as any}
                className={`relative px-5 h-10 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 group ${isActive ? 'active-pill' : ''}`}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
              >
                <span
                  ref={el => circleRefs.current[i] = el}
                  className="absolute left-1/2 bottom-0 bg-gradient-to-br from-[#DE638A] to-[#4A3267] rounded-full z-0 pointer-events-none"
                />
                <span className="relative z-10 flex flex-col h-[1lh] overflow-hidden pointer-events-none">
                  <span className={`pill-label block font-semibold text-sm tracking-wider uppercase transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#4A3267]'}`}>
                    {item.label}
                  </span>
                  <span className="pill-label-hover absolute top-0 left-0 block font-semibold text-sm tracking-wider uppercase text-white opacity-0">
                    {item.label}
                  </span>
                </span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#DE638A] to-[#4A3267] -z-10 shadow-lg shadow-pink-500/30" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="flex items-center gap-2">
          {items.filter(item => item.isCTA).map((item) => (
            <Link
              key={item.href}
              to={item.href as any}
              className="hidden md:flex px-6 h-10 items-center justify-center rounded-full bg-gradient-to-br from-[#DE638A] to-[#4A3267] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_20px_rgba(222,99,138,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(222,99,138,0.6)]"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Menu Toggle */}
          <button
            ref={hamburgerRef}
            onClick={toggleMobileMenu}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-[#4A3267] text-white"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={mobileMenuRef}
          className="absolute top-[calc(100%+0.75rem)] left-0 right-0 p-2 backdrop-blur-2xl bg-white/20 border border-white/30 rounded-[2rem] shadow-2xl invisible md:hidden"
        >
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href as any}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all ${
                  item.isCTA 
                    ? 'bg-gradient-to-br from-[#DE638A] to-[#4A3267] text-white mt-2' 
                    : 'text-[#4A3267] hover:bg-white/30'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PillNav;
