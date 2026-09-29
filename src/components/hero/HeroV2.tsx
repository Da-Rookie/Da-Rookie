import { lazy, Suspense, useRef } from "react";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { AppLink } from "@/lib/router";
import { WebGLBoundary } from "./WebGLBoundary";
import { useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";
const InteractiveTypography = lazy(() => import("./InteractiveTypography"));
export function HeroV2() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  return (
    <section ref={rootRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-intro">
        <span>EKO PRASETYO PRATOMO</span>
        <span className="hero-edition">
          INDEPENDENT MIND. USEFUL TECHNOLOGY.
        </span>
      </div>
      <div className="hero-stage">
        <h1
          id="hero-title"
          className="hero-type"
          aria-label="Build. Automate. Lead."
        >
          <span className="hero-line">
            <span data-hero-word>BUILD</span>
            <span className="word-caption" aria-hidden="true">
              Ideas into
              <br />
              working systems.
            </span>
          </span>
          <span className="hero-line">
            <span data-hero-word>AUTOMATE</span>
          </span>
          <span className="hero-line">
            <span className="hero-arrow" aria-hidden="true">
              <MoveUpRight strokeWidth={0.7} />
            </span>
            <span data-hero-word>LEAD</span>
            <span className="word-caption" aria-hidden="true">
              Technology with
              <br />a sense of direction.
            </span>
          </span>
        </h1>
        <span className="interaction-hint" aria-hidden="true">
          <span className="desktop-hint">
            Move across the words. Discover another dimension.
          </span>
          <span className="touch-hint">Touch & slide across the words.</span>
        </span>
      </div>
      {!reduced && (
        <WebGLBoundary>
          <Suspense fallback={null}>
            <InteractiveTypography rootRef={rootRef} />
          </Suspense>
        </WebGLBoundary>
      )}
      <div className="hero-bottom">
        <div className="hero-position">
          <p>{profile.titles.join(" · ")}</p>
          <span>Building useful technology for real operational needs.</span>
        </div>
        <div className="hero-actions">
          <a href="#selected-work" className="pill-link">
            Explore Selected Work <ArrowDown size={17} />
          </a>
          <AppLink href="/contact" className="text-link">
            Start a Conversation <ArrowUpRight size={17} />
          </AppLink>
        </div>
      </div>
    </section>
  );
}
