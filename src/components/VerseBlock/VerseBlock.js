"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./VerseBlock.module.css";

export default function VerseBlock() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const wordsRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordsRef.current.querySelectorAll("span");
      fadeUpStagger(words, sectionRef.current, {
        y: 24,
        stagger: 0.03,
        duration: 0.7,
      });

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  const words = t("verse.text").split(" ");

  return (
    <section id="verse" ref={sectionRef} className={styles.verseBlock}>
      <div className={styles.watermark} aria-hidden="true">
        ”
      </div>

      <div className={`container ${styles.inner}`}>
        <p ref={wordsRef} lang={language} className={styles.verseText}>
          {words.map((word, i) => (
            <span key={i} className={styles.word}>
              {word}&nbsp;
            </span>
          ))}
        </p>
        <div ref={lineRef} className={styles.divider} />
        <span className={styles.verseRef}>{t("verse.ref")}</span>
      </div>
    </section>
  );
}
