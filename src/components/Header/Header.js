"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Header.module.css";

export default function Header() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const navItems = [
    { key: "nav.home", href: "#home" },
    { key: "nav.about", href: "#about" },
    { key: "nav.virtues", href: "#virtues" },
    { key: "nav.programs", href: "#programs" },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a key={item.key} href={item.href} className={styles.navLink}>
              {t(item.key)}
            </a>
          ))}
        </nav>

        {/* Right side controls */}
        <div className={styles.controls}>
          <button
            className={styles.toggleBtn}
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <span className={language === "en" ? styles.activeLang : ""}>
              EN
            </span>
            <span className={styles.langDivider}>/</span>
            <span className={language === "am" ? styles.activeLang : ""}>
              አማ
            </span>
          </button>

          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && (
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </motion.span>
            )}
          </button>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSenHnLFkshKBdNR5mD7g3vpg53ucl0lYcpg1OdpF1dvkfMHTQ/viewform?usp=dialog"
            className={styles.ctaBtn}
            target="_blank"
          >
            {t("nav.join")}
          </a>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav className={styles.mobileNav}>
              {navItems.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {t(item.key)}
                </motion.a>
              ))}
              <motion.a
                href="https://docs.google.com/forms/d/e/1FAIpQLSenHnLFkshKBdNR5mD7g3vpg53ucl0lYcpg1OdpF1dvkfMHTQ/viewform?usp=dialog"
                target="_blank"
                className={styles.ctaBtn}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.07 }}
              >
                {t("nav.join")}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
