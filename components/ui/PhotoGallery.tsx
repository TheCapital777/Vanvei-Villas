"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

interface PhotoGalleryProps {
  images: readonly string[];
  name: string;
}

export default function PhotoGallery({ images, name }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const openAt = (i: number) => {
    setLightboxIndex(i);
    setLightbox(true);
  };

  const next = useCallback(() => {
    setDirection(1);
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, next, prev]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (!images.length) return (
    <div className="h-64 bg-[#161616] flex items-center justify-center border-b border-white/5">
      <p className="text-white/30 text-sm">Photos coming soon</p>
    </div>
  );

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  };

  const preview = images.slice(0, 4);

  return (
    <>
      {/* ── Photo grid ── */}
      <div className="px-5 md:px-6 max-w-7xl mx-auto mb-8">
        <div className="relative rounded-2xl overflow-hidden">

          {/* Mobile: single hero image */}
          <div className="md:hidden relative h-64 cursor-pointer" onClick={() => openAt(0)}>
            <Image
              src={images[0]}
              alt={`${name} — photo 1`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); openAt(0); }}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                See all {images.length} photos
              </button>
            )}
          </div>

          {/* Desktop: hero + up to 3 thumbnails */}
          <div className="hidden md:grid grid-cols-2 gap-1.5 h-[460px]">
            {/* Hero */}
            <div
              className="relative cursor-pointer overflow-hidden rounded-l-xl"
              onClick={() => openAt(0)}
            >
              <Image
                src={images[0]}
                alt={`${name} — photo 1`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300" />
            </div>

            {/* Right column — 2 or 3 thumbnails */}
            <div className={`grid gap-1.5 ${preview.length >= 4 ? "grid-rows-2" : "grid-rows-1"}`}>
              {preview.slice(1).map((src, i) => {
                const isLast = i === preview.slice(1).length - 1 && images.length > 4;
                const isTopRight = i === 0;
                const isBottomRight = i === preview.slice(1).length - 1;
                return (
                  <div
                    key={i}
                    className={`relative cursor-pointer overflow-hidden ${
                      isTopRight ? "rounded-tr-xl" : ""
                    } ${isBottomRight ? "rounded-br-xl" : ""}`}
                    onClick={() => openAt(i + 1)}
                  >
                    <Image
                      src={src}
                      alt={`${name} — photo ${i + 2}`}
                      fill
                      loading="lazy"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300" />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">+{images.length - 4} more</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* "See all photos" button — desktop */}
          {images.length > 1 && (
            <button
              onClick={() => openAt(0)}
              className="hidden md:flex absolute bottom-4 right-4 items-center gap-2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-neutral-100 transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              See all {images.length} photos
            </button>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/97 flex flex-col"
            onClick={() => setLightbox(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <p className="text-white/50 text-sm tabular-nums">{lightboxIndex + 1} / {images.length}</p>
              <p className="text-white/70 text-sm font-medium">{name}</p>
              <button
                onClick={() => setLightbox(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 relative flex items-center justify-center px-14" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={lightboxIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 flex items-center justify-center px-14"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={images[lightboxIndex]}
                      alt={`${name} — photo ${lightboxIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail strip */}
            <div
              className="flex-shrink-0 overflow-x-auto py-3 px-4 flex gap-2"
              style={{ scrollbarWidth: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > lightboxIndex ? 1 : -1); setLightboxIndex(i); }}
                  className="relative w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200"
                  style={{
                    opacity: i === lightboxIndex ? 1 : 0.4,
                    outline: i === lightboxIndex ? "2px solid #c8912a" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="64px" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
