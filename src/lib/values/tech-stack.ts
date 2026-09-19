import {
  Code2,
  Palette,
  Braces,
  FileCode,
  // Smartphone,
  Zap,
  Server,
  Database,
  RefreshCcw,
  Flame,
  Coffee,
  GitBranch,
  Wind,
  Globe,
  // Code,
} from "lucide-react"


export const techStack = {
    Frontend: [
      { name: "HTML", description: "Markup language for web pages", icon: Code2 },
      { name: "CSS", description: "Styling language for web pages", icon: Palette },
      { name: "JavaScript", description: "Programming language for the web",  icon: Braces },
      { name: "TypeScript", description: "Typed JavaScript", icon: FileCode },
      { name: "React", description: "Component-based UI library", icon: Code2 },
      { name: "Next.js", description: "Full-stack React framework", icon: Zap },
      { name: "TanStack Query", description: "Powerful data fetching and state management library for React", icon: RefreshCcw},
      // { name: "React Native", description: "Mobile app framework", icon: Smartphone },
      // { name: "Expo", description: "React Native toolchain for rapid development", icon: Zap },
      { name: "Tailwind CSS", description: "Utility-first CSS framework",  icon: Wind },
    ],
    Backend: [
      { name: "Node.js", description: "JavaScript runtime",  icon: Server },
      { name: "Next.js", description: "Full-stack React framework", icon: Zap },
      { name: "Express.js", description: "Web framework for Node.js", icon: Server },
      { name: "Bun", description: "Fast JavaScript runtime", icon: Coffee },
      { name: "Prisma", description: "Next-generation ORM", icon: Database },
      { name: "REST API", description: "Architectural style for building APIs", icon: Zap },
    ],
    "Database & Services": [
      { name: "MySQL", description: "Relational database", icon: Database },
      { name: "PostgreSQL", description: "Object-relational database", icon: Database },
      { name: "Firebase", description: "Backend-as-a-Service platform", icon: Flame },
      { name: "Supabase", description: "Backend-as-a-Service platform", icon: Zap },
      { name: "Vercel", description: "Cloud platform for static sites and serverless functions", icon: Globe },
      { name: "Render", description: "Cloud platform for deploying and hosting web applications", icon: Globe },
    ],
    "Tools & Languages": [
      { name: "Git", description: "Version control system", icon: GitBranch },
      { name: "Github", description: "Version control platform", icon: GitBranch },
      { name: "Java", description: "Object-oriented programming language", icon: Coffee },
      // { name: "C++", description: "General-purpose programming language", icon: Code },
      // { name: "Android Studio", description: "Integrated development environment for Android app development", icon: Smartphone },
      { name: "VS Code", description: "Lightweight and versatile source code editor with extensive extensions", icon: FileCode }    
    ],
  }