import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/values/project";

function ProjectEntry({ project }: { project: (typeof projects)[number] }) {
  const images = Array.isArray(project.image) ? project.image : [project.image];
  return (
    <article className="project-entry spotlight-entry" data-project-id={project.id}>
      <div className="project-summary">
        <h3 className="item-title">{project.title}</h3>
        <p className="item-description">{project.description}</p>
        <ul className="technology-list" aria-label="Technologies">
          {project.technologies.map(tech => <li key={tech}>{tech}</li>)}
        </ul>
        <div className="project-links">
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}>visit site <ArrowUpRight size={13} aria-hidden="true" /></a>}
          {!project.private && project.githubUrl && <a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`Source code for ${project.title}`}>source <Github size={13} aria-hidden="true" /></a>}
        </div>
      </div>
      <div className={images.length > 1 ? "project-media project-media-pair" : "project-media"}>
        {images.map((src, i) => <Image key={src} src={src} alt={`${project.title} screenshot ${i + 1}`} width={600} height={380} sizes={images.length > 1 ? "(max-width: 639px) calc((100vw - 60px) / 2), 134px" : "(max-width: 639px) calc(100vw - 48px), 268px"} className="project-image" />)}
      </div>
    </article>
  );
}

export default function ProjectsContainer() {
  return (
    <section aria-labelledby="page-title">
      <div className="project-list">
        {projects.map(project => <ProjectEntry key={project.id} project={project} />)}
      </div>
    </section>
  );
}
