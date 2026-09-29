import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
const channels = [
  {
    name: "Email",
    value: "ekoprasetyopratomo@gmail.com",
    href: profile.contact.email,
  },
  { name: "LinkedIn", value: "eko-prstyo", href: profile.contact.linkedin },
  { name: "GitHub", value: "Da-Rookie", href: profile.contact.github },
];
export function ContactPage() {
  return (
    <main className="page page--contact">
      <section className="contact-heading section-pad">
        <div className="eyebrow">
          <span>05 / CONTACT</span>
          <span>GOOD WORK STARTS HERE.</span>
        </div>
        <h1>
          LET'S BUILD
          <br />
          SOMETHING
          <br />
          <em>USEFUL.</em>
          <ArrowUpRight aria-hidden="true" strokeWidth={0.7} />
        </h1>
        <div className="contact-bottom">
          <p>
            Have a product to build, a process to automate, or a project to move
            forward?
            <br />
            <br />
            Let's talk about what comes next.
          </p>
          <div className="contact-links">
            {channels.map(({ name, value, href }, i) => (
              <a
                href={href}
                key={name}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={`${name}: ${value}${
                  href.startsWith("http") ? ", opens in a new tab" : ""
                }`}
              >
                <span>
                  0{i + 1} / {name}
                </span>
                <strong>{value}</strong>
                <ArrowUpRight size={22} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <div className="contact-wordmark" aria-hidden="true">
        PRASETYO
      </div>
    </main>
  );
}
