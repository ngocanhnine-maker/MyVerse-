import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PreviewCard from '../components/PreviewCard.jsx';
import { deleteWorld, getCharacters, getWorlds, saveWorld } from '../utils/storage.js';

export default function WorldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [world, setWorld] = useState(null);
  const [editing, setEditing] = useState(false);
  const characters = getCharacters();

  useEffect(() => {
    setWorld(getWorlds().find((item) => item.id === id) || null);
  }, [id]);

  if (!world) {
    return <Missing />;
  }

  const update = (field, value) => setWorld((current) => ({ ...current, [field]: value }));
  const toggleCharacter = (characterId) => {
    const currentIds = world.characterIds || [];
    update('characterIds', currentIds.includes(characterId) ? currentIds.filter((item) => item !== characterId) : [...currentIds, characterId]);
  };
  const addedCharacters = characters.filter((character) => (world.characterIds || []).includes(character.id));

  const handleSave = () => {
    setWorld(saveWorld(world));
    setEditing(false);
  };
  const handleDelete = () => {
    deleteWorld(world.id);
    navigate('/my-creations');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <Link to="/my-creations" className="text-sm font-black text-indigo-600">← Back to My Creations</Link>
        <h1 className="mt-4 text-4xl font-black">{world.name || 'Unnamed World'}</h1>
        <p className="mt-3 leading-7 text-slate-600">Full world information, storyline, and added characters.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="secondary-btn" onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel edit' : 'Edit world'}</button>
          <button className="danger-btn" onClick={handleDelete}>Delete world</button>
        </div>
      </section>

      {editing ? (
        <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
          <h2 className="text-xl font-black">Edit world</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {['name', 'genre', 'setting', 'mood', 'rules', 'locations', 'conflict', 'description', 'storyline'].map((field) => (
              field === 'name' || field === 'genre' || field === 'setting' || field === 'mood'
                ? <Input key={field} label={labelize(field)} value={world[field] || ''} onChange={(value) => update(field, value)} />
                : <TextArea key={field} label={labelize(field)} value={world[field] || ''} onChange={(value) => update(field, value)} />
            ))}
          </div>
          <div className="mt-5">
            <h3 className="font-black">Added characters</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {characters.length === 0 ? (
                <p className="text-sm text-slate-600">No saved characters available.</p>
              ) : characters.map((character) => (
                <label key={character.id} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <input type="checkbox" checked={(world.characterIds || []).includes(character.id)} onChange={() => toggleCharacter(character.id)} />
                  <span className="font-bold">{character.name || 'Unnamed Character'}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="primary-btn mt-5" onClick={handleSave}>Save changes</button>
        </section>
      ) : (
        <PreviewCard type="world" title={world.name || 'Unnamed World'}>
          <Info label="Source" value={world.path === 'template' ? `Template: ${world.templateName || 'Unnamed template'}` : 'Original world'} />
          <Info label="Genre" value={world.genre || 'Not set'} />
          <Info label="Mood" value={world.mood || 'Not set'} />
          <Info label="Setting" value={world.setting || 'Not set'} />
          <Info label="Rules" value={world.rules || 'Not set'} />
          <Info label="Main locations" value={world.locations || 'Not set'} />
          <Info label="Main conflict" value={world.conflict || 'Not set'} />
          <Info label="Description" value={world.description || 'Not set'} />
          <Info label="Storyline" value={world.storyline || 'Not set'} />
          <Info label="Added characters" value={addedCharacters.map((character) => character.name).join(', ') || 'None'} />
        </PreviewCard>
      )}
    </div>
  );
}

function Missing() {
  return (
    <div className="rounded-[2rem] bg-white/80 p-8 text-center shadow-sm">
      <h1 className="text-2xl font-black">Saved world not found</h1>
      <Link className="primary-btn mt-5" to="/my-creations">Go to My Creations</Link>
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

function labelize(value) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}
