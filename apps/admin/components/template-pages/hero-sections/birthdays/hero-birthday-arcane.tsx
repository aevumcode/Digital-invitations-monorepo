"use client";
import * as React from "react";
import { motion } from "framer-motion";

type ArcaneHeroProps = {
  title: string; // e.g. "Arcane Birthday"
  subtitle?: string; // e.g. "You are invited"
  date?: string; // e.g. "Oct 25, 2025"
  time?: string; // e.g. "9:30 PM"
  venue?: string; // e.g. "Zaun Lounge"
  address?: string; // e.g. "123 Piltover Ave, Any City"
  rsvp?: string; // e.g. "RSVP: +123-456-7890"
  videoSrc: string; // "/birthdays/birthday-arcane.mp4"
  poster?: string; // optional poster image
  duration?: string; // e.g. "0:24"
  ctaText?: string; // e.g. "View Details"
  onCtaClick?: () => void;
};

export default function HeroBirthdayArcane({
  title,
  subtitle,
  date,
  time,
  venue,
  address,
  rsvp,
  videoSrc,
  poster,
  duration = "0:24",
  ctaText = "RSVP",
  onCtaClick,
}: ArcaneHeroProps) {
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

  const gold = "#d4af37"; // warm gold
  const pale = "#f1e9d2"; // parchment-like light
  const coal = "#0b0d10"; // deep shadow

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        poster={poster}
        autoPlay
        loop
        muted={muted}
        playsInline
      />

      {/* Dark vignette + film grain feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25),rgba(0,0,0,0.7))]" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15]"
        style={{ backgroundImage: "url('/textures/film-grain.png')", backgroundSize: "cover" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-[92vh] max-w-5xl flex-col justify-between px-6 py-8 sm:px-10"
      >
        {/* Top row: controls pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-black/50 px-4 py-2 text-[13px] font-semibold uppercase tracking-wider text-white backdrop-blur"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-full bg-black/50 px-3 py-2 text-[13px] font-semibold uppercase tracking-wider text-white backdrop-blur"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            {duration}
          </span>
        </div>

        {/* Centered title block */}
        <div className="text-center">
          {subtitle && (
            <p
              className="mb-3 text-[13px] uppercase tracking-[0.35em]"
              style={{ color: pale, letterSpacing: "0.35em", opacity: 0.9 }}
            >
              {subtitle}
            </p>
          )}

          <h1
            className="mx-auto max-w-3xl text-[clamp(36px,7.5vw,84px)] leading-[1.05]"
            style={{
              color: gold,
              fontFamily: "'Cinzel', serif", // elegant, arcane-adjacent
              textShadow: `0 1px 0 ${coal}, 0 6px 24px rgba(212,175,55,.35)`,
            }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-[13px] uppercase tracking-[0.2em]">
            {date && <span className="text-white/85">{date}</span>}
            {time && <span className="text-white/60">•</span>}
            {time && <span className="text-white/85">{time}</span>}
            {(venue || address) && <span className="text-white/60">•</span>}
            {venue && <span className="text-white/85">{venue}</span>}
          </div>

          {address && <p className="mt-2 text-sm text-white/80">{address}</p>}
        </div>

        {/* Bottom row: CTA + RSVP */}
        <div className="flex items-end justify-between">
          <div />
          <div className="flex items-center gap-4">
            {rsvp && <p className="text-sm text-white/80">{rsvp}</p>}
            <button
              onClick={onCtaClick}
              className="rounded-md border border-[#a58324]/60 bg-[#a58324]/20 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-[#f2e6bf] shadow-[0_0_0_1px_rgba(165,131,36,.25)_inset] hover:bg-[#a58324]/30"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Soft inner border frame for that “poster” feel */}
      <div className="pointer-events-none absolute inset-4 rounded-2xl border border-white/10" />
    </section>
  );
}
