import { useCallback, useRef, useState } from "react";
import { PumpRunGame } from "./components/PumpRunGame";
import {
  YouTubeBackground,
  type DemonPlayerControls,
} from "./components/YouTubeBackground";

const BG_VIDEO_ID = "qF0PdgefNMY";

export default function App() {
  const demonRef = useRef<DemonPlayerControls | null>(null);
  const [demonReady, setDemonReady] = useState(false);

  const handlePlayerReady = useCallback((controls: DemonPlayerControls) => {
    demonRef.current = controls;
    setDemonReady(true);
  }, []);

  const handleRoundStart = useCallback(() => {
    demonRef.current?.unmute();
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <YouTubeBackground videoId={BG_VIDEO_ID} onPlayerReady={handlePlayerReady} />
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-white/75 backdrop-blur-[1px] dark:bg-black/65 dark:backdrop-blur-none"
        aria-hidden
      />
      <header className="relative z-10 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 text-center">
        <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-2xl">
          TO MOON
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Tap fast. Fake numbers only. Not financial advice.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={!demonReady}
            onClick={() => demonRef.current?.play()}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            play the demon
          </button>
          <button
            type="button"
            disabled={!demonReady}
            onClick={() => demonRef.current?.pause()}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            stop the demon
          </button>
        </div>
      </header>
      <main className="relative z-10 flex flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <PumpRunGame onRoundStart={handleRoundStart} />
      </main>
    </div>
  );
}
