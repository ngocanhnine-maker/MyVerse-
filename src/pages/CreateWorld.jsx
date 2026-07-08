import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PreviewCard from '../components/PreviewCard.jsx';
import StepCard from '../components/StepCard.jsx';
import { getCharacters, saveWorld } from '../utils/storage.js';

const templates = [
  { name: 'Sky Orchard Isles', genre: 'Fantasy', mood: 'Hopeful', description: 'Floating islands filled with fruit-lit villages and windy bridges.' },
  { name: 'Neon Harbor', genre: 'Science fantasy', mood: 'Mysterious', description: 'A bright port city where inventors trade secrets under glowing rain.' },
  { name: 'Clockwork Grove', genre: 'Adventure', mood: 'Whimsical', description: 'A forest of gentle machines, old maps, and hidden doorways.' },
];

const emptyWorld = {
  path: '',
  templateName: '',
  customization: '',
  name: '',
  genre: '',
  setting: '',
  mood: '',
  rules: '',
  locations: '',
  conflict: '',
  description: '',
  characterIds: [],
  storyline: '',
};

export default function CreateWorld() {
  const [world, setWorld] = useState(emptyWorld);
  const [preview, setPreview] = useState(false);
  const characters = getCharacters();
  const navigate = useNavigate();
  const update = (field, value) => setWorld((current) => ({ ...current, [field]: value }));

  const storyline = useMemo(() => {
    const name = world.name || world.templateName || 'This world';
    const conflict = world.conflict || 'a strange challenge';
    const locations = world.locations || 'unexplored places';
    return `${name} begins with rumors spreading through ${locations}. As ${conflict} grows, unlikely allies must learn the world's rules, protect what matters, and choose what kind of future they want to create.`;
  }, [world]);

  const toggleCharacter = (id) => {
    update('characterIds', world.characterIds.includes(id) ? world.characterIds.filter((item) => item !== id) : [...world.characterIds, id]);
  };

  const chooseTemplate = (template) => {
    setWorld((current) => ({
      ...current,
      path: 'template',
      templateName: template.name,
      name: current.name || template.name,
      genre: current.genre || template.genre,
      mood: current.mood || template.mood,
      description: current.description || template.description,
    }));
  };

  const handlePreview = () => {
    update('storyline', storyline);
    setPreview(true);
  };

  const handleSave = () => {
    const saved = saveWorld({ ...world, storyline });
    navigate(`/worlds/${saved.id}`);
  };

  if (preview) {
    const addedCharacters = characters.filter((character) => world.characterIds.includes(character.id));
    return (
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">World preview</p>
          <h1 className="mt-3 text-4xl font-black">{world.name || 'Your new world'}</h1>
          <p className="mt-4 leading-7 text-slate-600">A placeholder storyline and image are ready. Save it now or jump back to refine the details.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="secondary-btn" onClick={() => setPreview(false)}>Back to edit</button>
            <button className="primary-btn" onClick={handleSave}>Save world</button>
          </div>
        </div>
        <PreviewCard type="world" title={world.name || 'Unnamed World'}>
          <Info label="Genre" value={world.genre || 'Not set'} />
          <Info label="Mood" value={world.mood || 'Not set'} />
          <Info label="Setting" value={world.setting || world.description || 'Not set'} />
          <Info label="Main locations" value={world.locations || 'Not set'} />
          <Info label="Rules" value={world.rules || 'Not set'} />
          <Info label="Conflict" value={world.conflict || 'Not set'} />
          <Info label="Storyline" value={storyline} />
          <Info label="Added characters" value={addedCharacters.map((character) => character.name).join(', ') || 'None yet'} />
        </PreviewCard>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">Create World</p>
      <h1 className="mt-3 text-4xl font-black">Choose a starting path for your world</h1>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <StepCard title="Use available world template" description="Start with a playful ready-made world, then customize it." icon="🗺️" active={world.path === 'template'} onClick={() => update('path', 'template')} />
        <StepCard title="Create your own world" description="Describe a completely original setting from scratch." icon="🌱" active={world.path === 'own'} onClick={() => update('path', 'own')} />
      </section>

      {world.path === 'template' && (
        <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
          <h2 className="text-xl font-black">Choose template</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <button key={template.name} onClick={() => chooseTemplate(template)} className={`rounded-[1.5rem] p-4 text-left transition hover:-translate-y-1 ${world.templateName === template.name ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}>
                <div className="text-4xl">🏞️</div>
                <h3 className="mt-3 font-black">{template.name}</h3>
                <p className="mt-1 text-sm font-bold opacity-80">{template.genre} · {template.mood}</p>
                <p className="mt-2 text-sm leading-6 opacity-80">{template.description}</p>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <TextArea label="How do you want to customize this world?" value={world.customization} onChange={(value) => update('customization', value)} />
          </div>
        </section>
      )}

      {world.path && (
        <>
          <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
            <h2 className="text-xl font-black">{world.path === 'template' ? 'Answer a few world questions' : 'Describe your own world idea'}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input label="World name" value={world.name} onChange={(value) => update('name', value)} />
              <Input label="Genre" value={world.genre} onChange={(value) => update('genre', value)} />
              <Input label="Setting" value={world.setting} onChange={(value) => update('setting', value)} />
              <Input label="Mood" value={world.mood} onChange={(value) => update('mood', value)} />
              <TextArea label="Rules" value={world.rules} onChange={(value) => update('rules', value)} />
              <TextArea label="Main locations" value={world.locations} onChange={(value) => update('locations', value)} />
              <TextArea label="Main conflict" value={world.conflict} onChange={(value) => update('conflict', value)} />
              <TextArea label="Description" value={world.description} onChange={(value) => update('description', value)} />
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
            <h2 className="text-xl font-black">Add saved characters</h2>
            {characters.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">No saved characters yet. You can still create and save this world now.</p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {characters.map((character) => (
                  <label key={character.id} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                    <input type="checkbox" checked={world.characterIds.includes(character.id)} onChange={() => toggleCharacter(character.id)} />
                    <span className="font-bold">{character.name || 'Unnamed Character'}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          <div className="mt-8 flex justify-end">
            <button className="primary-btn disabled:cursor-not-allowed disabled:opacity-50" disabled={!world.name.trim()} onClick={handlePreview}>
              Generate placeholder storyline
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return <label><span className="label">{label}</span><input className="field" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextArea({ label, value, onChange }) {
  return <label className="md:col-span-2"><span className="label">{label}</span><textarea className="field min-h-28" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Info({ label, value }) {
  return <p><span className="font-black text-slate-900">{label}:</span> {value}</p>;
}
