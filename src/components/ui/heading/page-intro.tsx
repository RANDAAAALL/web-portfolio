"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function PageIntro({ pages }: { pages: Record<string, { title: string; description: string }> }) {
  const pathname = usePathname();
  const page = pages[pathname];
  if (!page) return null;
  const words = page.description.split(" ");

  return (
    <div className="page-intro">
      <h2 id="page-title" className="sr-only">{page.title}</h2>
      <p key={pathname}>
        {words.map((word, index) => (
          <Fragment key={index}>
            {index > 0 ? " " : null}
            <span
              className="intro-word"
              style={{ animationDelay: `calc(var(--intro-stagger-duration) * ${index / Math.max(words.length - 1, 1)})` }}
            >
              {word}
            </span>
          </Fragment>
        ))}
      </p>
    </div>
  );
}
