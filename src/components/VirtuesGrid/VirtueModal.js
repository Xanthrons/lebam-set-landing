"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./VirtueModal.module.css";

export default function VirtueModal({ item, onClose }) {
  const { t, language } = useLanguage();
  const labels = t("virtues.labels");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) return null;

  const rows = [
    {
      label: labels.verse,
      text: `“${item.verseText}” — ${item.verseRef}`,
      kind: "verse",
    },
    { label: labels.reflection, text: item.reflection, kind: "reflection" },
    { label: labels.application, text: item.application, kind: "application" },
    { label: labels.prayer, text: item.prayer, kind: "prayer" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <span className={styles.modalNumber}>{item.number}</span>
          <h3 className={styles.modalTitle}>{item.title}</h3>

          <div className={styles.rows}>
            {rows.map((row, i) => (
              <motion.div
                key={row.kind}
                className={`${styles.row} ${styles[row.kind]}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              >
                <span className={styles.rowLabel}>{row.label}</span>
                <p lang={language} className={styles.rowText}>
                  {row.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
