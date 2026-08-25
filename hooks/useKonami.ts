"use client";

import { useEffect, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];

/**
 * Listens for the Konami code (↑↑↓↓←→←→ B A). Returns a boolean that flips
 * to true when the sequence completes; consumers can reset it.
 */
export function useKonami(): [boolean, () => void] {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    let buffer: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);
      if (
        buffer.length === SEQUENCE.length &&
        buffer.every((k, i) => k === SEQUENCE[i])
      ) {
        setTriggered(true);
        buffer = [];
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return [triggered, () => setTriggered(false)];
}
