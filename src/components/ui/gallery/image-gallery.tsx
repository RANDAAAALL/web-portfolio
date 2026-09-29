"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type GalleryItem = { src: string; alt: string; title: string; subtitle?: string };

function GalleryViewer({ items, startIndex }: { items: GalleryItem[]; startIndex: number }) {
  const [viewport, carousel] = useEmblaCarousel({ loop: true, startIndex });
  const [index, setIndex] = useState(startIndex);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const previousButton = useRef<HTMLButtonElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!carousel) return;
    const onSelect = () => setIndex(carousel.selectedScrollSnap());
    carousel.on("select", onSelect);
    return () => { carousel.off("select", onSelect); };
  }, [carousel]);

  return (
    <div onKeyDown={event => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setKeyboardNavigation(true);
        previousButton.current?.focus({ preventScroll: true });
        carousel?.scrollPrev(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setKeyboardNavigation(true);
        nextButton.current?.focus({ preventScroll: true });
        carousel?.scrollNext(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
    }}>
      <DialogTitle className="pr-8 text-sm leading-6">{items[index].title}</DialogTitle>
      <DialogDescription className="sr-only">Image viewer. Use the left and right arrow keys to browse. Press Escape to close.</DialogDescription>
      <div className="gallery-viewport my-4" ref={viewport}>
        <div className="gallery-track">
          {items.map((item, i) => <div className="gallery-slide" key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 90vw, 900px" className="object-contain" loading={i === startIndex ? "eager" : "lazy"} /></div>)}
        </div>
      </div>
      <div className="gallery-controls" data-keyboard-navigation={keyboardNavigation || undefined} onPointerMove={() => setKeyboardNavigation(false)}>
        <button ref={previousButton} type="button" aria-label="Previous image" onClick={() => carousel?.scrollPrev(window.matchMedia("(prefers-reduced-motion: reduce)").matches)}><ArrowLeft size={18} /></button>
        <p className="gallery-caption" aria-live="polite">{index + 1} / {items.length}{items[index].subtitle && <span className="block">{items[index].subtitle}</span>}</p>
        <button ref={nextButton} type="button" aria-label="Next image" onClick={() => carousel?.scrollNext(window.matchMedia("(prefers-reduced-motion: reduce)").matches)}><ArrowRight size={18} /></button>
      </div>
    </div>
  );
}

export function ImageGallery({ items, contain = false }: { items: GalleryItem[]; contain?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return (
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <button type="button" className="gallery-trigger" key={item.src} aria-label={`View ${item.title}`} aria-haspopup="dialog" onClick={event => {
            trigger.current = event.currentTarget;
            event.currentTarget.dataset.revealComplete = "true";
            setSelected(index);
          }}>
            <span className="gallery-thumbnail"><Image src={item.src} alt={item.alt} fill sizes="(max-width: 379px) calc(100vw - 48px), (max-width: 719px) calc((100vw - 68px) / 2), 326px" className={contain ? "object-contain p-3" : "object-cover"} /></span>
            <span className="item-title text-center">{item.title}</span>
            {item.subtitle && <span className="item-meta text-center">{item.subtitle}</span>}
          </button>
        ))}
      </div>
      <DialogContent className="max-h-[94dvh] overflow-y-auto sm:max-w-5xl" onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }}>
        {selected !== null && <GalleryViewer items={items} startIndex={selected} />}
      </DialogContent>
    </Dialog>
  );
}
