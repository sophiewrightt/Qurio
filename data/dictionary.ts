export type DictionaryEntry = { id: string; term: string; definition: string };

export function dictionaryId(term: string) {
  return term.trim().normalize('NFKC').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').toLowerCase();
}

// Only call for a definition the learner has actually encountered. Replays do
// not duplicate entries; a later explanation of the same term updates it.
export function recordDictionaryEntry(entries: DictionaryEntry[], term: string, definition: string): DictionaryEntry[] {
  const id = dictionaryId(term);
  if (!id || !definition.trim()) return entries;
  const entry = { id, term: term.trim(), definition: definition.trim() };
  const previous = entries.find(item => item.id === id);
  if (previous?.term === entry.term && previous.definition === entry.definition) return entries;
  return previous ? entries.map(item => item.id === id ? entry : item) : [...entries, entry];
}

export type DictionaryRect = { x: number; y: number; width: number; height: number };
export function dictionaryCopyVisible(rect: DictionaryRect, viewport: { width: number; height: number }) {
  if (![rect.x, rect.y, rect.width, rect.height, viewport.width, viewport.height].every(Number.isFinite)
    || rect.width <= 0 || rect.height <= 0 || viewport.width <= 0 || viewport.height <= 0) return false;
  const visibleWidth = Math.max(0, Math.min(rect.x + rect.width, viewport.width) - Math.max(rect.x, 0));
  const visibleHeight = Math.max(0, Math.min(rect.y + rect.height, viewport.height) - Math.max(rect.y, 0));
  return visibleWidth >= Math.min(rect.width, viewport.width) * 0.6
    && visibleHeight >= Math.min(rect.height, viewport.height) * 0.6;
}

// Two visible samples keep a fast scroll past a card from filling the book.
// Stop polling immediately after discovery, and ignore late native callbacks.
export function watchDictionaryCopy({ measure, viewport, isActive, onSeen, schedule }: {
  measure: (callback: (rect: DictionaryRect) => void) => void;
  viewport: () => { width: number; height: number };
  isActive: () => boolean;
  onSeen: () => void;
  schedule: (callback: () => void) => () => void;
}) {
  let live = true, visibleSamples = 0, measuring = false;
  let stopTimer = () => {};
  const check = () => {
    if (!live || measuring) return;
    if (!isActive()) { visibleSamples = 0; return; }
    measuring = true;
    measure(rect => {
      measuring = false;
      if (!live) return;
      visibleSamples = isActive() && dictionaryCopyVisible(rect, viewport()) ? visibleSamples + 1 : 0;
      if (visibleSamples >= 2) { live = false; stopTimer(); onSeen(); }
    });
  };
  stopTimer = schedule(check);
  check();
  return () => { live = false; stopTimer(); };
}
