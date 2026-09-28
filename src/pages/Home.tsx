import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroV2 } from "@/components/hero/HeroV2";
import { achievements } from "@/data/achievements";
import { projects } from "@/data/projects";
import { publications } from "@/data/publications";
import { AppLink } from "@/lib/router";

export function HomePage() {
  return (
    <main className="page page--home">
      <HeroV2 />

      <section className="editorial-section intro-statement" aria-labelledby="practice-heading">
        <div className="section-eyebrow">01 / PRACTICE</div>
        <div className="intro-statement__grid">
          <h2 id="practice-heading">Systems with a reason to exist.</h2>
          <div className="intro-statement__copy">
            <p>
              Engineering, automation, and project leadership in one practice — focused on useful technology for real operational problems.
            </p>
            <AppLink href="/about" className="text-link">
              About the practice <ArrowRight size={17} aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </section>

      <section id="selected-work" className="editorial-section selected-work" aria-labelledby="selected-work-heading">
        <div className="section-heading-row">
          <div>
            <div className="section-eyebrow">02 / SELECTED WORK</div>
            <h2 id="selected-work-heading">Selected systems & products.</h2>
          </div>
          <span className="section-count">{String(projects.length).padStart(2, "0")}</span>
        </div>

        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-row" key={project.id}>
              <AppLink href={`/projects/${project.id}`} className="project-row__link" ariaLabel={`View ${project.title} case study`}>
                <div className={`project-row__visual project-row__visual--${(index % 3) + 1}`} aria-hidden="true">
                  <span className="project-row__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="project-row__monogram">{project.title.split(" ").map((word) => word[0]).join("").slice(0, 3)}</span>
                  <span className="project-row__visual-line" />
                </div>
                <div className="project-row__content">
                  <div className="project-row__meta">
                    <span>{project.label.replace(/^\d+\s*\/\s*/, "")}</span>
                    <span>{project.period}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                  <div className="project-row__tech" aria-label="Key technologies">
                    {project.technologies.slice(0, 5).map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                </div>
                <span className="project-row__arrow" aria-hidden="true">
                  <ArrowUpRight size={22} />
                </span>
              </AppLink>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section home-recognition" aria-labelledby="home-recognition-heading">
        <div className="section-eyebrow">03 / SIGNAL</div>
        <div className="home-recognition__grid">
          <div>
            <h2 id="home-recognition-heading">Work that leaves evidence.</h2>
            <p>Selected professional recognition and published work. The complete record lives in Recognition.</p>
          </div>
          <div className="home-recognition__items">
            {achievements.slice(0, 2).map((item) => (
              <div className="signal-item" key={item.id}>
                <span>{item.year}</span>
                <strong>{item.award}</strong>
                <small>{item.title}</small>
              </div>
            ))}
            {publications.slice(0, 1).map((item) => (
              <div className="signal-item" key={item.id}>
                <span>{item.publishedDate}</span>
                <strong>{item.accreditation}</strong>
                <small>{item.title}</small>
              </div>
            ))}
          </div>
        </div>
        <AppLink href="/recognition" className="text-link">
          View Recognition <ArrowRight size={17} aria-hidden="true" />
        </AppLink>
      </section>

      <section className="editorial-section closing-cta" aria-labelledby="home-closing-heading">
        <div className="closing-cta__line" aria-hidden="true" />
        <h2 id="home-closing-heading">Have a useful problem to solve?</h2>
        <AppLink href="/contact" className="button-link">
          Start a Conversation <ArrowUpRight size={18} aria-hidden="true" />
        </AppLink>
      </section>
    </main>
  );
}
