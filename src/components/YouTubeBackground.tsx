import { useEffect, useRef } from "react";

const BG_PLAYER_ID = "yt-bg-player";

type YTPlayerInstance = {
  playVideo: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    id: string,
    options: {
      width: string;
      height: string;
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (e: { target: YTPlayerInstance }) => void;
      };
    },
  ) => YTPlayerInstance;
};

let youtubeApiPromise: Promise<void> | null = null;

function ensureYoutubeApi(): Promise<void> {
  if (youtubeApiPromise) return youtubeApiPromise;
  youtubeApiPromise = new Promise((resolve) => {
    const w = window as Window & { YT?: YTNamespace };
    if (w.YT?.Player) {
      resolve();
      return;
    }
    const w2 = window as Window & { onYouTubeIframeAPIReady?: () => void };
    const prev = w2.onYouTubeIframeAPIReady;
    w2.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return youtubeApiPromise;
}

type Props = {
  videoId: string;
  onPlayerReady?: (controls: { unmute: () => void }) => void;
};

export function YouTubeBackground({ videoId, onPlayerReady }: Props) {
  const onPlayerReadyRef = useRef(onPlayerReady);
  onPlayerReadyRef.current = onPlayerReady;
  const playerRef = useRef<YTPlayerInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    ensureYoutubeApi().then(() => {
      if (cancelled) return;
      const w = window as Window & { YT?: YTNamespace };
      if (!w.YT?.Player) return;

      playerRef.current = new w.YT.Player(BG_PLAYER_ID, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            e.target.playVideo();
            const unmute = () => {
              e.target.unMute();
              e.target.setVolume(100);
            };
            onPlayerReadyRef.current?.({ unmute });
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-[100vh] w-[100vw] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2">
        <div id={BG_PLAYER_ID} className="h-full w-full" />
      </div>
    </div>
  );
}
