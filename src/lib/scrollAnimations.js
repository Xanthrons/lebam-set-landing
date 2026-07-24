"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Fades + rises a group of elements in, staggered, once they scroll into view.
 * Reused across almost every section in the site.
 */
export function fadeUpStagger(targets, trigger, options = {}) {
  return gsap.fromTo(
    targets,
    { y: options.y ?? 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration ?? 0.9,
      stagger: options.stagger ?? 0.08,
      ease: options.ease ?? "power3.out",
      scrollTrigger: {
        trigger,
        start: options.start ?? "top 80%",
        once: true,
      },
    },
  );
}
