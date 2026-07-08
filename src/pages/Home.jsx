import { Link } from 'react-router-dom';

const actions = [
  { to: '/create-world', title: 'Create World', text: 'Shape a setting, conflict, rules, and storyline.', icon: '🌍' },
  { to: '/create-character', title: 'Create Character', text: 'Build a hero, rival, guide, or mystery figure.', icon: '🎭' },
  { to: '/my-creations', title: 'My Creations', text: 'Open, edit, and organize your saved ideas.', icon: '📚' },
];

export default function Home() {
  return (
    <div className="py-8 sm:py-14">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-black text-fuchsia-600 shadow-sm">
            Story playground MVP
          </p>
          <h1 className="brand-name max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            MyVerse
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Create characters, worlds, and storylines from your imagination.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="primary-btn" to="/create-world">Create World</Link>
            <Link className="secondary-btn" to="/create-character">Create Character</Link>
            <Link className="secondary-btn" to="/my-creations">My Creations</Link>
          </div>
        </div>
        <div className="rounded-[2.5rem] border border-white/80 bg-white/65 p-4 shadow-2xl shadow-fuchsia-100">
          <div className="rounded-[2rem] bg-gradient-to-br from-amber-200 via-pink-200 to-indigo-200 p-6">
            <div className="grid aspect-square place-items-center rounded-[1.6rem] bg-white/35 text-center">
              <div>
                <img
                  src="/logo.svg"
                  alt="MyVerse logo"
                  className="mx-auto size-28 rounded-[2rem] object-contain drop-shadow-lg sm:size-32"
                />
                <p className="mt-4 text-xl font-black text-slate-900">Imagine. Preview. Save.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl">{action.icon}</div>
            <h2 className="mt-5 text-xl font-black">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
