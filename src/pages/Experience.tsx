import { experiences, type Experience } from "@/data/experience";
import { PageHeading } from "@/components/ui/PageHeading";
import { NextChapter } from "@/components/ui/NextChapter";
function Role({
  item,
  index,
  current = false,
}: {
  item: Experience;
  index: number;
  current?: boolean;
}) {
  return (
    <article
      className={`career-entry ${current ? "career-entry--current" : ""}`}
    >
      <div className="career-period">
        <span className="career-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p>
          {item.id === "pertamedika-ai" ? "August 2026" : item.startDate}
          <br />
          <span>— {item.endDate ?? "Present"}</span>
        </p>
        {current && <span className="current-label">CURRENT</span>}
      </div>
      <div className="career-body">
        <div className="career-heading">
          <h3>{item.position}</h3>
          <p>{item.company}</p>
          <div className="career-meta">
            {[item.employmentType, item.workMode, item.location]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
        <ul>
          {item.description.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
export function ExperiencePage() {
  const current = experiences.filter((e) => !e.endDate),
    past = experiences.filter((e) => e.endDate);
  return (
    <main className="page page--experience">
      <PageHeading
        index="03"
        label="EXPERIENCE"
        description="A path through operations, engineering, product, and project delivery. Each chapter adds another perspective to the work."
      >
        Always building.
        <br />
        <em>Always becoming.</em>
      </PageHeading>
      <section className="career-current section-pad">
        <div className="section-top">
          <h2 className="eyebrow">NOW / TWO PARALLEL CHAPTERS</h2>
          <span>2026 — PRESENT</span>
        </div>
        {current.map((item, index) => (
          <Role item={item} index={index} current key={item.id} />
        ))}
      </section>
      <section className="career-past section-pad">
        <h2 className="eyebrow">THE PATH SO FAR</h2>
        {past.map((item, index) => (
          <Role item={item} index={index + current.length} key={item.id} />
        ))}
      </section>
      <NextChapter
        label="04 / RECOGNITION"
        title="The evidence along the way."
        href="/recognition"
      />
    </main>
  );
}
