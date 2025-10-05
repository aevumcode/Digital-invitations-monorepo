"use client";
import * as React from "react";
import { motion } from "framer-motion";

type FifaHeroProps = {
  title: string; // e.g. "FIFA Birthday"
  subtitle?: string; // e.g. "Kick-off Celebration"
  date?: string; // e.g. "Oct 30, 2025"
  time?: string; // e.g. "7:00 PM"
  venue?: string; // e.g. "Stadium Arena"
  address?: string; // e.g. "123 Football St, City"
  rsvp?: string; // e.g. "RSVP: +123-456-7890"
  videoSrc: string; // "/birthdays/birthday-fifa.mp4"
  poster?: string;
  duration?: string;
  ctaText?: string;
  onCtaClick?: () => void;
};

export default function HeroBirthdayFifa({
  title,
  subtitle,
  date,
  time,
  venue,
  address,
  rsvp,
  videoSrc,
  poster,
  duration = "0:45",
  ctaText = "Join the Match",
  onCtaClick,
}: FifaHeroProps) {
  const [muted, setMuted] = React.useState(true);
  const [playing, setPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    } else {
      v.pause();
    }
  }, [playing]);

  // FIFA vibes
  const pitchGreen = "#0b6623"; // grass green
  const brightWhite = "#ffffff"; // pitch lines
  const shadowBlack = "#0d0d0d";
  const trophyGold = "#e6c200";

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted={muted}
        playsInline
        poster={poster}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Stadium overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15]"
        style={{ backgroundImage: "url('/textures/turf-texture.png')", backgroundSize: "cover" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-[92vh] max-w-5xl flex-col justify-between px-6 py-8 sm:px-10"
      >
        {/* Top row: controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-black/60 px-4 py-2 text-[13px] font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-black/80"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-full bg-black/60 px-3 py-2 text-[13px] font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-black/80"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            {duration}
          </span>
        </div>

        {/* Center title */}
        <div className="text-center">
          {subtitle && (
            <p
              className="mb-3 text-[13px] uppercase tracking-[0.3em]"
              style={{ color: brightWhite, opacity: 0.95 }}
            >
              {subtitle}
            </p>
          )}

          <h1
            className="mx-auto max-w-4xl text-[clamp(36px,8vw,96px)] leading-[1.05]"
            style={{
              color: trophyGold,
              fontFamily: "'Anton', sans-serif", // bold sporty font
              textShadow: `0 2px 0 ${shadowBlack}, 0 6px 20px rgba(230,194,0,.5)`,
            }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-[13px] uppercase tracking-[0.2em]">
            {date && <span className="text-white/90">{date}</span>}
            {time && <span className="text-white/60">•</span>}
            {time && <span className="text-white/90">{time}</span>}
            {(venue || address) && <span className="text-white/60">•</span>}
            {venue && <span className="text-white/90">{venue}</span>}
          </div>

          {address && <p className="mt-2 text-sm text-white/85">{address}</p>}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div />
          <div className="flex items-center gap-4">
            {rsvp && <p className="text-sm text-white/80">{rsvp}</p>}
            <button
              onClick={onCtaClick}
              className="rounded-md border border-[#e6c200]/70 bg-[#e6c200]/20 px-6 py-2 text-sm font-bold uppercase tracking-widest text-[#fffde6] shadow-[0_0_0_1px_rgba(230,194,0,.3)_inset] hover:bg-[#e6c200]/30"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Subtle frame */}
      <div className="pointer-events-none absolute inset-4 rounded-xl border border-white/15" />
    </section>
  );
}
