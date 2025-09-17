// components/invitations/animations/EnvelopeOpen.tsx
"use client";
import * as React from "react";
import { useAnimate, type AnimationSequence, type AnimationPlaybackControls } from "framer-motion";

type Props = {
  onOpened: () => void;
  sealText?: string;
  primary?: string;
  secondary?: string;
};

export default function EnvelopeOpen({
  onOpened,
  sealText = "DI",
  primary = "#7c3aed",
  secondary = "#5b21b6",
}: Props) {
  const [opened, setOpened] = React.useState(false);
  const [scope, animate] = useAnimate();
  const idleCtrl = React.useRef<AnimationPlaybackControls | null>(null);

  React.useEffect(() => {
    if (opened) return;
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
      ["#flapContainer", { rotateX: -180 }, { duration: 1.6, ease: [0.4, 0.8, 0.2, 1] }],
      [
        "#letterSmall",
        { y: -200, scale: 1, boxShadow: "0 20px 60px rgba(0,0,0,.25)" },
        { duration: 0.8 },
      ],
    ];
    await animate(seq);
    await animate("#envelope", { opacity: 0 }, { duration: 0.5 });
    onOpened();
  };

  return (
    <div
      ref={scope}
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
        className="relative h-48 w-80 sm:h-56 sm:w-96 cursor-pointer rounded-xl outline-none"
        style={{ transformStyle: "preserve-3d" }}
        aria-label="Open invitation"
      >
        {/* wax seal */}
        <div
          id="seal"
          className="absolute left-1/2 top-[52%] z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white font-bold text-lg"
          style={{
            background: "linear-gradient(to bottom, #111, #555)",
            fontFamily: "'Great Vibes', cursive",
            boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4)",
            border: "2px solid rgba(0,0,0,0.2)",
          }}
        >
          {sealText}
        </div>

        {/* body */}
        <div
          id="envBody"
          className="absolute inset-0 rounded-xl shadow-lg"
          style={{ background: `linear-gradient(to bottom, ${primary}, ${secondary})` }}
        />

        {/* flap */}
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
            className="w-full h-full rounded-t-xl"
            style={{ background: primary, clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
          />
        </div>

        {/* inner card preview */}
        <div
          id="letterSmall"
          className="absolute bottom-4 left-1/2 z-10 w-[85%] -translate-x-1/2 rounded-lg bg-white p-4 text-center shadow-md"
        >
          <div className="text-sm font-semibold text-gray-800">You are invited</div>
          <div className="mt-1 text-xs text-gray-500">Tap to open</div>
        </div>
      </button>
    </div>
  );
}
