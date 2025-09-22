"use client";
import * as React from "react";
import { useAnimate, type AnimationSequence, type AnimationPlaybackControls } from "framer-motion";

type Props = {
  onOpened: () => void;
  sealText?: string;
  primary?: string;
  secondary?: string;
};

export default function EnvelopeOpen2({
  onOpened,
  sealText = "DI",
  primary = "#f5f1e9", // ivory / beige
  secondary = "#e8e4d9", // slightly darker beige
}: Props) {
  const [opened, setOpened] = React.useState(false);
  const [scope, animate] = useAnimate();
  const idleCtrl = React.useRef<AnimationPlaybackControls | null>(null);

  // Floating idle animation
  React.useEffect(() => {
    if (opened) return;
    idleCtrl.current = animate(
      "#envelope2",
      { y: [-6, 0, -6], rotate: [-1, 1, -1] },
      { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
    );
    return () => idleCtrl.current?.stop();
  }, [animate, opened]);

  const handleOpen = async () => {
    if (opened) return;
    setOpened(true);
    idleCtrl.current?.stop();

    const seq: AnimationSequence = [
      // flap opens slowly & smoothly
      ["#flapContainer2", { rotateX: -180 }, { duration: 1.8, ease: [0.22, 0.61, 0.36, 0.5] }],
      // letter slides up with bounce
      [
        "#letter2",
        {
          y: -240,
          rotate: [-2, 0],
          scale: [0.95, 1.05, 1],
          boxShadow: "0 25px 80px rgba(0,0,0,.25)",
        },
        { duration: 1.1, ease: [0.68, -0.55, 0.27, 1.55] },
      ],
      // envelope shrinks & fades
      ["#envelope2", { scale: 0.95 }, { duration: 0.3, ease: "easeInOut" }],
      ["#envelope2", { opacity: 0 }, { duration: 0.5 }],
    ];

    await animate(seq);
    onOpened();
  };

  return (
    <div
      ref={scope}
      className="relative flex w-full items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {!opened && (
        <div className="absolute -top-12 z-10 select-none rounded-xl bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-md">
          Tap to reveal
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-white/95 shadow-md" />
        </div>
      )}

      <button
        id="envelope2"
        onClick={handleOpen}
        className="relative h-52 w-80 sm:h-60 sm:w-96 cursor-pointer rounded-xl outline-none"
        style={{ transformStyle: "preserve-3d" }}
        aria-label="Open invitation"
      >
        {/* Envelope body */}
        <div
          id="envBody2"
          className="absolute inset-0 rounded-xl"
          style={{
            backgroundColor: primary,
            border: "2px solid black",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.7)",
          }}
        />

        {/* Flap */}
        <div
          id="flapContainer2"
          className="absolute left-0 right-0 top-0 mx-auto w-full"
          style={{
            height: "50%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className="w-full h-full rounded-t-xl"
            style={{
              backgroundColor: secondary,
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
              borderTop: "2px solid black",
              borderLeft: "2px solid black",
              borderRight: "2px solid black",
              borderBottom: "2px solid black",
            }}
          />
        </div>

        {/* Letter */}
        <div
          id="letter2"
          className="absolute bottom-6 left-1/2 z-10 w-[85%] -translate-x-1/2 rounded-lg bg-white p-6 text-center shadow-lg"
          style={{
            fontFamily: "serif",
          }}
        >
          <div className="text-base font-bold text-gray-800">You are invited</div>
          <div className="mt-1 text-sm text-gray-500">Click to open</div>
        </div>
      </button>
    </div>
  );
}
