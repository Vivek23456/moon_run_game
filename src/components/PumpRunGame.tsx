import { useCallback, useEffect, useRef, useState } from "react";

const GAME_MS = 40_000;
const TICK_MS = 100;
const DECAY_PER_SEC = 9;
const PUMP_MIN = 10;
const PUMP_MAX = 22;
const START_PRICE = 100;
const STORAGE_KEY = "pump-run-best";

type Phase = "idle" | "playing" | "ended";

function loadBest(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v == null) return 0;
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.floor(n)));
  } catch {
    /* ignore */
  }
}

const TICKERS = ["MOON", "WAGMI", "HODL", "LFG", "GG", "SEND IT", "UP ONLY"];

export function PumpRunGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [price, setPrice] = useState(START_PRICE);
  const [peak, setPeak] = useState(START_PRICE);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_MS);
  const [best, setBest] = useState(0);
  const [ticker, setTicker] = useState(0);
  const startRef = useRef<number>(0);
  const peakRef = useRef(START_PRICE);
  const endedRef = useRef(false);

  useEffect(() => {
    setBest(loadBest());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTicker((t) => (t + 1) % TICKERS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  const endGame = useCallback((finalPeak: number) => {
    setPhase("ended");
    setBest((prev) => {
      const next = Math.max(prev, Math.floor(finalPeak));
      if (next > prev) saveBest(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const id = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, GAME_MS - elapsed);
      setTimeLeftMs(left);

      if (left <= 0) {
        if (!endedRef.current) {
          endedRef.current = true;
          endGame(peakRef.current);
        }
        return;
      }

      setPrice((p) => {
        const decay = (DECAY_PER_SEC * TICK_MS) / 1000;
        const next = Math.max(0, p - decay);
        peakRef.current = Math.max(peakRef.current, next);
        setPeak(peakRef.current);
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [phase, endGame]);

  const start = useCallback(() => {
    endedRef.current = false;
    peakRef.current = START_PRICE;
    setPrice(START_PRICE);
    setPeak(START_PRICE);
    setTimeLeftMs(GAME_MS);
    startRef.current = Date.now();
    setPhase("playing");
  }, []);

  const pump = useCallback(() => {
    if (phase !== "playing") return;
    setPrice((p) => {
      const bump = PUMP_MIN + Math.random() * (PUMP_MAX - PUMP_MIN);
      const next = p + bump;
      peakRef.current = Math.max(peakRef.current, next);
      setPeak(peakRef.current);
      return next;
    });
  }, [phase]);

  const seconds = Math.ceil(timeLeftMs / 1000);
  const showPeak = phase === "playing" || phase === "ended";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div
        className="overflow-hidden rounded-lg border border-pump-dim bg-black/40 py-2 text-center font-mono text-xs text-pump-green/90"
        aria-hidden
      >
        <span className="inline-block animate-pulse">
          {TICKERS[ticker]} · {TICKERS[(ticker + 3) % TICKERS.length]} · NOT REAL
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl border border-pump-dim bg-gradient-to-b from-pump-dim/50 to-black/60 p-4">
        <div className="w-full text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Peak price</p>
          <p className="mt-1 font-mono text-5xl font-extrabold tabular-nums text-pump-green md:text-6xl">
            {showPeak ? peak.toFixed(1) : "—"}
          </p>
          <p className="mt-2 font-mono text-sm text-zinc-400">
            Current: <span className="text-zinc-200">{price.toFixed(1)}</span>
          </p>
        </div>

        {phase === "playing" && (
          <p className="font-mono text-2xl font-bold tabular-nums text-pump-pink">
            {seconds}s
          </p>
        )}

        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="w-full max-w-sm rounded-xl bg-pump-green px-6 py-5 font-mono text-lg font-bold text-black shadow-[0_0_24px_rgba(0,255,136,0.35)] transition active:scale-[0.98] md:text-xl"
          >
            START PUMP
          </button>
        )}

        {phase === "playing" && (
          <button
            type="button"
            onClick={pump}
            style={{ touchAction: "manipulation" }}
            className="flex min-h-[120px] w-full max-w-sm select-none items-center justify-center rounded-2xl bg-gradient-to-br from-pump-pink to-orange-600 px-4 py-8 font-mono text-2xl font-extrabold uppercase tracking-wide text-white shadow-[0_0_32px_rgba(255,0,170,0.35)] active:scale-[0.97] md:min-h-[140px] md:text-3xl"
          >
            PUMP
          </button>
        )}

        {phase === "ended" && (
          <div className="w-full max-w-sm space-y-4 text-center">
            <p className="font-mono text-zinc-300">
              Round high:{" "}
              <span className="text-pump-green">{Math.floor(peak)}</span>
            </p>
            <p className="font-mono text-sm text-zinc-500">
              Best ever: <span className="text-zinc-300">{best}</span>
            </p>
            <button
              type="button"
              onClick={start}
              className="w-full rounded-xl border border-pump-green/50 bg-pump-green/10 px-6 py-4 font-mono text-lg font-bold text-pump-green transition active:scale-[0.98]"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] leading-relaxed text-zinc-600">
        For fun only. No blockchain, no tokens, no real money.
      </p>
    </div>
  );
}
