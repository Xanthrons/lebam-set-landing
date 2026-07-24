"use client";

import { useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { gsap, ScrollTrigger } from "@/lib/scrollAnimations";
import styles from "./JourneyPath.module.css";

const ROW_HEIGHT = 380;
const PATH_WIDTH = 80;
const CENTER_X = PATH_WIDTH / 2;
const AMPLITUDE = 16;

// Smooth curve through a set of points (Catmull-Rom, converted to cubic Beziers)
function buildSmoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function JourneyPath() {
  const { t, language } = useLanguage();
  const stages = t("journey.stages");

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressPathRef = useRef(null);
  const dotRef = useRef(null);
  const markerRefs = useRef([]);
  const contentRefs = useRef([]);
  const mobileTrackRef = useRef(null);
  const mobileRowRefs = useRef([]);

  const totalHeight = stages.length * ROW_HEIGHT;

  // Marker points weave gently left/right around center — this is what
  // makes the path feel like a real journey rather than a progress bar.
  const points = useMemo(
    () =>
      stages.map((_, i) => ({
        x: CENTER_X + (i % 2 === 0 ? -AMPLITUDE : AMPLITUDE),
        y: i * ROW_HEIGHT + ROW_HEIGHT / 2,
      })),
    [stages.length],
  );

  const pathD = useMemo(() => buildSmoothPath(points), [points]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- Desktop: one continuous scroll-linked path ----
      const mmDesktop = gsap.matchMedia();
      mmDesktop.add("(min-width: 901px)", () => {
        const path = progressPathRef.current;
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);

        let activeCount = 0;

        ScrollTrigger.create({
          trigger: trackRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress;
            path.style.strokeDashoffset = String(length * (1 - progress));

            if (dotRef.current) {
              const pt = path.getPointAtLength(length * progress);
              dotRef.current.style.left = `calc(50% + ${pt.x - CENTER_X}px)`;
              dotRef.current.style.top = `${pt.y}px`;
              dotRef.current.style.opacity =
                progress > 0.005 && progress < 0.995 ? "1" : "0";
            }

            const scrolledY = progress * totalHeight;
            const newActive = points.reduce(
              (count, p, i) => (scrolledY >= p.y ? i + 1 : count),
              0,
            );

            if (newActive !== activeCount) {
              activeCount = newActive;
              markerRefs.current.forEach((el, i) => {
                if (el) el.classList.toggle(styles.markerActive, i < newActive);
              });
              contentRefs.current.forEach((el, i) => {
                if (el)
                  el.classList.toggle(styles.contentActive, i < newActive);
              });
            }
          },
        });
      });

      // ---- Mobile: straight line fill + independent row reveals ----
      const mmMobile = gsap.matchMedia();
      mmMobile.add("(max-width: 900px)", () => {
        if (mobileTrackRef.current) {
          gsap.to(mobileTrackRef.current, {
            "--fill": 1,
            ease: "none",
            scrollTrigger: {
              trigger: mobileTrackRef.current,
              start: "top center",
              end: "bottom center",
              scrub: 0.6,
            },
          });
        }

        mobileRowRefs.current.forEach((el) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 78%", once: true },
            },
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language, totalHeight, points]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={`section ${styles.journey}`}
    >
      <div className={`container ${styles.header}`}>
        <span className={styles.eyebrow}>{t("journey.eyebrow")}</span>
        <h2 className={styles.title}>{t("journey.title")}</h2>
        <p className={styles.subtitle}>{t("journey.subtitle")}</p>
      </div>

      {/* ---- Desktop: curved path ---- */}
      <div className="container">
        <div
          ref={trackRef}
          className={styles.track}
          style={{ height: totalHeight }}
        >
          <svg
            className={styles.pathSvg}
            width={PATH_WIDTH}
            height={totalHeight}
            viewBox={`0 0 ${PATH_WIDTH} ${totalHeight}`}
            preserveAspectRatio="none"
          >
            <path d={pathD} className={styles.pathBg} />
            <path
              ref={progressPathRef}
              d={pathD}
              className={styles.pathProgress}
            />
          </svg>

          <div ref={dotRef} className={styles.travelerDot} />

          {stages.map((stage, i) => {
            const isLeft = i % 2 === 1;
            return (
              <div
                key={i}
                className={`${styles.row} ${isLeft ? styles.rowLeft : styles.rowRight}`}
                style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
              >
                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  className={styles.content}
                >
                  <span className={styles.stepLabel}>
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(stages.length).padStart(2, "0")}
                  </span>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                  <p lang={language} className={styles.stageText}>
                    {stage.text}
                  </p>
                </div>

                <div
                  ref={(el) => (markerRefs.current[i] = el)}
                  className={styles.marker}
                  style={{ left: `calc(50% + ${points[i].x - CENTER_X}px)` }}
                >
                  <span>{i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Mobile: straight timeline ---- */}
      <div className={`container ${styles.mobileTrackWrap}`}>
        <div
          ref={mobileTrackRef}
          className={styles.mobileTrack}
          style={{ "--fill": 0 }}
        >
          <div className={styles.mobileLine} />
          <div className={styles.mobileLineFill} />
          {stages.map((stage, i) => (
            <div
              key={i}
              ref={(el) => (mobileRowRefs.current[i] = el)}
              className={styles.mobileRow}
            >
              <div className={styles.mobileMarker}>{i + 1}</div>
              <div className={styles.mobileContent}>
                <span className={styles.stepLabel}>
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(stages.length).padStart(2, "0")}
                </span>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p lang={language} className={styles.stageText}>
                  {stage.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
