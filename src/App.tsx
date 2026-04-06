import { useCallback, useRef } from "react";
import { PumpRunGame } from "./components/PumpRunGame";
import { YouTubeBackground } from "./components/YouTubeBackground";

const BG_VIDEO_ID = "qF0PdgefNMY";

export default function App() {
  const unmuteRef = useRef<(() => void) | null>(null);

  const handlePlayerReady = useCallback((controls: { unmute: () => void }) => {
    unmuteRef.current = controls.unmute;
  }, []);

  const handleRoundStart = useCallback(() => {
    unmuteRef.current?.();
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
      </header>
      <main className="relative z-10 flex flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <PumpRunGame onRoundStart={handleRoundStart} />
      </main>
    </div>
  );
}
