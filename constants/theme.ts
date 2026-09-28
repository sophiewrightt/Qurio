export const colors = {
  background: '#F8F3E8',
  surface: '#FFFDF7',
  ink: '#21302C',
  muted: '#68746F',
  primary: '#6D57D9',
  primaryDark: '#4E3CB2',
  coral: '#EF765F',
  mint: '#82CDB5',
  yellow: '#F5C85B',
  blue: '#75B8E8',
  green: '#4CA57F',
  red: '#D85F57',
  border: '#D8D2C4',
  track: '#E5DFD3',
  white: '#FFFFFF',
  overlay: 'rgba(25, 30, 29, 0.68)',
} as const;

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radii = { sm: 12, md: 18, lg: 26, pill: 999 } as const;
export const type = { tiny: 12, small: 14, body: 17, h3: 21, h2: 28, h1: 38, hero: 46 } as const;
export const fonts = { display: 'Schoolbell_400Regular', body: 'PatrickHand_400Regular' } as const;

export const shadow = {
  shadowColor: '#21302C', shadowOffset: { width: 4, height: 5 }, shadowOpacity: 0.2,
  shadowRadius: 0, elevation: 3,
};
