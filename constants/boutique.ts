import { Platform } from 'react-native';

// A wardrobe-only type palette. Lesson typography remains unchanged.
export const boutique = {
  display: Platform.OS === 'android' ? 'serif' : 'Georgia',
  body: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  ink: '#382438', plum: '#533249', velvet: '#75455F', gold: '#B38A48',
  cream: '#FBF4E7', blush: '#EEDFD8', muted: '#76646B',
};
