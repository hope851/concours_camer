"use client";

import { UpdateTutelle } from "../action/newtutelle";
import { useRouter } from "next/navigation";
import { Sparkles, MapPin, Building2, TextQuote, CheckCircle2 } from "lucide-react";

interface TutelleProps {
    data: {
        id: string;
        nom_tutelle: string;
        nom_tutelle_tech?: string | null;
        region: string;
        tutelle_bio?: string | null;
    };
}

export default function FormTutelleClient({ data }: TutelleProps) {
    // const router = useRouter();

    async function handleClientAction(formData: FormData) {
        // On force l'ID de la base de données dans le formulaire
        formData.append("id", data.id);

        const result = await UpdateTutelle(formData);

        if (result?.error) {
            alert("❌ Erreur : " + result.error);
        } else {
            alert("✅ Réussite ! L'institut a été mis à jour.");
            //router.refresh(); 
            // router.push("/gestionnairetutelle"); 
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] -bottom-48 -left-48 animate-pulse" />
            </div>

            <div className="relative w-full max-w-2xl z-10 animate-scale-in">
                <div className="glass-card rounded-[40px] shadow-3xl overflow-hidden border-white/5">

                    {/* Header with gradient */}
                    <div className="relative p-12 bg-linear-to-br from-white/[0.08] to-transparent border-b border-white/10">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Building2 size={120} className="text-white" />
                        </div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} /> Gestion des Tutelles
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                Institution <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">Tutélaire</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-xs">Modification de la structure existante.</p>
                        </div>
                    </div>

                    <form action={handleClientAction} className="p-10 space-y-10">

                        {/* Nom de l'institut */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Building2 size={24} className="text-emerald-400" />
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
                                    defaultValue={data?.nom_tutelle}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Tutelle Technique */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Tutelle Technique
                                </label>
                                <input
                                    type="text"
                                    name="nom_tutelle_tech"
                                    placeholder="Nom technique (optionnel)"
                                    className="glass-input p-5 rounded-2xl w-full"
                                    defaultValue={data?.nom_tutelle_tech || ""}
                                />
                            </div>

                            {/* Région */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">
                                    Région ou Pays
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        name="region"
                                        placeholder="ex: Centre, Cameroun"
                                        required
                                        className="glass-input p-5 pl-12 rounded-2xl w-full"
                                        defaultValue={data?.region}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio / Description */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-8 bg-linear-to-b from-teal-400 to-emerald-400 rounded-full shadow-lg shadow-teal-500/50" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <TextQuote size={24} className="text-teal-400" />
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
                                    defaultValue={data?.tutelle_bio || ""}
                                ></textarea>
                            </div>
                        </div>

                        {/* Bouton de soumission */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group"
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
