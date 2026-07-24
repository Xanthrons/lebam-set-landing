"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { VirtueIcon } from "./VirtueIcons";
import VirtueModal from "./VirtueModal";
import styles from "./VirtuesGrid.module.css";

const ZOOM = 1.9;
const LENS_SIZE = 130;
const STAGE_SIZE = 560;
const RING_RADIUS = 230;
const MEDALLION_SIZE = 280;

export default function VirtuesGrid() {
  const { t, language } = useLanguage();
  const items = t("virtues.items");
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [lensVisible, setLensVisible] = useState(false);
  const medallionRef = useRef(null);

  const mx = useMotionValue(MEDALLION_SIZE / 2);
  const my = useMotionValue(MEDALLION_SIZE / 2);
  const smoothX = useSpring(mx, { stiffness: 260, damping: 28 });
  const smoothY = useSpring(my, { stiffness: 260, damping: 28 });

  const lensLeft = useTransform(smoothX, (v) => v - LENS_SIZE / 2);
  const lensTop = useTransform(smoothY, (v) => v - LENS_SIZE / 2);
  const zoomLeft = useTransform(smoothX, (v) => LENS_SIZE / 2 - v * ZOOM);
  const zoomTop = useTransform(smoothY, (v) => LENS_SIZE / 2 - v * ZOOM);

  const handleMove = (e) => {
    const rect = medallionRef.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const center = STAGE_SIZE / 2;
  const positions = useMemo(
    () =>
      items.map((_, i) => {
        const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2;
        return {
          x: center + RING_RADIUS * Math.cos(angle),
          y: center + RING_RADIUS * Math.sin(angle),
        };
      }),
    [items],
  );

  return (
    <section id="virtues" className={`section ${styles.virtues}`}>
      <div className={`container ${styles.header}`}>
        <span className={styles.eyebrow}>{t("virtues.eyebrow")}</span>
        <h2 className={styles.title}>{t("virtues.title")}</h2>
        <p className={styles.subtitle}>{t("virtues.subtitle")}</p>
      </div>

      <div
        className={styles.orbitStage}
        style={{ width: STAGE_SIZE, height: STAGE_SIZE }}
      >
        {/* Visible ring + spokes — real vector lines, not implied by gaps */}
        <svg
          className={styles.ringSvg}
          viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}
        >
          <circle
            cx={center}
            cy={center}
            r={RING_RADIUS}
            className={styles.ringPath}
          />
          {positions.map((pos, i) => (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={pos.x}
              y2={pos.y}
              className={`${styles.spokeLine} ${
                activeIndex === i || hoverIndex === i
                  ? styles.spokeLineActive
                  : ""
              }`}
            />
          ))}
        </svg>

        {/* Center medallion + magnifier */}
        <div
          ref={medallionRef}
          className={styles.medallion}
          onMouseMove={handleMove}
          onMouseEnter={() => setLensVisible(true)}
          onMouseLeave={() => setLensVisible(false)}
        >
          <div className={styles.medallionContent}>
            <span className={styles.quoteMark} aria-hidden="true">
              ”
            </span>
            <p lang={language} className={styles.centerVerse}>
              {t("virtues.centerVerse")}
            </p>
            <span className={styles.centerRef}>{t("virtues.centerRef")}</span>
          </div>

          <motion.div
            className={styles.lensWrap}
            style={{
              left: lensLeft,
              top: lensTop,
              opacity: lensVisible ? 1 : 0,
            }}
          >
            <div className={styles.lensGlass}>
              <motion.div
                className={styles.lensInner}
                style={{
                  left: zoomLeft,
                  top: zoomTop,
                  width: MEDALLION_SIZE,
                  height: MEDALLION_SIZE,
                  scale: ZOOM,
                  transformOrigin: "0px 0px",
                }}
              >
                <div className={styles.medallionContent}>
                  <span className={styles.quoteMark} aria-hidden="true">
                    ”
                  </span>
                  <p lang={language} className={styles.centerVerse}>
                    {t("virtues.centerVerse")}
                  </p>
                  <span className={styles.centerRef}>
                    {t("virtues.centerRef")}
                  </span>
                </div>
              </motion.div>
              <div className={styles.lensShine} />
            </div>
            <div className={styles.lensHandle} />
          </motion.div>
        </div>

        {/* Orbit items — button itself sits exactly on the ring point,
            label is positioned separately so it can't drag the center off */}
        {items.map((item, i) => (
          <div
            key={item.number}
            className={styles.orbitItem}
            style={{ left: positions[i].x, top: positions[i].y }}
          >
            <motion.button
              className={`${styles.orbitButton} ${activeIndex === i ? styles.orbitButtonActive : ""}`}
              onClick={() => setActiveIndex(i)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.07,
                duration: 0.5,
                ease: [0.65, 0, 0.35, 1],
              }}
              aria-label={item.title}
            >
              <span className={styles.orbitNumeral}>{item.number}</span>
            </motion.button>
            <span className={styles.orbitLabel}>{item.title}</span>
          </div>
        ))}
      </div>

      {/* Mobile fallback list */}
      <div className={`container ${styles.mobileList}`}>
        {items.map((item, i) => (
          <button
            key={item.number}
            className={styles.mobileRow}
            onClick={() => setActiveIndex(i)}
          >
            <span className={styles.mobileNumber}>{item.number}</span>
            <span className={styles.mobileTitle}>{item.title}</span>
            <span className={styles.mobileArrow}>→</span>
          </button>
        ))}
      </div>

      <p className={styles.tapHint}>{t("virtues.tapHint")}</p>

      {activeIndex !== null && (
        <VirtueModal
          item={items[activeIndex]}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
