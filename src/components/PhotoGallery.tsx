"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/domain";

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const photo = selected === null ? undefined : photos[selected];

  useEffect(() => {
    if (selected === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);

  function open(index: number) {
    setSelected(index);
    dialog.current?.showModal();
  }

  function move(direction: number) {
    setSelected((index) => index === null ? null : (index + direction + photos.length) % photos.length);
  }

  if (!photos.length) return <p className="mt-12 rounded-lg border border-zinc-200 bg-white p-8 text-zinc-600">Photos are coming soon.</p>;

  return <>
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((item, index) => (
        <figure key={item.key} className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <button type="button" onClick={() => open(index)} aria-label={`Enlarge photo ${index + 1}: ${item.alt}`} className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#1a1f2e] focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#f2a81d]">
            <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
            <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-[#111318]/80 px-3 py-1 text-sm text-white">View photo ↗</span>
          </button>
          {item.caption ? <figcaption className="px-5 py-4 text-sm leading-6 text-zinc-600">{item.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
    <dialog ref={dialog} aria-label="Photo viewer" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }} className="fixed inset-0 m-auto max-h-[95dvh] w-[calc(100%_-_2rem)] max-w-5xl overflow-y-auto rounded-lg bg-[#111318] p-4 text-[#f5f0e8] shadow-2xl backdrop:bg-black/85 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p aria-live="polite" aria-atomic="true" className="text-sm">Photo {selected === null ? 1 : selected + 1} of {photos.length}</p>
        <button type="button" onClick={() => dialog.current?.close()} className="min-h-11 rounded-md border border-white/30 px-4 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#f2a81d]">Close ✕</button>
      </div>
      {photo ? <figure>
        <div className="relative h-[55dvh] sm:h-[65dvh]">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 976px, 95vw" className="object-contain" />
        </div>
        {photo.caption ? <figcaption className="mt-4 text-center text-sm leading-6 text-[#f5f0e8]/80">{photo.caption}</figcaption> : null}
      </figure> : null}
      {photos.length > 1 ? <div className="mt-4 flex justify-between gap-4">
        <button type="button" onClick={() => move(-1)} className="min-h-11 rounded-md border border-white/30 px-4 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#f2a81d]">← Previous photo</button>
        <button type="button" onClick={() => move(1)} className="min-h-11 rounded-md border border-white/30 px-4 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#f2a81d]">Next photo →</button>
      </div> : null}
    </dialog>
  </>;
}
