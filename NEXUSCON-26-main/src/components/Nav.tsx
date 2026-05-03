import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/context/SoundContext";

const navItems = [
  { href: "#top", label: "Home" },
  { href: "#overview", label: "Overview" },
  { href: "#about", label: "About" },
  { href: "#speakers", label: "Speakers" },
  { href: "#sponsor", label: "Sponsor" },
];

export default function Nav() {
  const { isSoundEnabled, toggleSound, playHover, playClick } = useSound();
  const navRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    // Active Section Tracking
    const sections = navItems.map(item => item.href.substring(1));
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0% -70% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (mobileOpen) {
      gsap.set(menu, { display: "block" });
      gsap.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" });
    } else {
      gsap.to(menu, { opacity: 0, y: -10, duration: 0.2, ease: "power3.in", onComplete: () => gsap.set(menu, { display: "none" }) });
    }
  }, [mobileOpen]);

  return (
    <div ref={navRef} className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-5xl">
      <nav
        className="flex items-center justify-between px-3 py-2 rounded-full border border-white/30 shadow-[0_8px_32px_rgba(9,60,93,0.15)] bg-white/40 backdrop-blur-xl"
      >
        {/* Logo Section */}
        <a 
          href="#top" 
          onMouseEnter={() => playHover()}
          onClick={() => playClick()}
          className="flex items-center gap-2.5 flex-shrink-0 group px-2"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-md ring-2 ring-white/40 group-hover:scale-105 transition-transform duration-300">
            <img
              src={`${base}images/logo.png?v=2`}
              alt="TechNexus Community"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<div class="w-full h-full bg-[#6FD1D7] flex items-center justify-center text-white font-bold text-lg">N</div>';
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-black tracking-tight text-[#093C5D] uppercase leading-none">NexusCon</span>
            <span className="text-[9px] font-bold tracking-[0.1em] text-[#6FD1D7] uppercase leading-none mt-0.5">Bengaluru '26</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-0.5 relative">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
                className={`relative px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 rounded-full ${
                  isActive ? "text-white" : "text-[#093C5D]/60 hover:text-[#093C5D]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#6FD1D7] to-[#093C5D] rounded-full shadow-lg -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => { toggleSound(); playClick(); }}
            onMouseEnter={() => playHover()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-[#093C5D] transition-all border border-white/30"
            title={isSoundEnabled ? "Mute Sounds" : "Enable Sounds"}
          >
            {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <a
            href={`${base}docs/prospectus.pdf`}
            download
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="hidden sm:flex items-center justify-center px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#093C5D] hover:text-[#6FD1D7] transition-colors border border-[#093C5D]/10 rounded-full bg-white/20 hover:bg-white/40"
          >
            Download Prospectus
          </a>
          <a
            href="#waitlist"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="hidden md:flex items-center px-6 py-2.5 rounded-full bg-[#093C5D] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#6FD1D7] hover:scale-105 transition-all duration-300"
          >
            Join Waitlist
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => { setMobileOpen(o => !o); playClick(); }}
            onMouseEnter={() => playHover()}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-[#093C5D]/10"
          >
            <span className={`block w-5 h-0.5 bg-[#093C5D] rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#093C5D] rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#093C5D] rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="hidden absolute top-[calc(100%+0.75rem)] left-0 right-0 p-3 rounded-[2rem] border border-white/30 shadow-2xl bg-white/80 backdrop-blur-2xl"
      >
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-colors ${
                activeSection === item.href.substring(1) ? "bg-[#093C5D] text-white" : "text-[#093C5D] hover:bg-white/40"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-[#6FD1D7] to-[#093C5D] text-center uppercase tracking-widest"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </div>
  );
}
