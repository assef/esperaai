export function posterGradient(hue: number): string {
  return `linear-gradient(150deg, oklch(0.42 0.11 ${hue}) 0%, oklch(0.22 0.07 ${(hue + 28) % 360}) 100%)`;
}
