import { realms } from './curriculum';

// Navigation screen IDs are not lesson numbers (the later finales are 31/32).
export const lessonOrder = realms.flatMap(realm => realm.chapters.flatMap(chapter => chapter.lessons));

// Local guest progression, not account authorization: completed path + next lesson.
export function availableLessonIds(completed: readonly number[]): readonly number[] {
  const next = lessonOrder.findIndex(id => !completed.includes(id));
  return next < 0 ? lessonOrder : lessonOrder.slice(0, next + 1);
}

export function lessonNumber(screen: number): string | undefined {
  if (!Number.isInteger(screen)) return;
  for (const realm of realms) for (const chapter of realm.chapters) {
    const index = chapter.lessons.indexOf(screen);
    if (index >= 0) return `${chapter.number}.${index + 1}`;
  }
}
