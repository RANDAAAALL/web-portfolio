export const metadataInfos = {
  metaDatabase: new URL("https://lstrndg.vercel.app"),
  titles: {
    defaults: {
      default: "Experience - Lester Andig",
      template: "%s - Lester Andig",
    },
    pages: {
      projects: {
        title: "Projects",
        description:
          "Explore a selection of projects I've worked on, showcasing my skills in web development. From personal projects to collaborative efforts, discover the diverse range of applications and websites I've built using modern technologies.",
      },
      certificates: {
        title: "Certificates",
        description:
          "A showcase of my certifications, demonstrating my skills, professional development, and commitment to continuous learning in the field of web development.",
      },
      journal: (params?: string) => ({
        title: !params ? "Journal" : `${params} - Journal`,
        description: !params
          ? "Explore my journals, documenting projects, experiences, and adventures."
          : `Journal entry and photos for ${params}.`,
      }),
      techstack: {
        title: "Tech Stack",
        description:
          "Explore the technologies and tools I use to build modern web applications. From frontend frameworks to backend services, discover my tech stack and how I leverage it to create impactful digital experiences.",
      },
    },
  },
  mainDescription:
    "Portfolio of Lester Andig - Web Developer specializing in React, Next.js, and modern web technologies",
  keywords: [
    "web developer",
    "gamer",
    "student",
    "programming",
    "software development",
    "portfolio",
    "projects",
    "certificates",
    "tech stack",
  ],
  creator: "Lester Andig",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/signature-favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/signature-favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/signature-favicon.png",
    apple: { url: "/signature-apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "Lester Andig",
    description:
      "Portfolio of Lester Andig - Web Developer specializing in React, Next.js, and modern web technologies",
    url: "https://lstrndg.vercel.app",
    siteName: "Lester Andig Portfolio",
    images: [
      {
        url: "/lester-social-preview.png",
        width: 1200,
        height: 630,
        alt: "Lester Andig's signature centered above his name on a dark background",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lester Andig",
    description:
      "Portfolio of Lester Andig - Web Developer specializing in React, Next.js, and modern web technologies",
    images: [{
      url: "/lester-social-preview.png",
      alt: "Lester Andig's signature centered above his name on a dark background",
    }],
  },
};
