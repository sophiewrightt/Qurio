import { createContext, useContext, type ReactNode } from 'react';

const KnowledgeContext = createContext<(questionKey: string) => void>(() => {});
export function KnowledgeProvider({ onCorrect, children }: { onCorrect: (questionKey: string) => void; children: ReactNode }) {
  return <KnowledgeContext.Provider value={onCorrect}>{children}</KnowledgeContext.Provider>;
}
export const useKnowledge = () => useContext(KnowledgeContext);
