"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./AraSProject.module.css";

export default function AraSProject() {
  const { t, language } = useLanguage();
  const data = t("arasProject");
  const stories = data.stories;

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });

      const cardEls = gridRef.current.querySelectorAll("[data-reveal-card]");
      fadeUpStagger(cardEls, sectionRef.current, { stagger: 0.1 });
    }, sectionRef);
    return () => ctx.revert();
  }, [language]);

  useEffect(() => {
    if (!activeStory) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => e.key === "Escape" && setActiveStory(null);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeStory]);

  const closeModal = useCallback(() => setActiveStory(null), []);

  return (
    <section ref={sectionRef} className={`section ${styles.arasProject}`}>
      <div ref={headerRef} className={`container ${styles.header}`}>
        <span data-reveal className={styles.eyebrow}>
          {data.eyebrow}
        </span>
        <h2 data-reveal className={styles.title}>
          {data.title}
        </h2>
        <p data-reveal lang={language} className={styles.description}>
          {data.description}
        </p>
      </div>

      <div ref={gridRef} className={`container ${styles.grid}`}>
        {stories.map((story) => (
          <div key={story.id} data-reveal-card className={styles.card}>
            <div className={styles.photoFrame}>
              {story.image ? (
                <img
                  src={story.image}
                  alt={story.name}
                  className={styles.photo}
                  loading="lazy"
                />
              ) : (
                <div className={styles.avatarFallback} aria-hidden="true">
                  {story.name?.charAt(0)}
                </div>
              )}
              <span className={styles.quoteMark} aria-hidden="true">
                ”
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.person}>
                <span className={styles.name}>{story.name}</span>
                {story.location && (
                  <span className={styles.location}>{story.location}</span>
                )}
              </div>

              <p lang={language} className={styles.summary}>
                {story.summary}
              </p>

              <button
                type="button"
                className={styles.readMoreBtn}
                onClick={() => setActiveStory(story)}
              >
                {data.readMore}
                <span aria-hidden="true" className={styles.readMoreArrow}>
                  →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.ctaWrap}>
        <a
          href={data.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          {data.ctaText}
        </a>
      </div>

      <AnimatePresence>
        {activeStory && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeModal}
            role="presentation"
          >
            <motion.div
              className={styles.modalPanel}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={activeStory.name}
            >
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeModal}
                aria-label={data.close || "Close"}
              >
                ×
              </button>

              <div className={styles.modalMain}>
                <div className={styles.modalImageCol}>
                  {activeStory.image ? (
                    <img
                      src={activeStory.image}
                      alt={activeStory.name}
                      className={styles.modalImg}
                    />
                  ) : (
                    <div className={styles.avatarFallbackLg} aria-hidden="true">
                      {activeStory.name?.charAt(0)}
                    </div>
                  )}
                  <div className={styles.modalImageOverlay} />
                  <div className={styles.modalHeroText}>
                    <span className={styles.modalName}>{activeStory.name}</span>
                    {activeStory.location && (
                      <span className={styles.modalLocation}>
                        {activeStory.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.modalContentCol}>
                  <span className={styles.modalQuoteMark} aria-hidden="true">
                    ”
                  </span>
                  <div className={styles.modalBody}>
                    {activeStory.fullStory
                      .split("\n")
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i} lang={language}>
                          {para}
                        </p>
                      ))}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <a
                  href={data.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalCtaBtn}
                >
                  {data.modalCta}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
