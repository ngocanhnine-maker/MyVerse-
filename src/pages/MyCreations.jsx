import { useState } from 'react';
import CharacterCard from '../components/CharacterCard.jsx';
import WorldCard from '../components/WorldCard.jsx';
import { getCharacters, getWorlds } from '../utils/storage.js';

export default function MyCreations() {
  const [tab, setTab] = useState('characters');
  const characters = getCharacters();
  const worlds = getWorlds();

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.25em] text-fuchsia-600">My Creations</p>
      <h1 className="mt-3 text-4xl font-black">Your saved story pieces</h1>

      <div className="mt-8 inline-flex rounded-2xl bg-white/75 p-1 shadow-sm">
        <button className={`rounded-xl px-5 py-3 text-sm font-black ${tab === 'characters' ? 'bg-slate-900 text-white' : 'text-slate-700'}`} onClick={() => setTab('characters')}>
          Saved Characters
        </button>
        <button className={`rounded-xl px-5 py-3 text-sm font-black ${tab === 'worlds' ? 'bg-slate-900 text-white' : 'text-slate-700'}`} onClick={() => setTab('worlds')}>
          Saved Worlds
        </button>
      </div>

      {tab === 'characters' ? (
        <section className="mt-6">
          {characters.length === 0 ? (
            <Empty title="No characters saved yet" text="Create a character and it will appear here." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => <CharacterCard key={character.id} character={character} />)}
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6">
          {worlds.length === 0 ? (
            <Empty title="No worlds saved yet" text="Create a world and it will appear here." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {worlds.map((world) => <WorldCard key={world.id} world={world} />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Empty({ title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/75 p-10 text-center shadow-sm">
      <div className="text-6xl">✨</div>
      <h2 className="mt-4 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}
