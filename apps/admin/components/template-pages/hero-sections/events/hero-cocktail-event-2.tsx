"use client";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type HeroCocktailMinimalProps = {
  titleTop: string;
  titleBottom: string;
  date: string;
  time: string;
  address: string;
  background: string;
};

export default function HeroCocktailEvent2({
  titleTop,
  titleBottom,
  date,
  time,
  address,
  background,
}: HeroCocktailMinimalProps) {
  return (
    <section className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background image */}
      <Image
        src={background}
        alt="Cocktail background"
        fill
        priority
        className="object-cover object-center opacity-80"
      />

      {/* Overlay content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full h-full px-6 sm:px-10 py-10 text-black"
      >
        {/* Title fixed at top */}
        <div className="absolute top-10 left-6 sm:left-10">
          <h1
            className="text-[clamp(44px,9vw,96px)] font-extrabold leading-[1.05] tracking-tight"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            {titleTop}
          </h1>
          <h1
            className="text-[clamp(44px,9vw,96px)] font-extrabold leading-[1.05] tracking-tight -mt-2"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            {titleBottom}
          </h1>
        </div>

        {/* Date bottom-left */}
        <div className="absolute bottom-10 left-6 sm:left-10">
          <p
            className="text-[clamp(28px,6vw,48px)] font-bold"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            {date}
          </p>
        </div>

        {/* Time + Address bottom-right */}
        <div className="absolute bottom-10 right-6 sm:right-10 text-right space-y-1">
          <p className="text-sm sm:text-base font-medium">{time}</p>
          <p className="text-sm sm:text-base font-medium leading-snug">{address}</p>
        </div>
      </motion.div>
    </section>
  );
}
