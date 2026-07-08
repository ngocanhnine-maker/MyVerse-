export default function StepCard({ title, description, icon = '🌟', active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[2rem] border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        active ? 'border-fuchsia-300 bg-white shadow-fuchsia-100' : 'border-white/80 bg-white/70'
      }`}
    >
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-200 to-pink-200 text-2xl">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </button>
  );
}
