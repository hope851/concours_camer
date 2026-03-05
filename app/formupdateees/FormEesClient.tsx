"use client";

import { UpdateEes } from "../action/newees";
import { useFormStatus } from "react-dom";
import { useRef, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import FiliereInput from "@/components/FiliereInput";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, MapPin, Globe, BookOpen, GraduationCap } from "lucide-react";

interface EesProps {
    data: {
        id?: string;
        nom_ees?: string;
        domaine?: string;
        ees_bio?: string | null;
        ville?: string;
        site_ees?: string | null;
        ees_type?: string;
        tutelle_id?: string;
        filieres?: { nom_filiere: string }[];
    };
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
            {pending ? (
                <>
                    <Loader2 size={24} className="animate-spin" />
                    <span className="tracking-wide">Traitement en cours...</span>
                </>
            ) : (
                <>
                    {isEditing ? <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
                    <span className="tracking-wide font-black uppercase">
                        {isEditing ? "Enregistrer les modifications" : "Ajouter l'EES"}
                    </span>
                </>
            )}
        </button>
    );
}

function FormFields({ data }: EesProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();

    // Récupération des IDs depuis l'URL
    const idFromUrl = searchParams.get("id");
    const tutelleIdFromUrl = searchParams.get("tutelle_id");

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    async function handleClientAction(formData: FormData) {
        setStatus(null);
        // On attache l'ID de la tutelle (obligatoire pour l'action)
        const finalTutelleId = tutelleIdFromUrl || data?.tutelle_id;
        if (finalTutelleId) {
            formData.append("tutelle_id", finalTutelleId);
        } else {
            setStatus({ type: 'error', message: "ID de tutelle manquant." });
            return;
        }

        // On attache l'ID de l'EES s'il existe (cas d'une modification)
        const finalEesId = idFromUrl || data?.id;
        if (finalEesId) {
            formData.append("id", finalEesId);
        }

        try {
            const result = await UpdateEes(formData);
            if (result?.error) {
                setStatus({ type: 'error', message: result.error });
            } else {
                setStatus({ type: 'success', message: "Opération réussie ! Vos modifications ont été enregistrées." });
                // On ne reset le formulaire que si c'est une création (pas d'ID)
                if (!finalEesId) formRef.current?.reset();
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Une erreur inattendue est survenue." });
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-3xl z-10 animate-scale-in">
                {/* Glassmorphic Card */}
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Header with gradient */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <GraduationCap size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Établissements
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                {data?.id ? 'Modifier' : 'Ajouter'} <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">l'EES</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium">Gestion de l'établissement d'enseignement supérieur</p>
                        </div>
                    </div>

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
                                <div className="w-1.5 h-8 bg-linear-to-b from-indigo-400 to-purple-400 rounded-full shadow-lg shadow-indigo-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <GraduationCap size={24} className="text-indigo-400" />
                                    Informations Principales
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Nom de l'établissement</label>
                                    <input
                                        name="nom_ees"
                                        defaultValue={data?.nom_ees || ""}
                                        placeholder="Ex: Polytechnique"
                                        required
                                        className="glass-input p-5 rounded-2xl w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Domaine d'étude</label>
                                    <input
                                        name="domaine"
                                        defaultValue={data?.domaine || ""}
                                        placeholder="Ex: Ingénierie"
                                        required
                                        className="glass-input p-5 rounded-2xl w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Type de structure</label>
                                    <select
                                        name="ees_type"
                                        defaultValue={data?.ees_type || "PUBLIC"}
                                        className="glass-input p-5 rounded-2xl w-full appearance-none cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23818CF8' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', paddingRight: '3rem' }}
                                    >
                                        <option value="PUBLIC" className="bg-slate-900">🏫 Établissement Public</option>
                                        <option value="PRIVE" className="bg-slate-900">🏢 Établissement Privé</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Localisation (Ville)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                        <input
                                            name="ville"
                                            defaultValue={data?.ville || ""}
                                            placeholder="Ex: Yaoundé"
                                            required
                                            className="glass-input p-5 pl-12 rounded-2xl w-full"
                                        />
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
                                <input
                                    name="site_ees"
                                    defaultValue={data?.site_ees || ""}
                                    placeholder="https://www.exemple.com"
                                    className="glass-input p-5 rounded-2xl w-full"
                                />
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
                                <FiliereInput initialFilieres={data?.filieres || []} />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Sparkles size={24} className="text-emerald-400" />
                                    À Propos
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Description de l'établissement</label>
                                <textarea name="ees_bio" defaultValue={data?.ees_bio || ""} placeholder="Racontez brièvement l'histoire..." rows={4} className="glass-input w-full p-5 rounded-2xl resize-none"></textarea>
                            </div>
                        </div>

                        <div className="pt-6">
                            <SubmitButton isEditing={!!data?.id} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormFields;
