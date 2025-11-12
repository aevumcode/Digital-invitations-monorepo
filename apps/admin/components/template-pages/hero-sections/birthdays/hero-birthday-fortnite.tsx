"use client";
import * as React from "react";
import { motion } from "framer-motion";

type FortniteHeroProps = {
  title: string; // e.g. "Fortnite Birthday Party"
  subtitle?: string; // e.g. "Drop In – You're Invited!"
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  rsvp?: string;
  videoSrc: string;
  poster?: string;
  duration?: string;
  ctaText?: string;
  onCtaClick?: () => void;
};

export default function HeroBirthdayFortnite({
  title,
  subtitle,
  date,
  time,
  venue,
  address,
  rsvp,
  videoSrc,
  poster,
  duration = "0:35",
  ctaText = "Drop In",
  onCtaClick,
}: FortniteHeroProps) {
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

  // Fortnite neon vibes
  const neonBlue = "#00f0ff";
  const neonPink = "#ff3ee8";
  const neonPurple = "#a020f0";
  const darkBg = "#0b0d15";

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

      {/* Neon overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0b0d15]/40 to-black/40" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.2]"
        style={{ backgroundImage: "url('/textures/fortnite-grid.png')", backgroundSize: "cover" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col justify-between px-6 py-10 sm:px-12"
      >
        {/* Top row: controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-black/80"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-full bg-black/60 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur hover:bg-black/80"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
            {duration}
          </span>
        </div>

        {/* Center title */}
        <div className="text-center px-2">
          {subtitle && (
            <p
              className="mb-4 text-sm uppercase tracking-[0.25em]"
              style={{ color: neonBlue, opacity: 0.9 }}
            >
              {subtitle}
            </p>
          )}

          <h1
            className="mx-auto max-w-4xl text-[clamp(38px,8vw,90px)] leading-[1.1]"
            style={{
              color: neonPink,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 12px ${neonPink}, 0 0 30px ${neonBlue}, 0 0 60px ${neonPurple}`,
            }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm uppercase tracking-[0.15em] text-white/90">
            {date && <span>{date}</span>}
            {time && <span className="text-white/50">•</span>}
            {time && <span>{time}</span>}
            {(venue || address) && <span className="text-white/50">•</span>}
            {venue && <span>{venue}</span>}
          </div>

          {address && <p className="mt-3 text-sm text-white/80">{address}</p>}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div />
          <div className="flex items-center gap-4">
            {rsvp && <p className="text-sm text-white/80">{rsvp}</p>}
            <button
              onClick={onCtaClick}
              className="rounded-md border border-[#00f0ff]/70 bg-[#00f0ff]/20 px-6 py-2 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_10px_rgba(0,240,255,.6),0_0_20px_rgba(255,62,232,.4)] hover:bg-[#00f0ff]/30 hover:shadow-[0_0_20px_rgba(0,240,255,.8),0_0_40px_rgba(255,62,232,.6)]"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Neon frame */}
      <div className="pointer-events-none absolute inset-4 rounded-2xl border border-[#ff3ee8]/50 shadow-[0_0_15px_rgba(255,62,232,.5),0_0_25px_rgba(0,240,255,.4)]" />
    </section>
  );
}
