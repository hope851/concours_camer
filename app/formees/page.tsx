"use client";
import { AddEes } from "../action/newees";
import { useFormStatus } from "react-dom";
import { useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FiliereInput from "@/components/FiliereInput";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-4xl shadow-xl shadow-blue-100 disabled:opacity-50 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enregistrement...
        </span>
      ) : "Ajouter l'EES"}
    </button>
  );
}

// Séparation du formulaire pour utiliser useSearchParams proprement
function FormFields() {
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    
    // Récupération de l'id de la tutelle dans l'URL (?tutelleId=...)
    const tutelleId = searchParams.get("tutelleId");

    async function handleClientAction(formData: FormData) {
        // On injecte l'ID récupéré du routing dans le formData avant l'envoi
        if (tutelleId) {
            formData.append("tutelleId", tutelleId);
        } else {
            alert("❌ Erreur : ID de tutelle manquant dans l'URL");
            return;
        }

        const result = await AddEes(formData);
        if (result?.error) alert("❌ " + result.error); 
        else {
            alert("✅ EES et Filières ajoutés !");
            formRef.current?.reset();
        }
    }

    return (
        <form ref={formRef} action={handleClientAction} className="space-y-8">
            {/* Informations Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Nom de l'établissement</label>
                    <input name="nom_ees" placeholder="Ex: Polytechnique" required className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Domaine d'étude</label>
                    <input name="domaine" placeholder="Ex: Ingénierie" required className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Type de structure</label>
                    <select name="ees_type" className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 appearance-none cursor-pointer">
                        <option value="PUBLIC">🏫 Établissement Public</option>
                        <option value="PRIVE">🏢 Établissement Privé</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Localisation (Ville)</label>
                    <input name="ville" placeholder="Ex: Yaoundé" required className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Site Web Officiel</label>
                    <input name="site_ees" type="email" placeholder="https://www.exemple.com" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300" />
                </div>
            </div>

            {/* OPTION FILIÈRES */}
            <div className="p-8 bg-blue-50/30 rounded-4xl border-2 border-dashed border-blue-100">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <label className="block text-sm font-black text-blue-900 uppercase tracking-widest">Filières à ajouter</label>
                </div>
                <FiliereInput />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Description de l'établissement</label>
                <textarea name="ees_bio" placeholder="Racontez brièvement l'histoire..." rows={4} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 resize-none"></textarea>
            </div>
            
            <div className="pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}

export default function FormEesPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-14">
                
                <header className="mb-12">
                    <span className="text-blue-600 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Administration</span>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase">
                        Nouvel <span className="text-blue-600">EES</span>
                    </h1>
                    <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-4"></div>
                </header>
                
                <Suspense fallback={<div className="text-center p-10">Chargement du formulaire...</div>}>
                    <FormFields />
                </Suspense>
            </div>
        </div>
    );
}
