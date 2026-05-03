import React from 'react';
import Masonry from '../components/Masonry';
import Reveal from '../components/Reveal';

const PastGlimpse: React.FC = () => {
  const base = import.meta.env.BASE_URL;

  const items = [
    { id: "1", img: `${base}past/event1.jpg`, url: "#" },
    { id: "2", img: `${base}past/event2.jpg`, url: "#" },
    { id: "3", img: `${base}past/event3.jpg`, url: "#" },
    { id: "4", img: `${base}past/event4.jpg`, url: "#" },
    { id: "5", img: `${base}past/event5.jpg`, url: "#" },
    { id: "6", img: `${base}past/event6.jpg`, url: "#" },
    { id: "7", img: `${base}past/event7.jpg`, url: "#" },
    { id: "8", img: `${base}past/event8.jpg`, url: "#" },
    { id: "9", img: `${base}past/event9.jpg`, url: "#" },
    { id: "10", img: `${base}past/event10.jpg`, url: "#" },
    { id: "11", img: `${base}past/event11.jpg`, url: "#" },
    { id: "12", img: `${base}past/event12.jpg`, url: "#" },
    { id: "13", img: `${base}past/event13.jpg`, url: "#" },
  ];

  return (
    <section id="past" className="relative py-24 overflow-hidden bg-mesh">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6FD1D7]/10 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#093C5D]/10 blur-[120px] rounded-full animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Reveal>
            <span className="text-[#3B7597] font-bold tracking-widest text-sm uppercase mb-4 block">
              PAST MOMENTS
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#093C5D] mb-6">
              A glimpse of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FD1D7] to-[#3B7597]">energy</span> we've built
            </h2>
            <p className="text-[#093C5D]/70 text-lg leading-relaxed">
              Relive the highlights of TechNexus. From visionary keynotes to hands-on workshops, every moment is a step towards the future.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <Masonry
            items={items}
            ease="power4.out"
            duration={0.8}
            stagger={0.08}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.96}
            blurToFocus={true}
            colorShiftOnHover={true}
          />
        </div>
      </div>
    </section>
  );
};

export default PastGlimpse;
