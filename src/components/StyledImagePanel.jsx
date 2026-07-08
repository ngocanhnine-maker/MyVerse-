export default function StyledImagePanel({
  originalImage,
  styledImage,
  status,
  error,
  message,
  onGenerate,
}) {
  return (
    <div className="mt-5 rounded-[1.5rem] border border-fuchsia-100 bg-fuchsia-50/70 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="font-black text-slate-900">Generate your 2D character</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Turn the uploaded or webcam photo into the selected style. The generated result will be used in final preview and saved creations.
          </p>
        </div>
        <button
          type="button"
          className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!originalImage || status === 'generating'}
          onClick={onGenerate}
        >
          {styledImage ? 'Regenerate' : 'Generate Styled Character'}
        </button>
      </div>

      {status === 'generating' && (
        <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm font-black text-fuchsia-700">
          Generating your 2D character...
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {message}
        </p>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ImageCompare title="Original reference" image={originalImage} fallback="Upload or capture an image first." />
        <ImageCompare title="Generated 2D result" image={styledImage} fallback="Your styled character will appear here." />
      </div>
      {styledImage && (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Generated result selected. It will appear in the final preview, saved cards, and character detail page.
        </p>
      )}
    </div>
  );
}

function ImageCompare({ title, image, fallback }) {
  return (
    <div className="rounded-[1.25rem] bg-white/80 p-3">
      <p className="mb-3 text-sm font-black text-slate-900">{title}</p>
      <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 via-violet-100 to-cyan-100 text-center">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <p className="px-5 text-sm font-bold leading-6 text-slate-500">{fallback}</p>
        )}
      </div>
    </div>
  );
}
