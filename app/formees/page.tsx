"use client";

import { AddEes } from "../action/newees";
import { GetTutelles } from "../action/newtutelle";
import { GetPays, GetVilles } from "../action/location";
import EesLocalisation from "@/components/EesLocalisation";
import { useFormStatus } from "react-dom";
import { useRef, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProgrammesInput from "@/components/ProgrammesInput";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, MapPin, Globe, BookOpen, GraduationCap, ArrowRight, Building2, Navigation } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group cursor-pointer"
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

    const tutelle_id_url = searchParams.get("tutelle_id");

    const [tutelles, setTutelles] = useState<{ id: string; nomTutelle: string }[]>([]);
    const [paysList, setPaysList] = useState<{ id: string; nomPays: string }[]>([]);
    const [villes, setVilles] = useState<{ id: string; nomVille: string; paysId: string }[]>([]);
    const [selectedPaysId, setSelectedPaysId] = useState<string>("");
    const [selectedVilleId, setSelectedVilleId] = useState<string>("");
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

    useEffect(() => {
        GetTutelles().then(setTutelles);
        GetPays().then((p) => {
            setPaysList(p);
            if (p.length > 0) setSelectedPaysId(p[0].id);
        });
    }, []);

    useEffect(() => {
        GetVilles(selectedPaysId || undefined).then(setVilles);
    }, [selectedPaysId]);

    async function handleClientAction(formData: FormData) {
        setStatus(null);
        try {
            const result = await AddEes(formData);
            if (result?.error) {
                setStatus({ type: 'error', message: result.error });
            } else {
                setStatus({ type: 'success', message: "L'établissement et ses programmes ont été ajoutés avec succès !" });
                formRef.current?.reset();
            }
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") throw error;
            console.error(error);
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

            {/* Hierarchical Relational Link: Tutelle */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-indigo-400 to-blue-400 rounded-full shadow-lg shadow-indigo-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Building2 size={24} className="text-indigo-400" />
                        Tutelle de Rattachement (Hiérarchie: Tutelle → EES)
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Sélectionner la Tutelle</label>
                    <select
                        name="tutelle_id"
                        defaultValue={tutelle_id_url ?? ""}
                        required
                        className="glass-input p-5 rounded-2xl w-full [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                        <option value="">-- Choisir une tutelle institutionnelle --</option>
                        {tutelles.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nomTutelle}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Informations Principales EES */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <GraduationCap size={24} className="text-blue-400" />
                        Informations de l'Établissement
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Nom de l'établissement (EES)</label>
                        <input name="nom_ees" placeholder="Ex: Ecole Nationale Supérieure Polytechnique" required className="glass-input p-5 rounded-2xl w-full" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Domaine d'étude principal</label>
                        <input name="domaine" placeholder="Ex: Sciences, Technologie & Ingénierie" required className="glass-input p-5 rounded-2xl w-full" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Statut d'établissement</label>
                    <select name="ees_type" className="glass-input p-5 rounded-2xl w-full [&>option]:bg-slate-900 [&>option]:text-white">
                        <option value="PUBLIC">🏫 Établissement Public</option>
                        <option value="PRIVE">🏢 Établissement Privé</option>
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Site Web Officiel</label>
                    <input name="site_ees" placeholder="https://www.polytechnique.cm" className="glass-input p-5 rounded-2xl w-full" />
                </div>
            </div>

            <EesLocalisation
                paysList={paysList}
                villes={villes}
                selectedPaysId={selectedPaysId}
                selectedVilleId={selectedVilleId}
                coordinates={coordinates}
                onPaysChange={setSelectedPaysId}
                onVilleChange={setSelectedVilleId}
                onCoordinatesChange={setCoordinates}
            />

            {/* Programmes & Filières */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <BookOpen size={24} className="text-cyan-400" />
                        Programmes d'Études Proposés (Hiérarchie: EES → Programme)
                    </h2>
                </div>

                <div className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.09] to-blue-500/[0.04] shadow-xl shadow-cyan-950/20">
                    <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Carte de création</p>
                            <h3 className="mt-1 text-xl font-black text-white">Ajoutez les programmes de l’EES</h3>
                        </div>
                        <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">Creation en une seule fois</span>
                    </div>
                    <div className="p-5 sm:p-8">
                        <ProgrammesInput mode="create" />
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <ArrowRight size={24} className="text-emerald-400" />
                        À Propos de l'Établissement
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Présentation générale / Historique</label>
                    <textarea name="ees_bio" placeholder="Présentation synthétique de l'établissement..." rows={4} className="glass-input p-5 rounded-2xl w-full resize-none"></textarea>
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

            <div className="relative w-full max-w-5xl z-10 animate-scale-in">
                {/* Master Glassmorphic Container */}
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Hero Section Header */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <GraduationCap size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Établissements (EES)
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                Ajouter un <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">EES</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-md">Enregistrez un nouvel établissement d'enseignement supérieur rattaché à une tutelle.</p>
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
