'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.dataset.theme === 'light');
  }, []);

  function toggleTheme() {
    const nextIsLight = !isLight;
    document.documentElement.dataset.theme = nextIsLight ? 'light' : 'dark';
    localStorage.setItem('concours-camer-theme', nextIsLight ? 'light' : 'dark');
    setIsLight(nextIsLight);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Activer le mode sombre' : 'Activer le mode clair'}
      onClick={toggleTheme}
      title={isLight ? 'Passer en mode sombre' : 'Passer en mode clair'}
      className="theme-switch fixed top-3 z-[100] inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/90 text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur-lg transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {isLight ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
