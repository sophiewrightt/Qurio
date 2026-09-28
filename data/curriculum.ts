// Stable navigation IDs are separate from learner-facing realm/chapter numbering.
export type Chapter = { id: string; number: number; title: string; lessons: readonly number[] };
export type Realm = { id: string; number: number; chapters: readonly Chapter[] };
export const realms: readonly Realm[] = [{ id: 'quantum-foundations', number: 1, chapters: [
  { id: 'quantum-introduction', number: 1, title: 'Entering the Quantum World', lessons: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { id: 'quantum-rules', number: 2, title: 'The Quantum Rules', lessons: [11, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'quantum-connections', number: 3, title: 'Quantum Connections', lessons: [19, 20, 21, 22, 23, 24, 25, 31] },
  { id: 'better-together', number: 4, title: 'Better together', lessons: [26, 27, 28, 29, 30, 32] },
] }];
export const currentRealm = realms[0]!;
