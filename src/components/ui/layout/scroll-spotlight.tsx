"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollSpotlight() {
  const pathname = usePathname();

  useEffect(() => {
    if (!["/projects", "/journal", "/tech-stack"].includes(pathname)) return;
    const shell = document.querySelector<HTMLElement>(".portfolio-shell");
    if (!shell) return;
    const finePointer = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

    let pointer: { x: number; y: number } | null = null;
    let active: HTMLElement | null = null;
    let frame = 0;

    const clear = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      active?.removeAttribute("data-spotlight-active");
      active = null;
      shell.removeAttribute("data-scroll-spotlight");
    };

    const update = () => {
      frame = 0;
      if (!pointer || !finePointer.matches) {
        clear();
        return;
      }

      const element = document.elementFromPoint(pointer.x, pointer.y);
      const next = element?.closest<HTMLElement>(".spotlight-entry") ?? null;
      const target = next && shell.contains(next) ? next : null;
      if (active !== target) {
        active?.removeAttribute("data-spotlight-active");
        target?.setAttribute("data-spotlight-active", "");
        active = target;
      }
      // Browsers can keep :hover on the old row until smooth scrolling ends.
      shell.setAttribute("data-scroll-spotlight", "");
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (shell.hasAttribute("data-scroll-spotlight")) clear();
    };
    const onScroll = () => {
      if (pointer && !frame) frame = requestAnimationFrame(update);
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        pointer = null;
        clear();
      }
    };
    const onBlur = () => {
      pointer = null;
      clear();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", onBlur);
    finePointer.addEventListener("change", clear);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onBlur);
      finePointer.removeEventListener("change", clear);
      clear();
    };
  }, [pathname]);

  return null;
}
