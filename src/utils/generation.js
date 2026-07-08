import { getStylePrompt } from './stylePrompts.js';

export async function generateStyledCharacter({ image, style, character }) {
  const response = await fetch('/api/generate-styled-character', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image,
      style,
      stylePrompt: getStylePrompt(style),
      character,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    throw new Error('Image stylization requires API configuration.');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Image stylization failed. Please try again.');
  }

  if (!data?.image) {
    throw new Error('Image stylization did not return an image.');
  }

  return data;
}
