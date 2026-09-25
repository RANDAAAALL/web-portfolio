import { techStack } from "@/lib/values/tech-stack";

export default function TechStackContainer() {
  return (
    <section aria-labelledby="page-title">
      {Object.entries(techStack).map(([category, technologies]) => (
        <section key={category} className="stack-group spotlight-entry" aria-label={category}>
          <h3 className="group-label">{category.toLowerCase()}</h3>
          <div className="stack-grid">
            {technologies.map(({ name, description, icon: Icon }) => (
              <div key={name} className="stack-item"><Icon size={16} aria-hidden="true" /><div><h4 className="item-title">{name}</h4><p className="item-meta">{description}</p></div></div>
            ))}
          </div>
        </section>
      ))}
      <aside className="closing-note"><h3>Always Learning</h3><p>Technology evolves rapidly, and I&rsquo;m committed to continuous learning. I regularly explore new frameworks, languages, and tools to stay current with industry trends and best practices. Currently diving deep into systems programming and exploring the intersection of web development and machine learning.</p></aside>
    </section>
  );
}
