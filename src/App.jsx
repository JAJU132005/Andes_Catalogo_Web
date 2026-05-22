import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import FondoParticulas from './components/FondoParticulas';
import GuardianClicDerecho from './components/GuardianClicDerecho';
import ChatbotFlotante from './components/ChatbotFlotante';
import Catalogo from './pages/Catalogo';
import Solicitar from './pages/Solicitar';
import Admin from './pages/Admin';

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>© 2026 ANDES · Asociación Nacional para el Desarrollo Social</p>
        <p className="text-xs">Hackathon Talento Tech Oriente · Catálogo 3D Social</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <FondoParticulas />
      <GuardianClicDerecho />
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/solicitar" element={<Solicitar />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <ChatbotFlotante />
    </div>
  );
}
