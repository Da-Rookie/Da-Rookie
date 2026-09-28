import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SplashScreenV2Props {
  onComplete: () => void;
}

export function SplashScreenV2({ onComplete }: SplashScreenV2Props) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 40 : 1900);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      className="splash-v2"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.05 : 0.42 }}
      role="status"
      aria-label="Opening Eko Prasetyo Pratomo portfolio"
    >
      <motion.div
        className="splash-v2__mark"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        P
      </motion.div>
      <motion.div
        className="splash-v2__name"
        initial={{ opacity: 0, letterSpacing: reduceMotion ? "0.12em" : "0.24em" }}
        animate={{ opacity: 1, letterSpacing: "0.12em" }}
        transition={{ delay: reduceMotion ? 0 : 0.35, duration: reduceMotion ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        PRASETYO
      </motion.div>
      <motion.div
        className="splash-v2__line"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.8, duration: reduceMotion ? 0.01 : 0.45 }}
      >
        BUILD / AUTOMATE / LEAD
      </motion.div>
    </motion.div>
  );
}
