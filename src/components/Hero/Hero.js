"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t, language } = useLanguage();
  const heroRef = useRef(null);

  // Mouse parallax for the portrait
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });
  const photoX = useTransform(springX, [-1, 1], [-14, 14]);
  const photoY = useTransform(springY, [-1, 1], [-14, 14]);

  const handleMouseMove = (e) => {
    const rect = heroRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * 2);
    y.set(relY * 2);
  };

  const wordContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
  };

  const wordItem = {
    hidden: { y: 44, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
    },
  };

  const renderStaggeredLine = (line) =>
    line.split(" ").map((word, i) => (
      <motion.span key={i} variants={wordItem} className={styles.word}>
        {word}
      </motion.span>
    ));

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className={`${styles.hero} dotGrid`}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.textCol}>
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            className={styles.title}
            variants={wordContainer}
            initial="hidden"
            animate="visible"
          >
            <span className={styles.line}>
              {renderStaggeredLine(t("hero.titleLine1"))}
            </span>
            <span className={`${styles.line} ${styles.lineAccent}`}>
              {renderStaggeredLine(t("hero.titleLine2"))}
            </span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
          >
            <a href="#about" className={styles.ctaPrimary}>
              {t("hero.ctaPrimary")}
            </a>
            <a href="#join" className={styles.ctaSecondary}>
              {t("hero.ctaSecondary")}
            </a>
          </motion.div>

          <motion.p
            lang="am"
            className={styles.verseFragment}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.3 }}
          >
            {t("hero.verseFragment")}
            <span className={styles.verseRef}>— {t("hero.verseRef")}</span>
          </motion.p>
        </div>

        <motion.div
          className={styles.photoCol}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.div
            className={styles.photoRing}
            style={{ x: photoX, y: photoY }}
          >
            <div className={styles.photoFrame}>
              <img
                src="/images/hero-portrait.jpg"
                alt="A woman of Lebam Set"
                className={styles.photo}
              />
              <div className={styles.photoOverlay} />
            </div>
          </motion.div>
          <div className={styles.orbitDot} />
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <span>{t("hero.scrollCue")}</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
