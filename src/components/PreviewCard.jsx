export default function PreviewCard({ type = 'character', title, imageSrc, children }) {
  const icon = type === 'world' ? '🌍' : '🎭';
  const gradient = type === 'world'
    ? 'from-emerald-200 via-sky-200 to-amber-200'
    : 'from-pink-200 via-violet-200 to-cyan-200';

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-slate-200/60">
      <div className={`mb-5 aspect-[16/10] rounded-[1.75rem] bg-gradient-to-br ${gradient} p-5`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${title} preview`}
            className="h-full w-full rounded-[1.35rem] object-cover shadow-inner"
          />
        ) : (
          <div className="grid h-full place-items-center rounded-[1.35rem] bg-white/35 text-center">
            <div>
              <div className="text-7xl">{icon}</div>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.25em] text-slate-700">AI image placeholder</p>
            </div>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-black text-slate-900">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}
