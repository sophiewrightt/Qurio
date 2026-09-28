/** Independent simulated measurements; tests may inject a reproducible RNG. */
export function sampleBinary(count: number, probability: number, random: () => number = Math.random): boolean[] {
  return Array.from({ length: count }, () => random() < probability);
}
