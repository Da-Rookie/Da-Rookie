import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { publications } from "@/data/publications";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Publications() {
  const reduced = useReducedMotion();

  return (
    <section id="research" aria-label="Research and Publications" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <SectionHeader label="06 / RESEARCH & PUBLICATIONS" className="mb-12" />

        <div className="grid md:grid-cols-2 gap-4">
          {publications.map((pub, i) => (
            <motion.article
              key={pub.id}
              className="card-surface rounded-sm p-6 sm:p-7 group transition-all duration-300 hover:border-[#2F5241] flex flex-col shadow-2xs"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              aria-label={`Publication: ${pub.title}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-[#2F5241]" aria-hidden="true" />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#2F5241] font-semibold">
                    Published
                  </span>
                </div>
                <span className="border border-[#2F5241]/40 bg-[#D6CFB9]/40 text-[#2F5241] font-mono text-[10px] px-2 py-0.5 tracking-wider font-semibold">
                  {pub.accreditation}
                </span>
              </div>

              <h3 className="font-display font-bold text-[#152A38] text-base leading-snug mb-3 flex-1">
                {pub.title}
              </h3>

              <p className="text-sm text-[#4A5B52] leading-relaxed mb-4">
                {pub.description}
              </p>

              {/* Meta */}
              <div className="space-y-1.5 mb-4 border-t border-[#152A38]/10 pt-4">
                <p className="font-mono text-[10px] text-[#4A5B52]">
                  <span className="text-[#4A5B52]/70 font-sans text-xs">Journal / Publisher</span>
                  <br />
                  <span className="text-[#152A38] font-medium">{pub.journal ? `${pub.journal} — ` : ""}{pub.publisher}</span>
                </p>
                <p className="font-mono text-[10px] text-[#4A5B52]">
                  <span className="text-[#4A5B52]/70 font-sans text-xs">Published</span>
                  <br />
                  <span className="text-[#152A38] font-medium">{pub.publishedDate}</span>
                </p>
                {pub.institution && (
                  <p className="font-mono text-[10px] text-[#4A5B52]">
                    <span className="text-[#4A5B52]/70 font-sans text-xs">Institution</span>
                    <br />
                    <span className="text-[#152A38] font-medium">{pub.institution}</span>
                  </p>
                )}
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {pub.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="font-mono text-[9px] px-2 py-0.5 border border-[#152A38]/12 bg-[#E4E5DB]/70 text-[#4A5B52]"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 text-sm font-medium text-[#2F5241] hover:text-[#152A38] transition-colors mt-auto"
                  aria-label={`Read publication: ${pub.title}`}
                >
                  Read Publication
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
