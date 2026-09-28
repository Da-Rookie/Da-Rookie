import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { skillGroups } from '@/data/skills';
import { achievements } from '@/data/achievements';
import { publications } from '@/data/publications';

const navItems = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'projects', label: 'Projects', icon: '◇' },
  { id: 'about', label: 'About', icon: '○' },
  { id: 'journey', label: 'Journey', icon: '↝' },
  { id: 'contact', label: 'Contact', icon: '✉' },
] as const;

type NavId = (typeof navItems)[number]['id'];

type AmbientRig = {
  context: AudioContext;
  oscillator: OscillatorNode;
  overtone: OscillatorNode;
  master: GainNode;
};

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [active, setActive] = useState<NavId>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('heritage-v2-sound') !== 'off';
  });
  const [soundBlocked, setSoundBlocked] = useState(false);
  const rigRef = useRef<AmbientRig | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setSplashVisible(false), 1850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const nodes = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as NavId);
      },
      { rootMargin: '-38% 0px -42% 0px', threshold: [0, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const startAmbient = async () => {
    try {
      if (!rigRef.current) {
        const context = new AudioContext();
        const master = context.createGain();
        const filter = context.createBiquadFilter();
        const oscillator = context.createOscillator();
        const overtone = context.createOscillator();
        const baseGain = context.createGain();
        const overtoneGain = context.createGain();

        master.gain.value = 0;
        filter.type = 'lowpass';
        filter.frequency.value = 760;
        oscillator.type = 'sine';
        oscillator.frequency.value = 65.406;
        overtone.type = 'sine';
        overtone.frequency.value = 98;
        overtone.detune.value = -4;
        baseGain.gain.value = 0.68;
        overtoneGain.gain.value = 0.28;

        oscillator.connect(baseGain);
        overtone.connect(overtoneGain);
        baseGain.connect(master);
        overtoneGain.connect(master);
        master.connect(filter);
        filter.connect(context.destination);
        oscillator.start();
        overtone.start();
        rigRef.current = { context, oscillator, overtone, master };
      }

      const rig = rigRef.current;
      await rig.context.resume();
      const now = rig.context.currentTime;
      rig.master.gain.cancelScheduledValues(now);
      rig.master.gain.setValueAtTime(rig.master.gain.value, now);
      rig.master.gain.linearRampToValueAtTime(0.045, now + 1.5);
      setSoundBlocked(false);
    } catch {
      setSoundBlocked(true);
    }
  };

  const muteAmbient = () => {
    const rig = rigRef.current;
    if (!rig) return;
    const now = rig.context.currentTime;
    rig.master.gain.cancelScheduledValues(now);
    rig.master.gain.setValueAtTime(rig.master.gain.value, now);
    rig.master.gain.linearRampToValueAtTime(0, now + 0.5);
  };

  useEffect(() => {
    window.localStorage.setItem('heritage-v2-sound', soundEnabled ? 'on' : 'off');
    if (soundEnabled) void startAmbient();
    else muteAmbient();
  }, [soundEnabled]);

  useEffect(() => {
    const unlock = () => {
      if (soundEnabled) void startAmbient();
    };
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [soundEnabled]);

  useEffect(() => () => {
    const rig = rigRef.current;
    if (!rig) return;
    try { rig.oscillator.stop(); } catch { /* noop */ }
    try { rig.overtone.stop(); } catch { /* noop */ }
    void rig.context.close();
  }, []);

  return (
    <>
      {splashVisible && <Splash />}
      <div className={`site-shell ${splashVisible ? 'site-loading' : 'site-ready'}`}>
        <a className="skip-link" href="#projects">Skip to projects</a>
        <button
          type="button"
          className="audio-control"
          onClick={() => setSoundEnabled((value) => !value)}
          aria-label={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
          title={soundBlocked && soundEnabled ? 'Tap once to enable sound' : soundEnabled ? 'Sound on' : 'Sound off'}
        >
          <span className={`audio-pulse ${soundEnabled && !soundBlocked ? 'is-playing' : ''}`} />
          <span aria-hidden="true">{soundEnabled ? '◖))' : '◖×'}</span>
          <span>{soundEnabled ? (soundBlocked ? 'Tap for sound' : 'Sound on') : 'Sound off'}</span>
        </button>

        <main>
          <Hero />
          <ProjectsSection />
          <AboutSection />
          <JourneySection />
          <CredentialsSection />
          <ContactSection />
        </main>

        <nav className="bottom-dock" aria-label="Primary navigation">
          {navItems.map((item) => {
            const selected = active === item.id;
            return (
              <button
                type="button"
                key={item.id}
                className={`dock-item ${selected ? 'is-active' : ''}`}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                aria-label={`Go to ${item.label}`}
                aria-current={selected ? 'page' : undefined}
              >
                <span className="dock-icon-wrap" aria-hidden="true">{item.icon}</span>
                <span className="dock-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

function Splash() {
  return (
    <div className="splash-v2 splash-css" aria-hidden="true">
      <div className="splash-mark">
        <span className="splash-monogram">P</span>
        <div className="splash-rule" />
        <div className="splash-caption">PRASETYO · BUILD / AUTOMATE / LEAD</div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const [point, setPoint] = useState({ x: 62, y: 46 });
  const [dragging, setDragging] = useState(false);

  const updatePoint = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPoint({
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    });
  };

  const handleMove = (event: ReactPointerEvent<HTMLElement>) => updatePoint(event.clientX, event.clientY);

  return (
    <section
      id="home"
      ref={ref}
      className={`hero-v2 ${dragging ? 'is-dragging' : ''}`}
      onPointerMove={handleMove}
      onPointerDown={(event) => {
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePoint(event.clientX, event.clientY);
      }}
      onPointerUp={(event) => {
        setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => setDragging(false)}
      style={{ '--mx': `${point.x}%`, '--my': `${point.y}%` } as CSSProperties}
      aria-label="Portfolio introduction"
    >
      <div className="hero-topline">
        <a href="#home" className="brand-lockup" aria-label="Eko Prasetyo Pratomo home">
          <span className="brand-monogram">P</span>
          <span className="brand-word">PRASETYO</span>
        </a>
        <div className="hero-status"><span /> Jakarta · Indonesia</div>
      </div>

      <div className="hero-copy-layer hero-copy-base" aria-hidden="true"><HeroWords /></div>
      <div className="hero-reveal" aria-hidden="true">
        <img className="hero-asset hero-orb" src="/hero/metal-orb.svg" alt="" draggable={false} />
        <img className="hero-asset hero-ribbon" src="/hero/metal-ribbon.svg" alt="" draggable={false} />
        <img className="hero-asset hero-forest" src="/hero/forest-orb.svg" alt="" draggable={false} />
        <div className="hero-copy-layer hero-copy-invert"><HeroWords /></div>
      </div>

      <div className="hero-content">
        <div className="hero-kicker">Full-Stack Developer · AI Engineer · Product & Technology</div>
        <h1 className="sr-only">{profile.tagline}</h1>
        <p>{profile.description}</p>
        <div className="hero-actions">
          <a href="#projects" className="hero-link primary">Explore selected work <span aria-hidden="true">↘</span></a>
          <a href="#contact" className="hero-link">Start a conversation <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="hero-hint"><span className="hero-hint-dot" /><span>Hover / drag to reveal</span></div>
    </section>
  );
}

function HeroWords() {
  return <div className="hero-words"><div>BUILD</div><div>AUTOMATE</div><div>LEAD</div></div>;
}

function SectionIntro({ index, eyebrow, title, body }: { index: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div className="section-intro">
      <div className="section-index">{index}</div>
      <div>
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="section section-projects">
      <SectionIntro index="01" eyebrow="Selected work" title="Systems with a reason to exist." body="A selection of products and systems spanning SaaS, enterprise operations, AI and automation." />
      <div className="projects-grid">
        {projects.map((project, index) => (
          <article key={project.id} className={`project-card project-${index + 1}`}>
            <div className="project-meta"><span>{project.label}</span><span>{project.period}</span></div>
            <div className="project-card-body">
              <div><p className="project-role">{project.role.join(' · ')}</p><h3>{project.title}</h3><p className="project-subtitle">{project.subtitle}</p></div>
              <p className="project-description">{project.description}</p>
            </div>
            <div className="project-bottom">
              <div className="tag-row">{project.technologies.slice(0, 6).map((tech) => <span key={tech}>{tech}</span>)}</div>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section section-about">
      <SectionIntro index="02" eyebrow="About" title="Engineering, automation, and product thinking — in one practice." />
      <div className="about-layout">
        <div className="about-statement">
          <p className="about-big">{profile.about.headline}</p>
          <div className="about-rule" />
          <span className="about-note">Builder / problem solver / technology generalist</span>
        </div>
        <div className="about-copy">
          {profile.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="capability-strip"><span>Digital products</span><span>AI systems</span><span>Business automation</span><span>Data-driven solutions</span></div>
        </div>
      </div>
      <div className="skills-ledger">
        {skillGroups.map((group) => (
          <div className="skill-row" key={group.id}>
            <div className="skill-category">{group.category}</div>
            <div className="skill-items">{group.items.slice(0, 9).map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section id="journey" className="section section-journey">
      <SectionIntro index="03" eyebrow="Journey" title="From operations to software, products, AI, and project leadership." body="The thread is consistent: understand the system, remove friction, build the next version." />
      <div className="timeline">
        {experiences.slice(0, 6).map((experience, index) => (
          <article className="timeline-item" key={experience.id}>
            <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="timeline-date">{experience.startDate} — {experience.endDate ?? 'Present'}</div>
            <div className="timeline-main"><h3>{experience.position}</h3><p className="timeline-company">{experience.company}</p><p>{experience.description[0]}</p></div>
            <div className="timeline-mode">{experience.workMode}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CredentialsSection() {
  return (
    <section className="section section-credentials" aria-label="Achievements and publications">
      <div className="credential-column">
        <SectionIntro index="04" eyebrow="Recognition" title="Selected achievements." />
        <div className="credential-list">
          {achievements.map((item) => (
            <article className="credential-card" key={item.id}>
              <div className="credential-year">{item.year}</div>
              <div><div className="credential-kicker">{item.award}</div><h3>{item.title}</h3><p>{item.project}</p></div>
            </article>
          ))}
        </div>
      </div>
      <div className="credential-column publication-column">
        <SectionIntro index="05" eyebrow="Research" title="Published work." />
        <div className="credential-list">
          {publications.map((item) => (
            <article className="publication-card" key={item.id}>
              <div className="publication-top"><span>{item.accreditation}</span><span>{item.publishedDate}</span></div>
              <h3>{item.title}</h3><p>{item.publisher}</p>
              <div className="tag-row compact">{item.keywords.slice(0, 3).map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section section-contact">
      <div className="contact-panel">
        <div className="contact-topline"><span>06 / CONTACT</span><span>Available for meaningful work & collaboration</span></div>
        <h2>LET&apos;S BUILD<br />SOMETHING<br /><em>USEFUL.</em></h2>
        <div className="contact-bottom">
          <p>Have a product, AI system, automation workflow, or technical challenge worth solving? Start with a conversation.</p>
          <div className="contact-links">
            <a href={profile.contact.email}>Email <span aria-hidden="true">↗</span></a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="contact-ghost" aria-hidden="true">P</div>
      </div>
      <footer className="site-footer"><span>© 2026 Eko Prasetyo Pratomo</span><a href="#home">Back to top <span aria-hidden="true">→</span></a></footer>
    </section>
  );
}
