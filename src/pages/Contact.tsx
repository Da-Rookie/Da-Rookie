import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";

const channels = [
  {
    label: "Email",
    value: "ekoprasetyopratomo@gmail.com",
    href: profile.contact.email,
    mark: "EM",
  },
  {
    label: "LinkedIn",
    value: "eko-prstyo",
    href: profile.contact.linkedin,
    mark: "IN",
  },
  {
    label: "GitHub",
    value: "Da-Rookie",
    href: profile.contact.github,
    mark: "GH",
  },
];

export function ContactPage() {
  return (
    <main className="page page--contact">
      <section className="contact-hero" aria-labelledby="contact-heading">
        <div className="contact-hero__watermark" aria-hidden="true">
          PRASETYO
        </div>

        <div className="contact-hero__top">
          <div className="section-eyebrow">05 / CONTACT</div>
          <span>{profile.location}</span>
        </div>

        <h1 id="contact-heading">
          LET&apos;S BUILD
          <br />
          SOMETHING
          <br />
          USEFUL.
        </h1>

        <div className="contact-hero__bottom">
          <p>
            Open to software projects, AI systems, automation, technical collaboration,
            project collaboration, and professional opportunities.
          </p>

          <div className="contact-channel-list">
            {channels.map(({ label, value, href, mark }) => {
              const external = href.startsWith("http");

              return (
                <a
                  key={label}
                  href={href}
                  className="contact-channel"
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  aria-label={`${label}: ${value}${external ? ", opens in a new tab" : ""}`}
                >
                  <span className="contact-channel__icon" aria-hidden="true">
                    {mark}
                  </span>
                  <span className="contact-channel__label">{label}</span>
                  <strong>{value}</strong>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Eko Prasetyo Pratomo</span>
        <span>BUILD · AUTOMATE · LEAD</span>
      </footer>
    </main>
  );
}
