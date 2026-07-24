"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, fadeUpStagger } from "@/lib/scrollAnimations";
import styles from "./Footer.module.css";

const TIKTOK_URL = "https://www.tiktok.com/@virtuouswomenproverb31";
const TELEGRAM_URL = "https://t.me/+UHbfgJarYTNjMjhk";

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82c-1.02-.9-1.66-2.2-1.66-3.66h-3.17v13.6c0 1.64-1.33 2.98-2.98 2.98a2.98 2.98 0 0 1-2.98-2.98 2.98 2.98 0 0 1 2.98-2.98c.27 0 .53.04.78.1V9.7a6.18 6.18 0 0 0-.78-.05A6.15 6.15 0 0 0 2.65 15.8 6.15 6.15 0 0 0 8.8 21.95a6.15 6.15 0 0 0 6.15-6.15V8.98a8.34 8.34 0 0 0 4.86 1.56V7.37a4.85 4.85 0 0 1-3.21-1.55z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.9 4.3 18.6 20c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.15L18.05 6.4c.4-.36-.09-.56-.62-.2L6.4 13.47l-5-1.57c-1.1-.34-1.11-1.1.23-1.63L20.5 3.5c.9-.34 1.7.2 1.4 1.8z" />
    </svg>
  );
}

export default function Footer() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const footerRef = useRef(null);
  const verseRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeUpStagger(verseRef.current.children, footerRef.current, {
        stagger: 0.1,
        y: 24,
      });
    }, footerRef);
    return () => ctx.revert();
  }, [language]);

  const navLinks = [
    { key: "nav.about", href: "#about" },
    { key: "nav.virtues", href: "#virtues" },
    { key: "nav.programs", href: "#programs" },
    { key: "nav.join", href: "#join" },
  ];

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div ref={verseRef} className={styles.verseWrap}>
          <p lang={language} className={styles.verse}>
            {t("footer.closingVerse")}
          </p>
          <span className={styles.verseRef}>{t("footer.closingRef")}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.col}>
          <a href="#home" className={styles.logo}>
            <span className={styles.logoMark}>
              <img
                src="/images/logo.png"
                alt="Lebam Set"
                className={styles.logoImg}
              />
            </span>
            <span className={styles.logoText}>
              Lebam Set
              <span className={styles.logoSub}>ልባም ሴት</span>
            </span>
          </a>
          <p className={styles.tagline}>{t("footer.location")}</p>
        </div>

        {/* Nav */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t("footer.navTitle")}</h4>
          <ul className={styles.linkList}>
            {navLinks.map((item) => (
              <li key={item.key}>
                <a href={item.href}>{t(item.key)}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t("footer.connectTitle")}</h4>
          <div className={styles.socialRow}>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
          </div>
          <a href={`mailto:${t("footer.email")}`} className={styles.email}>
            {t("footer.email")}
          </a>
        </div>

        {/* Preferences */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>
            {t("footer.contactTitle") === t("footer.contactTitle") ? "" : ""}
          </h4>
          <div className={styles.prefRow}>
            <button className={styles.prefBtn} onClick={toggleLanguage}>
              <span className={language === "en" ? styles.activePref : ""}>
                EN
              </span>
              <span className={styles.prefDivider}>/</span>
              <span className={language === "am" ? styles.activePref : ""}>
                አማ
              </span>
            </button>
            <button className={styles.prefBtn} onClick={toggleTheme}>
              {mounted && (theme === "light" ? "🌙 Dark" : "☀️ Light")}
            </button>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © {new Date().getFullYear()} Lebam Set. {t("footer.rights")}
        </span>
      </div>
    </footer>
  );
}
