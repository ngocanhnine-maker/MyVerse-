export default function StyleSelector({ styles, selectedStyle, onSelect }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {styles.map((style) => (
        <button
          key={style}
          type="button"
          className={`rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
            selectedStyle === style ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
          onClick={() => onSelect(style)}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
