import confetti from 'canvas-confetti';

export function fireStarCelebration() {
  confetti({
    particleCount: 70,
    spread: 68,
    origin: { y: 0.65 },
    colors: ['#F4B942', '#EE6C4D', '#2A9D8F', '#3B82F6', '#EC4899'],
  });
}

export function fireBigTrophyCelebration() {
  const end = Date.now() + 900;
  const colors = ['#F4B942', '#EE6C4D', '#2A9D8F', '#FFD166'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.68 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.68 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
