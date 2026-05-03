import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 9 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setProgress(100);
        setTimeout(() => setDone(true), 450);
      } else {
        setProgress(Math.floor(p));
      }
    }, 110);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-mesh flex items-center justify-center"
        >
          <div className="w-full max-w-md px-8 text-center">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="text-xs tracking-[0.5em] text-muted-foreground mb-3">NEXUSCON</div>
              <h2 className="text-3xl font-bold text-gradient-brand">INITIALIZING</h2>
            </motion.div>

            <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden border border-white/80 shadow-card">
              <motion.div
                className="h-full bg-gradient-brand rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>
            <div className="mt-4 flex justify-between text-xs font-mono text-muted-foreground">
              <span>LOADING ASSETS</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
