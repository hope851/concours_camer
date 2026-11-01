"use client";

import { AddTutelle } from "../action/newtutelle";
import { GetPays } from "../action/location";
import { useFormStatus } from "react-dom";
import { useRef, useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Building2, MapPin, TextQuote, Plus, Globe } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group cursor-pointer"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span>Enregistrement...</span>
                </>
            ) : (
                <>
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Ajouter l'institut</span>
                </>
            )}
        </button>
    );
}

export default function FormTutellePage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [paysList, setPaysList] = useState<{ id: string; nomPays: string; region: string }[]>([]);

    useEffect(() => {
        GetPays().then(setPaysList);
    }, []);

    async function handleClientAction(formData: FormData) {
        setStatus(null);
        try {
            const result = await AddTutelle(formData);
            if (result?.error) {
                setStatus({ type: 'error', message: result.error });
            } else {
                setStatus({ type: 'success', message: "L'institution tutélaire a été enregistrée avec succès !" });
                formRef.current?.reset();
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Une erreur technique est survenue." });
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-2xl z-10 animate-scale-in">
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Header with gradient */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Building2 size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Tutelles (Hiérarchie: Pays → Tutelle)
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                Institution <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">Tutélaire</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-xs italic">Enregistrement d'une nouvelle structure de tutelle.</p>
                        </div>
                    </div>

                    <form ref={formRef} action={handleClientAction} className="p-10 space-y-10">
                        {status && (
                            <div className={`flex items-center gap-4 p-6 rounded-2xl border ${status.type === 'success' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                                {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                <p className="font-bold text-sm">{status.message}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-indigo-400 to-purple-400 rounded-full shadow-lg shadow-indigo-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Building2 size={24} className="text-indigo-400" />
                                    Informations Principales
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Nom de l'institut tutélaire
                                </label>
                                <input
                                    type="text"
                                    name="nom_tutelle"
                                    placeholder="ex: Ministère de l'Enseignement Supérieur"
                                    required
                                    className="glass-input p-5 rounded-2xl w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Tutelle Technique (Optionnel)
                                </label>
                                <input
                                    type="text"
                                    name="nom_tutelle_tech"
                                    placeholder="Nom technique"
                                    className="glass-input p-5 rounded-2xl w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Site Officiel (Optionnel)
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="url"
                                        name="site_tutelle"
                                        placeholder="https://minesup.gov.cm"
                                        className="glass-input p-5 pl-12 rounded-2xl w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hierarchical Relational Linking: Pays */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Pays de Rattachement
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <select
                                        name="pays_id"
                                        className="glass-input p-5 pl-12 rounded-2xl w-full [&>option]:bg-slate-900 [&>option]:text-white"
                                    >
                                        <option value="">Sélectionner un pays existant</option>
                                        {paysList.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nomPays} ({p.region})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Ou Créer un Pays / Région
                                </label>
                                <input
                                    type="text"
                                    name="nom_pays"
                                    placeholder="ex: Cameroun, Gabon..."
                                    className="glass-input p-5 rounded-2xl w-full"
                                />
                            </div> */}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-purple-400 to-indigo-400 rounded-full shadow-lg shadow-purple-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <TextQuote size={24} className="text-purple-400" />
                                    Description
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Description de la structure
                                </label>
                                <textarea
                                    name="tutelle_bio"
                                    placeholder="Décrivez en quelques mots la mission de cette structure..."
                                    rows={4}
                                    className="glass-input p-5 rounded-2xl w-full resize-none"
                                ></textarea>
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
