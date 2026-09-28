# Latest UI update

See `UI_EXPANSION.md`: curriculum rewards now say chapters; Realm 1 contains four chapters. Special packet JPGs are framed with host-colour paper blending to remove visible white rectangles (white offer cards and cream reward modal); originals remain unchanged, not alpha PNGs.

# Boutique and Q-market

## Implemented prototype

- Wardrobe screen `10` uses the regular Schoolbell / PatrickHand crayon fonts, plum curtains, a gilded arch mirror, blush rug and gold-trimmed drawers. The heading is “Qurio Boutique” with “Dress up your particle” below. The companion name is edited only on Home, not repeated in the wardrobe. Normalized particle/accessory alignment is unchanged. Scenery and furniture are code-native, not generated raster artwork.
- The top-right bag icon and **Shop** action open screen `34`. Back returns to the wardrobe without changing the companion's name or equipped items.
- Standard Q accessory packets cost **100 Quanta** and make three independent draws with replacement. Owned items and repeats inside one packet are possible. Collection completion no longer stops packet purchases or World 3's reward.
- Purchase debits are recorded once in App session state, separately from earned Quanta. Purchase IDs, captured-state checks and a single pending packet prevent repeat charges/rerolls. Contents are fixed at purchase. Pending packets do not reserve items from other reward pools.
- The opening screen appears immediately after purchase. Open later retains the paid packet for the current session. Only the actual rip unlocks items and increments the achievement packet counter, once. Opened results can be revisited until dismissed.
- The latest rarity list supersedes the earlier all-Common placeholder. `data/shop.ts` assigns the matching existing artwork: Rare (heart eyes, lips, regular moustache), Ultra Rare (third eye, monocle, curly moustache, flower face paint), Legendary (deal-with-it glasses, kawaii blush); remaining artwork is Common. Monocle and eyelashes now belong to Eyes. Legacy 3D glasses, beauty mark and fedora were not specified and provisionally remain Common.
- Rare / Ultra Rare / Legendary cost **200 / 350 / 500 Quanta**, granting exactly one item of that rarity, including owned items. They are enabled when matching artwork exists. The repeated “Ultra rare - 500” in the user's prices was interpreted as Legendary and communicated to the user.
- Six original packet scans are copied unchanged into `assets/shop/`. `ShopArtwork` frames their subjects at runtime; the intact and torn artwork are preloaded in every world. They are used by the shared `RewardPack` when that packet kind becomes available.
- `drawAccessories` is shared by standard shop, lesson and bonus packets. It first draws a rarity, then uniformly selects an item within it. The user approved **Common 70%, Rare 20%, Ultra Rare 8%, Legendary 2% per item** as the initial playtest balance. The prototype shop intentionally hides the odds/details UI and gives a simple three-accessory offer plus a repeats note. The underlying probabilities are unchanged; paid-launch odds disclosure remains a production checkpoint. Three independent draws give a 65.7% chance of at least one non-Common and a 5.8808% chance of at least one Legendary; neither is a guarantee. Weights must be finite, nonnegative, total 100, and have artwork in every positive-weight pool. Ownership never changes odds.
- Reveal cards are grouped Common → Rare → Ultra Rare → Legendary, with yellow / light-pink / light-blue / purple tints and readable labelled colour chips beside the category. Accessory previews use 112×112 clipped frames with visible-subject bounds from `data/accessoryPreview.ts`, rather than shrinking the full padded canvas. Original images and worn alignment are unchanged. Duplicate text is exactly `(You already have this)`. Opening-time flags include earlier draws in the same packet; purchased results retain them across navigation. Inventory remains a unique set; no duplicate refunds or extra rewards were added.
- Wardrobe's **Creator preview** is a local prototype toggle, not an authenticated role. It exposes every available accessory and particle for try-on using isolated local equipment state. Turning it off or leaving restores actual equipment; it never grants ownership, Quanta or achievements. The local Tester entry enables it; Guest does not. Replace this prototype mode with a verified creator role before learner release.

## Artwork still needed from the supplied rarity list

These names are retained here, not added as invisible/unrenderable packet rewards. Current catalogue has only 22 accessory sprites.

- Head / Common: Baseball cap, Simple crown, Witch hat, “Brown and headband” (name needs clarification), Flower crown, Evil horns.
- Head / Rare: Halo, Curly hair, Propeller hat, Tiara.
- Head / Ultra Rare: Mushroom hat (confirmed), Alex’s beret, Wizard hat.
- Head / Legendary: Gem crown, Pink bob.
- Mushroom hat's earlier duplicate listing is resolved: **Ultra Rare**, not Rare. Artwork is still needed before it can enter the reward pool.
- Eyes / Common: Retro glasses, Yellow shade glasses, Aviators, Sunglasses, “Clour goggles” (name/art mapping needs clarification).
- Eyes / Rare: Star glasses, Chic glasses, Peace glasses.
- Eyes / Ultra Rare: Retro shades.
- Eyes / Legendary: Dame glasses.

Existing artwork mappings: Angry brows → eyebrows; Bandaid → bandage; Harry scar → lightning scar; Big lips → lips; Goatee combo → moustache-and-goatee; Flower paint → flower-paint; Regular moustache → regular-moustache. Do not assume 3D glasses are colour goggles or invent sprites for absent designs.

## Real-money purchases: deliberately unavailable

The section reads **Support us by getting quanta**, with the supplied pile, bucket, chest and vault illustrations, copied unchanged into `assets/shop/` and framed/blended at runtime. The 1,000 bundle is “Vault of quanta”. This section retains system typography, while all Quanta packet shopping uses crayon fonts. Special packet cards show their supplied art and price without redundant rarity headings. It has no checkout handler, network purchase request, or pretend currency grant.

| Quanta | Proposed AUD price | Status |
| --- | --- | --- |
| 100 | A$1.50 | User's planned price |
| 300 | A$2.99 | User's planned price |
| 500 | A$4.49 | Recommendation, not confirmed |
| 1,000 | A$7.99 | Recommendation, not confirmed |

The larger recommendations cost about A$0.90 and A$0.80 per 100 Quanta, versus about A$1.00 for the 300 bundle. These are design proposals, not researched market-optimal prices or published store products. Store-supported prices must be checked in App Store Connect / Play Console, and live UI must use the store's localized price, not these strings.

`PurchaseThankYouModal` is prepared with **Thank you! Your support means a lot.** It is intentionally not wired to a fake success path. Future billing must show it only after transaction verification and idempotent wallet credit.

Before enabling payments: implement accounts/persistence and a server-authoritative wallet/inventory ledger, platform consumable products, receipt verification and replay protection, pending/cancelled/refunded purchase handling, and platform-appropriate recovery. Review paid-random-item rules, age/classification and child/parent purchasing requirements for the intended audience and Australian launch. Do not use session state for paid balances.

Official references checked during implementation:

- [Apple In-App Purchase pricing](https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/set-a-price-for-an-in-app-purchase): choose supported price points; configure a base country and storefront pricing.
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/): 3.1.1 covers digital in-app purchases and prior disclosure of randomized virtual-item odds. Final billing/platform compliance still requires review; this prototype does not implement it.

## Verification

Latest presentation checks: `tests/shop-presentation.cjs` covers the simplified copy, supplied/preloaded artwork, centred companion, claimed reward hiding and unchanged disabled IAP. Full CJS suite and TypeScript pass. A temporary, isolated real-component preview was checked at 390×844 and 320×740 for Home/greeting, boutique, packet cards and all four paid-bundle illustrations, then removed. The user's existing session was not reloaded.

`tests/shop.cjs` covers prices, exact-rarity selection, insufficient funds, empty pools, double taps, stale packet IDs, fixed contents across navigation, duplicate-capable inventory updates, one-time openings, and disabled real-money checkout. `tests/accessory-rarities.cjs` checks mapping, weighted boundaries, invalid configurations, replacement draws, duplicate snapshots, grouping, enlarged previews and creator-preview isolation. `tests/avatar-wardrobe.cjs` preserves normal drawer/cycling/skin invariants. Native export is build validation, not an on-device IAP test.

Rarity update verification: typecheck and all test scripts passed; web/iOS exports succeeded. Browser QA at 390×844 and 320×740 verified prototype preview isolation, rarity labels (before the later simplified storefront), a real session-Quanta packet debit/rip, enlarged subject framing and narrow-modal scrolling. Duplicate outcomes and resumed labels are deterministic harness checks, not forced browser randomness. Viewport override reset after QA.
