"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type HeroCocktailPosterProps = {
  title: string;
  subtitle?: string;
  date: string;
  aboutTitle: string;
  aboutText: string;
  infoText: string;
  backgroundImage: string;
};

export default function HeroCocktailPoster({
  title,
  subtitle,
  date,
  aboutTitle,
  aboutText,
  infoText,
  backgroundImage,
}: HeroCocktailPosterProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-12 bg-white">
      {/* Background image */}
      <Image
        src="/events/poster/event-poster-bg-1.png"
        alt="cocktail poster background"
        fill
        priority
        className="object-contain object-center pointer-events-none select-none"
      />

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 flex flex-col items-start justify-start px-6 sm:px-12 lg:px-20 pt-12 lg:pt-20 text-black"
      >
        {/* Title */}
        <h1
          className="text-[clamp(40px,8vw,88px)] font-extrabold leading-[1.1] tracking-tight"
          style={{ fontFamily: "Arial Black, sans-serif" }}
        >
          {title}
        </h1>

        {/* Subtitle / date */}
        <div className="mt-6 lg:mt-10 self-end text-right">
          <p
            className="text-[clamp(28px,6vw,54px)] font-bold leading-tight"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            {date}
          </p>
        </div>

        {/* About */}
        <div className="mt-12 max-w-md">
          <h2 className="text-lg sm:text-xl font-extrabold uppercase mb-2">{aboutTitle}</h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">{aboutText}</p>
        </div>

        {/* Info */}
        <div className="mt-10 text-sm sm:text-base font-semibold">{infoText}</div>
      </motion.div>
    </section>
  );
}
