"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type HeroWeddingElegantProps = {
  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;
  address: string;
};

export default function HeroWeddingElegant({
  groom,
  bride,
  date,
  time,
  venue,
  address,
}: HeroWeddingElegantProps) {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: "url('/textures/texture-paper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative floral frame */}
      <Image
        src="/weddings/elegant/floral-only-transparent.png"
        alt="floral frame"
        width={900}
        height={1200}
        className="absolute inset-0 w-full h-full max-w-[820px] mx-auto object-contain opacity-70 pointer-events-none select-none"
        priority
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-[700px] mx-auto"
      >
        {/* Names */}
        <h1 className="font-[Great_Vibes] text-[clamp(32px,7vw,54px)] text-slate-800">
          {groom} & {bride}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-600">
          Invite you to join in the celebration of their
        </p>

        {/* Wedding Party headline */}
        <p className="mt-3 font-[Playfair_Display] italic text-[clamp(22px,6vw,38px)] text-slate-800">
          Wedding Party
        </p>

        {/* Venue + Date + Time */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-slate-800 text-sm sm:text-base">
          <p className="uppercase tracking-wide">{venue}</p>
          <span className="hidden sm:block h-5 w-px bg-slate-400/60" />
          <p>{date}</p>
          <span className="hidden sm:block h-5 w-px bg-slate-400/60" />
          <p>{time}</p>
        </div>

        {/* Address */}
        <p className="mt-6 text-xs sm:text-sm text-slate-500">{address}</p>
      </motion.div>
    </section>
  );
}
