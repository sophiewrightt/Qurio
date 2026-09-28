export const quantisationQuestions = [
  {
    question: 'Does quantisation mean everything in the universe comes only in whole numbers?',
    options: ['Yes', 'No'],
    answer: 'No', explanation: "Quantisation restricts particular properties to allowed values; it does not turn every quantity into a whole number.",
  },
  {
    question: 'Which is the better analogy for a quantised property?',
    options: ['A smooth ramp', 'A staircase'],
    answer: 'A staircase', explanation: "The steps represent allowed values and the gaps represent excluded values. Real steps need not be equally spaced.",
  },
  {
    question: 'What does it mean when a property is quantised?',
    options: ['Only particular values are allowed', 'Every possible value is allowed', 'The value never changes'],
    answer: 'Only particular values are allowed', explanation: "A quantised property can change between allowed values; it need not remain constant.",
  },
];

export const energyLevelQuestions = [
  {
    question: 'An electron bound inside an atom can have…',
    options: ['Any energy it chooses', 'Particular allowed energy levels', 'Only zero energy', 'The same energy forever'],
    answer: 'Particular allowed energy levels', explanation: "A bound electron has specific allowed energies; the lines are not places where it sits.",
  },
  {
    question: 'What is the lowest allowed energy state called?',
    options: ['The ground state', 'The shelf state', 'The zero particle state'],
    answer: 'The ground state', explanation: "Ground means lowest allowed energy, not necessarily zero energy or the bottom of a physical atom.",
  },
  {
    question: 'What can happen when an atom’s electron gains energy?',
    options: ['It can move to a higher allowed level', 'It must sit between two levels', 'All energy levels disappear'],
    answer: 'It can move to a higher allowed level', explanation: "Gaining the appropriate energy can excite an electron to a higher allowed level.",
  },
  {
    question: 'Are the lines in an energy-level diagram real shelves inside an atom?',
    options: ['Yes - electrons rest on them', 'No - they represent allowed energies'],
    answer: 'No - they represent allowed energies', explanation: "The cloud describes possible positions. Energy-level lines describe allowed energies, not shelves in space.",
  },
];

export const placementQuestions = [
  { prompt: 'Is the electron allowed here?', answer: 'Yes', explanation: 'Level 3 is one of the marked energy levels.' },
  { prompt: 'Is the electron allowed here?', answer: 'No', explanation: 'Between the lines is not one of the electron’s energy levels.' },
  { prompt: 'Is the electron allowed here?', answer: 'Yes', explanation: 'Level 1 is an energy level - and it is the ground state.' },
] as const;

export const photonColourQuestions = [
  {
    question: 'When an electron drops to a lower allowed energy level, the atom can…',
    options: ['Emit a photon', 'Destroy the energy', 'Put the electron between two levels'],
    answer: 'Emit a photon',
    explanation: 'An emitted photon carries away the energy the atom loses in this transition.',
  },
  {
    question: 'Which transition can produce the more energetic photon?',
    options: ['Level 2 → Level 1', 'Level 4 → Level 1', 'They must be identical'],
    answer: 'Level 4 → Level 1',
    explanation: 'The larger energy drop releases a photon with more energy.',
  },
  {
    question: 'Within visible light, which photon has more energy?',
    options: ['A red photon', 'A blue-violet photon', 'Colour is unrelated to photon energy'],
    answer: 'A blue-violet photon',
    explanation: 'Within visible light, blue-violet photons have more energy than red photons.',
  },
  {
    question: 'When can an atom absorb an incoming photon?',
    options: ['When its energy matches an allowed jump', 'Whenever the photon is bright', 'Only when the electron is at the highest level'],
    answer: 'When its energy matches an allowed jump',
    explanation: 'For the bound-state transitions in this model, the photon must supply an allowed energy gap.',
  },
  {
    question: 'In this diagram, an atom emits a photon when its electron drops. Where does the photon’s energy come from?',
    options: ['The detector supplies the energy', 'The energy lost by the atom', 'The photon creates new energy'],
    answer: 'The energy lost by the atom',
    explanation: 'Energy is conserved: the photon carries the difference between the atom’s initial and final energies.',
  },
];

export const quantumPossibilityQuestions = [
  {
    question: 'What information does a quantum state provide?',
    options: ['Possible measurement outcomes and their probabilities', 'One guaranteed result for every experiment', 'Only the particle’s colour'],
    answer: 'Possible measurement outcomes and their probabilities', explanation: "The state and the measurement choice determine the probabilities. Some measurements can have a certain outcome.",
  },
  {
    question: 'Can quantum mechanics always predict the exact outcome of the next single experiment?',
    options: ['Yes, with certainty', 'No, it often predicts probabilities instead'],
    answer: 'No, it often predicts probabilities instead', explanation: "Quantum physics can predict probabilities accurately even when several individual outcomes remain possible.",
  },
  {
    question: 'What becomes clearer when an experiment is repeated many times?',
    options: ['The expected distribution of outcomes', 'That every outcome is identical', 'That the quantum state disappears'],
    answer: 'The expected distribution of outcomes', explanation: "Repeated fresh preparations reveal relative frequencies, not a guaranteed sequence of results.",
  },
  {
    question: 'If outcome A has a probability of 75%, must every set of four trials contain exactly three A results?',
    options: ['Yes, every small set must match perfectly', 'No, small sets can vary'],
    answer: 'No, small sets can vary', explanation: "A probability is not a quota: a small group of four can contain more or fewer than three A results.",
  },
  {
    question: 'What does Schrödinger’s equation help physicists describe?',
    options: ['How a quantum state changes over time', 'One guaranteed result for every experiment', 'Only the colour of a particle'],
    answer: 'How a quantum state changes over time', explanation: "Its solution, the wavefunction, lets physicists calculate probabilities for different measurement outcomes.",
  },
];

export const superpositionQuestions = [
  {
    question: 'A basketball is secretly inside Box A before you look. Is that a superposition?',
    options: ['Yes - because we are uncertain', 'No - the ball already has a definite location'],
    answer: 'No - the ball already has a definite location', explanation: "The ball had one definite location. Our lack of knowledge alone does not make a superposition.",
  },
  {
    question: 'What is a superposition?',
    options: ['A quantum state combining different possible states', 'One hidden classical answer', 'Two complete particles glued together'],
    answer: 'A quantum state combining different possible states', explanation: "The alternatives contribute to one quantum state; this is not two complete particles stuck together.",
  },
  {
    question: 'What does one measurement of an A & B superposition record?',
    options: ['One allowed outcome: A or B', 'Half an A and half a B', 'Every possible result at once'],
    answer: 'One allowed outcome: A or B', explanation: "An A-or-B measurement records one outcome, even when both alternatives contribute to the prepared state.",
  },
  {
    question: 'What shows that both paths contributed to the quantum state, rather than this being ordinary uncertainty about a hidden A-or-B answer?',
    options: ['Its parts can create interference', 'Its label uses two letters', 'It always gives equal probabilities'],
    answer: 'Its parts can create interference', explanation: "The alternating interference bands appear when the two path contributions reinforce or cancel. Simply adding the separate one-slit results does not create those bands.",
  },
];

export const measurementQuestions = [
  {
    question: 'What is quantum state collapse?',
    options: ['The change from several possible outcomes in a state to one recorded result', 'The electron falling through the detector', 'Every possible result being recorded at once'],
    answer: 'The change from several possible outcomes in a state to one recorded result', explanation: "Collapse is the name often used when measurement produces one recorded outcome from the possibilities described by the state.",
  },
  {
    question: 'What is the difference between a quantum state and a measurement outcome?',
    options: ['The state predicts possibilities; the outcome is one recorded result', 'They are two names for the same thing', 'The state is always A and the outcome is always B'],
    answer: 'The state predicts possibilities; the outcome is one recorded result', explanation: "A prediction describes possible results; a detector record is the particular result obtained in one run.",
  },
  {
    question: 'A state predicts 70% A and 30% B. Can we know the next single result with certainty?',
    options: ['Yes - it must be A', 'No - either allowed result could occur'],
    answer: 'No - either allowed result could occur', explanation: "More likely does not mean certain. A 30% outcome can still occur next.",
  },
  {
    question: 'What do many repeated preparations and measurements reveal?',
    options: ['A long-run distribution close to the predicted probabilities', 'A guaranteed repeating order', 'That every result becomes A'],
    answer: 'A long-run distribution close to the predicted probabilities', explanation: "Long-run proportions tend towards the probabilities, but finite runs fluctuate.",
  },
  {
    question: 'In the spinning-coin analogy, what does slapping the coin down represent?',
    options: ['A measurement recording one result', 'Creating more possible outcomes', 'Changing an electron into a coin'],
    answer: 'A measurement recording one result', explanation: "The analogy contrasts several possibilities before measurement with the one result that is recorded afterwards.",
  },
];

export const spinQuestions = [
  {
    question: 'What does quantum spin describe?',
    options: ['An intrinsic property of a particle', 'A tiny ball physically rotating', 'The speed of an electron around an atom'],
    answer: 'An intrinsic property of a particle', explanation: "Intrinsic means built-in. Quantum spin is not a particle physically spinning like a ball.",
  },
  {
    question: 'When spin is measured along a chosen direction, what outcomes can a spin-½ particle give?',
    options: ['Any angle at all', 'Spin up or spin down along that direction', 'Only spin up'],
    answer: 'Spin up or spin down along that direction', explanation: "Up and down are relative to the measurement direction, not fixed directions in the room.",
  },
  {
    question: 'Particles are prepared spin up vertically, then measured vertically. What happens in the ideal experiment?',
    options: ['Every result is spin down', 'The results must be half up and half down', 'Every result is spin up'],
    answer: 'Every result is spin up', explanation: "In an ideal same-direction measurement of this prepared state, the up result has probability one.",
  },
  {
    question: 'Why did the ordinary arrow pass through decimals while the spin sorter produced only two groups?',
    options: ['The electron had no properties', 'The ordinary arrow was continuous, but the spin result was quantised', 'The sorter rounded every result by accident'],
    answer: 'The ordinary arrow was continuous, but the spin result was quantised', explanation: "The arrow can point through continuous intermediate directions. Along one chosen measurement direction, electron spin gives only up or down.",
  },
];

export const schrodingerCatQuestions = [
  {
    question: "Why did Schrödinger imagine the cat experiment?",
    options: ['To show how strange it is to extend a quantum superposition to an everyday object', 'To prove cats are quantum particles', 'To design a new kind of pet carrier'],
    answer: 'To show how strange it is to extend a quantum superposition to an everyday object', explanation: "Schrödinger used the thought experiment to expose a difficult question about where the quantum description stops applying.",
  },
  {
    question: 'In the original thought experiment, what triggers the detector?',
    options: ['A person thinking about the box', 'A radioactive atom decaying', 'The cat pressing a button'],
    answer: 'A radioactive atom decaying', explanation: "The imagined apparatus connects a random radioactive decay to a detector and then to the larger mechanism.",
  },
  {
    question: 'Does a quantum measurement require a conscious person?',
    options: ['Yes - a person must watch', 'Only if the box is closed', 'No - a physical interaction can leave a record'],
    answer: 'No - a physical interaction can leave a record', explanation: "A detector can become correlated with a system and leave a physical record without anyone watching it happen.",
  },
  {
    question: 'Why do we not normally see cat-sized superpositions?',
    options: ['Large objects interact constantly with their environment, causing very rapid decoherence', 'Cats are not made of particles', 'Quantum physics switches off inside boxes'],
    answer: 'Large objects interact constantly with their environment, causing very rapid decoherence', explanation: "Those many uncontrolled interactions destroy the observable interference that would reveal a coherent superposition.",
  },
];

export const quantumRulesChallengeQuestions = [
  {
    question: 'A bound electron can occupy one allowed energy level or another, but not a value between them. Which rule is this?',
    options: ['Superposition', 'Quantisation', 'Measurement'],
    answer: 'Quantisation', explanation: "Quantisation means a property has particular allowed values rather than every value in between.",
  },
  {
    question: 'An atom releases light after an electron drops to a lower energy level. What happened?',
    options: ['Quantum probability', 'The energy vanished', 'Photon emission'],
    answer: 'Photon emission', explanation: "The emitted photon carries energy lost by the atom.",
  },
  {
    question: 'A quantum state contains contributions from two possible states. What is this called?',
    options: ['Quantisation', 'Superposition', 'Measurement'],
    answer: 'Superposition', explanation: "Superposition combines alternatives in one state; it is not merely uncertainty about a hidden classical answer.",
  },
  {
    question: 'Identically prepared particles give different individual results but predictable overall statistics. Which idea is at work?',
    options: ['Quantum probability', 'Photon absorption', 'Classical certainty'],
    answer: 'Quantum probability', explanation: "The individual result varies, while long-run proportions follow the prepared state’s probabilities.",
  },
  {
    question: 'A detector records one particular result. What has occurred?',
    options: ['Superposition', 'An energy level', 'Measurement'],
    answer: 'Measurement', explanation: "Measurement is a physical interaction that records an outcome; consciousness is not required.",
  },
];
