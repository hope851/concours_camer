import { MapPin, BookOpen } from "lucide-react";
import Link from "next/link";

export default function TutelleCard({ data }: { data: any }) {

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-lg transition-all hover:shadow-2xl">
      {/* En-tête : Correction pour le nom long */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8">
        <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
          {/* Suppression de uppercase pour faciliter la lecture des noms longs */}
          {data.nom_tutelle}
        </h2>
        <div className="flex items-center text-blue-100 mt-3 opacity-90">
          <MapPin className="h-4 w-4 mr-2 shrink-0" />
          <span className="text-sm font-medium">{data.region || "Localisation non définie"}</span>
        </div>
      </div>

      {/* Corps des informations */}
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Tutelle Technique</p>
            <p className="text-slate-800 font-semibold text-lg">{data.nom_tutelle_tech || "Public"}</p>
          </div>
        </div>

        {/* Section Bio : Correction de la visibilité */}
        {data.tutelle_bio && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "{data.tutelle_bio}"
            </p>
          </div>
        )}
      </div>

      {/* Footer / Action */}

      <div className="px-8 pb-8">
  <Link 
    href={`/getionnaireees/${data.id}?nom_tutelle=${encodeURIComponent(data.nom_tutelle)}`}
    className="block w-full" 
  >
    {/* On utilise une div stylisée comme un bouton au lieu d'une balise <button> */}
    <div className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl transition-all duration-200 flex justify-center items-center gap-2 group cursor-pointer">
      Voir la liste des etablissements
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </div>
  </Link>
</div>
      
    </div>
  );
}
