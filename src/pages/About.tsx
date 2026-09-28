import { ArrowUpRight } from "lucide-react";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { AppLink } from "@/lib/router";

const capabilities = [
  "Digital Products",
  "AI Systems",
  "Business Automation",
  "Data-driven Solutions",
  "Internal Business Systems",
  "API-driven Platforms",
];

export function AboutPage() {
  return (
    <main className="page page--inner">
      <header className="page-hero page-hero--about">
        <div className="page-hero__index">02</div>
        <div className="section-eyebrow">ABOUT / PRACTICE</div>
        <h1>Engineering, automation, and project leadership — in one practice.</h1>
        <div className="page-hero__support">
          <p>{profile.about.paragraphs[0]}</p>
          <p>
            The work sits between implementation and execution: understanding the operational problem, choosing the right technical approach, and moving the project toward something useful.
          </p>
        </div>
      </header>

      <section className="editorial-section capability-section" aria-labelledby="capabilities-heading">
        <div className="section-heading-row section-heading-row--compact">
          <div>
            <div className="section-eyebrow">WHAT I BUILD</div>
            <h2 id="capabilities-heading">Capabilities, not a logo wall.</h2>
          </div>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability, index) => (
            <article className="capability-item" key={capability}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{capability}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section skills-section" aria-labelledby="skills-heading">
        <div className="section-eyebrow">SKILLS / CAPABILITY MAP</div>
        <div className="skills-layout">
          <div className="skills-layout__intro">
            <h2 id="skills-heading">Tools grouped by the work they enable.</h2>
            <p>
              The stack changes with the problem. The capability stays centered on building, automating, analysing, and leading delivery.
            </p>
          </div>
          <div className="skills-groups">
            {skillGroups.map((group) => (
              <article className="skill-group" key={group.id}>
                <div className="skill-group__title">{group.category}</div>
                <div className="skill-group__items">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section education-section" aria-labelledby="education-heading">
        <div className="section-eyebrow">EDUCATION</div>
        <h2 id="education-heading" className="sr-only">Education</h2>
        {education.map((item) => (
          <article className="education-row" key={item.id}>
            <div>
              <span className="education-row__period">
                {item.startYear} — {item.endYear ?? "Present"}
              </span>
            </div>
            <div>
              <h3>{item.institution}</h3>
              <p>{item.degree} · {item.field}</p>
            </div>
            <div className="education-row__status">
              <span>{item.status}</span>
              {item.gpa ? <small>{item.gpa}</small> : null}
            </div>
          </article>
        ))}
      </section>

      <section className="editorial-section next-page" aria-labelledby="about-next-heading">
        <div>
          <div className="section-eyebrow">NEXT / EXPERIENCE</div>
          <h2 id="about-next-heading">Follow the career progression.</h2>
        </div>
        <AppLink href="/experience" className="button-link">
          View Experience <ArrowUpRight size={18} aria-hidden="true" />
        </AppLink>
      </section>
    </main>
  );
}
