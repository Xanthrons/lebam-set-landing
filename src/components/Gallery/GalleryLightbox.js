"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./GalleryLightbox.module.css";

export default function GalleryLightbox({ photos, index, onClose, onChange }) {
  const { language } = useLanguage();
  const total = photos.length;
  const photo = photos[index];

  const goNext = () => onChange((index + 1) % total);
  const goPrev = () => onChange((index - 1 + total) % total);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index]);

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        ✕
      </button>
      <span className={styles.counter}>
        {index + 1} / {total}
      </span>

      <button
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label="Previous photo"
      >
        ‹
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            className={styles.figure}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          >
            <img src={photo.src} alt={photo.caption} className={styles.image} />
            <figcaption lang={language} className={styles.caption}>
              {photo.caption}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <button
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        aria-label="Next photo"
      >
        ›
      </button>
    </motion.div>
  );
}
