"use client";
import React, { useState, useEffect, useRef } from "react";

export default function TTSPlayer({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [avatarId, setAvatarId] = useState(44); // Default to avoid hydration mismatch
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }

    // Pick a random woman's face on client mount (IDs 1-99)
    setAvatarId(Math.floor(Math.random() * 99) + 1);

    // Cleanup on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleToggle = () => {
    if (!synthRef.current) return;

    if (isPlaying && !isPaused) {
      // Pause
      synthRef.current.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      // Resume
      synthRef.current.resume();
      setIsPaused(false);
    } else {
      // Start fresh
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Attempt to find a female voice to match the avatar
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(
        (v) =>
          v.name.includes("Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Zira"),
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Track progress word by word
      utterance.onboundary = (e) => {
        if (e.name === "word") {
          const currentProgress = (e.charIndex / text.length) * 100;
          setProgress(currentProgress);
        }
      };

      // Reset when finished
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
      };

      synthRef.current.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white/95 backdrop-blur-sm p-2 pr-4 rounded-full shadow-2xl border border-gray-200 hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 group">
      {/* Avatar Image */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {/* Using randomuser.me API for a high-quality placeholder face */}
        <img
          src={`https://randomuser.me/api/portraits/women/${avatarId}.jpg`}
          alt="AI Reader"
          className="w-full h-full rounded-full object-cover border-2 border-purple-200"
        />
        {/* Pulsing online indicator when playing */}
        {isPlaying && !isPaused && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </div>

      {/* Audio Info & Progress Bar */}
      <div className="flex flex-col w-32 md:w-48">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
          {isPlaying && !isPaused ? "Now Reading..." : "Listen to Article"}
        </span>

        {/* Progress Bar Background */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
          {/* Active Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-200 ease-linear"
            style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggle}
        className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-purple-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        aria-label={isPlaying && !isPaused ? "Pause audio" : "Play audio"}>
        {isPlaying && !isPaused ? (
          // Pause Icon
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          // Play Icon
          <svg className="w-4 h-4 fill-current ml-1" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
