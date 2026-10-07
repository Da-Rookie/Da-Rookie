import { useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Copy,
  Check,
  Layers,
  Cpu,
  Compass,
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  Code2,
  BriefcaseBusiness,
} from "lucide-react";
import { profile } from "../data/profile";
import { experiences } from "../data/experience";
import { projects } from "../data/projects";
import { achievements } from "../data/achievements";
import { certifications } from "../data/certifications";
import { publications } from "../data/publications";
import { education } from "../data/education";
import { skillGroups } from "../data/skills";
import {
  places,
  nodes,
  edges,
  type PanelId,
  type PlaceId,
  type Quality,
} from "./topology";
export const panelTitles: Record<PanelId, string> = {
  works: "Inside the project lab",
  about: "The person behind the practice",
  experience: "Eight chapters. One evolving practice.",
  recognition: "A trail of evidence",
  contact: "Let’s make something meaningful.",
  map: "Find your own way",
  settings: "Make yourself comfortable",
  help: "A little orientation",
};
interface Props {
  panel: PanelId;
  onPanel: (p: PanelId) => void;
  onTravel: (id: PlaceId) => void;
  quality: Quality;
  onQuality: (q: Quality) => void;
  visited: PlaceId[];
  reduced: boolean;
  onReduced: (v: boolean) => void;
  onReplay: () => void;
  initialProject?: string;
}
export function Content(props: Props) {
  const { panel, onPanel } = props;
  if (panel === "works")
    return <Works onPanel={onPanel} initialProject={props.initialProject} />;
  if (panel === "about") return <About onPanel={onPanel} />;
  if (panel === "experience") return <Experience />;
  if (panel === "recognition") return <Recognition />;
  if (panel === "contact") return <Contact />;
  if (panel === "map") return <IslandMap {...props} />;
  if (panel === "settings") return <Settings {...props} />;
  return <Help onReplay={props.onReplay} />;
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
function Tags({ items }: { items: readonly string[] }) {
  return (
    <div className="tags">
      {items.map((s) => (
        <span key={s}>{s}</span>
      ))}
    </div>
  );
}
function Works({
  onPanel,
  initialProject,
}: {
  onPanel: (p: PanelId) => void;
  initialProject?: string;
}) {
  const [selected, setSelected] = useState<string | null>(
    initialProject ?? null,
  );
  const item = projects.find((p) => p.id === selected);
  if (selected === "daycare") {
    const ai = experiences[0];
    return (
      <>
        <button className="back-link" onClick={() => setSelected(null)}>
          <ArrowLeft size={15} /> All projects
        </button>
        <Eyebrow>CURRENT WORK / AI ENGINEERING</Eyebrow>
        <h3 className="feature-title">Daycare & intelligent workflows</h3>
        <p className="lede">
          Connecting an internal application with the information parents need.
        </p>
        <Tags items={["Laravel", "LLM-based agents", "n8n", "WhatsApp"]} />
        <section className="prose-section">
          <h4>Context & role</h4>
          <p>
            AI Engineer at PT Pertamina Bina Medika IHC. Building the Daycare
            Module within the internal system and integrating child information
            workflows with parent communication.
          </p>
          <h4>Current contributions</h4>
          <ul>
            {ai.description.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="note">
            Ongoing internal work. No private operational data or child
            information is displayed.
          </p>
        </section>
        <button className="primary" onClick={() => onPanel("experience")}>
          View related experience <ArrowUpRight size={16} />
        </button>
      </>
    );
  }
  if (item)
    return (
      <>
        <button className="back-link" onClick={() => setSelected(null)}>
          <ArrowLeft size={15} /> All projects
        </button>
        <Eyebrow>
          {item.label} · {item.period}
        </Eyebrow>
        <h3 className="feature-title">{item.title}</h3>
        <p className="lede">{item.subtitle}</p>
        {item.id === "ai-automation" && (
          <div className="status-note">
            Concept exploration — not presented as a launched product.
          </div>
        )}
        <ProjectArt id={item.id} />
        <section className="prose-section">
          <h4>Context</h4>
          <p>{item.description}</p>
          <h4>My role</h4>
          <Tags items={item.role} />
          <h4>What the work covers</h4>
          <ul className="feature-list">
            {item.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <h4>System architecture</h4>
          <div className="architecture-flow">
            {item.architecture?.map((a, i) => (
              <div key={a}>
                <span>0{i + 1}</span>
                {a}
              </div>
            ))}
          </div>
          <h4>Technologies</h4>
          <Tags items={item.technologies} />
        </section>
        <button className="primary" onClick={() => onPanel("experience")}>
          Explore the professional context <ArrowUpRight size={16} />
        </button>
      </>
    );
  return (
    <>
      <p className="lede">
        A closer look at the products, systems, and workflows behind the
        practice.
      </p>
      <div className="project-list">
        {[
          {
            id: "daycare",
            title: "Daycare & intelligent workflows",
            subtitle: "Internal systems. Thoughtful automation.",
            label: "CURRENT / AI ENGINEERING",
          },
          ...projects,
        ].map((p, i) => (
          <button
            className="project-entry"
            key={p.id}
            onClick={() => setSelected(p.id)}
          >
            <div className={`project-thumb thumb-${p.id}`}>
              <ProjectArt id={p.id} />
              <span className="project-number">0{i + 1}</span>
            </div>
            <div className="project-info">
              <Eyebrow>{p.label}</Eyebrow>
              <h3>{p.title}</h3>
              <p>{p.subtitle}</p>
              {p.id === "ai-automation" && (
                <span className="small-badge">Concept</span>
              )}
            </div>
            <ArrowUpRight className="project-arrow" size={22} />
          </button>
        ))}
      </div>
    </>
  );
}
function ProjectArt({ id }: { id: string }) {
  if (id === "klik-kelontong" || id === "pertamedika-hris")
    return (
      <img
        className="project-image"
        src={
          id === "klik-kelontong"
            ? "/images/klik-kelontong.webp"
            : "/images/integrated-hris.webp"
        }
        alt={
          id === "klik-kelontong"
            ? "Klik Kelontong project illustration"
            : "Integrated HRIS and attendance project illustration"
        }
        loading="lazy"
      />
    );
  return (
    <div
      className={`system-art ${id === "daycare" ? "system-daycare" : ""}`}
      aria-hidden="true"
    >
      <div className="system-ring" />
      <div className="system-ring ring-two" />
      <div className="system-core">
        <Cpu size={35} />
      </div>
      <span className="system-node node-one">
        <Layers size={18} />
      </span>
      <span className="system-node node-two">
        <Mail size={18} />
      </span>
    </div>
  );
}
function About({ onPanel }: { onPanel: (p: PanelId) => void }) {
  return (
    <>
      <Eyebrow>JAKARTA · INDONESIA</Eyebrow>
      <h3 className="feature-title">
        Eko Prasetyo
        <br />
        <em>Pratomo.</em>
      </h3>
      <p className="identity-line">{profile.titles.join(" · ")}</p>
      <div className="prose-section">
        {profile.about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="pillars">
        {[
          { title: "BUILD", role: "Full-Stack Developer", icon: Layers },
          { title: "AUTOMATE", role: "AI Engineer", icon: Cpu },
          { title: "LEAD", role: "Project Manager", icon: Compass },
        ].map(({ title, role, icon: Icon }) => (
          <div key={title}>
            <Icon size={22} />
            <h4>{title}</h4>
            <p>{role}</p>
          </div>
        ))}
      </div>
      <section className="prose-section">
        <Eyebrow>WHERE I AM NOW</Eyebrow>
        {experiences
          .filter((e) => !e.endDate)
          .map((e) => (
            <article className="current-role" key={e.id}>
              <span className="live-dot" />
              <div>
                <h4>{e.position}</h4>
                <p>{e.company}</p>
                <small>
                  {e.startDate} — Present · {e.workMode}
                </small>
              </div>
            </article>
          ))}
        <button className="text-action" onClick={() => onPanel("experience")}>
          Explore all 8 experiences <ArrowUpRight size={16} />
        </button>
      </section>
      <section className="prose-section">
        <h4>Education</h4>
        {education.map((e) => (
          <div className="education" key={e.id}>
            <GraduationCap size={25} />
            <div>
              <strong>{e.institution}</strong>
              <p>
                {e.degree} · {e.field}
              </p>
              <small>
                {e.startYear} — Present · {e.status}
              </small>
            </div>
          </div>
        ))}
      </section>
      <section className="prose-section">
        <h4>Tools & disciplines</h4>
        {skillGroups.map((g) => (
          <div className="skill-group" key={g.id}>
            <h5>{g.category}</h5>
            <Tags items={g.items} />
          </div>
        ))}
      </section>
    </>
  );
}
function Experience() {
  return (
    <>
      <p className="lede">
        From understanding operations to building systems and leading the people
        who bring them to life.
      </p>
      <div className="experience-summary">
        <span>
          <strong>08</strong> professional experiences
        </span>
        <span>
          <strong>02</strong> current roles
        </span>
      </div>
      <div className="timeline">
        {experiences.map((e, i) => (
          <details key={e.id} open={i < 2} className="experience-item">
            <summary>
              <span className="timeline-dot" />
              <span className="experience-date">
                {e.startDate} — {e.endDate || "Present"}
              </span>
              <h3>{e.position}</h3>
              <p>{e.company}</p>
              <span className="experience-meta">
                {[e.employmentType, e.workMode].filter(Boolean).join(" · ")}{" "}
                {!e.endDate && <b>Current</b>}
              </span>
              <span className="expand-symbol">+</span>
            </summary>
            <div className="experience-body">
              {e.location && <p className="note">{e.location}</p>}
              <ul>
                {e.description.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
function Recognition() {
  return (
    <>
      <p className="lede">
        Recognition, published research, and continued learning.
      </p>
      <div className="recognition-section">
        <Eyebrow>01 / ACHIEVEMENTS</Eyebrow>
        {achievements.map((a) => (
          <article className="award-entry" key={a.id}>
            <Award size={32} />
            <div>
              <small>
                {a.year} · {a.project}
              </small>
              <h3>{a.award}</h3>
              <p>{a.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="recognition-section">
        <Eyebrow>02 / PUBLICATIONS</Eyebrow>
        {publications.map((p) => (
          <article className="publication-entry" key={p.id}>
            <BookOpen size={22} />
            <div>
              <span className="small-badge">{p.accreditation}</span>
              <h3>{p.title}</h3>
              <p>{p.publisher}</p>
              <small>{p.publishedDate}</small>
              <p>{p.description}</p>
              <Tags items={p.keywords} />
              {p.url && (
                <a
                  className="text-action"
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read publication <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="recognition-section">
        <Eyebrow>03 / CERTIFICATIONS</Eyebrow>
        {certifications.map((c) => (
          <article className="cert-entry" key={c.id}>
            <div>
              <h3>{c.name}</h3>
              <p>
                {c.issuer} · {c.domain}
              </p>
            </div>
            {c.credentialUrl && (
              <a
                href={c.credentialUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${c.name} credential`}
              >
                <ArrowUpRight size={20} />
              </a>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
function Contact() {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        profile.contact.email.replace("mailto:", ""),
      );
      setCopied(true);
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <>
      <p className="lede">
        Have a product to build, a workflow to rethink, or a team to move
        forward? Let’s start a conversation.
      </p>
      <div className="contact-brand">
        BUILD.
        <br />
        AUTOMATE.
        <br />
        <em>LEAD.</em>
      </div>
      <a className="contact-link" href={profile.contact.email}>
        <Mail size={23} />
        <div>
          <small>WRITE TO ME</small>
          <span>{profile.contact.email.replace("mailto:", "")}</span>
        </div>
        <ArrowUpRight size={22} />
      </a>
      <button className="back-link" onClick={copy}>
        {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
        {copied ? "Email copied" : "Copy email address"}
      </button>
      <p role="status" className="note">
        {error
          ? "Copy is unavailable here. Select the email above or open your mail app."
          : copied
            ? "Ready to paste into your mail app."
            : ""}
      </p>
      <div className="social-links">
        <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
          <BriefcaseBusiness size={22} /> LinkedIn <ArrowUpRight size={17} />
        </a>
        <a href={profile.contact.github} target="_blank" rel="noreferrer">
          <Code2 size={22} /> GitHub <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="contact-signoff">
        <span className="live-dot" /> Jakarta, Indonesia{" "}
        <span>Built by Eko Prasetyo Pratomo</span>
      </div>
    </>
  );
}
function IslandMap({ visited, onTravel }: Props) {
  return (
    <>
      <p className="lede">
        One island. Many ways to get to know the work. Choose a destination to
        travel there.
      </p>
      <div className="island-map">
        <svg
          viewBox="-34 -30 72 63"
          role="img"
          aria-label="Waterfront walking loop connects the arrival pier, project lab, career terrace, recognition gallery and conversation deck"
        >
          <path
            d="M -27 17 C -40 -3 -28 -30 -3 -28 C 22 -32 37 -18 32 8 L 26 17 L 18 10 C 29 -4 8 -19 -5 -14 C -23 -10 -21 5 -19 12Z"
            fill="#244b3f"
          />
          <path
            d={edges
              .map(
                ([a, b]) =>
                  `M ${nodes[a][0]} ${nodes[a][1]} L ${nodes[b][0]} ${nodes[b][1]}`,
              )
              .join(" ")}
            fill="none"
            stroke="#86d8bd"
            strokeWidth=".7"
            strokeDasharray="1.5 1"
          />
          {places.map((p, i) => {
            const [x, z] = nodes[p.node];
            return (
              <g key={p.id}>
                <circle cx={x} cy={z} r="2" fill={p.color} />
                <text
                  x={x}
                  y={z + 0.85}
                  textAnchor="middle"
                  fill="#092e2b"
                  fontSize="2.3"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
          <text
            x="1"
            y="4"
            textAnchor="middle"
            fill="#80aaa6"
            fontSize="2.2"
            letterSpacing=".9"
          >
            EMERALD BAY
          </text>
        </svg>
      </div>
      <div className="map-destinations">
        {places.map((p, i) => (
          <button key={p.id} onClick={() => onTravel(p.id)}>
            <span className="map-number">0{i + 1}</span>
            <div>
              <h3>{p.title}</h3>
              <p>{p.label}</p>
            </div>
            {visited.includes(p.id) ? (
              <Check size={18} />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
function Settings({ quality, onQuality, reduced, onReduced }: Props) {
  return (
    <>
      <p className="lede">
        Choose the way Emerald Bay feels on your device. Every setting includes
        the complete portfolio.
      </p>
      <Eyebrow>GRAPHICS QUALITY</Eyebrow>
      <div className="quality-options">
        {(
          [
            {
              id: "low",
              title: "Low",
              copy: "A lighter footprint",
              detail: "Simple water · no shadows · fewer trees",
            },
            {
              id: "medium",
              title: "Medium",
              copy: "A balanced view",
              detail: "Reflected water · soft shadows · fuller greenery",
            },
            {
              id: "high",
              title: "High",
              copy: "All the atmosphere",
              detail:
                "2048px surface maps · dense foliage · bloom · sharper reflections",
            },
          ] as const
        ).map((q) => (
          <button
            className={quality === q.id ? "selected" : ""}
            aria-pressed={quality === q.id}
            key={q.id}
            onClick={() => onQuality(q.id)}
          >
            <span className="radio-dot" />
            <div>
              <h3>
                {q.title} <small>{q.copy}</small>
              </h3>
              <p>{q.detail}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="note">
        High is available on every device and uses more GPU power. Your
        selection is kept until you change it.
      </p>
      <div className="setting-row">
        <div>
          <h3>Reduced motion</h3>
          <p>Skip arrival movement and soften ambient animation.</p>
        </div>
        <button
          className={`switch ${reduced ? "on" : ""}`}
          role="switch"
          aria-checked={reduced}
          aria-label="Reduced motion"
          onClick={() => onReduced(!reduced)}
        >
          <span />
        </button>
      </div>
    </>
  );
}
function Help({ onReplay }: { onReplay: () => void }) {
  return (
    <>
      <p className="lede">
        Follow your curiosity. There is no right order, and nothing to unlock
        before you can read.
      </p>
      <div className="help-controls">
        <section>
          <Eyebrow>DESKTOP</Eyebrow>
          <p>
            <kbd>Click</kbd> the path to walk
          </p>
          <p>
            <kbd>W A S D</kbd> or arrow keys to move
          </p>
          <p>
            <kbd>Drag</kbd> to orbit the camera
          </p>
          <p>
            <kbd>Scroll</kbd> to zoom
          </p>
        </section>
        <section>
          <Eyebrow>TOUCH</Eyebrow>
          <p>
            <kbd>Tap</kbd> the path to walk
          </p>
          <p>
            <kbd>Swipe</kbd> to orbit
          </p>
          <p>
            <kbd>Pinch</kbd> to zoom
          </p>
          <p>
            <kbd>Tap a marker</kbd> to explore a story
          </p>
        </section>
      </div>
      <div className="prose-section">
        <h4>Take the scenic route. Or go straight there.</h4>
        <p>
          The bottom navigation opens portfolio content immediately. The map
          takes you to any destination. Use the compass button to reset the
          camera whenever you need a familiar view.
        </p>
        <p>
          While a reading panel is open, movement pauses. Close it or press
          Escape to return to the island.
        </p>
      </div>
      <button className="secondary" onClick={onReplay}>
        Replay the arrival <ArrowUpRight size={16} />
      </button>
    </>
  );
}
