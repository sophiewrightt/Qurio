// Edit these lists to add more personality. Each eligible message has an equal
// chance on each Home visit. Independent draws can occasionally repeat.
export const greetingMessages = {
  morning: ['Top of the morning to you', 'Good morning', 'Morning'],
  anytime: [
    'Hi!', 'Hey there', 'G’day', 'How are you?', 'How’s it going?', 'Sup',
    'Great to see you.', 'Welcome', 'Hey', 'Ready to get curious?',
    'Time to explore the tiny world', 'Another day, another mystery',
    'Welcome back, pal', 'Let’s explore some weird stuff', 'You’re back!',
    'Oh, hey you', 'Look who showed up', 'Well, well, well…..', 'Ahoy',
    'Fancy seeing you here', 'Reporting for duty', 'Back for more, huh?',
    'Hellooooooooo', 'Hello, hello, hello.', 'Salutations', 'Here we go again.',
    'Congrats on opening the app.', 'Good news: you’re here!',
  ],
  birthday: ['Happy birthday'],
  easter: ['Happy Easter!'],
  christmas: ['Merry Christmas!'],
} as const;

export const GREETING_DURATION_MS = 5000;
export type Birthday = { day: number; month: number };

export function isValidBirthday(value: Birthday): boolean {
  // No birth year needed. February 29 is a valid birthday.
  const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return Number.isInteger(value.month) && Number.isInteger(value.day) &&
    value.month >= 1 && value.month <= 12 && value.day >= 1 && value.day <= (days[value.month - 1] ?? 0);
}

// Gregorian Easter Sunday, using the Meeus/Jones/Butcher computus.
export function easterSunday(year: number): Birthday {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const result = h + l - 7 * m + 114;
  return { month: Math.floor(result / 31), day: result % 31 + 1 };
}

export function eligibleGreetings(now: Date, birthday?: Birthday): readonly string[] {
  const month = now.getMonth() + 1, day = now.getDate();
  // Use the device's local calendar, not UTC. Birthday wins holiday collisions.
  if (birthday && isValidBirthday(birthday) && birthday.month === month && birthday.day === day) return greetingMessages.birthday;
  if (month === 12 && day === 25) return greetingMessages.christmas;
  const easter = easterSunday(now.getFullYear());
  if (month === easter.month && day === easter.day) return greetingMessages.easter;
  return now.getHours() < 12 ? [...greetingMessages.morning, ...greetingMessages.anytime] : greetingMessages.anytime;
}

export function chooseGreeting(now = new Date(), birthday?: Birthday, random = Math.random): string {
  const pool = eligibleGreetings(now, birthday);
  return pool[Math.floor(random() * pool.length)] ?? greetingMessages.anytime[0];
}
