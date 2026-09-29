import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { PageHeading } from "@/components/ui/PageHeading";
import { NextChapter } from "@/components/ui/NextChapter";
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
    <main className="page page--about">
      <PageHeading index="02" label="ABOUT">
        One practice.
        <br />
        <em>Many dimensions.</em>
      </PageHeading>
      <section className="about-statement section-pad">
        <div className="about-initial" aria-hidden="true">
          P<span>BUILD / AUTOMATE / LEAD</span>
        </div>
        <div>
          <div className="eyebrow">EKO PRASETYO PRATOMO</div>
          <h2>
            Engineering, automation,
            <br />
            and project leadership.
          </h2>
          <p className="identity-line">{profile.titles.join(" · ")}</p>
          {profile.about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <section className="capability-section section-pad">
        <div className="section-top">
          <div className="eyebrow">WHAT I BUILD</div>
          <span>FROM PROBLEM TO POSSIBILITY</span>
        </div>
        <div className="capability-list">
          {capabilities.map((capability, index) => (
            <div key={capability}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{capability}</h3>
              <span aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </section>
      <section className="skills-section section-pad">
        <div className="skills-intro">
          <div className="eyebrow">TOOLS & CAPABILITIES</div>
          <h2>
            Different tools.
            <br />
            <em>One intention.</em>
          </h2>
          <p>Choose the technology that serves the work.</p>
        </div>
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <article className="skill-group" key={group.id}>
              <h3>{group.category}</h3>
              <p>{group.items.join(" / ")}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="education-section section-pad">
        <div className="eyebrow">EDUCATION / ALWAYS LEARNING</div>
        {education.map((item) => (
          <article key={item.id} className="education-row">
            <span>
              {item.startYear} — {item.endYear ?? "Present"}
            </span>
            <div>
              <h2>{item.institution}</h2>
              <p>
                {item.degree} · {item.field}
              </p>
            </div>
            <span>{item.status}</span>
          </article>
        ))}
      </section>
      <NextChapter
        label="03 / EXPERIENCE"
        title="The journey behind the work."
        href="/experience"
      />
    </main>
  );
}
