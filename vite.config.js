import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import generateStyledCharacter from './api/generate-styled-character.js';

const localApiPlugin = () => ({
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use('/api/generate-styled-character', async (request, response, next) => {
      try {
        await generateStyledCharacter(request, response);
      } catch (error) {
        next(error);
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.GEMINI_API_KEY ||= env.GEMINI_API_KEY;
  process.env.GEMINI_IMAGE_MODEL ||= env.GEMINI_IMAGE_MODEL;

  return {
    plugins: [localApiPlugin(), react(), tailwindcss()],
  };
});
