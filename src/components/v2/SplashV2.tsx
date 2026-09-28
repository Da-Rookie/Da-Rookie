import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function SplashV2({ onComplete }: { onComplete: () => void }) {
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduced ? 350 : 1850);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduced]);

  return (
    <motion.div
      className="splash-v2"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.018, filter: 'blur(8px)' }}
      transition={{ duration: reduced ? 0.1 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <motion.div
        className="splash-mark"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.1 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="splash-monogram">P</span>
        <div className="splash-rule" />
        <div className="splash-caption">PRASETYO · BUILD / AUTOMATE / LEAD</div>
      </motion.div>
    </motion.div>
  );
}
