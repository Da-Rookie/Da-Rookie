import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Circle } from "lucide-react";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Container from "@/components/layout/Container";

const gridItems = [
  "01 SOFTWARE",
  "02 HARDWARE",
  "03 DATA",
  "04 AUTOMATION",
  "05 PRODUCT",
  "06 PROJECT",
];

export default function Hero() {
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;

    const handleMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      grid.style.transform = `translate(${x}px, ${y}px)`;
    };
    const handleLeave = () => {
      grid.style.transform = "translate(0,0)";
    };

    const hero = grid.parentElement;
    hero?.addEventListener("mousemove", handleMove);
    hero?.addEventListener("mouseleave", handleLeave);
    return () => {
      hero?.removeEventListener("mousemove", handleMove);
      hero?.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduced]);

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: "easeOut" as const },
      };

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-screen flex items-center overflow-hidden pt-14"
    >
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(47,82,65,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(21,42,56,1) 1px, transparent 1px), linear-gradient(90deg, rgba(21,42,56,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <Container className="relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left — content */}
          <div>
            <motion.div {...fadeUp(0)} className="mb-8">
              <p className="section-label">01 / INTRODUCTION</p>
            </motion.div>

            <motion.div {...fadeUp(0.08)} className="mb-4">
              <p className="font-mono text-xs tracking-[0.2em] text-[#4A5B52] uppercase mb-2">
                {profile.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.titles.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-widest uppercase text-[#2F5241] font-semibold border border-[#2F5241]/30 bg-[#D6CFB9]/40 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp(0.16)}
              className="font-display font-extrabold leading-[0.9] tracking-tight text-[#152A38] mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
            >
              <span className="block">BUILD.</span>
              <span className="block">AUTOMATE.</span>
              <span className="block text-accent-gradient">LEAD.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.24)}
              className="text-[#4A5B52] leading-relaxed mb-8 max-w-lg"
              style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}
            >
              {profile.description}
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3 mb-10">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 bg-[#2F5241] hover:bg-[#152A38] text-[#E4E5DB] font-medium px-5 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4E5DB]"
                aria-label="View Selected Work"
              >
                View Selected Work
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 border border-[#152A38]/20 hover:border-[#2F5241] text-[#152A38] font-medium px-5 py-2.5 text-sm transition-all bg-[#FAF8F2] hover:bg-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4E5DB]"
              >
                Let&apos;s Connect
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.36)} className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F5241] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F5241]" />
                </span>
                <span className="text-sm text-[#4A5B52]">{profile.status}</span>
              </div>

              {/* Current role */}
              <div className="border-l border-[#152A38]/15 pl-4 sm:pl-6">
                <p className="font-mono text-[12px] tracking-widest uppercase text-[#4A5B52] mb-0.5">
                  Current Role
                </p>
                <p className="text-sm font-medium text-[#152A38]">
                  {profile.currentRole.title}
                </p>
                <p className="text-sm font-semibold text-[#2F5241]">{profile.currentRole.company}</p>
                <p className="font-mono text-[12px] text-[#4A5B52]">
                  {profile.currentRole.period}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — abstract visual grid */}
          <div
            className="hidden lg:flex items-center justify-center relative h-96"
            aria-hidden="true"
          >
            <div
              ref={gridRef}
              className="relative w-72 h-72 transition-transform duration-300 ease-out"
            >
              {/* Center node */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 flex items-center justify-center bg-[#FAF8F2] shadow-xs"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(214,207,185,0.6) 0%, #FAF8F2 70%)",
                  }}
                >
                  <span className="font-mono text-[10px] text-[#2F5241] tracking-widest font-bold">
                    AI
                  </span>
                </div>
              </div>

              {/* Orbiting labels */}
              {gridItems.map((item, i) => {
                const angle = (i / gridItems.length) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 120;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <motion.div
                    key={item}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px - 52px)`,
                      top: `calc(50% + ${y}px - 14px)`,
                      width: 104,
                    }}
                    initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  >
                    <div className="border border-[#152A38]/12 bg-[#FAF8F2] px-2 py-1 text-center hover:border-[#2F5241] transition-colors shadow-2xs">
                      <span className="font-mono text-[9px] tracking-widest text-[#152A38] font-medium">
                        {item}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Connecting lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 288 288"
                fill="none"
              >
                {gridItems.map((_, i) => {
                  const angle = (i / gridItems.length) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const r = 120;
                  const x = 144 + Math.cos(rad) * r;
                  const y = 144 + Math.sin(rad) * r;
                  return (
                    <line
                      key={i}
                      x1="144"
                      y1="144"
                      x2={x}
                      y2={y}
                      stroke="rgba(47,82,65,0.25)"
                      strokeWidth="1"
                    />
                  );
                })}
                <circle
                  cx="144"
                  cy="144"
                  r={120}
                  stroke="rgba(21,42,56,0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-16 lg:mt-24 flex items-center gap-3"
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-[#152A38]/15 max-w-[80px]" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#4A5B52]">
            Scroll to explore
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
