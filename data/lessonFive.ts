import type { LessonQuestion } from '../components/LessonQuiz';

export const lessonFiveQuestions: LessonQuestion[] = [
  {
    question: 'Why did the interference bands disappear when slit detectors were added?',
    options: ['The detectors physically interacted with the experiment', 'A person thought about the electron', 'The electron became tired'],
    answer: 'The detectors physically interacted with the experiment',
    explanation: 'The detectors changed the physical setup and left information about the path. Conscious attention was not required.',
  },
  {
    question: 'Are electrons conscious or able to feel stage fright?',
    options: ['Yes, they know when people watch', 'No, stage fright is only a memory trick', 'Only while passing through a slit'],
    answer: 'No, stage fright is only a memory trick',
    explanation: 'Electrons do not think or feel. The pattern changes because of physical interactions with their surroundings.',
  },
  {
    question: 'What happened when no equipment recorded which slit each electron passed through?',
    options: ['Interference bands built up', 'Only two narrow bands appeared', 'Every electron landed in the same place'],
    answer: 'Interference bands built up',
    explanation: 'Without which-path information, many electron arrivals built the familiar interference pattern.',
  },
];
