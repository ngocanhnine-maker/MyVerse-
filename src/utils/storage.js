const CHARACTER_KEY = 'cyc_characters';
const WORLD_KEY = 'cyc_worlds';

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const write = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const getCharacters = () => read(CHARACTER_KEY);
export const getWorlds = () => read(WORLD_KEY);

export const saveCharacter = (character) => {
  const items = getCharacters();
  const saved = {
    ...character,
    id: character.id || crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  const next = items.some((item) => item.id === saved.id)
    ? items.map((item) => (item.id === saved.id ? saved : item))
    : [saved, ...items];
  write(CHARACTER_KEY, next);
  return saved;
};

export const deleteCharacter = (id) => {
  write(CHARACTER_KEY, getCharacters().filter((item) => item.id !== id));
};

export const saveWorld = (world) => {
  const items = getWorlds();
  const saved = {
    ...world,
    id: world.id || crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  const next = items.some((item) => item.id === saved.id)
    ? items.map((item) => (item.id === saved.id ? saved : item))
    : [saved, ...items];
  write(WORLD_KEY, next);
  return saved;
};

export const deleteWorld = (id) => {
  write(WORLD_KEY, getWorlds().filter((item) => item.id !== id));
};
