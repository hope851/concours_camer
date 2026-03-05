"use client";
import { useFormStatus } from "react-dom";
import { useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AddConcours } from "../action/newconcours";


// Séparation du formulaire pour utiliser useSearchParams proprement
import { useFormStatus } from "react-dom";
import { useRef, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddConcours } from "../action/newconcours";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Calendar, Clock, MapPin, TextQuote, Zap } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span>Création en cours...</span>
                </>
            ) : (
                <>
                    <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Enregistrer le Concours</span>
                </>
            )}
        </button>
    );
}

function FormFields() {
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const ees_id = searchParams.get("ees_id");

    async function handleClientAction(formData: FormData) {
        setStatus(null);
        if (ees_id) {
            formData.append("ees_id", ees_id);
        } else {
            setStatus({ type: 'error', message: "ID de l'EES manquant dans l'URL." });
            return;
        }

        try {
            const result = await AddConcours(formData);
            if (result?.error) {
                setStatus({ type: 'error', message: result.error });
            } else {
                setStatus({ type: 'success', message: "Le concours a été configuré et activé avec succès !" });
                formRef.current?.reset();
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Une erreur est survenue lors de l'enregistrement." });
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

            {/* Section 1: Informations Générales */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-indigo-400 to-blue-400 rounded-full shadow-lg shadow-indigo-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Zap size={24} className="text-indigo-400" />
                        Informations Générales
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Intitulé du Concours</label>
                    <input
                        name="nom_concours"
                        placeholder="ex: Concours d'entrée en 1ère année"
                        required
                        className="glass-input p-5 rounded-2xl w-full"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Diplôme Requis</label>
                    <input
                        name="diplome_requis"
                        placeholder="ex: BAC, Licence, Master..."
                        required
                        className="glass-input p-5 rounded-2xl w-full"
                    />
                </div>
            </div>

            {/* Section 2: Calendrier */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Calendar size={24} className="text-purple-400" />
                        Calendrier des Épreuves
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-sm">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Ouverture</label>
                        <input name="date_ouverture" type="datetime-local" required className="glass-input p-4 rounded-xl text-sm" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-purple-300 uppercase tracking-[0.2em]">Limite dépôt</label>
                        <input name="limite_depot" type="datetime-local" required className="glass-input p-4 rounded-xl text-sm" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-pink-300 uppercase tracking-[0.2em]">Date Exam</label>
                        <input name="date_exam" type="datetime-local" required className="glass-input p-4 rounded-xl text-sm" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={18} className="text-rose-400" />
                    Lieu d'examen
                </label>
                <input
                    name="adress_exam"
                    placeholder="ex: Campus universitaire (Yaoundé 1) : Amphi 1000"
                    className="glass-input p-5 rounded-2xl w-full"
                />
            </div>

            {/* Section 3: Bio et État */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-linear-to-b from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-500/50" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <TextQuote size={24} className="text-cyan-400" />
                        Détails & Statut
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Bio du Concours</label>
                    <textarea
                        name="concours_bio"
                        placeholder="Précisez les conditions, les matières à composer..."
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
                            className="peer sr-only"
                        />
                        <div className="w-12 h-6 bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-6" />
                    </div>
                    <div>
                        <p className="font-black text-white text-sm uppercase tracking-wider">Activer le concours</p>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Visible par les étudiants dès l'enregistrement</p>
                    </div>
                </label>
            </div>

            <div className="pt-6">
                <SubmitButton />
            </div>
        </form>
    );
}

export default function FormConcoursPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl top-0 right-0 animate-pulse" />
                <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 left-0 animate-pulse" />
            </div>

            <div className="relative w-full max-w-3xl z-10">
                {/* Glassmorphic Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl">

                    {/* Header with gradient */}
                    <div className="relative p-10 bg-linear-to-r from-indigo-500/20 to-blue-500/20 border-b border-white/10">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute w-40 h-40 bg-indigo-400/30 rounded-full blur-2xl -top-20 -right-20" />
                        </div>
                        <div className="relative">
                            <span className="text-indigo-300 font-bold tracking-widest text-xs uppercase mb-2 block">Gestion des Concours</span>
                            <h1 className="text-4xl font-black text-white">
                                Ajouter un <span className="bg-linear-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Concours</span>
                            </h1>
                            <p className="text-slate-300 mt-2 font-medium">Configurez les détails de la session d'examen</p>
                        </div>
                    </div>

                    <Suspense fallback={<div className="text-center p-10 text-white">Chargement du formulaire...</div>}>
                        <FormFields />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
