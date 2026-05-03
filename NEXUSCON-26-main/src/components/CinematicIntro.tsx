import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextType from "./ui/TextType";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Global GSAP optimizations
    gsap.ticker.fps(60);
    gsap.ticker.lagSmoothing(1000, 16);

    // GSAP Scroll Animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // Longer pin for more fluid motion
        scrub: 2.5,   // Higher scrub for "Apple-like" momentum
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(titleRef.current, {
      y: -200,
      opacity: 0,
      scale: 0.85,
      filter: "blur(10px)",
      duration: 1,
      ease: "power3.inOut"
    })
    .to(scrollIndicatorRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
    }, 0)
    .to(canvasRef.current, {
      scale: 1.4,
      opacity: 0.3,
      filter: "blur(25px)",
      duration: 2,
      ease: "power2.inOut"
    }, 0);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#EBFDFC]"
    >
      {/* 3D Background */}
      <div ref={canvasRef} className="absolute inset-0 z-0">
        <CityBackground />
      </div>

      {/* Clean Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'linear-gradient(to bottom, rgba(9,60,93,0.3), rgba(111,209,215,0.2), rgba(93,248,216,0.1))'
      }} />

      {/* Centered Content */}
      <div 
        ref={titleRef}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h1 className="text-[clamp(2.5rem,15vw,14rem)] font-black leading-none tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(93,248,216,0.3)' }}>
            NEXUSCON
          </h1>
          <div className="text-[clamp(1.2rem,6vw,3rem)] md:text-5xl font-black tracking-[0.2em] md:tracking-[0.5em] text-white/90 uppercase" style={{ textShadow: '0 0 15px rgba(111,209,215,0.2)' }}>
            BENGALURU ’26
          </div>
          <div className="pt-10">
            <TextType 
              text="WHERE INDIA’S TECH COMMUNITY CONVERGES"
              className="text-xs md:text-base font-bold tracking-[0.2em] md:tracking-[0.6em] text-white uppercase max-w-[90vw] mx-auto"
              typingSpeed={50}
              showCursor={false}
              loop={false}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] font-black tracking-[0.6em] text-[#6FD1D7]/60 uppercase">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-14 w-px bg-[#6FD1D7]/40"
        />
      </div>
    </section>
  );
}

function CityBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const colors = {
      base: 0x093C5D,
      mid: 0x3B7597,
      highlight: 0x6FD1D7,
      accent: 0x5DF8D8,
      bg: 0x093C5D, // Deep background
      window: 0x6FD1D7
    };

    scene.fog = new THREE.Fog(colors.bg, 15, 100);

    // Emissive Map Generator (White windows on Black background)
    const createEmissiveMap = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#000000'; // Black background = no emission
      ctx.fillRect(0, 0, 128, 128);
      
      ctx.fillStyle = '#ffffff'; // White = full emission
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 12; j++) {
          if (Math.random() > 0.4) {
            ctx.fillRect(i * 20 + 8, j * 10 + 4, 12, 4);
          }
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
      return texture;
    };

    const emissiveMap = createEmissiveMap();

    // Ground
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: colors.base,
      roughness: 1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const cityGroup = new THREE.Group();
    const buildingGeometries: THREE.BoxGeometry[] = [];

    for (let i = 0; i < 500; i++) {
      const h = Math.random() * 25 + 5;
      const w = Math.random() * 5 + 2;
      const d = Math.random() * 5 + 2;
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 120;
      const bx = Math.cos(angle) * radius;
      const bz = Math.sin(angle) * radius;

      // Distance factor for saturation/vibrancy
      const dist = Math.sqrt(bx*bx + bz*bz);
      const vibrancy = Math.max(0.3, 1 - (dist / 180));
      
      const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
      buildingGeometries.push(buildingGeo);
      
      // Apply Vertical Gradient via Vertex Colors
      const count = buildingGeo.attributes.position.count;
      buildingGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      const colorAttr = buildingGeo.attributes.color;
      
      const cBottom = new THREE.Color(colors.base);
      const cTop = new THREE.Color(colors.mid).lerp(new THREE.Color(colors.highlight), vibrancy * 0.4);

      for (let j = 0; j < count; j++) {
        const y = buildingGeo.attributes.position.getY(j);
        const lerpColor = y > 0 ? cTop : cBottom;
        colorAttr.setXYZ(j, lerpColor.r, lerpColor.g, lerpColor.b);
      }

      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.4,
        metalness: 0.1,
        emissive: colors.accent,
        emissiveIntensity: 0.3,
        emissiveMap: emissiveMap,
      });

      if (material.emissiveMap) {
        material.emissiveMap = material.emissiveMap.clone();
        material.emissiveMap.repeat.set(w, h / 2);
        material.emissiveMap.needsUpdate = true;
      }

      const building = new THREE.Mesh(buildingGeo, material);
      building.scale.set(w, h, d);
      
      if (Math.abs(bx) < 20) {
        building.position.x = bx + (bx > 0 ? 20 : -20);
      } else {
        building.position.x = bx;
      }
      
      building.position.y = h / 2;
      building.position.z = bz;
      building.rotation.y = (Math.random() - 0.5) * 0.15;
      
      cityGroup.add(building);
    }
    scene.add(cityGroup);

    // Layering for parallax
    const fgGroup = new THREE.Group();
    const bgGroup = new THREE.Group();
    cityGroup.children.forEach((b) => {
      if (b.position.z > 20) fgGroup.add(b);
      else bgGroup.add(b);
    });
    scene.add(fgGroup, bgGroup);

    // Bright Premium Lighting
    const ambient = new THREE.AmbientLight(colors.highlight, 0.6); // Soft cyan tint
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(colors.accent, 1.2); // Cool tone directional
    sun.position.set(100, 100, 50);
    scene.add(sun);

    const hemiLight = new THREE.HemisphereLight(0xffffff, colors.base, 0.4);
    scene.add(hemiLight);

    const animate = (time: number) => {
      const elapsed = time * 0.001; // gsap ticker gives time in ms
      const scroll = window.scrollY / window.innerHeight;
      
      // Smooth camera base motion
      camera.position.z = 80 - (elapsed * 2) - (scroll * 12);
      camera.position.y = 15 + Math.sin(elapsed * 0.4) * 1.5 - (scroll * 6);
      
      if (camera.position.z < -60) camera.position.z = 80;
      
      // Parallax layers
      fgGroup.position.z = -scroll * 30;
      bgGroup.position.z = -scroll * 10;
      
      camera.lookAt(0, 5 - scroll * 5, -50);

      renderer.render(scene, camera);
    };
    
    gsap.ticker.add(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(animate);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      buildingGeometries.forEach(g => g.dispose());
      groundGeo.dispose();
      if (emissiveMap) emissiveMap.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
