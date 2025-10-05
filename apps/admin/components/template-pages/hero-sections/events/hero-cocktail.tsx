"use client";
import * as React from "react";
import { motion } from "framer-motion";

type HeroCocktailProps = {
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  extra?: string;
  meetingLink?: string;
};

export default function HeroEventPoster({
  title,
  subtitle,
  date,
  time,
  extra,
  meetingLink,
}: HeroCocktailProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center py-20 px-6 text-white">
      {/* Background with bokeh-style image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/textures/cocktail-bg.png')", // you provide an image here
          filter: "brightness(0.6)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl space-y-4"
      >
        <p className="text-lg font-light">{subtitle}</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-wide">{title}</h1>
        <p className="text-xl font-semibold">{date}</p>
        <p className="text-lg">{time}</p>
        {extra && <p className="text-sm italic">{extra}</p>}
        {meetingLink && (
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Join Here
          </a>
        )}
      </motion.div>
    </section>
  );
}
