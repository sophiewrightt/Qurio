import { createContext, type ReactNode } from 'react';

type DictionaryDiscovery = { enabled: boolean; onDiscover: (term: string, definition: string) => void };
export const DictionaryContext = createContext<DictionaryDiscovery | undefined>(undefined);

export function DictionaryProvider({ enabled, onDiscover, children }: DictionaryDiscovery & { children: ReactNode }) {
  return <DictionaryContext.Provider value={{ enabled, onDiscover }}>{children}</DictionaryContext.Provider>;
}
