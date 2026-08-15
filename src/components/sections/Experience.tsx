import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { experiences } from "@/data/experience";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Experience() {
  const [expanded, setExpanded] = useState<string>("recreate");
  const reduced = useReducedMotion();

  return (
    <section id="experience" aria-label="Experience" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <SectionHeader label="05 / EXPERIENCE" className="mb-12" />

        <div className="max-w-3xl space-y-1" role="list">
          {experiences.map((exp, i) => {
            const isOpen = expanded === exp.id;
            const isCurrent = !exp.endDate;

            return (
              <motion.div
                key={exp.id}
                role="listitem"
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div
                  className={`border transition-all duration-300 rounded-sm shadow-2xs ${
                    isOpen
                      ? "border-[#2F5241] bg-[#D6CFB9]/30"
                      : "border-[#152A38]/12 bg-[#FAF8F2] hover:border-[#2F5241]"
                  }`}
                >
                  <button
                    className="w-full text-left px-5 py-4 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] focus-visible:ring-inset"
                    onClick={() => setExpanded(isOpen ? "" : exp.id)}
                    aria-expanded={isOpen}
                    aria-controls={`exp-${exp.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-[#152A38] text-base">
                          {exp.position}
                        </h3>
                        {isCurrent && (
                          <span className="font-mono text-[9px] tracking-widest uppercase border border-[#2F5241]/40 text-[#2F5241] bg-[#D6CFB9]/50 font-semibold px-1.5 py-0.5">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className={`font-medium ${isOpen ? "text-[#2F5241] font-semibold" : "text-[#4A5B52]"}`}>
                          {exp.company}
                        </span>
                        {exp.employmentType && (
                          <span className="text-[#4A5B52] font-mono text-xs">{exp.employmentType}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="hidden sm:block">
                        <p className="font-mono text-[10px] text-[#4A5B52]">
                          {exp.startDate} — {exp.endDate ?? "Present"}
                        </p>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-[#4A5B52] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#2F5241]" : ""}`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`exp-${exp.id}`}
                        initial={reduced ? {} : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-[#152A38]/10">
                          {/* Meta */}
                          <div className="flex flex-wrap gap-x-5 gap-y-2 py-3 mb-4">
                            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#4A5B52]">
                              <MapPin size={10} aria-hidden="true" />
                              {exp.location}
                            </span>
                            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#4A5B52]">
                              <Clock size={10} aria-hidden="true" />
                              {exp.workMode}
                            </span>
                            <span className="font-mono text-[10px] text-[#4A5B52] sm:hidden">
                              {exp.startDate} — {exp.endDate ?? "Present"}
                            </span>
                          </div>

                          <ul className="space-y-2.5" role="list">
                            {exp.description.map((d, di) => (
                              <li
                                key={di}
                                className="flex gap-3 text-sm text-[#4A5B52] leading-relaxed"
                              >
                                <span className="text-[#2F5241] mt-1.5 shrink-0 text-[8px]" aria-hidden="true">▸</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
