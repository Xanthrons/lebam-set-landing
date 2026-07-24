"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./Team.module.css";

export default function Team() {
  const { t, language } = useLanguage();
  const members = t("team.members");
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });
      fadeUpStagger(gridRef.current.children, gridRef.current, {
        stagger: 0.05,
        y: 30,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [language]);

  return (
    <section id="team" ref={sectionRef} className={`section ${styles.team}`}>
      <div ref={headerRef} className={`container ${styles.header}`}>
        <span data-reveal className={styles.eyebrow}>
          {t("team.eyebrow")}
        </span>
        <h2 data-reveal className={styles.title}>
          {t("team.title")}
        </h2>
        <p data-reveal className={styles.subtitle}>
          {t("team.subtitle")}
        </p>
      </div>

      <div className="container">
        <div ref={gridRef} className={styles.grid}>
          {members.map((m, i) => (
            <div key={m.name} className={styles.card}>
              <div className={styles.photoWrap}>
                <img
                  src={`/images/team-${i + 1}.jpg`}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className={styles.name}>{m.name}</h3>
              <span className={styles.role} lang={language}>
                {m.role}
              </span>
              <p lang={language} className={styles.bio}>
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
