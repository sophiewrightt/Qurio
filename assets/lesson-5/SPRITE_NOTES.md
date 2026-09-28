# Lesson 5–6 sprite preparation

These project PNGs were created from Sophie's supplied JPG drawings with the built-in image editor in background-extraction mode. The source JPGs in `Desktop/Qurio_sprites` were not changed.

## Output mapping

- `wizard-transparent.png` ← `wizard.jpg`
- `magic-hat-transparent.png` ← `magic_hat.jpg`
- `electron-surprised-transparent.png` ← `electron_surprised.jpg`
- `../lesson-6/electron-meditating-transparent.png` ← `electron_winking.jpg` (the artwork is the requested seated meditating pose despite its source filename)

## Final prompt set

Each asset used the same core prompt: “Remove only the white canvas background from this hand-drawn illustration and return it as a tightly cropped PNG with genuine transparency. Preserve the exact subject, crayon texture, colours, proportions, expression/pose, and subject edges. Do not redraw, enhance, smooth, restyle, recolour, add text, shadows, or objects.”

Asset-specific invariants:

- Wizard: preserve the white face enclosed by its black outline and all thin hand, arm, and leg lines.
- Hat: preserve its red band, gold stars, black texture, and every floating star.
- Electron expressions: preserve the soft blue glow as a semi-transparent fade rather than a hard edge.
- Meditating electron: preserve both hands, seated legs, closed eyes, and smile.
