"use client";

import { AddEes } from "../action/newees";
import { useFormStatus } from "react-dom";
import { useRef, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import FiliereInput from "@/components/FiliereInput";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, MapPin, Globe, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span>Enregistrement...</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Ajouter l'EES</span>
                </>
            )}
        </button>
    );
}

function FormFields() {
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const tutelleId = searchParams.get("tutelleId");
    const nomTutelle = searchParams.get("nom");

    async function handleClientAction(formData: FormData) {
        setStatus(null);
        if (tutelleId) {
            formData.append("tutelleId", tutelleId);
        } else {
            setStatus({ type: 'error', message: "ID de tutelle manquant dans l'URL." });
            return;
        }

        try {
            const result = await AddEes(formData);
            if (result?.error) {
                setStatus({ type: 'error', message: result.error });
            } else {
                setStatus({ type: 'success', message: "L'établissement et ses filières ont été ajoutés avec succès !" });
                formRef.current?.reset();
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Une erreur technique est survenue." });
        }
    }

    return (
        <form ref={formRef} action={handleClientAction} className="p-10 space-y-10">
            {status && (
                <div className={`flex items-center gap-4 p-6 rounded-2xl border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="font-bold text-sm">{status.message}</p>
                </div>
            )}

            {/* Informations Principales */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <GraduationCap size={24} className="text-blue-400" />
                        Informations Principales
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Nom de l'établissement</label>
                        <input name="nom_ees" placeholder="Ex: Polytechnique" required className="glass-input p-5 rounded-2xl w-full" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Domaine d'étude</label>
                        <input name="domaine" placeholder="Ex: Ingénierie" required className="glass-input p-5 rounded-2xl w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Type de structure</label>
                        <select name="ees_type" className="glass-input p-5 rounded-2xl w-full appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23818CF8' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', paddingRight: '3rem' }}>
                            <option value="PUBLIC">🏫 Établissement Public</option>
                            <option value="PRIVE">🏢 Établissement Privé</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Localisation (Ville)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input name="ville" placeholder="Ex: Yaoundé" required className="glass-input p-5 pl-12 rounded-2xl w-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Site Web */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Globe size={24} className="text-purple-400" />
                        Présence en Ligne
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Site Web Officiel</label>
                    <input name="site_ees" placeholder="https://www.exemple.com" className="glass-input p-5 rounded-2xl w-full" />
                </div>
            </div>

            {/* Filières */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <BookOpen size={24} className="text-cyan-400" />
                        Filières Proposées
                    </h2>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-sm">
                    <FiliereInput />
                </div>
            </div>

            {/* Bio */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <ArrowRight size={24} className="text-emerald-400" />
                        À Propos
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Description</label>
                    <textarea name="ees_bio" placeholder="Racontez brièvement l'histoire et les caractéristiques..." rows={4} className="glass-input p-5 rounded-2xl w-full resize-none"></textarea>
                </div>
            </div>

            <div className="pt-6">
                <SubmitButton />
            </div>
        </form>
    );
}

export default function FormEesPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-4xl z-10 animate-scale-in">
                {/* Master Glassmorphic Container */}
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Hero Section Header */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <GraduationCap size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Établissements
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                Ajouter un <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">EES</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-md">Enregistrez un nouvel établissement d'enseignement supérieur sur la plateforme.</p>
                        </div>
                    </div>

                    <Suspense fallback={<div className="p-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-400" size={40} />
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Préparation du formulaire...</p>
                    </div>}>
                        <FormFields />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
