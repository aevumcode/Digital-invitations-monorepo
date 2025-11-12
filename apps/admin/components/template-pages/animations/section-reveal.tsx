"use client";
import { motion } from "framer-motion";
import { presetVariants } from "./variants";
import type { AnimationPreset } from "../types";

export default function SectionReveal({
  animation = "slideUp",
  className,
  children,
}: {
  animation?: AnimationPreset;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={presetVariants[animation]}
    >
      {children}
    </motion.section>
  );
}
