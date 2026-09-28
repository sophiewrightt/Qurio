import type { AccessoryId } from './customisation';

// Visible alpha bounds in the canonical 460px wardrobe canvases. Reward cards
// frame these originals in a clipped view; avatar overlays remain untouched.
const bounds: Record<AccessoryId, [number, number, number, number]> = {
  '3d-glasses': [115, 237, 222, 55], bandage: [281, 285, 60, 42],
  'beauty-mark': [255, 285, 6, 7], 'black-spectacles': [123, 218, 201, 85],
  'curly-moustache': [152, 275, 147, 37], 'deal-with-it-glasses': [133, 252, 180, 34],
  eyebrows: [154, 226, 140, 20], eyelashes: [136, 244, 171, 25],
  fedora: [56, 54, 345, 177], 'flower-paint': [106, 253, 249, 57],
  freckles: [132, 280, 191, 24], 'heart-eyes': [148, 256, 144, 18],
  'heart-glasses': [122, 229, 212, 74], 'kawaii-blush': [116, 275, 226, 28],
  'lightning-scar': [212, 159, 28, 58], lips: [199, 285, 56, 30],
  monocle: [245, 237, 115, 76], 'moustache-and-goatee': [201, 279, 52, 68],
  'red-spectacles': [124, 217, 202, 84], 'regular-moustache': [182, 278, 82, 26],
  'rosy-blush': [99, 256, 250, 78], 'third-eye': [209, 216, 28, 25],
};
export function accessoryPreviewStyle(id: AccessoryId) {
  const [x, y, width, height] = bounds[id];
  const scale = Math.min(92 / width, 86 / height, 2);
  return { position: 'absolute' as const, width: 460 * scale, height: 460 * scale,
    left: 56 - (x + width / 2) * scale, top: 56 - (y + height / 2) * scale };
}
