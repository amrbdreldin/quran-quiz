'use client';

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  fire: boolean;
}

/**
 * Confetti — canvas-confetti celebration for 100% score.
 * Uses dynamic import to avoid SSR issues.
 * Islamic-themed palette: gold (#FAC46C) + dark teal (#004243) + white.
 */
export function Confetti({ fire }: ConfettiProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!fire || firedRef.current) return;
    firedRef.current = true;

    const colors = ['#FAC46C', '#004243', '#FFFFFF', '#FFD93D', '#00C9A7'];

    import('canvas-confetti').then(({ default: confetti }) => {
      // First burst — center explosion
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        startVelocity: 45,
      });

      // Second wave — left cannon
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
      }, 300);

      // Third wave — right cannon
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });
      }, 600);

      // Final shower
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.3 },
          colors,
          gravity: 0.8,
        });
      }, 1000);
    });
  }, [fire]);

  // This component renders no DOM — it uses the canvas-confetti API
  return null;
}
