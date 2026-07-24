"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en } from "@/locales/en";
import { am } from "@/locales/am";

const dictionaries = { en, am };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("lebam-lang");
    if (stored) {
      setLanguage(stored);
      document.documentElement.setAttribute("lang", stored);
    }
  }, []);

  const toggleLanguage = () => {
    const next = language === "en" ? "am" : "en";
    setLanguage(next);
    document.documentElement.setAttribute("lang", next);
    localStorage.setItem("lebam-lang", next);
  };

  // t('hero.title') walks the dictionary by dot-path
  const t = (path) => {
    const dict = dictionaries[language];
    return path.split(".").reduce((obj, key) => obj?.[key], dict) ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
