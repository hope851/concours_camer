"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UpdateConcours, GetProgrammesByEes } from "../action/newconcours";
import { Sparkles, MapPin, BookOpen, CheckCircle2 } from "lucide-react";

interface ConcoursProps {
    data: {
        id: string;
        nom_concours?: string;
        nomConcours?: string;
        etat: boolean;
        concours_bio?: string | null;
        concoursBio?: string | null;
        diplome_requis?: string;
        diplomeRequis?: string;
        adress_exam?: string | null;
        adressExam?: string | null;
        date_ouverture?: Date | string;
        dateOuverture?: Date | string;
        limite_depot?: Date | string;
        limiteDepot?: Date | string;
        date_exam_ecrit?: Date | string | null;
        dateExamEcrit?: Date | string | null;
        date_exam_oral?: Date | string | null;
        dateExamOral?: Date | string | null;
        eesId?: string;
        programmeId?: string | null;
        ees?: {
            id?: string;
            nomEes?: string;
            nom_ees?: string;
        };
    };
}

const formatDateForInput = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
};

function FormFieldsContent({ data }: ConcoursProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();

    const ees_id = searchParams.get("ees_id") || data?.eesId || data?.ees?.id;
    const id = searchParams.get("id") || data?.id;

    const [programmes, setProgrammes] = useState<{ id: string; nomProgramme: string; niveau: string }[]>([]);

    useEffect(() => {
        if (!ees_id) return;
        GetProgrammesByEes(ees_id).then(setProgrammes);
    }, [ees_id]);

    async function handleClientAction(formData: FormData) {
        if (!ees_id || !id) {
            alert("❌ Erreur : ID de l'EES ou du concours manquant.");
            return;
        }

        formData.append("ees_id", ees_id);
        formData.append("id", id);

        const isChecked = formData.get("etat") === "on";
        formData.set("etat", String(isChecked));

        const result = await UpdateConcours(formData);

        if (result?.error) {
            alert("❌ " + result.error);
        } else {
            alert("✅ Concours mis à jour avec succès !");
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-3xl z-10 animate-scale-in">
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Header with gradient */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Sparkles size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Concours
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                Modifier le <span className="bg-linear-to-r from-indigo-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">Concours</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium">Mise à jour pour : <span className="text-indigo-300 font-bold">{data?.ees?.nomEes ?? data?.ees?.nom_ees}</span></p>
                        </div>
                    </div>

                    <form action={handleClientAction} ref={formRef} className="p-10 space-y-10">

                        {/* Section 1: Informations Générales */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-indigo-400 to-blue-400 rounded-full shadow-lg shadow-indigo-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <BookOpen size={24} className="text-indigo-400" />
                                    Informations Générales
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3 md:col-span-2">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Intitulé du Concours</label>
                                    <input
                                        name="nom_concours"
                                        defaultValue={data?.nomConcours ?? data?.nom_concours}
                                        required
                                        className="glass-input p-5 rounded-2xl w-full"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 md:col-span-2">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Programme d'étude associé (Optionnel)</label>
                                    <select
                                        name="programme_id"
                                        defaultValue={data?.programmeId ?? ""}
                                        className="glass-input p-5 rounded-2xl w-full [&>option]:bg-slate-900 [&>option]:text-white"
                                    >
                                        <option value="">— Aucun programme spécifique —</option>
                                        {programmes.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nomProgramme} ({p.niveau})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-3 md:col-span-2">
                                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Diplôme Requis</label>
                                    <input
                                        name="diplome_requis"
                                        defaultValue={data?.diplomeRequis ?? data?.diplome_requis}
                                        required
                                        className="glass-input p-5 rounded-2xl w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Calendrier */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Sparkles size={24} className="text-purple-400" />
                                    Calendrier des Épreuves
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-sm">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Ouverture</label>
                                    <input
                                        name="date_ouverture"
                                        type="datetime-local"
                                        defaultValue={formatDateForInput(data?.dateOuverture ?? data?.date_ouverture)}
                                        required
                                        className="glass-input p-4 rounded-xl text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-purple-300 uppercase tracking-[0.2em]">Limite Dépôt</label>
                                    <input
                                        name="limite_depot"
                                        type="datetime-local"
                                        defaultValue={formatDateForInput(data?.limiteDepot ?? data?.limite_depot)}
                                        required
                                        className="glass-input p-4 rounded-xl text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-pink-300 uppercase tracking-[0.2em]">Examen écrit</label>
                                    <input
                                        name="date_exam_ecrit"
                                        type="datetime-local"
                                        defaultValue={formatDateForInput(data?.dateExamEcrit ?? data?.date_exam_ecrit)}
                                        required
                                        className="glass-input p-4 rounded-xl text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-pink-300 uppercase tracking-[0.2em]">Examen oral</label>
                                    <input
                                        name="date_exam_oral"
                                        type="datetime-local"
                                        defaultValue={formatDateForInput(data?.dateExamOral ?? data?.date_exam_oral)}
                                        required
                                        className="glass-input p-4 rounded-xl text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Adresse de l'examen */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin size={18} className="text-rose-400" />
                                Lieu d'examen
                            </label>
                            <input
                                name="adress_exam"
                                defaultValue={data?.adressExam ?? data?.adress_exam ?? ""}
                                placeholder="ex: Campus universitaire (Yaoundé 1) : Amphi 1000"
                                className="glass-input p-5 rounded-2xl w-full"
                            />
                        </div>

                        {/* Section 3: Bio et État */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Sparkles size={24} className="text-cyan-400" />
                                    Description & Activation
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Description / Bio</label>
                                <textarea
                                    name="concours_bio"
                                    defaultValue={data?.concoursBio ?? data?.concours_bio ?? ""}
                                    placeholder="Détails supplémentaires sur le concours..."
                                    rows={4}
                                    className="glass-input p-5 rounded-2xl w-full resize-none"
                                ></textarea>
                            </div>

                            <label className="flex items-center gap-4 p-6 bg-white/5 border border-white/5 hover:border-indigo-500/30 rounded-2xl cursor-pointer transition-all group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="etat"
                                        id="etat"
                                        defaultChecked={data?.etat === true}
                                        className="peer sr-only"
                                    />
                                    <div className="w-12 h-6 bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-6" />
                                </div>
                                <div>
                                    <p className="font-black text-white text-sm uppercase tracking-wider">Concours actif</p>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Cochez pour rendre ce concours visible immédiatement</p>
                                </div>
                            </label>
                        </div>

                        {/* Bouton de soumission */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group cursor-pointer"
                            >
                                <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                                <span>Sauvegarder les modifications</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function FormFields(props: ConcoursProps) {
    return (
        <Suspense fallback={<div className="text-center p-10 text-white">Chargement...</div>}>
            <FormFieldsContent {...props} />
        </Suspense>
    );
}
