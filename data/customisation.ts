import { ImageSourcePropType } from 'react-native';

export type ParticleId = 'electron' | 'photon' | 'gluon';
export type AccessoryCategory = 'eyes' | 'face' | 'head';
export type AccessoryId =
  | '3d-glasses'
  | 'black-spectacles'
  | 'deal-with-it-glasses'
  | 'eyebrows'
  | 'heart-eyes'
  | 'heart-glasses'
  | 'red-spectacles'
  | 'third-eye'
  | 'monocle'
  | 'bandage'
  | 'beauty-mark'
  | 'curly-moustache'
  | 'eyelashes'
  | 'flower-paint'
  | 'freckles'
  | 'lightning-scar'
  | 'kawaii-blush'
  | 'lips'
  | 'moustache-and-goatee'
  | 'regular-moustache'
  | 'rosy-blush'
  | 'fedora';
export type EquippedAccessories = Partial<Record<AccessoryCategory, AccessoryId>>;

export type Accessory = {
  id: AccessoryId;
  name: string;
  category: AccessoryCategory;
  source: ImageSourcePropType;
};

export const accessoryCatalog: Accessory[] = [
  { id: '3d-glasses', name: '3D glasses', category: 'eyes', source: require('../assets/accessories/3d-glasses-transparent.png') },
  { id: 'black-spectacles', name: 'Black spectacles', category: 'eyes', source: require('../assets/accessories/black-spectacles-transparent.png') },
  { id: 'deal-with-it-glasses', name: 'Deal-with-it glasses', category: 'eyes', source: require('../assets/accessories/deal-with-it-glasses-transparent.png') },
  { id: 'eyebrows', name: 'Angry brows', category: 'eyes', source: require('../assets/accessories/eyebrows-transparent.png') },
  { id: 'heart-eyes', name: 'Heart eyes', category: 'eyes', source: require('../assets/accessories/heart-eyes-transparent.png') },
  { id: 'heart-glasses', name: 'Heart glasses', category: 'eyes', source: require('../assets/accessories/heart-glasses-transparent.png') },
  { id: 'red-spectacles', name: 'Red spectacles', category: 'eyes', source: require('../assets/accessories/red-spectacles-transparent.png') },
  { id: 'third-eye', name: 'Third eye', category: 'eyes', source: require('../assets/accessories/third-eye-transparent.png') },
  { id: 'monocle', name: 'Monocle', category: 'eyes', source: require('../assets/accessories/monocle-transparent.png') },
  { id: 'bandage', name: 'Bandage', category: 'face', source: require('../assets/accessories/bandage-transparent.png') },
  { id: 'beauty-mark', name: 'Beauty mark', category: 'face', source: require('../assets/accessories/beauty-mark-transparent.png') },
  { id: 'curly-moustache', name: 'Curly moustache', category: 'face', source: require('../assets/accessories/curly-moustache-transparent.png') },
  { id: 'eyelashes', name: 'Eyelashes', category: 'eyes', source: require('../assets/accessories/eyelashes-transparent.png') },
  { id: 'flower-paint', name: 'Flower face paint', category: 'face', source: require('../assets/accessories/flower-paint-transparent.png') },
  { id: 'freckles', name: 'Freckles', category: 'face', source: require('../assets/accessories/freckles-transparent.png') },
  { id: 'lightning-scar', name: 'Lightning scar', category: 'face', source: require('../assets/accessories/lightning-scar-transparent.png') },
  { id: 'kawaii-blush', name: 'Kawaii blush', category: 'face', source: require('../assets/accessories/kawaii-blush-transparent.png') },
  { id: 'lips', name: 'Lips', category: 'face', source: require('../assets/accessories/lips-transparent.png') },
  { id: 'moustache-and-goatee', name: 'Moustache and goatee', category: 'face', source: require('../assets/accessories/moustache-and-goatee-transparent.png') },
  { id: 'regular-moustache', name: 'Moustache', category: 'face', source: require('../assets/accessories/regular-moustache-transparent.png') },
  { id: 'rosy-blush', name: 'Rosy blush', category: 'face', source: require('../assets/accessories/rosy-blush-transparent.png') },
  { id: 'fedora', name: 'Explorer fedora', category: 'head', source: require('../assets/accessories/fedora-transparent.png') },
];

export const starterAccessories = accessoryCatalog.map(item => item.id);

export const particleCatalog: { id: ParticleId; name: string; description: string; source: ImageSourcePropType }[] = [
  { id: 'electron', name: 'Electron', description: 'Fundamental particle', source: require('../assets/particles/electron-avatar.png') },
  { id: 'photon', name: 'Photon', description: 'Particle of light', source: require('../assets/lesson-9/photon-default-transparent.png') },
  { id: 'gluon', name: 'Gluon', description: 'Carrier of the strong interaction', source: require('../assets/module-3/lesson-2/gluon-default-transparent.png') },
];

export function accessoryById(id: AccessoryId) {
  return accessoryCatalog.find(item => item.id === id);
}
