import type { Project } from "@/data/projects";
export function ProjectVisual({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const cover =
    project.id === "klik-kelontong"
      ? "/images/klik-kelontong.webp"
      : project.id === "pertamedika-hris"
        ? "/images/integrated-hris.webp"
        : null;
  return (
    <div className={`project-visual project-visual--${project.id}`}>
      {cover ? (
        <img
          src={cover}
          alt=""
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="automation-diagram"
          aria-label="Workflow concept: research, analyse, generate, insight"
        >
          <span>01 / RESEARCH</span>
          <i />
          <span>02 / ANALYSE</span>
          <i />
          <span>03 / GENERATE</span>
          <i />
          <span>04 / INSIGHT</span>
        </div>
      )}
      <div className="project-visual-top">
        <span>{String(index + 1).padStart(2, "0")} / SELECTED WORK</span>
        <span>{cover ? "CONCEPTUAL COVER" : "WORKFLOW CONCEPT"}</span>
      </div>
      <div className="project-cover-title" aria-hidden="true">
        {project.id === "klik-kelontong" ? (
          <>
            Klik
            <br />
            Kelontong.
          </>
        ) : project.id === "pertamedika-hris" ? (
          <>
            People.
            <br />
            Connected.
          </>
        ) : (
          <>
            Intelligence
            <br />
            into action.
          </>
        )}
      </div>
    </div>
  );
}
