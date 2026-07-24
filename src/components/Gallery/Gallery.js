"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import GalleryLightbox from "./GalleryLightbox";
import styles from "./Gallery.module.css";

const photoSrcs = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
  "/images/gallery-9.jpg",
];

export default function Gallery() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const photos = t("gallery.photos").map((p, i) => ({
    src: photoSrcs[i % photoSrcs.length],
    caption: p.caption,
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });

      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [language]);

  return (
    <section ref={sectionRef} className={`section ${styles.gallery}`}>
      <div ref={headerRef} className={`container ${styles.header}`}>
        <span data-reveal className={styles.eyebrow}>
          {t("gallery.eyebrow")}
        </span>
        <h2 data-reveal className={styles.title}>
          {t("gallery.title")}
        </h2>
        <p data-reveal className={styles.subtitle}>
          {t("gallery.subtitle")}
        </p>
      </div>

      <div className="container">
        <div ref={gridRef} className={styles.masonry}>
          {photos.map((photo, i) => (
            <button
              key={i}
              className={styles.tile}
              onClick={() => setActiveIndex(i)}
              aria-label={photo.caption}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.tileOverlay}>
                <span className={styles.viewIcon}>+</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          photos={photos}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </section>
  );
}
