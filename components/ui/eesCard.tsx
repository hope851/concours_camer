import { MapPin, School, Globe, GraduationCap, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

// Tu peux exporter cette interface pour l'utiliser ailleurs
interface EesProps {
  data: {
    id: string;
    nom_ees: string;
    domaine: string;
    ees_bio?: string | null;
    ville: string;
    site_ees?: string | null;
    ees_type: string; // Ex: Privé, Public, Grande École...
    tutelle: {
      nom_tutelle: string;
    };
    _count?: {
      filieres: number;
      concours: number;
    };
  };
}

export default function EesCard({ data }: EesProps) {
  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Header avec Type d'EES */}
      <div className="relative p-6 pb-0">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
            {data.ees_type}
          </span>
          {data.site_ees && (
            <a href={data.site_ees} target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
          {data.nom_ees}
        </h2>
        
        <div className="flex items-center gap-1.5 mt-2 text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">{data.ville}</span>
        </div>
      </div>

      {/* Corps de la carte */}
      <div className="p-6 space-y-5 grow">
        
        {/* Domaine d'étude */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600">
            <School className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-1">Domaine</p>
            <p className="text-sm font-semibold text-slate-700">{data.domaine}</p>
          </div>
        </div>

        {/* Tutelle Parent */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-400 uppercase font-bold leading-none mb-1">Sous tutelle de</p>
            <p className="text-sm font-semibold text-slate-700">{data.tutelle.nom_tutelle}</p>
          </div>
        </div>

        {/* Bio courte */}
        {data.ees_bio && (
          <p className="text-sm text-slate-500 line-clamp-2 italic border-l-2 border-slate-100 pl-3">
            {data.ees_bio}
          </p>
        )}
      </div>

      {/* Footer avec compteurs (si tu inclus _count dans ta requête Prisma) */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex gap-4 mb-4 border-t border-slate-50 pt-4">
            <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">{data._count?.filieres || 0} Filières</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-600">{data._count?.concours || 0} Concours</span>
            </div>
        </div>

        <Link 
          href={`/gestionnaire-ees/${data.id}`}
          className="flex w-full py-3.5 bg-slate-900 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-200 justify-center items-center gap-2 group/btn shadow-lg shadow-slate-200 hover:shadow-blue-200"
        >
          Détails de l'établissement
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
