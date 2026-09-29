import { ArrowUpRight, Award } from "lucide-react";
import { achievements } from "@/data/achievements";
import { certifications } from "@/data/certifications";
import { publications } from "@/data/publications";
import { PageHeading } from "@/components/ui/PageHeading";
import { NextChapter } from "@/components/ui/NextChapter";
export function RecognitionPage() {
  return (
    <main className="page page--recognition">
      <PageHeading index="04" label="RECOGNITION">
        A body of work.
        <br />
        <em>A trail of evidence.</em>
      </PageHeading>
      <nav
        className="recognition-index section-pad"
        aria-label="Recognition sections"
      >
        <a href="#achievements">01 / Achievements</a>
        <a href="#publications">02 / Publications</a>
        <a href="#certificates">03 / Professional Certificates</a>
      </nav>
      <section id="achievements" className="recognition-section section-pad">
        <div className="section-top">
          <h2>Recognition earned.</h2>
          <span>01 / ACHIEVEMENTS</span>
        </div>
        <div className="awards">
          {achievements.map((item) => (
            <article key={item.id} className="award">
              <Award size={36} strokeWidth={1} />
              <span>{item.year}</span>
              <h3>
                {item.award === "Gold Medal" ? (
                  <>
                    Gold
                    <br />
                    Medal.
                  </>
                ) : (
                  <>
                    P2MW
                    <br />
                    Funding.
                  </>
                )}
              </h3>
              <p>
                {item.title}
                {item.project ? ` · ${item.project}` : ""}
              </p>
              <small>{item.description}</small>
            </article>
          ))}
        </div>
      </section>
      <section id="publications" className="publications-section section-pad">
        <div className="section-top">
          <h2>Ideas in print.</h2>
          <span>02 / PUBLICATIONS</span>
        </div>
        {publications.map((item, index) => (
          <article className="publication" key={item.id}>
            <div className="publication-side">
              <span>0{index + 1}</span>
              <span>{item.accreditation}</span>
            </div>
            <div>
              <div className="eyebrow">{item.publishedDate}</div>
              <h3>{item.title}</h3>
              <p className="publication-publisher">
                {item.journal ? `${item.journal} · ` : ""}
                {item.publisher}
              </p>
              <p>{item.description}</p>
              <div className="keywords">
                {item.keywords.map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  Read Publication <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
      <section id="certificates" className="certificates-section section-pad">
        <div className="section-top">
          <h2>Learning, continued.</h2>
          <span>03 / PROFESSIONAL CERTIFICATES</span>
        </div>
        {certifications.map((item, index) => (
          <article className="certificate" key={item.id}>
            <span className="certificate-number">0{index + 1}</span>
            <div>
              <h3>{item.name}</h3>
              <p>
                {item.issuer}
                {item.year ? ` · ${item.year}` : ""}
              </p>
            </div>
            <span className="certificate-domain">{item.domain}</span>
            {item.credentialUrl && (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${item.name} credential in new tab`}
              >
                <ArrowUpRight />
              </a>
            )}
          </article>
        ))}
      </section>
      <NextChapter
        label="05 / CONTACT"
        title="Good work begins with a conversation."
        href="/contact"
      />
    </main>
  );
}
