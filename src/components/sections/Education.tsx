import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { education } from "@/data/education";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Education() {
  const reduced = useReducedMotion();

  return (
    <section id="education" aria-label="Education" className="py-16 lg:py-20 border-t border-[#152A38]/10">
      <Container>
        <SectionHeader label="09 / EDUCATION" className="mb-8" />

        <div className="max-w-xl">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              className="card-surface rounded-sm p-5 sm:p-6 flex items-start gap-4 hover:border-[#2F5241] transition-all duration-300 shadow-2xs"
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 border border-[#2F5241]/30 bg-[#D6CFB9]/40 flex items-center justify-center shrink-0 mt-0.5 rounded-xs">
                <GraduationCap size={16} className="text-[#2F5241]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#152A38] text-base mb-1">
                  {edu.institution}
                </h3>
                <p className="text-[#4A5B52] text-sm mb-2">
                  {edu.degree} {edu.field}
                </p>
                <div className="flex flex-col items-left gap-2 sm:gap-3">
                  <span className="font-mono text-[10px] text-[#4A5B52]">
                    {edu.startYear} - {edu.endYear ?? "Present"}
                  </span>
                  {edu.gpa && (
                    <span className="font-mono text-[10px] w-max tracking-wider border border-[#152A38]/15 bg-[#E4E5DB]/70 text-[#152A38] font-bold px-2 py-0.5">
                      {edu.gpa}
                    </span>
                  )}
                  <span className="font-mono text-[10px] w-max tracking-widest uppercase border border-[#2F5241]/40 bg-[#D6CFB9]/40 text-[#2F5241] font-semibold px-2 py-0.5">
                    {edu.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
