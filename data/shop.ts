import type { Accessory, AccessoryId } from './customisation';

export type PacketKind = 'standard' | 'rare' | 'ultra-rare' | 'legendary';
export type Rarity = 'common' | Exclude<PacketKind, 'standard'>;
// Unlisted legacy artwork remains Common until the artist assigns it.
export const accessoryRarities: Partial<Record<AccessoryId, Rarity>> = {
  'deal-with-it-glasses': 'legendary', 'heart-eyes': 'rare', 'third-eye': 'ultra-rare',
  monocle: 'ultra-rare', 'curly-moustache': 'ultra-rare', 'flower-paint': 'ultra-rare',
  'kawaii-blush': 'legendary', lips: 'rare', 'regular-moustache': 'rare',
};
export const rarityOrder: Rarity[] = ['common', 'rare', 'ultra-rare', 'legendary'];
export const rarityStyles: Record<Rarity, { label: string; color: string; background: string; ink: string }> = {
  common: { label: 'Common', color: '#F3CE45', background: '#FFF6CC', ink: '#715700' },
  rare: { label: 'Rare', color: '#F4B7D5', background: '#FDEAF3', ink: '#8B315D' },
  'ultra-rare': { label: 'Ultra Rare', color: '#9DDAF5', background: '#E5F5FD', ink: '#235F80' },
  legendary: { label: 'Legendary', color: '#A477DC', background: '#EFE4FC', ink: '#653598' },
};
export type RarityOdds = Record<Rarity, number>;
// Approved initial playtest balance, per independent item draw.
export const standardRarityOdds: RarityOdds | null = { common: 70, rare: 20, 'ultra-rare': 8, legendary: 2 };
export function rarityOf(id: AccessoryId, rarities = accessoryRarities): Rarity { return rarities[id] ?? 'common'; }
export function effectiveRarityOdds(catalog: Accessory[], odds: RarityOdds | null = standardRarityOdds, rarities = accessoryRarities): RarityOdds {
  if (odds) {
    if (rarityOrder.some(rarity => !Number.isFinite(odds[rarity]) || odds[rarity] < 0) || Math.abs(rarityOrder.reduce((sum, rarity) => sum + odds[rarity], 0) - 100) > 0.000001) throw new Error('Rarity odds must total 100%.');
    if (rarityOrder.some(rarity => odds[rarity] > 0 && !catalog.some(item => rarityOf(item.id, rarities) === rarity))) throw new Error('A weighted rarity has no artwork.');
    return odds;
  }
  return Object.fromEntries(rarityOrder.map(rarity => [rarity, catalog.length ? 100 * catalog.filter(item => rarityOf(item.id, rarities) === rarity).length / catalog.length : 0])) as RarityOdds;
}
/** Independent draws with replacement: ownership never changes the odds. */
export function drawAccessories(catalog: Accessory[], count = 3, random = Math.random, kind: PacketKind = 'standard', odds: RarityOdds | null = standardRarityOdds, rarities = accessoryRarities): Accessory[] {
  if (!catalog.length) return [];
  const weights = kind === 'standard' ? effectiveRarityOdds(catalog, odds, rarities) : null;
  const results: Accessory[] = [];
  for (let index = 0; index < count; index++) {
    let rarity: Rarity = kind === 'standard' ? 'common' : kind;
    if (weights) {
      let roll = Math.min(1 - Number.EPSILON, Math.max(0, random())) * 100;
      for (const candidate of rarityOrder) {
        if (roll < weights[candidate]) { rarity = candidate; break; }
        roll -= weights[candidate];
      }
    }
    const pool = catalog.filter(item => rarityOf(item.id, rarities) === rarity);
    if (!pool.length) return [];
    results.push(pool[Math.min(pool.length - 1, Math.floor(Math.max(0, random()) * pool.length))]!);
  }
  return results;
}
export function duplicateRewards(rewards: AccessoryId[], owned: AccessoryId[]): boolean[] {
  const seen = new Set(owned);
  return rewards.map(id => { const duplicate = seen.has(id); seen.add(id); return duplicate; });
}
export const packetOffers: { kind: PacketKind; name: string; price: number; count: number }[] = [
  { kind: 'standard', name: 'Q accessory packet', price: 100, count: 3 },
  { kind: 'rare', name: 'Rare', price: 200, count: 1 },
  { kind: 'ultra-rare', name: 'Ultra Rare', price: 350, count: 1 },
  { kind: 'legendary', name: 'Legendary', price: 500, count: 1 },
];
export const quantaBundles = [
  { amount: 100, name: 'Pile of quanta', price: 'A$1.50', proposed: false },
  { amount: 300, name: 'Bucket of quanta', price: 'A$2.99', proposed: false },
  { amount: 500, name: 'Chest of quanta', price: 'A$4.49', proposed: true },
  { amount: 1000, name: 'Vault of quanta', price: 'A$7.99', proposed: true },
] as const;
export type PurchasedPacket = { id: number; kind: PacketKind; rewards: AccessoryId[]; opened: boolean; duplicates?: boolean[] };
export type ShopState = { spent: number; nextId: number; packet?: PurchasedPacket };
export const initialShop: ShopState = { spent: 0, nextId: 1 };

export function eligibleAccessories(kind: PacketKind, catalog: Accessory[], owned: AccessoryId[], rarities = accessoryRarities) {
  return catalog.filter(item => kind === 'standard' || rarityOf(item.id, rarities) === kind);
}

export function buyPacket(state: ShopState, kind: PacketKind, earnedQuanta: number, catalog: Accessory[], owned: AccessoryId[], random = Math.random, rarities = accessoryRarities): ShopState {
  const offer = packetOffers.find(item => item.kind === kind);
  if (!offer || state.packet || earnedQuanta - state.spent < offer.price) return state;
  const pool = eligibleAccessories(kind, catalog, owned, rarities);
  if (!pool.length) return state;
  const rewards = drawAccessories(catalog, offer.count, random, kind, standardRarityOdds, rarities);
  if (!rewards.length) return state;
  return { spent: state.spent + offer.price, nextId: state.nextId + 1,
    packet: { id: state.nextId, kind, rewards: rewards.map(item => item.id), opened: false } };
}
export function ripPacket(state: ShopState, id: number, owned: AccessoryId[] = []): ShopState {
  if (!state.packet || state.packet.id !== id || state.packet.opened) return state;
  return { ...state, packet: { ...state.packet, opened: true, duplicates: duplicateRewards(state.packet.rewards, owned) } };
}
export function finishPacket(state: ShopState, id: number): ShopState {
  if (state.packet?.id !== id || !state.packet.opened) return state;
  return { ...state, packet: undefined };
}
