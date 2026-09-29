import { ArrowUpRight, ArrowRight } from "lucide-react";
import { HeroV2 } from "@/components/hero/HeroV2";
import { projects } from "@/data/projects";
import { AppLink } from "@/lib/router";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { NextChapter } from "@/components/ui/NextChapter";
export function HomePage() {
  return (
    <main className="page page--home">
      <HeroV2 />
      <section className="practice-band">
        <div className="eyebrow">01 / THE PRACTICE</div>
        <div>
          <h2>
            Systems with a<br />
            <em>reason to exist.</em>
          </h2>
          <div className="practice-copy">
            <p>
              Engineering, automation, and project leadership — in one practice.
              From understanding the operational problem to building what comes
              next.
            </p>
            <AppLink href="/about" className="text-link">
              Meet the person behind the work <ArrowUpRight size={18} />
            </AppLink>
          </div>
        </div>
        <div className="practice-index" aria-hidden="true">
          B / A / L
        </div>
      </section>
      <section id="selected-work" className="selected-work section-pad">
        <div className="section-top">
          <div className="eyebrow">02 / SELECTED WORK</div>
          <span>PRODUCTS, SYSTEMS & POSSIBILITIES</span>
        </div>
        <h2 className="section-title">
          Intent into
          <br />
          <em>implementation.</em>
        </h2>
        <div className="work-grid">
          {projects.map((project, index) => (
            <article
              className={`work-entry work-entry--${index + 1}`}
              key={project.id}
            >
              <AppLink
                href={`/projects/${project.id}`}
                className="work-link"
                ariaLabel={`View ${project.title}`}
              >
                <ProjectVisual project={project} index={index} />
                <div className="work-caption">
                  <span>{project.label.replace(/^\d+\s*\/\s*/, "")}</span>
                  <span>{project.period}</span>
                </div>
                <div className="work-title">
                  <h3>{project.title}</h3>
                  <ArrowUpRight size={26} />
                </div>
                <p>{project.subtitle}</p>
              </AppLink>
            </article>
          ))}
        </div>
      </section>
      <section className="home-evidence section-pad">
        <div>
          <div className="eyebrow">03 / BEYOND THE BUILD</div>
          <h2>
            Work.
            <br />
            With a record.
          </h2>
          <AppLink href="/recognition" className="text-link">
            Explore Recognition <ArrowRight size={17} />
          </AppLink>
        </div>
        <div className="evidence-list">
          <div>
            <span>2025 / PEKAN INOVASI</span>
            <h3>Gold Medal</h3>
            <p>Klik Kelontong</p>
          </div>
          <div>
            <span>2025 / P2MW</span>
            <h3>Funding Recipient</h3>
            <p>Klik Kelontong</p>
          </div>
          <div>
            <span>RESEARCH & CONTINUOUS LEARNING</span>
            <h3>Published. Practised.</h3>
            <p>Publications and professional certificates.</p>
          </div>
        </div>
      </section>
      <NextChapter
        label="YOUR NEXT CHAPTER"
        title="Let's build something useful."
        href="/contact"
      />
    </main>
  );
}
