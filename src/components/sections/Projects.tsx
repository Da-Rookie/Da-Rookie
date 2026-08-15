import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Projects() {
  const reduced = useReducedMotion();

  return (
    <section id="work" aria-label="Selected Work" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="04 / SELECTED WORK"
            subtitle="A selection of products and systems I've designed, built, and contributed to."
          />
        </div>

        <div className="space-y-4">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              className="card-surface rounded-sm group transition-all duration-300 hover:border-[#2F5241] overflow-hidden shadow-2xs"
              initial={reduced ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              aria-label={`Project: ${project.title}`}
            >
              {/* Header bar */}
              <div className="border-b border-[#152A38]/10 px-6 py-3 flex items-center justify-between bg-[#D6CFB9]/20">
                <span className="section-label">{project.label}</span>
                <span className="font-mono text-[10px] text-[#4A5B52]">{project.period}</span>
              </div>

              <div className={`p-6 sm:p-8 ${i === 0 ? "lg:p-10" : ""}`}>
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                  {/* Main info */}
                  <div className={i === 0 ? "lg:col-span-2" : "lg:col-span-2"}>
                    <h3 className={`font-display font-bold text-[#152A38] mb-2 tracking-tight ${i === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                      {project.title}
                    </h3>
                    <p className="text-[#2F5241] font-semibold mb-4">{project.subtitle}</p>
                    <p className="text-[#4A5B52] leading-relaxed mb-6 max-w-xl">
                      {project.description}
                    </p>

                    {/* Role */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.role.map((r) => (
                        <span
                          key={r}
                          className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 border border-[#2F5241]/35 bg-[#D6CFB9]/40 text-[#2F5241] font-semibold"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-2 py-0.5 border border-[#152A38]/12 bg-[#FAF8F2] text-[#4A5B52] group-hover:border-[#2F5241] group-hover:text-[#2F5241] transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right panel — features / architecture */}
                  <div className="lg:col-span-1 space-y-5">
                    {project.architecture && (
                      <div>
                        <p className="font-mono text-[9px] tracking-widest uppercase text-[#4A5B52] font-semibold mb-3">
                          Architecture
                        </p>
                        <div className="space-y-0">
                          {project.architecture.map((layer, li) => (
                            <div key={layer}>
                              <div className="border border-[#152A38]/12 bg-[#E4E5DB]/70 px-3 py-1.5 text-xs text-[#152A38] font-medium group-hover:border-[#2F5241] transition-colors">
                                {layer}
                              </div>
                              {li < project.architecture!.length - 1 && (
                                <div className="flex justify-center py-0.5" aria-hidden="true">
                                  <span className="text-[#152A38]/40 text-xs">↓</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-mono text-[9px] tracking-widest uppercase text-[#4A5B52] font-semibold mb-2">
                        Capabilities
                      </p>
                      <ul className="space-y-1">
                        {project.features.slice(0, 6).map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-xs text-[#4A5B52]"
                          >
                            <ChevronRight size={10} className="text-[#2F5241] shrink-0" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                        {project.features.length > 6 && (
                          <li className="text-xs text-[#4A5B52] pl-4">
                            +{project.features.length - 6} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* {i === 0 && (
                      <a
                        href={project.caseStudyUrl ?? "#"}
                        className="group/btn inline-flex items-center gap-1.5 text-sm font-medium text-[#2F5241] hover:text-[#152A38] transition-colors"
                        aria-label={`View case study for ${project.title}`}
                        tabIndex={project.caseStudyUrl ? 0 : -1}
                        aria-disabled={!project.caseStudyUrl}
                      >
                        View Case Study
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    )} */}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
