# World 3 completion: lessons 6–7

## Lesson 6 — Teleporting without travelling (screen 24)

Question: what can teleportation transfer if it cannot send an instant message?

1. Predict whether a particle, a state or a person transfers; any answer reveals feedback.
2. Introduce strange X’s unknown spin state and the helper pair A/B, using the supplied drawings. Entangle A/B in a separate interaction before the Alex/Barb board appears.
3. Tap X/A for Alex’s joint measurement. Cross out both used resources and highlight one of four numbered colour tiles. The four labels correspond to random two-bit outcomes; they are not physical colours of the state.
4. Try B early, then swipe the matching instruction through an ordinary communication channel. Barb must wait for the animated paper to arrive.
5. Apply the matching adjustment. Strange B receives the original spin state; Alex has no spare original copy.
6. State-transfer/no-cloning/no-signalling explanation and one terminology definition.
7. Four-question quiz with mixed answer positions; takeaway under the final answered question; Finish lesson leads to screen 25.

The illustration assumes an ideal spin-qubit teleportation protocol, not a way to handle free strange quarks in a laboratory. It does not display or claim to measure an unknown state’s amplitudes. Applying the correction is an abstract action representing the adjustment specified by the two-bit result; no circuit operations are taught here. One of the four options is the identity (no change). Replay prepares fresh systems and entanglement.

## Lesson 7 — Connections at work (screen 25)

Question: what are quantum connections useful for?

1. Brief retrieval bridge from entanglement and teleportation to a practical use.
2. Send Alex’s readable internet packet to Barb, then repeat the journey with a hacker who can open and read it.
3. Encrypt the message with a secret key. The hacker sees scrambled text, while Barb can decrypt it with the matching key.
4. Discover the key-sharing problem: sending a finished key as an ordinary packet lets the hacker copy it.
5. Prepare many entangled pairs, choose measurement settings, keep compatible trials and form correlated raw bit strings locally. No finished key travels across the network.
6. Let the hacker measure some travelling quantum signals, then reveal and discard a small authenticated public sample. Too many errors means the key is discarded. Ordinary noise, statistical thresholds and authentication are stated explicitly.
7. Five-question World 3 final challenge: joint state, classical correlation, Bell correlations, quantum key distribution and teleportation.
8. Brief completion, shared ripping Q packet and three distinct unowned cosmetics (or the remaining available items), followed by Finish World 3.
9. Tease quantum crowds; do not teach indistinguishability, fermions/bosons or exclusion yet.

All progress remains session-only, matching the prototype. Replaying a world does not award completion XP again. Each newly opened reward packet uses the existing random unowned-accessory policy. Existing static artwork is reused and already in the preload list.

## Scientific guardrails and references

- Teleportation transfers an unknown state using shared entanglement and two classical bits. No intact original-state copy remains at the sender, and receipt of classical information is required: [IBM Quantum, quantum teleportation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation).
- The Bell lesson’s bound of 2 concerns the combined CHSH correlation score, not a single correlation. The local bound includes equality: [IBM Quantum, CHSH game](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/chsh-game).
- QKD establishes key material, not instantaneous messages or automatic security. Noise, implementation assumptions and authentication matter: [NIST, What is quantum cryptography?](https://www.nist.gov/cybersecurity-and-privacy/what-quantum-cryptography).
- Networks can connect quantum devices, distribute entanglement and support distributed sensing: [NIST, applications of quantum networks](https://www.nist.gov/pml/productsservices/quantum-networks-nist/applications-quantum-networks).
- Entanglement can improve some sensing protocols, but not all quantum sensors need it: [NIST, Quantum sensing explained](https://www.nist.gov/quantum-information-science/quantum-sensing-explained).
- Quantum computing is presented as carefully designed operations on qubits with interference and possible entanglement, not as freely reading every branch of a superposition.

## Regression coverage

`tests/world-three-finale.cjs` covers teleportation ordering, delayed message delivery, repeated taps, late animation callbacks after unmount, all four two-bit results, replay reset, the encryption and quantum-key gates, sample checks, quiz isolation, reward ownership and exhaustion, and World 3 Home navigation. `tests/module-three.cjs` checks quiz data and the full World 3 navigation/XP chain. These are logic tests, not substitutes for native device layout and touch testing.

The CJS checks do not replace a phone-sized visual pass. Verify the packet paths, transparent sprite crops, narrow-screen bit strips, sample buttons, quiz transition, three cosmetic reveals and return Home on an Expo device. Physical iOS/Android touch testing remains a separate device check when no simulator is installed.

September 23 refinement verification: all 17 CJS test files and TypeScript checks passed, as did iOS and web exports. A 390 × 844 browser pass checked the short sorter swipe, unclipped inputs, equal-scale Alex/Barb box figures, automatic light travel to the eye, swinging bell and podium layout, teleportation entangling/measurement/early-wait/delivery/adjustment flow, and the repeating recipient/hacker packet scenes. Physical-device touch validation is still separate. The supplied “PAIR 1” image was not among the attachments, so the board uses a plain text badge.
