import { motion } from "framer-motion";
import { Code2, Zap, Users, Briefcase } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const cards = [
  {
    id: "build",
    label: "BUILD",
    title: "Full-Stack Development",
    description:
      "I design and build scalable web applications, SaaS platforms, dashboards, and enterprise systems.",
    tags: ["Laravel", "React", "Next.js", "TypeScript"],
    icon: Code2,
    accent: false,
    large: true,
  },
  {
    id: "automate",
    label: "AUTOMATE",
    title: "AI & Business Automation",
    description:
      "I turn repetitive workflows into intelligent, data-driven systems.",
    tags: ["AI", "NLP", "Python", "n8n", "LangChain"],
    icon: Zap,
    accent: false,
    large: false,
  },
  {
    id: "lead",
    label: "LEAD",
    title: "Product & Project Management",
    description:
      "I connect business requirements, technical execution, and cross-functional teams.",
    tags: ["Agile", "Project Management", "Product Strategy", "Stakeholder Management"],
    icon: Users,
    accent: false,
    large: false,
  },
  {
    id: "currently",
    label: "CURRENTLY",
    title: "Project Manager",
    description: "ReCreate Academy",
    tags: ["Aug 2026 — Present", "Remote"],
    icon: Briefcase,
    accent: true,
    large: false,
    isCurrent: true,
  },
];

export default function CapabilityBento() {
  const reduced = useReducedMotion();

  return (
    <section id="capabilities" aria-label="Capabilities" className="py-24 lg:py-32">
      <Container>
        <SectionHeader label="02 / WHAT I DO" className="mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Large BUILD card */}
          <motion.div
            className="sm:col-span-2 lg:col-span-2 lg:row-span-2 card-surface rounded-sm p-7 group transition-all duration-300 hover:border-[#2F5241] flex flex-col shadow-2xs"
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-6">
              <p className="section-label">{cards[0].label}</p>
              <div className="w-8 h-8 border border-[#152A38]/15 flex items-center justify-center bg-[#D6CFB9]/40 rounded-xs">
                <Code2 size={14} className="text-[#2F5241]" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#152A38] mb-3">
              {cards[0].title}
            </h3>
            <p className="text-[#4A5B52] leading-relaxed mb-6 flex-1">
              {cards[0].description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {cards[0].tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] px-2 py-1 border border-[#152A38]/12 bg-[#FAF8F2] text-[#4A5B52] group-hover:border-[#2F5241] group-hover:text-[#2F5241] transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* AUTOMATE */}
          <motion.div
            className="card-surface rounded-sm p-6 group transition-all duration-300 hover:border-[#2F5241] flex flex-col shadow-2xs"
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="section-label">{cards[1].label}</p>
              <Zap size={14} className="text-[#2F5241]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-base font-bold text-[#152A38] mb-2">
              {cards[1].title}
            </h3>
            <p className="text-sm text-[#4A5B52] leading-relaxed mb-4 flex-1">
              {cards[1].description}
            </p>
            <div className="flex flex-wrap gap-1">
              {cards[1].tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] px-1.5 py-0.5 border border-[#152A38]/12 bg-[#FAF8F2] text-[#4A5B52]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* LEAD */}
          <motion.div
            className="card-surface rounded-sm p-6 group transition-all duration-300 hover:border-[#2F5241] flex flex-col shadow-2xs"
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="section-label">{cards[2].label}</p>
              <Users size={14} className="text-[#2F5241]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-base font-bold text-[#152A38] mb-2">
              {cards[2].title}
            </h3>
            <p className="text-sm text-[#4A5B52] leading-relaxed mb-4 flex-1">
              {cards[2].description}
            </p>
            <div className="flex flex-wrap gap-1">
              {cards[2].tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] px-1.5 py-0.5 border border-[#152A38]/12 bg-[#FAF8F2] text-[#4A5B52]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CURRENTLY */}
          <motion.div
            className="sm:col-span-2 lg:col-span-2 border border-[#2F5241]/35 bg-[#D6CFB9]/35 rounded-sm p-6 transition-all duration-300 hover:border-[#2F5241] hover:bg-[#D6CFB9]/50 shadow-2xs"
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="section-label">{cards[3].label}</p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F5241] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2F5241]" />
                </span>
                <span className="font-mono text-[9px] tracking-widest uppercase text-[#2F5241] font-semibold">
                  Active
                </span>
              </div>
            </div>
            <h3 className="font-display text-lg font-bold text-[#152A38] mb-1">
              {cards[3].title}
            </h3>
            <p className="text-[#2F5241] font-semibold mb-3">{cards[3].description}</p>
            <div className="flex gap-3">
              {cards[3].tags.map((t) => (
                <span key={t} className="font-mono text-[10px] text-[#4A5B52]">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
