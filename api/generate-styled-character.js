const STYLE_PROMPTS = {
  'Soft anime fantasy': 'Turn this person into a soft 2D anime fantasy character with gentle shading, pastel colors, clean outlines, expressive eyes, and a magical atmosphere.',
  Cartoon: 'Turn this person into a playful 2D cartoon character with simplified shapes, bold outlines, bright colors, and a friendly animated look.',
  Manga: 'Turn this person into a 2D manga-style character with strong line art, expressive facial features, and Japanese comic aesthetics.',
  'Pixel art': 'Turn this person into a 2D pixel-art game character with visible pixels, retro sprite style, and simplified facial features.',
  Comic: 'Turn this person into a 2D comic-style character with inked outlines, cel shading, vivid colors, and graphic illustration style.',
  'Realistic fantasy': 'Turn this person into a semi-realistic 2D fantasy illustration with painterly rendering, fantasy costume styling, and magical world atmosphere.',
};

const DEMO_MESSAGE = 'Demo preview only. Real AI stylization requires API configuration.';

const json = (response, status, body) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
};

const readJsonBody = async (request) => {
  if (typeof request.body === 'string') {
    return request.body ? JSON.parse(request.body) : {};
  }

  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
};

const dataUrlToParts = (dataUrl) => {
  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) {
    throw new Error('Invalid image data.');
  }

  const [, mimeType, base64] = match;
  return {
    base64,
    mimeType,
  };
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    json(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const style = body.style || 'Soft anime fantasy';
    const stylePrompt = STYLE_PROMPTS[style] || body.stylePrompt || STYLE_PROMPTS['Soft anime fantasy'];

    if (!body.image) {
      json(response, 400, { error: 'Please upload or capture an image before generating.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      json(response, 200, {
        image: body.image,
        style,
        demo: true,
        message: DEMO_MESSAGE,
      });
      return;
    }

    const { base64, mimeType } = dataUrlToParts(body.image);
    const character = body.character || {};
    const prompt = [
      stylePrompt,
      'Use the provided image as the reference and create a polished 2D character portrait.',
      'Preserve the person or subject identity cues while making the result clearly illustrated, family-friendly, and suitable for a character creation app.',
      character.name ? `Character name: ${character.name}.` : '',
      character.role ? `Role: ${character.role}.` : '',
      character.personality ? `Personality: ${character.personality}.` : '',
      character.background ? `Background story: ${character.background}.` : '',
      'Do not include copyrighted characters, studio names, movie names, anime names, or game names.',
    ].filter(Boolean).join(' ');

    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image',
        input: [
          { type: 'text', text: prompt },
          {
            type: 'image',
            mime_type: mimeType,
            data: base64,
          },
        ],
      }),
    });

    const result = await geminiResponse.json();
    if (!geminiResponse.ok) {
      json(response, geminiResponse.status, {
        error: result?.error?.message || 'Image stylization failed. Please try again.',
      });
      return;
    }

    const generatedImage = result?.output_image;
    if (!generatedImage?.data) {
      json(response, 502, { error: 'Image stylization did not return an image.' });
      return;
    }

    json(response, 200, {
      image: `data:${generatedImage.mime_type || 'image/png'};base64,${generatedImage.data}`,
      style,
      demo: false,
    });
  } catch (error) {
    json(response, 500, { error: error.message || 'Image stylization failed. Please try again.' });
  }
}
