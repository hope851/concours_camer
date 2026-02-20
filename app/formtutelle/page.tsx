"use client";

import { AddTutelle } from "../action/newtutelle";

export default function FormTutellePage() {

    async function handleClientAction(formData: FormData) {
        const result = await AddTutelle(formData);

        if (result?.error) {
            alert("❌ Erreur : " + result.error); 
        } else {
            alert("✅ Réussite ! L'institut a été ajouté.");
        }
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-12">
                
                <header className="mb-10 flex items-center gap-4">
                    <div className="h-12 w-2 bg-emerald-500 rounded-full"></div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                            Institution Tutélaire
                        </h1>
                        <p className="text-slate-500 font-medium">Enregistrement d'une nouvelle structure de tutelle</p>
                    </div>
                </header>
                
                <form action={handleClientAction} className="space-y-6">
                    
                    {/* Nom de l'institut */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                            Nom de l'institut tutélaire
                        </label>
                        <input 
                            type="text" 
                            name="nom_tutelle" 
                            placeholder="ex: Ministère de l'Enseignement Supérieur" 
                            required 
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all duration-300 shadow-sm" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tutelle Technique */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                                Tutelle Technique
                            </label>
                            <input 
                                type="text" 
                                name="nom_tutelle_tech" 
                                placeholder="Nom technique (optionnel)" 
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all duration-300 shadow-sm" 
                            />
                        </div>

                        {/* Région */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                                Région ou Pays
                            </label>
                            <input 
                                type="text" 
                                name="region" 
                                placeholder="ex: Centre, Cameroun" 
                                required 
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all duration-300 shadow-sm" 
                            />
                        </div>
                    </div>

                    {/* Bio / Description */}
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                            Description de la structure
                        </label>
                        <textarea 
                            name="tutelle_bio" 
                            placeholder="Décrivez en quelques mots la mission de cette structure..." 
                            rows={4} 
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all duration-300 shadow-sm resize-none"
                        ></textarea>
                    </div>

                    {/* Bouton de soumission */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg shadow-slate-200 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <span>Ajouter l'institut</span>
                            <svg xmlns="http://www.w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
