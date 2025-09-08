"use client";

import * as React from "react";
import { useAnimate, type AnimationSequence, type AnimationPlaybackControls } from "framer-motion";
import Image from "next/image";

import flower from "@/public/flower-png.png";
import RsvpForm from "@/components/rsvp-form";

// 👇 dynamic invitation data
const templateText = {
  groom: "Jonathan",
  bride: "Juliana",
  date: "30th November 2025",
  time: "3:00 PM",
  venue: "Borcelle Hotel & Ballroom",
  address: "123 Anywhere Street, Any City",
  footer: "Reception to Follow",
};

// demo gallery (external images)
const gallery = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
];

export default function InvitationTemplate({ publicSlug = "" }: { publicSlug?: string }) {
  const [opened, setOpened] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [showEnvelope, setShowEnvelope] = React.useState(true);

  const [scope, animate] = useAnimate();
  const idleCtrl = React.useRef<AnimationPlaybackControls | null>(null);

  // Idle bounce (envelope)
  React.useEffect(() => {
    if (opened) {
      idleCtrl.current?.stop();
      return;
    }
    idleCtrl.current = animate(
      "#envelope",
      { y: [-8, 0, -8] },
      { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
    );
    return () => idleCtrl.current?.stop();
  }, [animate, opened]);

  const handleOpen = async () => {
    if (opened) return;
    setOpened(true);
    idleCtrl.current?.stop();

    const seq: AnimationSequence = [
      ["#flapContainer", { rotateX: -180 }, { duration: 1.8, ease: [0.4, 0.8, 0.2, 1] }],
      [
        "#letterSmall",
        { y: -220, scale: 1, boxShadow: "0 20px 60px rgba(0,0,0,.25)" },
        { duration: 0.8, ease: "easeOut" },
      ],
    ];
    await animate(seq);

    await animate("#envelope", { opacity: 0 }, { duration: 0.6, ease: "easeInOut" });
    setShowEnvelope(false);
    setExpanded(true);
  };

  // Animate revealed layout
  React.useEffect(() => {
    if (!expanded) return;
    const run = async () => {
      await animate(
        "#letterFull",
        { opacity: [0, 1], scale: [0.9, 1], y: [40, 0] },
        { duration: 1.2, ease: [0.25, 0.8, 0.25, 1] },
      );
    };
    run();
  }, [expanded, animate]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-purple-100 to-gray-100 font-sans">
      <div
        ref={scope}
        className={`mx-auto flex min-h-screen max-w-5xl flex-col ${
          expanded ? "items-center justify-start py-10" : "items-center justify-center"
        } px-4`}
      >
        {/* Envelope stage */}
        {showEnvelope && (
          <div
            id="stage"
            className="relative flex w-full items-center justify-center"
            style={{ perspective: 1200 }}
          >
            {!opened && (
              <div className="absolute -top-10 z-10 select-none rounded-2xl bg-white px-3 py-1 text-xs font-medium text-purple-700 shadow-sm">
                Open me!
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-white shadow-sm" />
              </div>
            )}

            <button
              id="envelope"
              onClick={handleOpen}
              className="relative z-0 h-56 w-96 cursor-pointer rounded-xl outline-none"
              style={{ transformStyle: "preserve-3d" }}
              aria-label="Open invitation"
            >
              {/* Wax Seal */}
              <div
                id="seal"
                className="absolute left-1/2 top-[50%] z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-b from-gray-800 to-gray-600 text-white font-bold text-lg"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4)",
                  border: "2px solid rgba(0,0,0,0.2)",
                }}
              >
                DI
              </div>

              {/* Envelope body */}
              <div
                id="envBody"
                className="absolute inset-0 rounded-xl shadow-lg bg-gradient-to-b from-purple-500 to-purple-700"
              />

              {/* Flap – pointing DOWN initially */}
              <div
                id="flapContainer"
                className="absolute left-0 right-0 top-0 mx-auto w-full"
                style={{
                  height: "50%",
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  id="flap"
                  className="w-full h-full rounded-t-xl bg-purple-500"
                  style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
                />
              </div>

              {/* Small Letter */}
              <div
                id="letterSmall"
                className="absolute bottom-4 left-1/2 z-10 w-[85%] -translate-x-1/2 rounded-lg bg-white p-4 text-center shadow-md"
              >
                <div className="text-sm font-semibold text-gray-800">You are invited</div>
                <div className="mt-1 text-xs text-gray-500">Tap to open</div>
              </div>
            </button>
          </div>
        )}

        {/* Revealed, scrollable invite */}
        {expanded && (
          <article
            id="letterFull"
            className="w-full max-w-4xl translate-y-4 scale-95 opacity-0 overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200"
          >
            {/* 1) Designed card */}
            <section className="relative px-8 py-12">
              <div className="border border-gray-300/80 px-8 py-12 relative rounded-md">
                <div className="absolute left-6 top-6 h-[2px] w-40 bg-gray-400/70" />
                <div className="absolute right-6 bottom-6 h-[2px] w-40 bg-gray-400/70" />
                <Image
                  className="absolute top-6 right-6 w-24 h-24 text-gray-400/70"
                  src={flower}
                  alt="Decorative corner flourish"
                />

                <Image
                  className="absolute bottom-6 left-6 w-24 h-24 text-gray-400/70"
                  src={flower}
                  alt="Decorative corner flourish"
                />

                <h1
                  className="text-center text-5xl mb-4 text-gray-800"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {templateText.groom} + {templateText.bride}
                </h1>

                <p className="text-center text-gray-700/90 mb-6">
                  Request the pleasure of your company
                  <br /> at their wedding celebration
                </p>

                <p className="text-center font-medium text-gray-900 mb-6 tracking-wide">
                  AT {templateText.time}, {templateText.date}
                </p>

                <p className="text-center text-gray-700/90 mb-8">
                  {templateText.venue}
                  <br />
                  {templateText.address}
                </p>

                <p
                  className="text-center text-2xl text-gray-700"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {templateText.footer}
                </p>
              </div>
            </section>

            {/* 2) Location */}
            <section className="px-8 pb-12">
              <h2
                className="mb-3 text-3xl text-center text-gray-800"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Location
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <iframe
                  title="Map"
                  src="https://www.google.com/maps?q=Villa%20Dalmacija%20Split&output=embed"
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Villa Dalmacija, Split, Croatia
              </p>
            </section>

            {/* 3) Designer mosaic gallery (Next/Image) */}
            <section className="px-8 pb-12">
              <h2
                className="mb-6 text-3xl text-center text-gray-800"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Moments & Details
              </h2>

              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                style={{ gridAutoRows: "140px" }}
              >
                {/* feature tile 2x2 */}
                <div className="col-span-2 row-span-2 overflow-hidden rounded-xl">
                  <div className="relative h-full w-full">
                    <Image
                      src={gallery[0]}
                      alt="Gallery feature"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      priority={false}
                    />
                  </div>
                </div>

                {/* remaining tiles */}
                {gallery.slice(1).map((src, i) => (
                  <div
                    key={i}
                    className={`overflow-hidden rounded-xl ${i === 2 ? "col-span-2" : ""}`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={src}
                        alt={`Gallery ${i + 2}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* // 4) RSVP Form */}
              <RsvpForm publicSlug={publicSlug} />
            </section>
          </article>
        )}
      </div>
    </main>
  );
}
