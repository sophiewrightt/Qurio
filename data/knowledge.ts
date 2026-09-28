export const KNOWLEDGE_PER_ANSWER = 5;
export const KNOWLEDGE_PER_LEVEL = 200;
export const QUANTA_PER_LEVEL = 20;
export const knowledgeLevel = (total: number) => 1 + Math.floor(Math.max(0, total) / KNOWLEDGE_PER_LEVEL);
export type KnowledgeProgress = { total: number; shown: number; quanta: number; celebrations: number[] };
export const initialKnowledge: KnowledgeProgress = { total: 0, shown: 0, quanta: 120, celebrations: [] };
export function earnKnowledge(progress: KnowledgeProgress): KnowledgeProgress {
  return { ...progress, total: progress.total + KNOWLEDGE_PER_ANSWER };
}
// Settle only what Home actually presented. Functional updates make re-renders and
// repeated animation callbacks idempotent, including several crossed levels.
export function presentKnowledge(progress: KnowledgeProgress, target: number): KnowledgeProgress {
  const shown = Math.max(progress.shown, Math.min(progress.total, target));
  const levels = Array.from({ length: knowledgeLevel(shown) - knowledgeLevel(progress.shown) }, (_, i) => knowledgeLevel(progress.shown) + i + 1);
  return { ...progress, shown, quanta: progress.quanta + levels.length * QUANTA_PER_LEVEL, celebrations: [...progress.celebrations, ...levels] };
}
