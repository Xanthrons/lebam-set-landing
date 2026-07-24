"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const { t, language } = useLanguage();
  const items = t("faq.items");

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0); // first one open by default

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });
      fadeUpStagger(listRef.current.children, listRef.current, {
        stagger: 0.06,
        y: 20,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [language]);

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <section id="faq" ref={sectionRef} className={`section ${styles.faq}`}>
      <div ref={headerRef} className={`container ${styles.header}`}>
        <span data-reveal className={styles.eyebrow}>
          {t("faq.eyebrow")}
        </span>
        <h2 data-reveal className={styles.title}>
          {t("faq.title")}
        </h2>
        <p data-reveal className={styles.subtitle}>
          {t("faq.subtitle")}
        </p>
      </div>

      <div className={`container ${styles.container}`}>
        <div ref={listRef} className={styles.list}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <button
                  className={styles.question}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className={styles.qNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span lang={language} className={styles.qText}>
                    {item.q}
                  </span>
                  <span className={styles.qIcon}>
                    <span className={styles.qIconBar} />
                    <span
                      className={`${styles.qIconBar} ${styles.qIconBarV}`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      className={styles.answerWrap}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                    >
                      <p lang={language} className={styles.answer}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
