import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const journey = [
  { year: "2020", role: "HR Generalist" },
  { year: "", role: "HR Payroll" },
  { year: "2023", role: "IT Support" },
  { year: "2024", role: "Web Programming" },
  { year: "2024–2026", role: "Product & Technology Lead" },
  { year: "2025", role: "Full-Stack Developer" },
  { year: "2026", role: "Project Manager" },
];

export default function About() {
  const reduced = useReducedMotion();

  return (
    <section id="about" aria-label="About" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left */}
          <div>
            <SectionHeader label="03 / ABOUT" className="mb-8" />

            <motion.h2
              className="font-display text-2xl sm:text-3xl font-bold text-[#152A38] leading-tight mb-8"
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {profile.about.headline}
            </motion.h2>

            <div className="space-y-4">
              {profile.about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  className="text-[#4A5B52] leading-relaxed"
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right — Journey */}
          <div>
            <motion.div
              initial={reduced ? {} : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="border border-[#152A38]/12 bg-[#FAF8F2] p-6 sm:p-8 rounded-sm shadow-2xs">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#2F5241] font-semibold mb-6">
                  THE JOURNEY
                </p>
                <h3 className="font-display text-lg font-bold text-[#152A38] mb-6 leading-snug">
                  From business operations to technology leadership.
                </h3>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-[#152A38]/15" aria-hidden="true" />

                  <div className="space-y-0">
                    {journey.map((item, i) => (
                      <motion.div
                        key={i}
                        className="relative pl-6 flex items-start gap-4 group"
                        style={{ paddingBottom: i < journey.length - 1 ? "1.25rem" : 0 }}
                        initial={reduced ? {} : { opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                      >
                        {/* Dot */}
                        <div
                          className={`absolute left-[-4px] top-1 w-2 h-2 rounded-full border transition-colors ${
                            i === journey.length - 1
                              ? "border-[#2F5241] bg-[#2F5241]"
                              : "border-[#152A38]/30 bg-[#E4E5DB] group-hover:border-[#2F5241]"
                          }`}
                          aria-hidden="true"
                        />

                        <div className="flex items-baseline gap-3 min-w-0">
                          <span
                            className="font-mono text-[10px] tracking-widest text-[#2F5241] font-semibold shrink-0 w-16"
                            aria-label={item.year ? `Year ${item.year}` : undefined}
                          >
                            {item.year}
                          </span>
                          <span
                            className={`font-display text-sm font-semibold ${
                              i === journey.length - 1 ? "text-[#152A38]" : "text-[#4A5B52]"
                            }`}
                          >
                            {item.role.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-xs text-[#4A5B52] leading-relaxed border-t border-[#152A38]/10 pt-5">
                  My career has evolved across business operations, IT support, software engineering,
                  product development, and project management, giving me a perspective that connects
                  technical execution with real business needs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
