'use client';

import { createNewsAction } from '@/app/action/news';
import { Newspaper, Send, AlertTriangle, Link as LinkIcon, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function CreateNewsForm() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-3xl z-10 animate-scale-in">
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Header with gradient */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
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
                            <p className="text-slate-400 text-lg font-medium max-w-sm">Diffusez une information importante aux étudiants de la plateforme.</p>
                        </div>
                    </div>

                    <form action={createNewsAction} className="p-10 space-y-10">
                        {/* Section 1: Contenu */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-purple-400 to-blue-400 rounded-full shadow-lg shadow-purple-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Sparkles size={24} className="text-purple-400" />
                                    Corps de l'article
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Titre */}
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Titre de l'actualité</label>
                                    <input
                                        name="title"
                                        required
                                        placeholder="Ex: Lancement du concours Polytechnique 2024..."
                                        className="glass-input w-full p-5 rounded-2xl"
                                    />
                                </div>

                                {/* Catégorie */}
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Catégorie</label>
                                    <select
                                        name="category"
                                        className="glass-input w-full p-5 rounded-2xl appearance-none cursor-pointer"
                                    >
                                        <option value="Concours" className="bg-slate-900">Concours</option>
                                        <option value="Admission" className="bg-slate-900">Admission</option>
                                        <option value="Bourse" className="bg-slate-900">Bourse</option>
                                        <option value="Autre" className="bg-slate-900">Autre</option>
                                    </select>
                                </div>

                                {/* Urgence */}
                                <div className="flex items-end pb-1">
                                    <label htmlFor="isUrgent" className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 hover:border-red-500/30 rounded-2xl cursor-pointer transition-all group w-full">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isUrgent"
                                                id="isUrgent"
                                                className="peer sr-only"
                                            />
                                            <div className="w-12 h-6 bg-slate-700 rounded-full peer-checked:bg-red-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={18} className="text-red-400" />
                                            <p className="font-black text-white text-sm uppercase tracking-wider">Urgent</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Excerpt */}
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Résumé court</label>
                                    <textarea
                                        name="excerpt"
                                        rows={2}
                                        placeholder="Bref résumé pour la carte d'aperçu..."
                                        className="glass-input w-full p-5 rounded-2xl resize-none"
                                    />
                                </div>

                                {/* Contenu Principal */}
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Détails de l'article</label>
                                    <textarea
                                        name="content"
                                        required
                                        rows={6}
                                        placeholder="Détails complets de l'information..."
                                        className="glass-input w-full p-5 rounded-2xl resize-none"
                                    />
                                </div>

                                {/* Source */}
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <LinkIcon size={14} className="text-purple-400" /> Nom de la source
                                    </label>
                                    <input
                                        name="sourceName"
                                        placeholder="Ex: MINESUP / Journal Officiel"
                                        className="glass-input w-full p-5 rounded-2xl"
                                    />
                                </div>

                                {/* Image URL */}
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <ImageIcon size={14} className="text-blue-400" /> URL Image (Optionnel)
                                    </label>
                                    <input
                                        name="image"
                                        placeholder="https://..."
                                        className="glass-input w-full p-5 rounded-2xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group"
                            >
                                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>Publier l'Actualité</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
