"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, ScrollTrigger } from "@/lib/scrollAnimations";
import styles from "./ImpactStats.module.css";

export default function ImpactStats() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const numberRefs = useRef([]);

  const items = t("impact.items");

  useEffect(() => {
    const ctx = gsap.context(() => {
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = items[i].value;
        const counter = { val: 0 };

        gsap.to(counter, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.val);
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      });

      gsap.fromTo(
        `.${styles.stat}`,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section ref={sectionRef} className={styles.impact}>
      <div className={`container ${styles.grid}`}>
        {items.map((item, i) => (
          <div key={item.label} className={styles.stat}>
            <div className={styles.value}>
              <span ref={(el) => (numberRefs.current[i] = el)}>0</span>
              <span className={styles.suffix}>{item.suffix}</span>
            </div>
            <div className={styles.label}>{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
