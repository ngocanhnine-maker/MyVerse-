export const STYLE_PROMPTS = {
  'Soft anime fantasy': 'Turn this person into a soft 2D anime fantasy character with gentle shading, pastel colors, clean outlines, expressive eyes, and a magical atmosphere.',
  Cartoon: 'Turn this person into a playful 2D cartoon character with simplified shapes, bold outlines, bright colors, and a friendly animated look.',
  Manga: 'Turn this person into a 2D manga-style character with strong line art, expressive facial features, and Japanese comic aesthetics.',
  'Pixel art': 'Turn this person into a 2D pixel-art game character with visible pixels, retro sprite style, and simplified facial features.',
  Comic: 'Turn this person into a 2D comic-style character with inked outlines, cel shading, vivid colors, and graphic illustration style.',
  'Realistic fantasy': 'Turn this person into a semi-realistic 2D fantasy illustration with painterly rendering, fantasy costume styling, and magical world atmosphere.',
};

export const getStylePrompt = (style) => STYLE_PROMPTS[style] || STYLE_PROMPTS['Soft anime fantasy'];
