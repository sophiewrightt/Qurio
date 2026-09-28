// Deliberately simplified teaching distribution, not a physical calculation.
export const zoneWeights = [10, 20, 40, 20, 10] as const;
export function sampleZone(random = Math.random()): number {
  let cumulative = 0;
  for (let i = 0; i < zoneWeights.length; i++) {
    cumulative += zoneWeights[i]!;
    if (random * 100 < cumulative) return i;
  }
  return 4;
}
