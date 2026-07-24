"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./JoinCommunity.module.css";

const TIKTOK_URL = "https://www.tiktok.com/@lebamset";
const TELEGRAM_URL = "https://t.me/lebamset";

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82c-1.02-.9-1.66-2.2-1.66-3.66h-3.17v13.6c0 1.64-1.33 2.98-2.98 2.98a2.98 2.98 0 0 1-2.98-2.98 2.98 2.98 0 0 1 2.98-2.98c.27 0 .53.04.78.1V9.7a6.18 6.18 0 0 0-.78-.05A6.15 6.15 0 0 0 2.65 15.8 6.15 6.15 0 0 0 8.8 21.95a6.15 6.15 0 0 0 6.15-6.15V8.98a8.34 8.34 0 0 0 4.86 1.56V7.37a4.85 4.85 0 0 1-3.21-1.55z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.9 4.3 18.6 20c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.15L18.05 6.4c.4-.36-.09-.56-.62-.2L6.4 13.47l-5-1.57c-1.1-.34-1.11-1.1.23-1.63L20.5 3.5c.9-.34 1.7.2 1.4 1.8z" />
    </svg>
  );
}

export default function JoinCommunity() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const collageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textEls = textRef.current.querySelectorAll("[data-reveal]");
      fadeUpStagger(textEls, sectionRef.current, { stagger: 0.1 });

      gsap.fromTo(
        collageRef.current.children,
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section id="join" ref={sectionRef} className={`section ${styles.join}`}>
      <div className={`container ${styles.inner}`}>
        <div ref={textRef} className={styles.textCol}>
          <span data-reveal className={styles.eyebrow}>
            {t("join.eyebrow")}
          </span>
          <h2 data-reveal className={styles.title}>
            {t("join.title")}
          </h2>
          <p data-reveal className={styles.text}>
            {t("join.text")}
          </p>

          <div data-reveal className={styles.buttonRow}>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
            >
              <span className={styles.btnFill} />
              <span className={styles.btnContent}>
                <TikTokIcon />
                {t("join.tiktok")}
              </span>
            </a>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
            >
              <span className={styles.btnFill} />
              <span className={styles.btnContent}>
                <TelegramIcon />
                {t("join.telegram")}
              </span>
            </a>
          </div>

          <p data-reveal className={styles.note}>
            {t("join.note")}
          </p>
        </div>

        <div ref={collageRef} className={styles.collage}>
          <div className={`${styles.collageItem} ${styles.itemLarge}`}>
            <img src="/images/community-1.jpg" alt="Women of Lebam Set" />
          </div>
          <div className={`${styles.collageItem} ${styles.itemSmall}`}>
            <img src="/images/community-2.jpg" alt="A Lebam Set gathering" />
          </div>
        </div>
      </div>
    </section>
  );
}
