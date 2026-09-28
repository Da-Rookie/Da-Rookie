import { ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/experience";
import { AppLink } from "@/lib/router";

export function ExperiencePage() {
  const current = experiences.filter((item) => !item.endDate);
  const past = experiences.filter((item) => item.endDate);

  return (
    <main className="page page--inner">
      <header className="page-hero page-hero--experience">
        <div className="page-hero__index">03</div>
        <div className="section-eyebrow">EXPERIENCE / CAREER JOURNEY</div>
        <h1>Built across engineering, operations, product, and project delivery.</h1>
        <div className="page-hero__support">
          <p>
            A career path shaped by building systems, understanding operational work, and coordinating the people and decisions around delivery.
          </p>
        </div>
      </header>

      <section className="editorial-section current-roles" aria-labelledby="current-roles-heading">
        <div className="section-heading-row section-heading-row--compact">
          <div>
            <div className="section-eyebrow">CURRENT / PARALLEL ROLES</div>
            <h2 id="current-roles-heading">Working across two active positions.</h2>
          </div>
          <span className="section-count">{String(current.length).padStart(2, "0")}</span>
        </div>

        <div className="current-role-grid">
          {current.map((item) => (
            <article className="current-role-card" key={item.id}>
              <div className="current-role-card__top">
                <span className="current-indicator"><i /> CURRENT</span>
                <span>{item.startDate} — Present</span>
              </div>
              <h3>{item.position}</h3>
              <p className="current-role-card__company">{item.company}</p>
              <div className="current-role-card__meta">
                {item.employmentType ? <span>{item.employmentType}</span> : null}
                <span>{item.workMode}</span>
                {item.location ? <span>{item.location}</span> : null}
              </div>
              <ul className="experience-copy">
                {item.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section timeline-section" aria-labelledby="past-experience-heading">
        <div className="section-eyebrow">PREVIOUS / PROGRESSION</div>
        <h2 id="past-experience-heading" className="sr-only">Previous experience</h2>
        <div className="experience-timeline">
          {past.map((item, index) => (
            <article className="timeline-entry" key={item.id}>
              <div className="timeline-entry__rail" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
              </div>
              <div className="timeline-entry__period">
                <span>{item.startDate}</span>
                <span>— {item.endDate}</span>
              </div>
              <div className="timeline-entry__body">
                <div className="timeline-entry__heading">
                  <div>
                    <h3>{item.position}</h3>
                    <p>{item.company}</p>
                  </div>
                  <div className="timeline-entry__meta">
                    {item.employmentType ? <span>{item.employmentType}</span> : null}
                    <span>{item.workMode}</span>
                    {item.location ? <span>{item.location}</span> : null}
                  </div>
                </div>
                <ul className="experience-copy">
                  {item.description.map((description) => (
                    <li key={description}>{description}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section next-page" aria-labelledby="experience-next-heading">
        <div>
          <div className="section-eyebrow">NEXT / RECOGNITION</div>
          <h2 id="experience-next-heading">Evidence beyond the timeline.</h2>
        </div>
        <AppLink href="/recognition" className="button-link">
          View Recognition <ArrowUpRight size={18} aria-hidden="true" />
        </AppLink>
      </section>
    </main>
  );
}
