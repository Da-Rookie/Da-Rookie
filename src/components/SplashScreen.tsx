import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

// Timing constants (seconds)
const WORD_DURATION = 0.72;       // how long each word stays visible
const WORD_INTERVAL = 1.05;       // gap between word appearances
const PAYOFF_DELAY = 3.4;         // when "with Prasetyo." appears
const PAYOFF_HOLD = 1.6;          // how long payoff stays before exit
const TOTAL_DURATION = PAYOFF_DELAY + PAYOFF_HOLD + 0.9; // full sequence

const words = ["Create.", "Automate.", "Scale."];

// Sophisticated entrance: rise from slight below with subtle scale + blur lift
const wordVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.96,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 1.03,
    filter: "blur(4px)",
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

// Payoff "with Prasetyo." — slower, more deliberate entrance
const payoffVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(6px)",
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

// The full splash overlay exit — fades + lifts up like a curtain
const overlayVariants = {
  visible: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: "-4%",
    transition: {
      duration: 0.85,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

// Thin horizontal rule that draws in under the payoff
const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      delay: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const prefersReduced = useReducedMotion();
  const [activeWord, setActiveWord] = useState<number>(-1); // -1 = none
  const [showPayoff, setShowPayoff] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      // Skip splash immediately for users who prefer reduced motion
      onComplete();
      return;
    }

    // Sequence controller
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Cycle through "Create.", "Automate.", "Scale."
    words.forEach((_, i) => {
      // Show word i
      timers.push(
        setTimeout(() => {
          setActiveWord(i);
        }, i * WORD_INTERVAL * 1000 + 120)
      );
      // Hide word i (unless it's the last — "Scale." stays until payoff)
      if (i < words.length - 1) {
        timers.push(
          setTimeout(() => {
            setActiveWord(-1);
          }, i * WORD_INTERVAL * 1000 + WORD_DURATION * 1000 + 120)
        );
      }
    });

    // After last word, hide it then show payoff
    timers.push(
      setTimeout(() => {
        setActiveWord(-1);
      }, (words.length - 1) * WORD_INTERVAL * 1000 + WORD_DURATION * 1000 + 280)
    );

    timers.push(
      setTimeout(() => {
        setShowPayoff(true);
      }, PAYOFF_DELAY * 1000)
    );

    // Begin exit sequence
    timers.push(
      setTimeout(() => {
        setExiting(true);
      }, (PAYOFF_DELAY + PAYOFF_HOLD) * 1000)
    );

    // Fully unmount splash
    timers.push(
      setTimeout(() => {
        setDone(true);
        onComplete();
      }, TOTAL_DURATION * 1000)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete, prefersReduced]);

  if (done) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          variants={overlayVariants}
          initial="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#E4E5DB" }}
          aria-live="polite"
          aria-label="Intro sequence"
        >
          {/* Subtle background radial — same as Hero, no new colors */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(47,82,65,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Noise overlay — from design system */}
          <div
            className="noise-overlay pointer-events-none absolute inset-0"
            aria-hidden="true"
          />

          {/* Word stage */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ minHeight: "1em" }}
            aria-hidden="true"
          >
            <AnimatePresence mode="wait">
              {/* Cycle words */}
              {activeWord >= 0 && !showPayoff && (
                <motion.span
                  key={`word-${activeWord}`}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="font-display font-extrabold leading-none tracking-tight select-none"
                  style={{
                    fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                    color: "#152A38",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {words[activeWord]}
                </motion.span>
              )}

              {/* Payoff — "with Prasetyo." */}
              {showPayoff && (
                <motion.div
                  key="payoff"
                  variants={payoffVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center gap-4"
                >
                  <span
                    className="font-display font-extrabold leading-none tracking-tight select-none"
                    style={{
                      fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                      letterSpacing: "-0.03em",
                      // gradient from design system: text-gradient
                      background: "linear-gradient(135deg, #152A38 0%, #2F5241 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    with Prasetyo.
                  </span>

                  {/* Thin accent line — draws in to reinforce the payoff moment */}
                  <motion.div
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      height: "1px",
                      width: "clamp(120px, 20vw, 240px)",
                      background: "linear-gradient(90deg, transparent, #2F5241, transparent)",
                      transformOrigin: "center",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner mono label — subtle, like section-label pattern */}
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="section-label absolute bottom-8 left-1/2 -translate-x-1/2"
            aria-hidden="true"
          >
            Portfolio / 2025
          </motion.p> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
