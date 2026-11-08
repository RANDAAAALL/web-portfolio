"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const WIDTH = 260;
const HEIGHT = 80;
const START_DELAY = 600;
const DURATION = 1300;

export function Signature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const source = imageRef.current;
    const canvas = canvasRef.current;
    if (!container || !source || !canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let startTimer = 0;
    let started = false;
    let finished = false;

    const finish = () => {
      finished = true;
      cancelAnimationFrame(frame);
      clearTimeout(startTimer);
      container.dataset.signatureState = "complete";
      source.style.opacity = "1";
    };

    const start = () => {
      if (started || finished) return;
      started = true;
      if (motion.matches || !source.naturalWidth) { finish(); return; }

      const sample = document.createElement("canvas");
      sample.width = WIDTH * 2;
      sample.height = HEIGHT * 2;
      const sampler = sample.getContext("2d", { willReadFrequently: true });
      const context = canvas.getContext("2d");
      if (!sampler || !context) { finish(); return; }

      try {
        sampler.drawImage(source, 0, 0, sample.width, sample.height);
        const pixels = sampler.getImageData(0, 0, sample.width, sample.height).data;
        const particles: { x: number; y: number; dx: number; dy: number; size: number; delay: number }[] = [];
        for (let y = 0; y < sample.height; y += 2) {
          for (let x = 0; x < sample.width; x += 2) {
            if (pixels[(y * sample.width + x) * 4 + 3] < 40) continue;
            const index = particles.length;
            particles.push({
              x: x / 2,
              y: y / 2,
              dx: ((index * 47 % 101) / 100 - 0.3) * 48,
              dy: ((index * 31 % 103) / 102 - 0.5) * 32,
              size: 0.75 + (index * 13 % 17) / 32,
              delay: x / sample.width * 0.3,
            });
          }
        }
        if (!particles.length) { finish(); return; }

        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = WIDTH * ratio;
        canvas.height = HEIGHT * ratio;
        context.scale(ratio, ratio);
        context.fillStyle = "#fff";
        source.style.opacity = "0";
        canvas.style.opacity = "1";
        container.dataset.signatureState = "running";
        const startedAt = performance.now();

        const draw = (now: number) => {
          if (finished) return;
          const time = Math.min((now - startedAt) / DURATION, 1);
          const settle = Math.max(0, (time - 0.78) / 0.22);
          context.clearRect(0, 0, WIDTH, HEIGHT);
          for (const particle of particles) {
            const progress = Math.min(1, Math.max(0, (time - particle.delay) / 0.65));
            const drift = Math.pow(1 - progress, 3);
            context.globalAlpha = Math.min(1, progress * 6);
            context.fillRect(particle.x + particle.dx * drift, particle.y + particle.dy * drift, particle.size, particle.size);
          }
          // Finish revealing the SVG before the particle layer clears to avoid a final flicker.
          canvas.style.opacity = String(1 - settle);
          source.style.opacity = String(Math.min(1, settle * 2.5));
          if (time < 1) frame = requestAnimationFrame(draw);
          else finish();
        };
        frame = requestAnimationFrame(draw);
      } catch {
        finish();
      }
    };

    const scheduleStart = () => {
      if (started || finished || startTimer) return;
      if (motion.matches || !source.naturalWidth) { finish(); return; }
      container.dataset.signatureState = "pending";
      source.style.opacity = "0";
      startTimer = window.setTimeout(() => {
        startTimer = 0;
        start();
      }, START_DELAY);
    };
    const onMotionChange = () => { if (motion.matches) finish(); };
    motion.addEventListener("change", onMotionChange);
    source.addEventListener("load", scheduleStart, { once: true });
    source.addEventListener("error", finish, { once: true });
    if (source.complete) scheduleStart();

    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      clearTimeout(startTimer);
      source.removeEventListener("load", scheduleStart);
      source.removeEventListener("error", finish);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="signature" ref={containerRef}>
      <Image ref={imageRef} className="signature-art" src="/lester-signature.svg" alt="Lester Andig's signature" width={650} height={200} priority />
      <canvas ref={canvasRef} className="signature-particles" width={WIDTH} height={HEIGHT} aria-hidden="true" />
    </div>
  );
}
