import { motion } from "framer-motion";
import { Trophy, Award } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { achievements } from "@/data/achievements";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const icons = [Trophy, Award];

export default function Achievements() {
  const reduced = useReducedMotion();

  return (
    <section id="achievements" aria-label="Recognition and Achievements" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <SectionHeader label="08 / RECOGNITION" className="mb-12" />

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {achievements.map((ach, i) => {
            const Icon = icons[i] ?? Trophy;
            return (
              <motion.article
                key={ach.id}
                className="card-surface rounded-sm p-6 sm:p-7 group hover:border-[#2F5241] transition-all duration-300 shadow-2xs"
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                aria-label={`Achievement: ${ach.award} — ${ach.title}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 border border-[#2F5241]/30 bg-[#D6CFB9]/40 flex items-center justify-center rounded-xs">
                    <Icon
                      size={16}
                      className="text-[#2F5241]"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#2F5241] font-semibold border border-[#2F5241]/30 bg-[#FAF8F2] px-2 py-0.5">
                    {ach.year}
                  </span>
                </div>

                <h3 className="font-display font-bold text-[#152A38] text-lg mb-1">
                  {ach.award}
                </h3>
                <p className="text-[#2F5241] font-semibold text-sm mb-3">{ach.title}</p>

                {ach.project && (
                  <p className="font-mono text-[10px] tracking-widest uppercase text-[#4A5B52] mb-3">
                    {ach.project}
                  </p>
                )}

                <p className="text-sm text-[#4A5B52] leading-relaxed">
                  {ach.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
