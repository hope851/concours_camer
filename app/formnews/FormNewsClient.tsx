'use client';

import { createNewsAction } from '@/app/action/news';
import { Newspaper, AlertTriangle, Link as LinkIcon, Image as ImageIcon, Sparkles, Building2, GraduationCap, BookOpen } from 'lucide-react';
import SubmitButton from '@/components/bouttonsubmite';
import { useState } from 'react';

type FormOptions = {
  eesList: { id: string; nomEes: string }[];
  tutelles: { id: string; nomTutelle: string }[];
  programmes: { id: string; nomProgramme: string; niveau: string; ees: { nomEes: string } }[];
};

export default function CreateNewsForm({ options }: { options: FormOptions }) {
  const [selectedEes, setSelectedEes] = useState<string>("none");

  const filteredProgrammes = selectedEes && selectedEes !== "none"
    ? options.programmes.filter((p) => p.ees.nomEes && options.eesList.find((e) => e.id === selectedEes)?.nomEes === p.ees.nomEes)
    : options.programmes;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-150 h-150 bg-purple-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
        <div className="absolute w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
      </div>

      <div className="relative w-full max-w-3xl z-10 animate-scale-in">
        <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">
          <div className="relative p-12 bg-linear-to-br from-white/8 to-transparent border-b border-white/10">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Newspaper size={120} className="text-white" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Sparkles size={12} /> Newsroom
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                Nouvelle <span className="bg-linear-to-r from-purple-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">Actualité</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-sm">Diffusez une information importante rattachée à la hiérarchie académique.</p>
            </div>
          </div>

          <form action={createNewsAction} className="p-10 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-linear-to-b from-purple-400 to-blue-400 rounded-full shadow-lg shadow-purple-500/50" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Sparkles size={24} className="text-purple-400" />
                  Corps de l&apos;article
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Titre de l&apos;actualité</label>
                  <input name="title" required placeholder="Ex: Lancement du concours Polytechnique 2026..." className="glass-input w-full p-5 rounded-2xl" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Catégorie</label>
                  <select name="category" className="glass-input w-full p-5 rounded-2xl cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white">
                    <option value="Concours">Concours</option>
                    <option value="Admission">Admission</option>
                    <option value="Bourse">Bourse</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label htmlFor="isUrgent" className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 hover:border-red-500/30 rounded-2xl cursor-pointer transition-all w-full">
                    <div className="relative flex items-center">
                      <input type="checkbox" name="isUrgent" id="isUrgent" className="peer sr-only" />
                      <div className="w-12 h-6 bg-slate-700 rounded-full peer-checked:bg-red-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-red-400" />
                      <p className="font-black text-white text-sm uppercase tracking-wider">Urgent</p>
                    </div>
                  </label>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Résumé court</label>
                  <textarea name="excerpt" rows={2} placeholder="Bref résumé pour la carte d'aperçu..." className="glass-input w-full p-5 rounded-2xl resize-none" />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Détails de l&apos;article</label>
                  <textarea name="content" required rows={6} placeholder="Détails complets de l'information..." className="glass-input w-full p-5 rounded-2xl resize-none" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <LinkIcon size={14} className="text-purple-400" /> Nom de la source
                  </label>
                  <input name="sourceName" placeholder="Ex: MINESUP / Journal Officiel" className="glass-input w-full p-5 rounded-2xl" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <LinkIcon size={14} className="text-indigo-400" /> URL de la source
                  </label>
                  <input name="sourceUrl" placeholder="https://..." className="glass-input w-full p-5 rounded-2xl" />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon size={14} className="text-blue-400" /> Image de couverture
                  </label>
                  <div className="relative group">
                    <input type="file" name="image" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="glass-input w-full p-5 rounded-2xl flex items-center gap-4 text-slate-400 group-hover:bg-white/5 transition-colors border-dashed border-2 border-white/10 group-hover:border-blue-500/30">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                        <ImageIcon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200">Choisir une image</span>
                        <span className="text-[10px] uppercase tracking-wider">JPG, PNG ou WebP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiérarchie / Rattachement */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-8 bg-linear-to-b from-cyan-400 to-indigo-400 rounded-full" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Rattachement Hiérarchique (Optionnel)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={12} /> Tutelle
                  </label>
                  <select name="tutelleId" className="glass-input w-full p-4 rounded-2xl [&>option]:bg-slate-900 [&>option]:text-white">
                    <option value="none">— Aucune —</option>
                    {options.tutelles.map((t) => (
                      <option key={t.id} value={t.id}>{t.nomTutelle}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={12} /> Établissement (EES)
                  </label>
                  <select
                    name="eesId"
                    value={selectedEes}
                    onChange={(e) => setSelectedEes(e.target.value)}
                    className="glass-input w-full p-4 rounded-2xl [&>option]:bg-slate-900 [&>option]:text-white"
                  >
                    <option value="none">— Aucun —</option>
                    {options.eesList.map((e) => (
                      <option key={e.id} value={e.id}>{e.nomEes}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={12} /> Programme
                  </label>
                  <select name="programmeId" className="glass-input w-full p-4 rounded-2xl [&>option]:bg-slate-900 [&>option]:text-white">
                    <option value="none">— Aucun —</option>
                    {filteredProgrammes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nomProgramme} ({p.niveau})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
