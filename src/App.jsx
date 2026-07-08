import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CreateWorld from './pages/CreateWorld.jsx';
import CreateCharacter from './pages/CreateCharacter.jsx';
import MyCreations from './pages/MyCreations.jsx';
import CharacterDetail from './pages/CharacterDetail.jsx';
import WorldDetail from './pages/WorldDetail.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fff8f0] text-slate-900">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#fef08a55,transparent_30%),radial-gradient(circle_at_top_right,#93c5fd66,transparent_30%),linear-gradient(135deg,#fff8f0,#fff1f7_48%,#eff6ff)]" />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-world" element={<CreateWorld />} />
          <Route path="/create-character" element={<CreateCharacter />} />
          <Route path="/my-creations" element={<MyCreations />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/worlds/:id" element={<WorldDetail />} />
        </Routes>
      </main>
    </div>
  );
}
