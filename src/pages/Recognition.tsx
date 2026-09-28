import { ArrowUpRight } from "lucide-react";
import { achievements } from "@/data/achievements";
import { certifications } from "@/data/certifications";
import { publications } from "@/data/publications";
import { AppLink } from "@/lib/router";

export function RecognitionPage() {
  return (
    <main className="page page--inner">
      <header className="page-hero page-hero--recognition">
        <div className="page-hero__index">04</div>
        <div className="section-eyebrow">RECOGNITION / EVIDENCE</div>
        <h1>Achievements, published work, and professional credentials.</h1>
        <div className="page-hero__support recognition-jump-links" aria-label="Recognition sections">
          <a href="#achievements">Achievements</a>
          <a href="#publications">Publications</a>
          <a href="#certificates">Professional Certificates</a>
        </div>
      </header>

      <section id="achievements" className="editorial-section recognition-section" aria-labelledby="achievements-heading">
        <div className="section-heading-row">
          <div>
            <div className="section-eyebrow">ACHIEVEMENTS</div>
            <h2 id="achievements-heading">Selected professional recognition.</h2>
          </div>
          <span className="section-count">{String(achievements.length).padStart(2, "0")}</span>
        </div>
        <div className="achievement-list">
          {achievements.map((item, index) => (
            <article className="achievement-row" key={item.id}>
              <span className="achievement-row__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <span className="achievement-row__year">{item.year}</span>
                <h3>{item.award}</h3>
                <p>{item.title}{item.project ? ` · ${item.project}` : ""}</p>
              </div>
              <p className="achievement-row__description">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="publications" className="editorial-section recognition-section recognition-section--mist" aria-labelledby="publications-heading">
        <div className="section-heading-row">
          <div>
            <div className="section-eyebrow">PUBLICATIONS</div>
            <h2 id="publications-heading">Published research & community work.</h2>
          </div>
          <span className="section-count">{String(publications.length).padStart(2, "0")}</span>
        </div>
        <div className="publication-list">
          {publications.map((item, index) => (
            <article className="publication-entry" key={item.id}>
              <div className="publication-entry__number">{String(index + 1).padStart(2, "0")}</div>
              <div className="publication-entry__body">
                <div className="publication-entry__meta">
                  <span>{item.publishedDate}</span>
                  <span>{item.accreditation}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="publication-entry__publisher">
                  {item.journal ? `${item.journal} · ` : ""}{item.publisher}
                </p>
                <p>{item.description}</p>
                <div className="keyword-list" aria-label="Publication keywords">
                  {item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                </div>
                {item.url ? (
                  <a href={item.url} className="text-link" target="_blank" rel="noreferrer">
                    View Publication <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="certificates" className="editorial-section recognition-section" aria-labelledby="certificates-heading">
        <div className="section-heading-row">
          <div>
            <div className="section-eyebrow">PROFESSIONAL CERTIFICATES</div>
            <h2 id="certificates-heading">Credentials supporting the practice.</h2>
          </div>
          <span className="section-count">{String(certifications.length).padStart(2, "0")}</span>
        </div>
        <div className="certificate-grid">
          {certifications.map((item, index) => (
            <article className="certificate-item" key={item.id}>
              <div className="certificate-item__top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.domain}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.issuer}</p>
              {item.year ? <small>{item.year}</small> : null}
              {item.credentialUrl ? (
                <a href={item.credentialUrl} target="_blank" rel="noreferrer" aria-label={`Open credential for ${item.name}`}>
                  Credential <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section next-page" aria-labelledby="recognition-next-heading">
        <div>
          <div className="section-eyebrow">NEXT / CONTACT</div>
          <h2 id="recognition-next-heading">Turn the evidence into a conversation.</h2>
        </div>
        <AppLink href="/contact" className="button-link">
          Start a Conversation <ArrowUpRight size={18} aria-hidden="true" />
        </AppLink>
      </section>
    </main>
  );
}
