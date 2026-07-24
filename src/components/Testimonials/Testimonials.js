"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./Testimonials.module.css";

const AUTOPLAY_MS = 6000;

export default function Testimonials() {
  const { t, language } = useLanguage();
  const items = t("testimonials.items");

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });
    }, sectionRef);
    return () => ctx.revert();
  }, [language]);

  const goTo = useCallback(
    (next) => {
      setDirection(
        next > index || (index === items.length - 1 && next === 0) ? 1 : -1,
      );
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [index, items.length],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const timer = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, isPaused, reducedMotion, goNext]);

  const current = items[index];

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.testimonials}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div ref={headerRef} className={`container ${styles.header}`}>
        <span data-reveal className={styles.eyebrow}>
          {t("testimonials.eyebrow")}
        </span>
        <h2 data-reveal className={styles.title}>
          {t("testimonials.title")}
        </h2>
        <p data-reveal className={styles.subtitle}>
          {t("testimonials.subtitle")}
        </p>
      </div>

      <div className={`container ${styles.stage}`}>
        <button
          className={`${styles.arrowBtn} ${styles.arrowPrev}`}
          onClick={goPrev}
          aria-label="Previous testimonial"
        >
          ‹
        </button>

        <div className={styles.spotlight}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              className={styles.slide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                if (info.offset.x < -60) goNext();
                else if (info.offset.x > 60) goPrev();
              }}
            >
              <div className={styles.photoCol}>
                <div className={styles.photoFrame}>
                  <img
                    src={`/images/testimonial-${index + 1}.jpg`}
                    alt={current.name}
                    className={styles.photo}
                  />
                </div>
                <span className={styles.quoteMark} aria-hidden="true">
                  ”
                </span>
              </div>

              <div className={styles.textCol}>
                <div className={styles.stars}>★★★★★</div>
                <p lang={language} className={styles.quote}>
                  {current.quote}
                </p>
                <div className={styles.person}>
                  <span className={styles.name}>{current.name}</span>
                  <span className={styles.location}>{current.location}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className={`${styles.arrowBtn} ${styles.arrowNext}`}
          onClick={goNext}
          aria-label="Next testimonial"
        >
          ›
        </button>
      </div>

      <div className={styles.thumbRow}>
        {items.map((item, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Show testimonial from ${item.name}`}
          >
            <img src={`/images/testimonial-${i + 1}.jpg`} alt="" />
            {i === index && !isPaused && !reducedMotion && (
              <svg className={styles.thumbProgress} viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  className={styles.thumbProgressCircle}
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
