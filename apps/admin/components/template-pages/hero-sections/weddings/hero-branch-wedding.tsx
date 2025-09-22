"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type HeroWeddingBranchProps = {
  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  footer?: string;
  rsvp?: string;
};

export default function HeroWeddingBranch({
  groom,
  bride,
  date,
  time,
  venue,
  address,
  footer,
  rsvp,
}: HeroWeddingBranchProps) {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-10 py-12 bg-[#fafafa]"
      style={{
        backgroundImage: "url('/textures/texture-paper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative branch on left */}
      <div className="absolute top-0 left-0 h-full w-[280px] sm:w-[220px] md:w-[380px] pointer-events-none select-none">
        <Image
          src="/weddings/branch/flower-bg-transparent-2.png"
          alt="leaf decoration"
          fill
          className="object-contain object-left"
          priority
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-left sm:text-center max-w-2xl mx-auto pl-28 sm:pl-0 md:pl-20"
      >
        {/* Names */}
        <h1 className="text-[clamp(28px,6vw,42px)] font-serif tracking-wide text-slate-800">
          {groom} & {bride}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 italic text-sm sm:text-base text-slate-600">
          invite you to celebrate their wedding
        </p>

        {/* Date & Time */}
        <p className="mt-6 uppercase tracking-[0.15em] text-sm sm:text-base text-slate-800">
          {date} — {time}
        </p>

        {/* Venue */}
        <p className="mt-4 text-sm sm:text-base text-slate-700">{venue}</p>
        <p className="text-sm text-slate-500">{address}</p>

        {/* Footer */}
        {footer && <p className="mt-6 italic text-sm text-slate-600">{footer}</p>}

        {/* RSVP */}
        {rsvp && <p className="mt-2 text-sm text-slate-500 italic">rsvp to: {rsvp}</p>}
      </motion.div>
    </section>
  );
}
