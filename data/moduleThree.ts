export const strangeSpinQuestions = [
  {
    question: 'Are photons, electrons and strange quarks all elementary particles?',
    options: ['Only photons and electrons are elementary', 'Yes, all three are elementary particles', 'Only strange quarks are elementary'],
    answer: 'Yes, all three are elementary particles', explanation: 'They have different properties and behaviours, but photons, electrons and strange quarks are all classified as elementary particles.',
  },
  {
    question: 'What does quantum spin describe?',
    options: ['How fast a tiny particle physically rotates', 'The colour of the particle', 'A built-in quantum property'],
    answer: 'A built-in quantum property', explanation: 'Spin is intrinsic to the particle. The name does not mean the particle is a tiny ball literally rotating.',
  },
  {
    question: 'The measurement direction is vertical. Is ↑ a valid spin result?',
    options: ['Yes', 'No, only ← is valid', 'No, vertical measurements have decimal results'],
    answer: 'Yes', explanation: 'A vertical spin measurement can give up ↑ or down ↓.',
  },
  {
    question: 'The measurement direction is vertical. Is → a valid spin result?',
    options: ['Yes, every arrow direction is allowed', 'No. → is horizontal, not vertical', 'Only if the particle is a photon'],
    answer: 'No. → is horizontal, not vertical', explanation: 'For the vertical axis, the two allowed results point along that axis: ↑ or ↓.',
  },
  {
    question: 'The measurement direction is horizontal. Is ← a valid spin result?',
    options: ['No, only ↑ is allowed', 'No, ← is an in-between result', 'Yes'],
    answer: 'Yes', explanation: 'A horizontal measurement can give left ← or right →.',
  },
  {
    question: 'The measurement direction is horizontal. Is ↗︎ a valid spin result?',
    options: ['No. ↗︎ is diagonal, not horizontal', 'Yes, because it points partly right', 'Yes, but only halfway'],
    answer: 'No. ↗︎ is diagonal, not horizontal', explanation: 'The result must point along the chosen horizontal axis, so the allowed arrows are ← and →.',
  },
  {
    question: 'The chosen measurement axis runs ↗︎ to ↙︎. Is ↙︎ a valid result?',
    options: ['No, diagonal measurements are impossible', 'Yes', 'No, only ↑ and ↓ ever count'],
    answer: 'Yes', explanation: 'A diagonal axis also has two opposite results. For this axis, ↗︎ and ↙︎ are the allowed pair.',
  },
  {
    question: 'How many results can a spin-½ measurement give along one chosen direction?',
    options: ['Every direction between 0 and 1', 'Three', 'Two'],
    answer: 'Two', explanation: 'Choosing a different axis changes which opposite directions label the results, but each chosen axis still gives two outcomes.',
  },
];

export const jointQuantumStateQuestions = [
  {
    question: 'Two particles are independent. What does that mean?',
    options: ['They must give opposite results', 'They share one guaranteed result', 'Knowing A’s result does not tell us B’s result'],
    answer: 'Knowing A’s result does not tell us B’s result', explanation: "For independent preparations, learning A’s outcome does not change the probabilities for B.",
  },
  {
    question: 'For the connected pair in this lesson, which vertical spin pairs appeared?',
    options: ['A up with B down, or A down with B up', 'Only A up with B up', 'Every pair except the opposite results'],
    answer: 'A up with B down, or A down with B up', explanation: "This ideal preparation gives opposite results along the tested vertical direction. The two same-direction rows stay at zero.",
  },
  {
    question: 'What does it mean for A and B to be correlated here?',
    options: ['A gains a third spin result', 'Knowing A’s result tells us B’s result', 'The particles are tied together by a physical string'],
    answer: 'Knowing A’s result tells us B’s result', explanation: "The results have a relationship. In this preparation, knowing one result tells you that the other must be opposite.",
  },
  {
    question: 'What is entanglement?',
    options: ['A physical cord joining two particles', 'Any two particles placed close together', 'A shared quantum state that cannot be fully described as separate independent states'],
    answer: 'A shared quantum state that cannot be fully described as separate independent states', explanation: "Entanglement is a joint quantum state. Its correlations are not a telepathic signal, and opposite results along one direction alone are not enough to prove entanglement experimentally.",
  },
];

export const connectedOutcomesQuestions = [
  {
    question: 'Why does opening Box A tell us which sock is in Box B?',
    options: ['Opening A changes the sock inside B', 'The socks were arranged before either box was opened', 'Each box contains both socks'],
    answer: 'The socks were arranged before either box was opened', explanation: 'The socks carried pre-arranged classical answers. Opening A revealed information, but did not change B.',
  },
  {
    question: 'Before either entangled box is opened, which description fits the strange-quark pair?',
    options: ['Each quark carries a fixed vertical arrow', 'Alex can choose which result appears', 'The pair has one joint state, while neither quark has its own definite vertical result'],
    answer: 'The pair has one joint state, while neither quark has its own definite vertical result', explanation: 'The entangled pair is described by one joint quantum state. Unlike the socks, the lesson does not begin with two fixed vertical results packed into the boxes.',
  },
  {
    question: 'Alex records spin up. What will Barb record when measuring along the same vertical direction?',
    options: ['Spin down', 'Spin up', 'A message chosen by Alex'],
    answer: 'Spin down', explanation: 'This entangled preparation gives opposite results along matching directions. Alex cannot choose the random result, so this cannot carry a chosen instant message.',
  },
  {
    question: 'What does the hidden-variables theory propose here?',
    options: ['The two stranges become physically joined', 'Each strange may carry a private answer sheet', 'Alex can choose both measurement results'],
    answer: 'Each strange may carry a private answer sheet', explanation: 'The theory proposes that each strange carries hidden information telling it which result to give. The next lesson asks how we can test that idea.',
  },
];

export const entanglementQuestions = [
  {
    question: 'In the Photon-2000 model, what happens when Alice and Bob use the same detector direction?',
    options: ['They always record the same result', 'A third polarization result appears', 'They record opposite results'],
    answer: 'They record opposite results', explanation: "This particular entangled preparation gives opposite results in matching detector bases; that is not a rule for every entangled state.",
  },
  {
    question: 'Why do Alice and Bob turn their detectors?',
    options: ['To ask the polarization question along different directions', 'To create a third polarization outcome', 'To change the photons’ energy'],
    answer: 'To ask the polarization question along different directions', explanation: "Rotating a detector changes the two polarization alternatives it distinguishes, not the photon’s energy.",
  },
  {
    question: "What does Bell's theorem tell us?",
    options: ['Every particle carries a complete secret answer sheet', 'Some quantum correlations are too strong to come from local pre-written answers', 'Entangled particles must always have identical outcomes'],
    answer: 'Some quantum correlations are too strong to come from local pre-written answers', explanation: "Bell tests compare carefully chosen setting combinations, assuming local answers and independent setting choices. A single opposite pair is not enough.",
  },
  {
    question: 'Can Alice use entanglement to send Bob a chosen message instantly?',
    options: ['Yes, whenever Alice records vertical polarization', 'Yes, if their detectors point the same way', 'No-each individual result is still unpredictable'],
    answer: 'No-each individual result is still unpredictable', explanation: "For this pair, Alice cannot choose her outcome, and Bob’s local record does not reveal her chosen message.",
  },
];

export const telepathyQuestions = [
  {
    question: 'Alex is 10 million light-years away. How long would the fastest ordinary signal need to reach Barb?',
    options: ['One second', 'At least 10 million years', 'Ten years'],
    answer: 'At least 10 million years', explanation: 'A light-year is the distance light travels in one year. Crossing 10 million light-years takes light at least 10 million years.',
  },
  {
    question: 'Alex records spin up. What does Barb record when she opens her box along the same vertical direction?',
    options: ['Spin up', 'The two results must match', 'Spin down'],
    answer: 'Spin down', explanation: 'This entangled preparation gives opposite results when both boxes are measured along the same direction.',
  },
  {
    question: 'What mystery does the distant-box experiment leave us with?',
    options: ['Whether quantum information can travel faster than light', 'Whether spaceships can carry cardboard boxes', 'Whether light has a speed limit'],
    answer: 'Whether quantum information can travel faster than light', explanation: 'The results line up far sooner than a light-speed signal could cross the distance. The next lesson investigates what that does and does not mean.',
  },
  {
    question: 'At this point, what is the hidden-variables idea?',
    options: ['A proven explanation of entanglement', 'A theory that the particles carry pre-written answers', 'A way to make light travel instantly'],
    answer: 'A theory that the particles carry pre-written answers', explanation: 'It is one possible theory, not a conclusion. Later experiments will test whether local pre-written answers can explain the full pattern.',
  },
];

export const noSignallingQuestions = [
  {
    question: 'What does a Bell inequality give to a local pre-written-answer theory?',
    options: ['A way to send an instant message', 'A maximum limit on its correlations', 'A guarantee that every result is spin up'],
    answer: 'A maximum limit on its correlations', explanation: 'Bell showed that local hidden-answer models cannot produce correlations stronger than this limit.',
  },
  {
    question: 'What have Bell tests found?',
    options: ['The sock model always works', 'Entanglement disappears over distance', 'Quantum correlations can violate the Bell limit'],
    answer: 'Quantum correlations can violate the Bell limit', explanation: 'Experiments using several measurement settings find the stronger pattern predicted by quantum mechanics.',
  },
  {
    question: 'Do Bell-test violations let someone choose and send a faster-than-light message?',
    options: ['No, each local result is still random', 'Yes, by choosing spin up', 'Only if the particles are ten million light-years apart'],
    answer: 'No, each local result is still random', explanation: 'The correlation appears after records are compared, but neither person controls the outcome they record.',
  },
  {
    question: 'Which pair of ideas cannot both explain every Bell-test result under the standard assumptions?',
    options: ['Energy and momentum', 'Locality and pre-existing local answers', 'Space and time'],
    answer: 'Locality and pre-existing local answers', explanation: 'The experiments rule out the whole local pre-written-answer package, while interpretations differ about what to give up.',
  },
];

export const teleportationQuestions = [
  {
    question: 'What is transferred in quantum teleportation?',
    options: ['The original particle itself', 'A quantum state', 'A person'],
    answer: 'A quantum state', explanation: "Strange B receives X’s original state. Strange X itself does not travel to Barb.",
  },
  {
    question: 'What does Alex need to send Barb after measuring X and A together?',
    options: ['The original particle', 'A perfect copy of the unknown state', 'His two-bit result through an ordinary communication channel'],
    answer: 'His two-bit result through an ordinary communication channel', explanation: "The two-bit result tells Barb which random scramble to undo on B. It does not reveal what X’s unknown state is.",
  },
  {
    question: 'Does this leave Alex with a spare copy of X’s original unknown state?',
    options: ['No - the original state is not preserved at Alex’s end', 'Yes - teleportation makes two identical copies', 'Only if Barb is far away'],
    answer: 'No - the original state is not preserved at Alex’s end', explanation: "Alex’s joint measurement uses X’s original state and the shared entanglement. It leaves no spare original-state copy.",
  },
  {
    question: 'Why can’t teleportation send information faster than light?',
    options: ['The particles are too heavy', 'Barb needs Alex’s ordinary message to complete the transfer', 'Entanglement only works nearby'],
    answer: 'Barb needs Alex’s ordinary message to complete the transfer', explanation: "Shared entanglement alone is not enough. Barb needs the ordinary two-bit instruction message.",
  },
];

export const quantumConnectionsFinalQuestions = [
  {
    question: 'What is spin?',
    options: ['A particle physically turning like a tiny ball', 'An intrinsic quantum property', 'The speed at which a particle travels'],
    answer: 'An intrinsic quantum property', explanation: 'Spin is built into the particle. Along one chosen direction, our strange-quark measurements give two allowed outcomes.',
  },
  {
    question: 'Can Alex use his entangled quark to send Barb an instant message?',
    options: ['Yes, by choosing his result', 'Yes, if the quarks are far enough apart', 'No, Barb’s local results are random'],
    answer: 'No, Barb’s local results are random', explanation: 'Alex cannot choose his random measurement outcome. Barb only sees the correlations after they compare records through an ordinary channel.',
  },
  {
    question: 'What does a joint quantum state describe?',
    options: ['Only the heavier particle', 'A secret message between particles', 'The combined quantum system'],
    answer: 'The combined quantum system', explanation: "The pair is described as one combined system, including relationships between its outcomes.",
  },
  {
    question: 'Why isn’t finding opposite results enough to prove entanglement?',
    options: ['An ordinary pre-arranged pair can also give opposite results', 'Entanglement never gives opposite results', 'Measurements always change distant objects'],
    answer: 'An ordinary pre-arranged pair can also give opposite results', explanation: "The socks already demonstrate opposite results from an ordinary arrangement; more settings must be tested.",
  },
  {
    question: 'What makes Bell-test correlations remarkable?',
    options: ['They let us choose every result', 'Across different measurement settings, they can exceed what local pre-written answers allow', 'They prove that every correlation is entanglement'],
    answer: 'Across different measurement settings, they can exceed what local pre-written answers allow', explanation: "The Bell limit concerns correlations across carefully chosen settings, not one striking pair of results.",
  },
  {
    question: 'How can quantum key distribution reveal possible eavesdropping?',
    options: ['The key glows near a hacker', 'Entanglement sends an instant warning', 'A public test sample shows too many unexpected errors'],
    answer: 'A public test sample shows too many unexpected errors', explanation: 'Measuring the travelling quantum signals can disturb their correlations. Alex and Barb reveal and discard a small test sample, then reject the key if its error rate is too high.',
  },
  {
    question: 'Which recipe can transfer an unknown quantum state to Barb?',
    options: ['Shared entanglement, Alex’s joint measurement, an ordinary message, and Barb’s adjustment', 'Entanglement alone, with no message', 'Reading the complete state from one measurement and copying it'],
    answer: 'Shared entanglement, Alex’s joint measurement, an ordinary message, and Barb’s adjustment', explanation: "The ordinary message and Barb’s adjustment are essential, and the original unknown state is not copied.",
  },
];
