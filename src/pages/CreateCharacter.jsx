import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepCard from '../components/StepCard.jsx';
import PreviewCard from '../components/PreviewCard.jsx';
import StyledImagePanel from '../components/StyledImagePanel.jsx';
import StyleSelector from '../components/StyleSelector.jsx';
import { generateStyledCharacter } from '../utils/generation.js';
import { saveCharacter } from '../utils/storage.js';

const styles = ['Soft anime fantasy', 'Cartoon', 'Manga', 'Pixel art', 'Comic', 'Realistic fantasy'];

const emptyCharacter = {
  inputMethod: 'Upload image',
  style: 'Soft anime fantasy',
  name: '',
  age: '',
  gender: '',
  role: '',
  personality: '',
  background: '',
  accessories: '',
  hair: '',
  clothes: '',
  sceneBackground: '',
  inputImage: '',
  styledImage: '',
  styledImageDemo: false,
};

export default function CreateCharacter() {
  const [character, setCharacter] = useState(emptyCharacter);
  const [preview, setPreview] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('idle');
  const [cameraError, setCameraError] = useState('');
  const [generationStatus, setGenerationStatus] = useState('idle');
  const [generationError, setGenerationError] = useState('');
  const [generationMessage, setGenerationMessage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRequestRef = useRef(0);
  const navigate = useNavigate();

  const canPreview = useMemo(() => character.name.trim() && character.role.trim(), [character]);
  const finalImage = character.styledImage || character.inputImage;
  const update = (field, value) => setCharacter((current) => ({ ...current, [field]: value }));
  const updateImage = (image) => {
    setGenerationStatus('idle');
    setGenerationError('');
    setGenerationMessage('');
    setCharacter((current) => ({ ...current, inputImage: image, styledImage: '', styledImageDemo: false }));
  };

  const stopCamera = () => {
    cameraRequestRef.current += 1;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const getCameraMessage = (error) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return 'Camera is not supported in this browser.';
    }
    if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
      return 'Camera access denied. Please allow camera permission.';
    }
    if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
      return 'No camera found.';
    }
    return 'Camera access denied. Please allow camera permission.';
  };

  const startCamera = async () => {
    stopCamera();
    const requestId = cameraRequestRef.current + 1;
    cameraRequestRef.current = requestId;
    setCameraError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('error');
      setCameraError('Camera is not supported in this browser.');
      return;
    }

    try {
      setCameraStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraRequestRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStatus('ready');
    } catch (error) {
      stopCamera();
      setCameraStatus('error');
      setCameraError(getCameraMessage(error));
    }
  };

  useEffect(() => {
    if (character.inputMethod === 'Use webcam' && !character.inputImage && !preview) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [character.inputMethod, character.inputImage, preview]);

  const handleSave = () => {
    const saved = saveCharacter(character);
    navigate(`/characters/${saved.id}`);
  };

  const handleInputMethod = (method) => {
    update('inputMethod', method);
    if (method === 'Upload image') {
      stopCamera();
      setCameraStatus('idle');
      setCameraError('');
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    const image = canvas.toDataURL('image/png');
    stopCamera();
    setCameraStatus('captured');
    updateImage(image);
  };

  const handleRetake = () => {
    updateImage('');
    setCameraStatus('idle');
    setCameraError('');
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      stopCamera();
      setCameraStatus('idle');
      updateImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStyleChange = (style) => {
    setGenerationStatus('idle');
    setGenerationError('');
    setGenerationMessage('');
    setCharacter((current) => ({
      ...current,
      style,
      styledImage: current.style === style ? current.styledImage : '',
      styledImageDemo: current.style === style ? current.styledImageDemo : false,
    }));
  };

  const handleGenerateStyledCharacter = async () => {
    if (!character.inputImage) {
      setGenerationStatus('error');
      setGenerationError('Please upload or capture an image before generating.');
      return;
    }

    try {
      setGenerationStatus('generating');
      setGenerationError('');
      setGenerationMessage('');
      const result = await generateStyledCharacter({
        image: character.inputImage,
        style: character.style,
        character,
      });
      setCharacter((current) => ({
        ...current,
        styledImage: result.image,
        styledImageDemo: Boolean(result.demo),
      }));
      setGenerationMessage(result.message || '');
      setGenerationStatus('done');
    } catch (error) {
      setGenerationStatus('error');
      setGenerationError(error.message || 'Image stylization failed. Please try again.');
    }
  };

  if (preview) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-fuchsia-600">Final preview</p>
          <h1 className="mt-3 text-4xl font-black">Meet {character.name || 'your character'}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            This preview uses your generated 2D style result when one is available.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="secondary-btn" onClick={() => setPreview(false)}>Back to edit</button>
            <button className="primary-btn" onClick={handleSave}>Save character</button>
          </div>
        </div>
        <PreviewCard title={character.name || 'Unnamed Character'} imageSrc={finalImage}>
          <Info label="Style" value={character.style} />
          <Info label="Image source" value={character.styledImageDemo ? 'Demo stylized preview' : character.styledImage ? 'Generated 2D style result' : character.inputImage ? 'Original reference image' : 'Placeholder'} />
          <Info label="Basic information" value={`${character.age || 'Unknown age'} · ${character.gender || 'Unknown gender'} · ${character.role || 'No role'}`} />
          <Info label="Appearance" value={`${character.hair || 'Any hair'}; ${character.clothes || 'Any clothes'}; ${character.accessories || 'No accessories'}; ${character.sceneBackground || 'simple background'}`} />
          <Info label="Personality" value={character.personality || 'Not described yet.'} />
          <Info label="Background story" value={character.background || 'Not described yet.'} />
        </PreviewCard>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.25em] text-fuchsia-600">Create Character</p>
      <h1 className="mt-3 text-4xl font-black">Build a character from a spark of imagination</h1>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <StepCard title="Use webcam" description="Open your camera, preview live video, and capture a reference photo." icon="📷" active={character.inputMethod === 'Use webcam'} onClick={() => handleInputMethod('Use webcam')} />
        <StepCard title="Upload image" description="Upload a reference image from your device and preview it instantly." icon="🖼️" active={character.inputMethod === 'Upload image'} onClick={() => handleInputMethod('Upload image')} />
      </section>

      <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Reference image</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Webcam requires camera permission and works on localhost or HTTPS.</p>
          </div>
          {character.inputImage && (
            <button type="button" className="secondary-btn" onClick={handleRetake}>
              {character.inputMethod === 'Use webcam' ? 'Retake Photo' : 'Choose another image'}
            </button>
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/70">
          {character.inputImage ? (
            <img src={character.inputImage} alt="Selected character reference" className="max-h-[28rem] w-full object-contain" />
          ) : character.inputMethod === 'Use webcam' ? (
            <div className="p-4">
              <div className="overflow-hidden rounded-[1.25rem] bg-slate-950">
                <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full object-cover" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-bold text-slate-600">
                  {cameraStatus === 'requesting' && 'Requesting camera permission...'}
                  {cameraStatus === 'ready' && 'Camera is ready.'}
                  {cameraStatus === 'error' && cameraError}
                  {cameraStatus === 'idle' && 'Preparing camera...'}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {cameraStatus === 'error' && (
                    <button type="button" className="secondary-btn" onClick={startCamera}>Try again</button>
                  )}
                  <button type="button" className="primary-btn disabled:cursor-not-allowed disabled:opacity-50" disabled={cameraStatus !== 'ready'} onClick={handleCapture}>
                    Capture Photo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="grid min-h-52 cursor-pointer place-items-center p-6 text-center">
              <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
              <span>
                <span className="block text-5xl">🖼️</span>
                <span className="mt-3 block text-sm font-black text-slate-800">Upload an image</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">Choose a character reference from your device.</span>
              </span>
            </label>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
        <h2 className="text-xl font-black">Favorite art style</h2>
        <StyleSelector styles={styles} selectedStyle={character.style} onSelect={handleStyleChange} />
        <StyledImagePanel
          originalImage={character.inputImage}
          styledImage={character.styledImage}
          status={generationStatus}
          error={generationError}
          message={generationMessage}
          onGenerate={handleGenerateStyledCharacter}
        />
      </section>

      <FormSection title="Basic information">
        <Input label="Name" value={character.name} onChange={(value) => update('name', value)} />
        <Input label="Age" value={character.age} onChange={(value) => update('age', value)} />
        <Input label="Gender" value={character.gender} onChange={(value) => update('gender', value)} />
        <Input label="Role" value={character.role} onChange={(value) => update('role', value)} />
        <TextArea label="Personality" value={character.personality} onChange={(value) => update('personality', value)} />
        <TextArea label="Background story" value={character.background} onChange={(value) => update('background', value)} />
      </FormSection>

      <FormSection title="Filters and appearance details">
        <Input label="Accessories" value={character.accessories} onChange={(value) => update('accessories', value)} />
        <Input label="Hair style" value={character.hair} onChange={(value) => update('hair', value)} />
        <Input label="Clothes" value={character.clothes} onChange={(value) => update('clothes', value)} />
        <Input label="Background" value={character.sceneBackground} onChange={(value) => update('sceneBackground', value)} />
      </FormSection>

      <div className="mt-8 flex justify-end">
        <button className="primary-btn disabled:cursor-not-allowed disabled:opacity-50" disabled={!canPreview} onClick={() => setPreview(true)}>
          Preview character
        </button>
      </div>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
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
