// Crée un petit composant bouton
import { Send } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-linear-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 group"
    ><Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      {pending ? "Envoi en cours..." : "Publier l'Actualité"}
    </button>
  );
}
