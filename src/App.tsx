import { PumpRunGame } from "./components/PumpRunGame";

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 text-center">
        <h1 className="font-mono text-xl font-bold tracking-tight text-pump-green md:text-2xl">
          PUMP RUN
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Tap fast. Fake numbers only. Not financial advice.
        </p>
      </header>
      <main className="flex flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <PumpRunGame />
      </main>
    </div>
  );
}
