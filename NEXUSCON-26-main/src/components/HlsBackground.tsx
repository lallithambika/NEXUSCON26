import { useEffect, useRef } from "react";

export default function HlsBackground({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;

    const setup = async () => {
      // Native HLS (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        const Hls = (await import("hls.js")).default;
        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true, lowLatencyMode: false });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
      }
      try {
        await video.play();
      } catch {
        /* autoplay may need user gesture; muted should allow it */
      }
    };

    setup();

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
      aria-hidden
    />
  );
}
