import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, MoveRight } from 'lucide-react';
import SplashV2 from '@/components/v2/SplashV2';
import BottomDock from '@/components/v2/BottomDock';
import AudioControl from '@/components/v2/AudioControl';
import HeroV2 from '@/components/v2/HeroV2';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { skillGroups } from '@/data/skills';
import { achievements } from '@/data/achievements';
import { publications } from '@/data/publications';

const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <AnimatePresence>{!splashDone && <SplashV2 onComplete={handleSplashComplete} />}</AnimatePresence>
      <motion.div
        className="site-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <a className="skip-link" href="#projects">Skip to projects</a>
        <AudioControl />
        <main>
          <HeroV2 />
          <ProjectsSection />
          <AboutSection />
          <JourneySection />
          <CredentialsSection />
          <ContactSection />
        </main>
        <BottomDock />
      </motion.div>
    </>
  );
}

function SectionIntro({ index, eyebrow, title, body }: { index: string; eyebrow: string; title: string; body?: string }) {
  return (
    <motion.div className="section-intro" {...reveal}>
      <div className="section-index">{index}</div>
      <div>
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
      </div>
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="section section-projects">
      <SectionIntro
        index="01"
        eyebrow="Selected work"
        title="Systems with a reason to exist."
        body="A selection of products and systems spanning SaaS, enterprise operations, AI and automation."
      />
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.article key={project.id} className={`project-card project-${index + 1}`} {...reveal}>
            <div className="project-meta"><span>{project.label}</span><span>{project.period}</span></div>
            <div className="project-card-body">
              <div>
                <p className="project-role">{project.role.join(' · ')}</p>
                <h3>{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
              </div>
              <p className="project-description">{project.description}</p>
            </div>
            <div className="project-bottom">
              <div className="tag-row">{project.technologies.slice(0, 6).map((tech) => <span key={tech}>{tech}</span>)}</div>
              <span className="project-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
            </div>
          </motion.article>
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
        <motion.div className="about-statement" {...reveal}>
          <p className="about-big">{profile.about.headline}</p>
          <div className="about-rule" />
          <span className="about-note">Builder / problem solver / technology generalist</span>
        </motion.div>
        <motion.div className="about-copy" {...reveal}>
          {profile.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="capability-strip">
            <span>Digital products</span><span>AI systems</span><span>Business automation</span><span>Data-driven solutions</span>
          </div>
        </motion.div>
      </div>
      <div className="skills-ledger">
        {skillGroups.map((group) => (
          <motion.div className="skill-row" key={group.id} {...reveal}>
            <div className="skill-category">{group.category}</div>
            <div className="skill-items">{group.items.slice(0, 9).map((item) => <span key={item}>{item}</span>)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section id="journey" className="section section-journey">
      <SectionIntro
        index="03"
        eyebrow="Journey"
        title="From operations to software, products, AI, and project leadership."
        body="The thread is consistent: understand the system, remove friction, build the next version."
      />
      <div className="timeline">
        {experiences.slice(0, 6).map((experience, index) => (
          <motion.article className="timeline-item" key={experience.id} {...reveal}>
            <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="timeline-date">{experience.startDate} — {experience.endDate ?? 'Present'}</div>
            <div className="timeline-main">
              <h3>{experience.position}</h3>
              <p className="timeline-company">{experience.company}</p>
              <p>{experience.description[0]}</p>
            </div>
            <div className="timeline-mode">{experience.workMode}</div>
          </motion.article>
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
            <motion.article className="credential-card" key={item.id} {...reveal}>
              <div className="credential-year">{item.year}</div>
              <div><div className="credential-kicker">{item.award}</div><h3>{item.title}</h3><p>{item.project}</p></div>
            </motion.article>
          ))}
        </div>
      </div>
      <div className="credential-column publication-column">
        <SectionIntro index="05" eyebrow="Research" title="Published work." />
        <div className="credential-list">
          {publications.map((item) => (
            <motion.article className="publication-card" key={item.id} {...reveal}>
              <div className="publication-top"><span>{item.accreditation}</span><span>{item.publishedDate}</span></div>
              <h3>{item.title}</h3>
              <p>{item.publisher}</p>
              <div className="tag-row compact">{item.keywords.slice(0, 3).map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section section-contact">
      <motion.div className="contact-panel" {...reveal}>
        <div className="contact-topline"><span>06 / CONTACT</span><span>Available for meaningful work & collaboration</span></div>
        <h2>LET&apos;S BUILD<br />SOMETHING<br /><em>USEFUL.</em></h2>
        <div className="contact-bottom">
          <p>Have a product, AI system, automation workflow, or technical challenge worth solving? Start with a conversation.</p>
          <div className="contact-links">
            <a href={profile.contact.email}>Email <Mail size={16} /></a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <Linkedin size={16} /></a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub <Github size={16} /></a>
          </div>
        </div>
        <div className="contact-ghost" aria-hidden="true">P</div>
      </motion.div>
      <footer className="site-footer">
        <span>© 2026 Eko Prasetyo Pratomo</span>
        <a href="#home">Back to top <MoveRight size={14} /></a>
      </footer>
    </section>
  );
}
