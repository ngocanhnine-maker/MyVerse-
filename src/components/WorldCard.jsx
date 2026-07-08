import { Link } from 'react-router-dom';

export default function WorldCard({ world }) {
  return (
    <Link to={`/worlds/${world.id}`} className="group block rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br from-emerald-200 via-sky-200 to-amber-200 p-4">
        <div className="grid h-full place-items-center rounded-[1.25rem] bg-white/35 text-6xl">🏰</div>
      </div>
      <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600">{world.name || 'Unnamed World'}</h3>
      <p className="mt-1 text-sm font-bold text-fuchsia-600">{world.genre || 'No genre'} · {world.mood || 'No mood'}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{world.description || world.setting || 'No description yet.'}</p>
      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{world.storyline || 'No storyline generated yet.'}</p>
    </Link>
  );
}
