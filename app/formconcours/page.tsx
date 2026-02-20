"use client";
import { AddConcours } from "../action/newconcours";

export default function FormConcoursPage() {

    async function handleClientAction(formData: FormData) {
        const result = await AddConcours(formData);
        if (result?.error) {
            alert("❌ " + result.error); 
        } else {
            alert("✅ Concours enregistré avec succès !");
            // Optionnel : réinitialiser le formulaire ici
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
                
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Nouveau Concours
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Configurez les détails de la session d'examen</p>
                </header>
                
                <form action={handleClientAction} className="space-y-8">
                    
                    {/* Section 1: Informations Générales */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Intitulé du Concours</label>
                            <input 
                                name="nom_concours" 
                                placeholder="ex: Concours d'entrée en 1ère année" 
                                required 
                                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">ID de l'EES (UUID)</label>
                                <input 
                                    name="ees_id" 
                                    placeholder="Collez l'ID de l'établissement" 
                                    required 
                                    className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300" 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Diplôme Requis</label>
                                <input 
                                    name="diplome_requis" 
                                    placeholder="ex: BAC, Licence..." 
                                    required 
                                    className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Calendrier */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-indigo-50/50 p-6 rounded-4xl">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-indigo-900 uppercase">Ouverture</label>
                            <input name="date_ouverture" type="datetime-local" required className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-indigo-900 uppercase">Limite Dépôt</label>
                            <input name="limite_depot" type="datetime-local" required className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-indigo-900 uppercase">Examen</label>
                            <input name="date_exam" type="datetime-local" required className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                        </div>
                    </div>

                    {/* Section 3: Bio et État */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Description / Bio</label>
                            <textarea 
                                name="concours_bio" 
                                placeholder="Détails supplémentaires sur le concours..." 
                                rows={3} 
                                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 resize-none"
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit">
                            <input 
                                type="checkbox" 
                                name="etat" 
                                id="etat"
                                className="w-6 h-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                            />
                            <label htmlFor="etat" className="font-bold text-slate-700 cursor-pointer select-none">
                                Activer le concours immédiatement
                            </label>
                        </div>
                    </div>

                    {/* Bouton de soumission */}
                    <button 
                        type="submit" 
                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-slate-200 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
                    >
                        Enregistrer le Concours
                    </button>
                </form>
            </div>
        </div>
    );
}
