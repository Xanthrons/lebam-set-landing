"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, ScrollTrigger, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);
  const statRef = useRef(null);
  const mvpRef = useRef(null);
  const valuesRef = useRef(null);

  const mvpItems = [t("about.mission"), t("about.vision"), t("about.purpose")];
  const values = t("about.values");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Story text
      const textEls = textRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(textEls, sectionRef.current, { stagger: 0.12 });

      // Image parallax — desktop + motion-ok only
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(imageRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Stat chip pop-in
      gsap.fromTo(
        statRef.current,
        { scale: 0.6, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top 65%",
            once: true,
          },
        },
      );

      // Mission / Vision / Purpose cards
      const mvpCards = mvpRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(mvpCards, mvpRef.current, { stagger: 0.15, y: 50 });

      // Core value chips
      const chips = valuesRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(chips, valuesRef.current, {
        stagger: 0.06,
        y: 20,
        duration: 0.6,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section id="about" ref={sectionRef} className={`section ${styles.about}`}>
      <div className={`container ${styles.inner}`}>
        <div ref={textRef} className={styles.textCol}>
          <span data-reveal className={styles.eyebrow}>
            {t("about.eyebrow")}
          </span>
          <h2 data-reveal className={styles.title}>
            {t("about.title")}
          </h2>
          <p data-reveal lang={language} className={styles.paragraphLead}>
            {t("about.paragraph1")}
          </p>

          <div data-reveal className={styles.paragraphReflectWrap}>
            <span className={styles.paragraphReflectMark} aria-hidden="true">
              ”
            </span>
            <p lang={language} className={styles.paragraphReflect}>
              {t("about.paragraph2")}
            </p>
          </div>
        </div>

        <div ref={imageWrapRef} className={styles.imageCol}>
          <div className={styles.imageMask}>
            <img
              ref={imageRef}
              src="/images/about-photo.jpg"
              alt="Women of Lebam Set gathered together"
              className={styles.image}
            />
          </div>
          <div ref={statRef} className={styles.statChip}>
            <span className={styles.statValue}>{t("about.statValue")}</span>
            <span className={styles.statLabel}>{t("about.statLabel")}</span>
            <span className={styles.statSub}>{t("about.statSub")}</span>
          </div>
          <div className={styles.ringAccent} />
        </div>
      </div>

      {/* ---- Mission / Vision / Purpose ---- */}
      <div className={`container ${styles.mvpHeader}`}>
        <span className={styles.eyebrow}>{t("about.mvpEyebrow")}</span>
      </div>

      <div ref={mvpRef} className={`container ${styles.mvpGrid}`}>
        {mvpItems.map((item, i) => (
          <div key={item.label} data-reveal className={styles.mvpCard}>
            <span className={styles.mvpBadge}>{["M", "V", "P"][i]}</span>
            <h3 className={styles.mvpTitle}>{item.label}</h3>
            <p lang={language} className={styles.mvpText}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* ---- Core Values ---- */}
      <div className={`container ${styles.valuesHeader}`}>
        <span className={styles.eyebrow}>{t("about.valuesEyebrow")}</span>
        <h3 className={styles.valuesTitle}>{t("about.valuesTitle")}</h3>
      </div>

      <div ref={valuesRef} className={`container ${styles.valuesGrid}`}>
        {values.map((v) => (
          <div key={v.name} data-reveal className={styles.valueChip}>
            <span className={styles.valueName}>{v.name}</span>
            <span className={styles.valueDivider} />
            <span lang={language} className={styles.valueText}>
              {v.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
