import { Variants } from "framer-motion";
import type { AnimationPreset } from "../types";

export const presetVariants: Record<AnimationPreset, Variants> = {
  none: { hidden: {}, show: {} },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.8, 0.25, 1] } },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  },
};
