import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { NextChapter } from "@/components/ui/NextChapter";
import { projects } from "@/data/projects";
import { AppLink } from "@/lib/router";

interface ProjectDetailPageProps {
  slug: string;
}

export function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const project = projects.find((item) => item.id === slug);

  if (!project) {
    return (
      <main className="page page--inner">
        <section className="not-found">
          <div className="section-eyebrow">PROJECT / NOT FOUND</div>
          <h1>This project route does not exist.</h1>
          <AppLink href="/" className="button-link">
            <ArrowLeft size={17} /> Back Home
          </AppLink>
        </section>
      </main>
    );
  }

  return (
    <main className="page page--inner project-detail">
      <header className="project-detail__hero">
        <AppLink href="/#selected-work" className="text-link text-link--muted">
          <ArrowLeft size={16} /> Selected Work
        </AppLink>
        <div className="project-detail__meta">
          <span>{project.label}</span>
          <span>{project.period}</span>
        </div>
        <h1>{project.title}</h1>
        <p>{project.subtitle}</p>
      </header>

      <ProjectVisual project={project} index={projects.indexOf(project)} />
      <section className="project-detail__overview">
        <div className="section-eyebrow">PROJECT OVERVIEW</div>
        <p>{project.description}</p>
        <div className="project-facts">
          <div>
            <span>Role</span>
            <strong>{project.role.join(" · ")}</strong>
          </div>
          <div>
            <span>Period</span>
            <strong>{project.period}</strong>
          </div>
        </div>
      </section>

      <section
        className="editorial-section project-detail__section"
        aria-labelledby="project-technology"
      >
        <div className="section-eyebrow">TECHNOLOGY</div>
        <h2 id="project-technology">Technology used.</h2>
        <div className="large-chip-list">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>

      <section
        className="editorial-section project-detail__section"
        aria-labelledby="project-implementation"
      >
        <div className="section-eyebrow">IMPLEMENTATION</div>
        <h2 id="project-implementation">
          {project.id === "ai-automation"
            ? "Concept capabilities."
            : "Implemented capabilities."}
        </h2>
        <div className="feature-list">
          {project.features.map((feature, index) => (
            <div key={feature}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{feature}</strong>
            </div>
          ))}
        </div>
      </section>

      {project.architecture?.length ? (
        <section
          className="editorial-section project-detail__section"
          aria-labelledby="project-architecture"
        >
          <div className="section-eyebrow">ARCHITECTURE</div>
          <h2 id="project-architecture">System composition.</h2>
          <div className="architecture-flow">
            {project.architecture.map((item, index) => (
              <div key={item} className="architecture-node">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.caseStudyUrl ? (
        <section className="editorial-section project-detail__section">
          <a
            href={project.caseStudyUrl}
            className="button-link"
            target="_blank"
            rel="noreferrer"
          >
            External Case Study <ArrowUpRight size={17} />
          </a>
        </section>
      ) : null}

      <NextChapter
        label="CONTINUE EXPLORING"
        title="Back to Selected Work."
        href="/#selected-work"
      />
    </main>
  );
}
