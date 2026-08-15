import { motion } from "framer-motion";
import { Link, GitFork, Mail, ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const contactLinks = [
  {
    label: "LinkedIn",
    href: profile.contact.linkedin,
    icon: Link,
    description: "Connect professionally",
  },
  {
    label: "GitHub",
    href: profile.contact.github,
    icon: GitFork,
    description: "See my code",
  },
  {
    label: "Email",
    href: profile.contact.email,
    icon: Mail,
    description: "Send a message",
  },
];

export default function Contact() {
  const reduced = useReducedMotion();

  return (
    <section id="contact" aria-label="Contact" className="py-24 lg:py-32 border-t border-[#152A38]/10">
      <Container>
        <div className="max-w-2xl">
          <SectionHeader label="10 / LET'S CONNECT" className="mb-8" />

          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-[#152A38] leading-tight mb-4 tracking-tight"
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Let&apos;s build something meaningful.
          </motion.h2>

          <motion.p
            className="text-[#4A5B52] leading-relaxed mb-10"
            initial={reduced ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Whether it&apos;s a digital product, AI solution, automation workflow, or technology project, let&apos;s talk.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3">
            {contactLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border border-[#152A38]/12 bg-[#FAF8F2] px-5 py-4 hover:border-[#2F5241] hover:bg-[#D6CFB9]/30 transition-all duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] shadow-2xs"
                  aria-label={`${link.label} — ${link.description}`}
                  initial={reduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Icon
                    size={16}
                    className="text-[#2F5241] group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#152A38]">{link.label}</p>
                    <p className="text-xs text-[#4A5B52]">{link.description}</p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-[#2F5241] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </motion.a>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
