"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./LoadingScreen.module.css";

const MIN_DURATION = 2200; // won't dismiss before this, even on instant load
const MAX_DURATION = 4500; // forces dismissal even if 'load' never fires cleanly
const VERSE_INTERVAL = 1900;

export default function LoadingScreen() {
  const { t, language } = useLanguage();
  const verses = t("loading.verses");

  const [phase, setPhase] = useState("loading"); // 'loading' | 'closing' | 'done'
  const [progress, setProgress] = useState(0);
  const [verseIndex, setVerseIndex] = useState(0);
  const overlayRef = useRef(null);
  const startedAt = useRef(Date.now());

  // Skip entirely on repeat views within the same tab session
  useEffect(() => {
    if (sessionStorage.getItem("lebam-loaded")) {
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;

    document.body.style.overflow = "hidden";

    // Fake-but-honest progress: eases toward 90% over MIN_DURATION,
    // then jumps to 100% the moment real load + minimum time both clear.
    let raf;
    const tick = () => {
      const elapsed = Date.now() - startedAt.current;
      const pct = Math.min(90, (elapsed / MIN_DURATION) * 90);
      setProgress(pct);
      if (elapsed < MIN_DURATION) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const verseTimer = setInterval(() => {
      setVerseIndex((i) => (i + 1) % verses.length);
    }, VERSE_INTERVAL);

    const finish = () => {
      const elapsed = Date.now() - startedAt.current;
      const wait = Math.max(0, MIN_DURATION - elapsed);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setPhase("closing"), 250);
      }, wait);
    };

    let settled = false;
    const onLoad = () => {
      if (settled) return;
      settled = true;
      finish();
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    const hardStop = setTimeout(() => {
      if (!settled) {
        settled = true;
        setProgress(100);
        setPhase("closing");
      }
    }, MAX_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(verseTimer);
      clearTimeout(hardStop);
      window.removeEventListener("load", onLoad);
    };
  }, [phase, verses.length]);

  const handleOverlayTransitionEnd = (e) => {
    if (e.propertyName !== "clip-path") return;
    document.body.style.overflow = "";
    sessionStorage.setItem("lebam-loaded", "1");
    setPhase("done");
  };

  if (phase === "done") return null;

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${phase === "closing" ? styles.overlayClosing : ""}`}
      onTransitionEnd={handleOverlayTransitionEnd}
      role="status"
      aria-live="polite"
      aria-label="Loading Lebam Set"
    >
      <div className={styles.dotBg} />
      <div className={styles.glow} />

      <div className={styles.content}>
        <div className={styles.ringWrap}>
          <svg viewBox="0 0 120 120" className={styles.ringSvg}>
            <circle cx="60" cy="60" r="52" className={styles.ringTrack} />
            <circle
              cx="60"
              cy="60"
              r="52"
              pathLength="100"
              className={styles.ringDraw}
            />
          </svg>
          <span className={styles.mark}>ል</span>
        </div>

        <h1 className={styles.wordmark}>Lebam Set</h1>
        <span className={styles.subWordmark}>ልባም ሴት</span>

        <div className={styles.verseWrap}>
          <p key={verseIndex} lang={language} className={styles.verse}>
            {verses[verseIndex]}
          </p>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
