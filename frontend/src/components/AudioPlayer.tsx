"use client";

import { useEffect } from "react";

export default function AudioPlayer() {
  useEffect(() => {
    const audio = new Audio("/gitarag.m4a");
    audio.loop = false;
    audio.volume = 0.8;

    const playAudio = () => {
      audio.play().catch(() => {
        console.log("Autoplay blocked. Waiting for interaction.");
      });
      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
    };

    window.addEventListener("click", playAudio);
    window.addEventListener("keydown", playAudio);
  }, []);

  return null; // no visual UI, audio runs in background
}
