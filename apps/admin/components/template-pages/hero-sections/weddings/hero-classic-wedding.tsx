"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type HeroWeddingClassicProps = {
  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  footer?: string;
};

export default function HeroWeddingClassic({
  groom,
  bride,
  date,
  time,
  venue,
  address,
  footer,
}: HeroWeddingClassicProps) {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-20 py-12 text-center"
      style={{
        backgroundImage: "url('/textures/texture-paper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative flowers */}
      <Image
        src="/weddings/classic/flower-classic-2.png"
        alt="flower top right"
        width={150}
        height={150}
        className="absolute  top-8 right-0 w-36 sm:w-40 h-auto opacity-90 pointer-events-none select-none"
      />

      <Image
        src="/weddings/classic/flower-classic-1.png"
        alt="flower bottom left"
        width={150}
        height={150}
        className="absolute bottom-0 left-0 md:bottom-8 md:left-8 w-36 sm:w-36 h-auto opacity-90 pointer-events-none select-none"
      />

      {/* Decorative lines */}
      {/* Top horizontal */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2/3 sm:w-1/2 h-px bg-gray-400/60" />
      {/* Bottom horizontal */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 sm:w-1/2 h-px bg-gray-400/60" />
      {/* Left vertical */}
      <div className="absolute top-16 bottom-16 left-6 sm:left-12 w-px bg-gray-400/50" />
      {/* Right vertical */}
      <div className="absolute top-16 bottom-16 right-6 sm:right-12 w-px bg-gray-400/50" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl mx-auto space-y-6"
      >
        {/* Groom & Bride names */}
        <h1
          className="text-5xl sm:text-6xl font-[Great_Vibes] text-gray-800"
          style={{ lineHeight: "1.2" }}
        >
          {groom} <span className="mx-2">&</span> {bride}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-base sm:text-lg">
          Request the pleasure of your company at their wedding celebration
        </p>

        {/* Date & Time */}
        <p className="uppercase tracking-wide text-gray-700 font-medium">
          {time}, {date}
        </p>

        {/* Venue */}
        <p className="text-gray-700 font-semibold">{venue}</p>
        <p className="text-gray-500">{address}</p>

        {/* Footer */}
        {footer && <p className="italic text-gray-600 text-sm sm:text-base">{footer}</p>}
      </motion.div>
    </section>
  );
}
