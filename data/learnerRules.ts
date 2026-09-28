// Shared display rules. Authoritative balances and permissions belong on the server.
export const DAILY_LIFE_LIMIT = 3;
export const FINAL_PASS_PERCENT = 70;

export function requiredFinalAnswers(total: number): number {
  if (!Number.isInteger(total) || total < 1) throw new Error('A final quiz needs at least one question.');
  return Math.floor(total * FINAL_PASS_PERCENT / 100) + 1;
}

export function passesFinalQuiz(correct: number, total: number): boolean {
  return Number.isInteger(correct) && correct <= total && correct >= requiredFinalAnswers(total);
}
