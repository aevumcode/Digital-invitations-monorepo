"use client";
import * as React from "react";
import { motion } from "framer-motion";

type HeroCocktailInviteRedProps = {
  background: string;
  rsvpLine: string;
  dateLine: string;
  invitedLine?: string;
  bigTitle: string;
  addressLine?: string;
};

export default function HeroEventRed({
  background,
  rsvpLine,
  dateLine,
  invitedLine = "(you are invited to)",
  bigTitle,
  addressLine,
}: HeroCocktailInviteRedProps) {
  return (
    <section className="relative flex items-center justify-center px-4 py-10 min-h-[90vh]">
      {/* Poster card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[520px] min-h-[90vh] overflow-hidden rounded-xl flex flex-col justify-between"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* TOP — RSVP + date */}
        <div className="pt-[7%] text-center">
          <p
            className="font-extrabold tracking-wide"
            style={{ fontFamily: "Arial Black, sans-serif", fontSize: "clamp(12px,2vw,20px)" }}
          >
            {rsvpLine}
          </p>
          <p
            className="mt-[4px] font-extrabold tracking-wide"
            style={{ fontFamily: "Arial Black, sans-serif", fontSize: "clamp(12px,2vw,20px)" }}
          >
            {dateLine}
          </p>
        </div>

        {/* MID — text block */}
        <div className="text-center mb-[14%]">
          <p
            className="italic text-black mb-2"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(16px,2.5vw,26px)",
            }}
          >
            {invitedLine}
          </p>
          <h1
            className="uppercase leading-none"
            style={{ fontFamily: "Arial Black, sans-serif", fontSize: "clamp(36px,8vw,82px)" }}
          >
            {bigTitle}
          </h1>
        </div>

        {/* BOTTOM — address */}
        {addressLine && (
          <div className="pb-[5%] text-center">
            <p
              className="text-black"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(12px,2vw,18px)",
              }}
            >
              {addressLine}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
