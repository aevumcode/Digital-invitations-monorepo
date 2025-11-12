"use client";
import * as React from "react";
import { motion } from "framer-motion";

type HeroWeddingFloralProps = {
  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;
  address: string;
};

export default function HeroWeddingFloral({
  groom,
  bride,
  date,
  time,
  venue,
  address,
}: HeroWeddingFloralProps) {
  return (
    <section
      className="relative min-h-[100vh] flex items-center justify-center px-6 sm:px-12 py-12"
      style={{
        backgroundImage: "url('/weddings/floral/floral-bg-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl mx-auto text-center"
      >
        {/* Initials */}
        <p className="text-gray-700 tracking-[0.25em] text-sm sm:text-base mb-6">O A</p>

        {/* Invitation line */}
        <p className="uppercase text-[13px] sm:text-sm tracking-[0.2em] text-gray-600 mb-6">
          Kindly join us <br />
          for the wedding of
        </p>

        {/* Names */}
        <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif tracking-wide text-gray-800">
          {groom}
        </h1>
        <p className="font-[Great_Vibes] text-2xl text-gray-600 my-2">and</p>
        <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif tracking-wide text-gray-800 mb-6">
          {bride}
        </h1>

        {/* Date & Time */}
        <p className="uppercase text-xs sm:text-sm tracking-[0.25em] text-gray-700 mb-6">
          {date} | {time}
        </p>

        {/* Venue */}
        <p className="font-semibold text-gray-800">{venue}</p>
        <p className="text-gray-500 text-sm">{address}</p>
      </motion.div>
    </section>
  );
}
