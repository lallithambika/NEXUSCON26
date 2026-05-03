import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsFinished(true), 500);
          setTimeout(onComplete, 1500);
          return 100;
        }
        return prev + Math.random() * 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#EBFDFC] overflow-hidden"
        >
          {/* Background 3D Scene */}
          <div className="absolute inset-0 z-0">
            <IntroBackground />
          </div>

          {/* Cinematic Framing */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top Bar */}
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 h-16 border-b border-[#093C5D]/5 bg-white/10 backdrop-blur-sm flex items-center justify-between px-4 md:px-12">
              <div className="text-[10px] font-black tracking-widest text-[#093C5D]/40">SOUND: OFF</div>
              <div className="flex gap-4 md:gap-8 text-[10px] font-black tracking-widest text-[#093C5D]/40">
                <span className="hidden xs:inline">SYSTEM</span>
                <span className="hidden xs:inline">NETWORK</span>
                <span>SECURITY</span>
              </div>
            </div>

            {/* Side Bevels (Futuristic Frame) */}
            <div className="hidden md:flex absolute inset-y-20 left-0 w-12 border-r border-[#093C5D]/5 items-center justify-center">
              <div className="h-64 w-0.5 bg-gradient-to-b from-transparent via-[#6FD1D7]/20 to-transparent" />
            </div>
            <div className="hidden md:flex absolute inset-y-20 right-0 w-12 border-l border-[#093C5D]/5 items-center justify-center">
              <div className="h-64 w-0.5 bg-gradient-to-b from-transparent via-[#6FD1D7]/20 to-transparent" />
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-0 inset-x-0 h-16 border-t border-[#093C5D]/5 bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-[10px] font-black tracking-[0.5em] text-[#093C5D]/30 uppercase">
                Bengaluru · NexusCon · 2026
              </div>
            </div>
          </div>

          {/* Overlay UI */}
          <div className="relative z-20 text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-sm font-black tracking-[0.6em] uppercase text-[#093C5D]/60">
                  NEXUSCON
                </h2>
                <h1 className="text-[clamp(2rem,10vw,6rem)] font-black tracking-tighter text-[#093C5D] relative">
                  INITIALIZING
                  <motion.span 
                    className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-[#6FD1D7] to-[#3B7597] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                  />
                </h1>
                <div className="text-[10px] font-black tracking-widest text-[#093C5D]/60 pt-4">
                  {Math.round(progress)}%
                </div>
              </div>

              <div className="pt-8">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#093C5D]/40 animate-pulse">
                  Preparing your NexusCon experience...
                </p>
              </div>
            </motion.div>
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6FD1D7]/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3B7597]/10 blur-[120px]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IntroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Create soft 3D mesh waves
    const geometry = new THREE.PlaneGeometry(15, 15, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x093C5D,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5;
    mesh.position.y = -2;
    scene.add(mesh);

    // Points system for soft particles
    const pointsGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x6FD1D7,
      transparent: true,
      opacity: 0.2,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const animate = () => {
      const time = performance.now() * 0.0005;
      
      // Animate mesh vertices for waves
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 0.5;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

      mesh.rotation.z = time * 0.1;
      points.rotation.y = time * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full opacity-40" />;
}
