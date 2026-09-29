import { journalPosts } from "./journal";
import { formatCategoryName } from "@/lib/helper/format-category-name";

export const pageIntros: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Experience",
    description: "My experience in web development, as someone who loves building modern web applications, is focused on crafting user-friendly and engaging digital experiences",
  },
  "/projects": {
    title: "Projects",
    description: "A selection of projects I've worked on, ranging from web applications to personal and academic projects.",
  },
  "/certificates": {
    title: "Certificates",
    description: "A collection of certifications I've earned, highlighting my skills, professional development, and commitment to continuous learning.",
  },
  "/journal": {
    title: "Journal",
    description: "Explore my journals, documenting projects, experiences, and adventures.",
  },
  "/tech-stack": {
    title: "Tech Stack",
    description: "Technologies and tools I use to build modern web applications.",
  },
  ...Object.fromEntries(Object.entries(journalPosts).map(([category, posts]) => [
    `/journal/${category}`,
    { title: formatCategoryName(category), description: `${posts.length} photographs` },
  ])),
};
