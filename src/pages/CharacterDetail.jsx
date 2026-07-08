import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PreviewCard from '../components/PreviewCard.jsx';
import { deleteCharacter, getCharacters, saveCharacter } from '../utils/storage.js';

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setCharacter(getCharacters().find((item) => item.id === id) || null);
  }, [id]);

  if (!character) {
    return <Missing type="character" />;
  }

  const update = (field, value) => setCharacter((current) => ({ ...current, [field]: value }));
  const previewImage = character.styledImage || character.inputImage;
  const handleSave = () => {
    setCharacter(saveCharacter(character));
    setEditing(false);
  };
  const handleDelete = () => {
    deleteCharacter(character.id);
    navigate('/my-creations');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <Link to="/my-creations" className="text-sm font-black text-fuchsia-600">← Back to My Creations</Link>
        <h1 className="mt-4 text-4xl font-black">{character.name || 'Unnamed Character'}</h1>
        <p className="mt-3 leading-7 text-slate-600">Full character information, with quick edit and delete controls.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="secondary-btn" onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel edit' : 'Edit character'}</button>
          <button className="danger-btn" onClick={handleDelete}>Delete character</button>
        </div>
      </section>

      {editing ? (
        <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
          <h2 className="text-xl font-black">Edit character</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {['name', 'age', 'gender', 'role', 'style', 'accessories', 'hair', 'clothes', 'sceneBackground'].map((field) => (
              <Input key={field} label={labelize(field)} value={character[field] || ''} onChange={(value) => update(field, value)} />
            ))}
            <TextArea label="Personality" value={character.personality || ''} onChange={(value) => update('personality', value)} />
            <TextArea label="Background story" value={character.background || ''} onChange={(value) => update('background', value)} />
          </div>
          <button className="primary-btn mt-5" onClick={handleSave}>Save changes</button>
        </section>
      ) : (
        <PreviewCard title={character.name || 'Unnamed Character'} imageSrc={previewImage}>
          <Info label="Input method" value={character.inputMethod || 'Not set'} />
          <Info label="Style" value={character.style || 'Not set'} />
          <Info label="Image source" value={character.styledImageDemo ? 'Demo stylized preview' : character.styledImage ? 'Generated 2D style result' : character.inputImage ? 'Original reference image' : 'Placeholder'} />
          <Info label="Age" value={character.age || 'Not set'} />
          <Info label="Gender" value={character.gender || 'Not set'} />
          <Info label="Role" value={character.role || 'Not set'} />
          <Info label="Accessories" value={character.accessories || 'Not set'} />
          <Info label="Hair style" value={character.hair || 'Not set'} />
          <Info label="Clothes" value={character.clothes || 'Not set'} />
          <Info label="Background" value={character.sceneBackground || 'Not set'} />
          <Info label="Personality" value={character.personality || 'Not set'} />
          <Info label="Background story" value={character.background || 'Not set'} />
        </PreviewCard>
      )}
    </div>
  );
}

function Missing({ type }) {
  return (
    <div className="rounded-[2rem] bg-white/80 p-8 text-center shadow-sm">
      <h1 className="text-2xl font-black">Saved {type} not found</h1>
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
