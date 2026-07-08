import { Link } from 'react-router-dom';

export default function CharacterCard({ character }) {
  const previewImage = character.styledImage || character.inputImage;

  return (
    <Link to={`/characters/${character.id}`} className="group block rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 aspect-square rounded-[1.5rem] bg-gradient-to-br from-pink-200 via-violet-200 to-cyan-200 p-4">
        {previewImage ? (
          <img
            src={previewImage}
            alt={`${character.name || 'Saved character'} preview`}
            className="h-full w-full rounded-[1.25rem] object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center rounded-[1.25rem] bg-white/35 text-6xl">🧑‍🎨</div>
        )}
      </div>
      <h3 className="text-xl font-black text-slate-900 group-hover:text-fuchsia-600">{character.name || 'Unnamed Character'}</h3>
      <p className="mt-1 text-sm font-bold text-indigo-600">{character.style || 'No style'} · {character.role || 'No role'}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{character.background || 'No background story yet.'}</p>
    </Link>
  );
}
