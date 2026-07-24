"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./Programs.module.css";

const images = [
  "/images/program-1.jpg",
  "/images/program-2.jpg",
  "/images/program-3.jpg",
];

export default function Programs() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const items = t("programs.items");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(headerEls, sectionRef.current, { stagger: 0.12 });

      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0, rotate: 2 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 85%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className={`section ${styles.programs}`}
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

      <div className="container">
        <div className={styles.grid}>
          {items.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                <img
                  src={images[i]}
                  alt={item.title}
                  className={styles.image}
                />
                <div className={styles.imageOverlay} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
                <a href="#join" className={styles.cardLink}>
                  {item.link}
                  <span className={styles.arrow}>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
