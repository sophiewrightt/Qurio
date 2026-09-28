export type Achievement = {
  id: string; group: string; name: string; description: string;
  lesson?: number; milestone?: number; reward: number | 'packet' | null;
};
export const achievementGroups = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Streak', 'Unlocks', 'Lessons'];
export const achievements: Achievement[] = [
  { id: 'W1.1', group: 'Chapter 1', name: 'It’s wavy baby', description: 'Understand wave-particle duality.', lesson: 4, reward: 20 },
  { id: 'W1.2', group: 'Chapter 1', name: 'Break a leg', description: 'Learn about decoherence.', lesson: 5, reward: 20 },
  { id: 'W1.3', group: 'Chapter 1', name: 'Tech savvy', description: 'Explore quantum applications.', lesson: 8, reward: 20 },
  { id: 'W1.4', group: 'Chapter 1', name: 'Complete chapter 1!', description: 'Finish Chapter 1’s final challenge.', lesson: 9, reward: 20 },
  { id: 'W2.1', group: 'Chapter 2', name: 'Rainbow', description: 'Explore atomic energy levels.', lesson: 12, reward: 20 },
  { id: 'W2.2', group: 'Chapter 2', name: 'Superpose', description: 'Learn about superposition.', lesson: 15, reward: 20 },
  { id: 'W2.3', group: 'Chapter 2', name: 'Cat’s out of the bag', description: 'Explore Schrödinger’s cat.', lesson: 17, reward: 20 },
  { id: 'W2.4', group: 'Chapter 2', name: 'Complete chapter 2!', description: 'Finish Chapter 2’s final challenge.', lesson: 18, reward: 20 },
  { id: 'W3.1', group: 'Chapter 3', name: 'Detangler', description: 'Learn about entanglement.', lesson: 21, reward: 20 },
  { id: 'W3.2', group: 'Chapter 3', name: 'Ding dong', description: 'Explore Bell’s theorem.', lesson: 23, reward: 20 },
  { id: 'W3.3', group: 'Chapter 3', name: 'Quantum trek?', description: 'Explore quantum teleportation.', lesson: 24, reward: 20 },
  { id: 'W3.4', group: 'Chapter 3', name: 'Complete chapter 3!', description: 'Finish Chapter 3’s final challenge.', lesson: 31, reward: 20 },
  { id: '4.1', group: 'Chapter 4', name: '9 3/4', description: 'Learn about quantum tunnelling.', lesson: 26, reward: 30 },
  { id: '4.2', group: 'Chapter 4', name: 'Family fun', description: 'Discover the differences between fermions and bosons.', lesson: 28, reward: 30 },
  { id: '4.3', group: 'Chapter 4', name: 'Complete chapter 4!', description: 'Finish Chapter 4’s final challenge.', lesson: 32, reward: 30 },
  ...[2, 7, 20, 50, 100, 150, 200, 250, 300, 365].map((milestone, i): Achievement => ({ id: `S${i + 1}`, group: 'Streak', name: `${milestone}-day streak`, description: `Log in ${milestone} days in a row.`, milestone, reward: 20 })),
  ...[5, 10, 20, 30, 40, 50].map((milestone, i): Achievement => ({ id: `U${i + 1}`, group: 'Unlocks', name: `${milestone} packets opened`, description: `Tear open ${milestone} customisation packets.`, milestone, reward: 'packet' })),
  ...[5, 20, 30, 40, 50, 70, 100].map((milestone, i): Achievement => ({ id: `L${i + 1}`, group: 'Lessons', name: `${milestone} lessons completed`, description: `Finish ${milestone} lessons. Replays count too!`, milestone, reward: 20 })),
];
export type AchievementProgress = {
  completed: number[]; lessons: number; packets: number; earned: string[];
  claimed: string[]; openedBonus: string[]; notices: string[]; quanta: number;
};
export const initialAchievements: AchievementProgress = { completed: [], lessons: 0, packets: 0, earned: [], claimed: [], openedBonus: [], notices: [], quanta: 0 };
export function discoverAchievements(progress: AchievementProgress): AchievementProgress {
  const newlyEarned = achievements.filter(a => !progress.earned.includes(a.id) && (
    (a.lesson !== undefined && progress.completed.includes(a.lesson)) ||
    (a.group === 'Lessons' && progress.lessons >= a.milestone!) ||
    (a.group === 'Unlocks' && progress.packets >= a.milestone!)
  )).map(a => a.id);
  return { ...progress, earned: [...progress.earned, ...newlyEarned], notices: [...progress.notices, ...newlyEarned] };
}
export function completeAchievementLesson(progress: AchievementProgress, lesson: number) {
  return discoverAchievements({ ...progress, completed: [...new Set([...progress.completed, lesson])], lessons: progress.lessons + 1 });
}
export function recordPacket(progress: AchievementProgress) {
  return discoverAchievements({ ...progress, packets: progress.packets + 1 });
}
export function claimAchievement(progress: AchievementProgress, id: string): AchievementProgress {
  const achievement = achievements.find(a => a.id === id);
  if (!achievement || achievement.reward === null || !progress.earned.includes(id) || progress.claimed.includes(id)) return progress;
  return { ...progress, claimed: [...progress.claimed, id], quanta: progress.quanta + (typeof achievement.reward === 'number' ? achievement.reward : 0) };
}
export function pendingBonusPackets(progress: AchievementProgress) {
  return progress.claimed.filter(id => achievements.find(a => a.id === id)?.reward === 'packet' && !progress.openedBonus.includes(id));
}
export function openBonusPacket(progress: AchievementProgress, id: string) {
  if (!pendingBonusPackets(progress).includes(id)) return progress;
  return recordPacket({ ...progress, openedBonus: [...progress.openedBonus, id] });
}
