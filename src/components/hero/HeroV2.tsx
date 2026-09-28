import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { AppLink } from "@/lib/router";
import { InteractiveTypography } from "./InteractiveTypography";

export function HeroV2() {
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section ref={heroRef} className="hero-v2" aria-labelledby="hero-title">
      <InteractiveTypography rootRef={heroRef} />

      <div className="hero-v2__topline" aria-hidden="true">
        <div className="brand-lockup">
          <span className="brand-lockup__mark">P</span>
          <span className="brand-lockup__word">PRASETYO</span>
        </div>
        <span className="hero-v2__location">{profile.location}</span>
      </div>

      <div className="hero-v2__body">
        <motion.div
          className="hero-v2__kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {profile.titles.join(" · ")}
        </motion.div>

        <h1 id="hero-title" className="hero-type" aria-label="Build. Automate. Lead.">
          <motion.span
            data-hero-word
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            BUILD.
          </motion.span>
          <motion.span
            data-hero-word
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            AUTOMATE.
          </motion.span>
          <motion.span
            data-hero-word
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            LEAD.
          </motion.span>
        </h1>

        <div className="hero-v2__footer">
          <p>
            Building digital products, intelligent systems, automation, and technology projects for real operational needs.
          </p>

          <div className="hero-v2__actions">
            <a className="text-link" href="#selected-work">
              Explore Selected Work
              <ArrowDownRight size={17} aria-hidden="true" />
            </a>
            <AppLink className="text-link text-link--muted" href="/contact">
              Start a Conversation
              <ArrowUpRight size={17} aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
