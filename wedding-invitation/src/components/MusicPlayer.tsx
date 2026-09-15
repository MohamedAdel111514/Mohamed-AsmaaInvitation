"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.45;
    audio.loop = true;

    const startMusic = async () => {
      try {
        await audio.play();

        setIsPlaying(true);
        setUnavailable(false);

        removeListeners();
      } catch {
        // المتصفح منع التشغيل التلقائي
        setIsPlaying(false);
      }
    };

    const removeListeners = () => {
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("scroll", startMusic);
    };

    // محاولة التشغيل تلقائيًا عند فتح الصفحة
    startMusic();

    // تشغيل الصوت بعد أول تفاعل إذا منع المتصفح التشغيل التلقائي
    window.addEventListener("click", startMusic);
    window.addEventListener("touchstart", startMusic);
    window.addEventListener("keydown", startMusic);
    window.addEventListener("scroll", startMusic);

    return () => {
      removeListeners();
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;

    if (!audio || unavailable) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setUnavailable(false);
    } catch {
      setUnavailable(true);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/wedding-song.mp3"
        loop
        preload="auto"
        onError={() => setUnavailable(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {!unavailable && (
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink/90 text-ivory shadow-lg backdrop-blur transition-transform hover:scale-105"
        >
          {isPlaying ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
