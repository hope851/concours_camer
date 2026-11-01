"use client";

import { UpdateEes } from "../action/newees";
import { GetTutelles } from "../action/newtutelle";
import { GetPays, GetVilles } from "../action/location";
import { useFormStatus } from "react-dom";
import { useRef, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProgrammesInput from "@/components/ProgrammesInput";
import EesLocalisation from "@/components/EesLocalisation";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, MapPin, Globe, BookOpen, GraduationCap, Building2, Navigation } from "lucide-react";

interface EesProps {
    data: {
        id?: string;
        nomEes?: string;
        nom_ees?: string;
        domaine?: string;
        eesBio?: string | null;
        ees_bio?: string | null;
        villeId?: string;
        ville?: { id?: string; nomVille?: string; paysId?: string; pays?: { id?: string; nomPays?: string } } | string | null;
        siteEes?: string | null;
        site_ees?: string | null;
        posGeoLatitude?: number | null;
        posGeoLongitude?: number | null;
        eesType?: string;
        ees_type?: string;
        tutelleId?: string;
        tutelle_id?: string;
        programme?: { nomProgramme?: string; specialite?: string; niveau?: string; nom_filiere?: string }[];
        filieres?: { nom_filiere: string }[];
    };
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
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

    const idFromUrl = searchParams.get("id");
    const tutelleIdFromUrl = searchParams.get("tutelle_id");

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [tutelles, setTutelles] = useState<{ id: string; nomTutelle: string }[]>([]);
    const [paysList, setPaysList] = useState<{ id: string; nomPays: string }[]>([]);
    const [villes, setVilles] = useState<{ id: string; nomVille: string; paysId: string }[]>([]);

    const initialTutelleId = tutelleIdFromUrl || data?.tutelleId || data?.tutelle_id || "";
    const initialVilleId = typeof data?.ville === "object" ? data?.ville?.id ?? data?.villeId : "";
    const initialPaysId = typeof data?.ville === "object" ? data?.ville?.paysId ?? data?.ville?.pays?.id : "";

    const [selectedPaysId, setSelectedPaysId] = useState<string>(initialPaysId || "");
    const [selectedVilleId, setSelectedVilleId] = useState<string>(initialVilleId || "");
    const [coordinates, setCoordinates] = useState<[number, number] | null>(
        data?.posGeoLatitude !== null && data?.posGeoLatitude !== undefined && data?.posGeoLongitude !== null && data?.posGeoLongitude !== undefined
            ? [data.posGeoLatitude, data.posGeoLongitude]
            : null,
    );

    useEffect(() => {
        GetTutelles().then(setTutelles);
        GetPays().then(setPaysList);
    }, []);

    useEffect(() => {
        GetVilles(selectedPaysId || undefined).then(setVilles);
    }, [selectedPaysId]);

    async function handleClientAction(formData: FormData) {
        setStatus(null);
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
                if (!finalEesId) formRef.current?.reset();
            }
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") throw error;
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

            <div className="relative w-full max-w-5xl z-10 animate-scale-in">
                {/* Glassmorphic Card */}
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Header with gradient */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <GraduationCap size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Établissements (EES)
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                {data?.id ? 'Modifier' : 'Ajouter'} <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">l'EES</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium">Modification des caractéristiques et filières de l'établissement</p>
                        </div>
                    </div>

                    <form ref={formRef} action={handleClientAction} className="p-10 space-y-10">
                        {status && (
                            <div className={`flex items-center gap-4 p-6 rounded-2xl border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                                {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                <p className="font-bold text-sm">{status.message}</p>
                            </div>
                        )}

                        {/* Tutelle Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-indigo-400 to-purple-400 rounded-full shadow-lg shadow-indigo-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Building2 size={24} className="text-indigo-400" />
                                    Tutelle de Rattachement (Hiérarchie: Tutelle → EES)
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Tutelle Institutionnelle</label>
                                <select
                                    name="tutelle_id"
                                    defaultValue={initialTutelleId}
                                    required
                                    className="glass-input p-5 rounded-2xl w-full [&>option]:bg-slate-900 [&>option]:text-white"
                                >
                                    <option value="">-- Sélectionner une tutelle --</option>
                                    {tutelles.map((t) => (
                                        <option key={t.id} value={t.id}>{t.nomTutelle}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Informations Principales */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-blue-400 to-indigo-400 rounded-full shadow-lg shadow-blue-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <GraduationCap size={24} className="text-blue-400" />
                                    Informations de l'Établissement
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Nom de l'établissement</label>
                                    <input
                                        name="nom_ees"
                                        defaultValue={data?.nomEes ?? data?.nom_ees ?? ""}
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

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Type de structure</label>
                                <select
                                    name="ees_type"
                                    defaultValue={data?.eesType ?? data?.ees_type ?? "PUBLIC"}
                                    className="glass-input p-5 rounded-2xl w-full [&>option]:bg-slate-900 [&>option]:text-white"
                                >
                                    <option value="PUBLIC">🏫 Établissement Public</option>
                                    <option value="PRIVE">🏢 Établissement Privé</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Site Web Officiel</label>
                            <input
                                name="site_ees"
                                defaultValue={data?.siteEes ?? data?.site_ees ?? ""}
                                placeholder="https://www.exemple.com"
                                className="glass-input p-5 rounded-2xl w-full"
                            />
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

                        {/* Filières */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <BookOpen size={24} className="text-cyan-400" />
                                    Programmes d'Études Proposés (Hiérarchie: EES → Programme)
                                </h2>
                            </div>

                            <div className="overflow-hidden rounded-[32px] border border-indigo-400/20 bg-gradient-to-br from-indigo-400/[0.09] to-cyan-400/[0.04] shadow-xl shadow-indigo-950/20">
                                <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-300">Carte de modification</p>
                                        <h3 className="mt-1 text-xl font-black text-white">
                                            Modifier les programmes de <span className="text-cyan-300">{data?.nomEes ?? data?.nom_ees ?? "cette EES"}</span>
                                        </h3>
                                    </div>
                                    <span className="w-fit rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-300">{data?.id ? "EES en modification" : "Nouvelle EES"}</span>
                                </div>
                                <div className="p-5 sm:p-8">
                                    <ProgrammesInput
                                        mode="edit"
                                        initialProgrammes={data?.programme ?? data?.filieres ?? []}
                                    />
                                </div>
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
                                <textarea name="ees_bio" defaultValue={data?.eesBio ?? data?.ees_bio ?? ""} placeholder="Racontez brièvement l'histoire..." rows={4} className="glass-input w-full p-5 rounded-2xl resize-none"></textarea>
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

export default function FormEesClient(props: EesProps) {
    return (
        <Suspense fallback={<div className="text-center p-10 text-white">Chargement du formulaire...</div>}>
            <FormFields {...props} />
        </Suspense>
    );
}
