import { motion } from "framer-motion";
import { Code2, Brain, Server, Zap, Layers } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { skillGroups } from "@/data/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const iconMap: Record<string, React.ElementType> = {
  code: Code2,
  brain: Brain,
  server: Server,
  zap: Zap,
  layers: Layers,
};

export default function Skills() {
  const reduced = useReducedMotion();

  return (
    <section id="skills" aria-label="Technology and Skills" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <SectionHeader label="07 / TECHNOLOGY" className="mb-12" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, i) => {
            const Icon = iconMap[group.icon] ?? Code2;
            return (
              <motion.div
                key={group.id}
                className="card-surface rounded-sm p-5 sm:p-6 group hover:border-[#2F5241] transition-all duration-300 shadow-2xs"
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 border border-[#152A38]/15 bg-[#D6CFB9]/40 flex items-center justify-center shrink-0 rounded-xs">
                    <Icon size={13} className="text-[#2F5241]" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-[#152A38] text-sm">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${group.category} skills`}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      role="listitem"
                      className="font-mono text-[10px] px-2 py-0.5 border border-[#152A38]/12 bg-[#FAF8F2] text-[#4A5B52] hover:border-[#2F5241] hover:text-[#2F5241] hover:bg-[#D6CFB9]/30 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
