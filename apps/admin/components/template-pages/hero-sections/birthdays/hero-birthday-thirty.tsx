"use client";
import * as React from "react";
import { motion } from "framer-motion";

type HeroBirthdayProps = {
  background: string; // "/birthdays/birthday-bg-1.png"
  subtitle: string; // "LET’S DRINK TO OLIVIA’S 30TH"
  dateTime: string; // "MAY 25, 2028 AT 9:30 PM"
  address: string; // "123 ANYWHERE ST., ANY CITY"
};

export default function HeroBirthdayThirty({
  background,
  subtitle,
  dateTime,
  address,
}: HeroBirthdayProps) {
  return (
    <section className="relative flex items-center justify-center min-h-[90vh] px-6 sm:px-8 py-10 bg-white">
      {/* Background image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative w-full max-w-[720px] mx-auto rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          minHeight: "80vh",
        }}
      >
        {/* Bottom details */}
        <div className="absolute bottom-[8%] w-full text-center px-4">
          <p
            className="font-extrabold mb-2"
            style={{
              fontFamily: "Arial Black, sans-serif",
              fontSize: "clamp(14px,2.2vw,18px)",
              color: "#1e3a8a",
            }}
          >
            {subtitle}
          </p>
          <p
            className="mb-1"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "clamp(12px,2vw,16px)",
              color: "#1e3a8a",
            }}
          >
            {dateTime}
          </p>
          <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "clamp(12px,2vw,16px)",
              color: "#1e3a8a",
            }}
          >
            {address}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
