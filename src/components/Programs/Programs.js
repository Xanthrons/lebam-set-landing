"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./Programs.module.css";

export default function Programs() {
  const { t, language } = useLanguage();
  const items = t("programs.items");

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });
      fadeUpStagger(listRef.current.children, listRef.current, {
        stagger: 0.08,
        y: 24,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [language]);

  const active = items[activeIndex];

  return (
    <section
      id="programs"
      ref={sectionRef}
      className={`section ${styles.programs} dotGrid`}
    >
      <div ref={headerRef} className={`container ${styles.header}`}>
        <span data-reveal className={styles.eyebrow}>
          {t("programs.eyebrow")}
        </span>
        <h2 data-reveal className={styles.title}>
          {t("programs.title")}
        </h2>
        <p data-reveal className={styles.subtitle}>
          {t("programs.subtitle")}
        </p>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* ---- Index list: the ONLY place the title text lives ---- */}
        <div ref={listRef} className={styles.list}>
          {items.map((item, i) => (
            <div key={item.title} className={styles.listItemWrap}>
              <button
                className={`${styles.listItem} ${activeIndex === i ? styles.listItemActive : ""}`}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                aria-expanded={activeIndex === i}
              >
                <span className={styles.listNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.listTitle}>{item.title}</span>
                <span className={styles.listArrow}>→</span>
              </button>

              {/* Mobile-only inline accordion — desktop uses the sticky panel instead */}
              <AnimatePresence initial={false}>
                {activeIndex === i && (
                  <motion.div
                    className={styles.mobilePanel}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <p lang={language} className={styles.mobileText}>
                      {item.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ---- Sticky detail panel (desktop only): no title, just the medallion + description ---- */}
        <div className={styles.panel}>
          <div className={styles.medallion}>
            <span className={styles.ringDashed} aria-hidden="true" />
            <span className={styles.ringSolid} aria-hidden="true" />
            <span className={styles.medallionNumber}>
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
              className={styles.panelContent}
            >
              <p lang={language} className={styles.panelText}>
                {active.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
