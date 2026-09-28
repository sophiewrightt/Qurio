export const loadingMessages = [
  'Sharpening crayons...',
  'One sec...',
  'Almost ready...',
  'Fetching something fascinating...',
  'Simplifying things...',
  'Loading something worth knowing...',
  'Doing important loading things….',
  'Pls admire this loading screen…',
  'Looking busy…',
  'Crunching numbers…?',
  'Hold on…',
  'Hmm.. Where did I put that?',
  'Loading faster because you’re watching…',
  'Getting smaller...',
  'Checking the laws of physics....',
  'Checking if the cat is okay…',
  'Entangling some things…',
  'Quantising...',
  'Getting the good stuff….',
  'Cool things coming ahead',
  'Hi',
  'Still here?',
  'Nothing to see here',
  'You’re early',
  'This usually happens faster',
  'Thanks for waiting :)',
  'Most people don’t make it this far.',
  'I have something to tell y-',
  'If you can read this it’s still loading',
  'You’re making me nervous',
  'Trying my best here',
  'Wait till you see this',
  'Ready?',
] as const;

// Each phrase appears once per shuffled cycle; cycle boundaries never repeat.
export function shuffledLoadingMessages(previous?: string, random = Math.random): string[] {
  const messages: string[] = [...loadingMessages];
  for (let i = messages.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [messages[i], messages[j]] = [messages[j]!, messages[i]!];
  }
  if (messages[0] === previous) [messages[0], messages[1]] = [messages[1]!, messages[0]!];
  return messages;
}
