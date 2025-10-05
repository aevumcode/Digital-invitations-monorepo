"use client";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Background must already contain: border, bows, divider, cake.
 * Put it at /public/birthdays/ribbon-cake-bg.png (3:5 aspect, e.g. 1200x2000).
 * Text color in the reference is a deep ink blue; we use #213E8B.
 */
type HeroBirthdayRibbonProps = {
  name: string; // "Harper Russo"
  age: number; // 18
  date: string; // "01.30.2030"
  subtitle: string; // "PLEASE JOIN US IN CELEBRATION OF HARPER'S 18TH BIRTHDAY"
  address: string; // "123 Anywhere St., Any City"
  background?: string; // default: /birthdays/ribbon-cake-bg.png
};

export default function HeroBirthdayRibbon({
  name,
  age,
  date,
  subtitle,
  address,
  background = "/birthdays/ribbon-cake-bg.png",
}: HeroBirthdayRibbonProps) {
  // Brand color sampled from reference
  const ink = "#213E8B";

  return (
    <section className="relative flex items-center justify-center  ">
      {/* Poster canvas with fixed aspect to keep positions exact */}
      <div className="relative w-full max-w-[640px] aspect-[3/5]">
        <Image src={background} alt="Birthday poster" fill priority className="object-contain" />

        {/* Overlay container */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 text-center"
          style={{ color: ink }}
        >
          {/* 1) Curved NAME above cake */}
          {/* This arc is tuned to sit above a centered cake in a 3:5 poster */}
          <div className="absolute left-0 right-0 top-[23.5%]">
            <svg viewBox="0 0 500 150" className="mx-auto w-[76%] max-w-[440px]">
              <path id="nameArc" d="M 40,120 C 160,20 340,20 460,120" fill="none" />
              <text
                fontFamily="'Dancing Script', cursive"
                fontSize="28"
                style={{ fontSize: "clamp(18px,3.1vw,28px)" }}
              >
                <textPath href="#nameArc" startOffset="50%" textAnchor="middle" fill={ink}>
                  {name}
                </textPath>
              </text>
            </svg>
          </div>

          {/* 2) “is turning 18!” just under cake bowl */}
          {/* <p
            className="absolute left-0 right-0 top-[50.6%] italic"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(18px,3.1vw,26px)",
              lineHeight: 1,
            }}
          >
            is turning {age}!
          </p> */}

          {/* 3) UPPERCASE subtitle on the divider line */}
          <p
            className="absolute left-[8%] right-[8%] top-[58.5%] tracking-[0.22em] uppercase px-20"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(10px,1.9vw,14px)",
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </p>

          {/* 4) Big date */}
          <p
            className="absolute left-0 right-0 top-[64.5%] font-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(22px,4.4vw,30px)",
              letterSpacing: "0.02em",
            }}
          >
            {date}
          </p>

          {/* 5) Address (script) */}
          <p
            className="absolute left-0 right-0 bottom-[20%]"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(14px,2.9vw,20px)",
            }}
          >
            {address}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
