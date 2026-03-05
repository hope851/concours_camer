"use client";
import { MapPin, ArrowRight, ShieldCheck, Trash2, Edit3, LayoutDashboard, School, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DeleteTutelle } from "@/app/action/newtutelle";

interface TutelleProps {
  data: {
    id: string;
    nom_tutelle: string;
    nom_tutelle_tech?: string | null;
    region: string;
    tutelle_bio?: string | null;
    _count?: { ees: number };
  };
}

export default function TutelleCard({ data }: TutelleProps) {
  const handleDelete = async () => {
    if (window.confirm("Supprimer cette institution ?")) {
      await DeleteTutelle(data.id);
    }
  };

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.1)] hover:border-slate-200 h-full flex flex-col overflow-hidden">
      
      {/* 1. Header Minimaliste */}
      <div className="p-8 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Institution
          </div>
          
          {/* Badge Nombre discret mais chic */}
          <div className="flex items-baseline gap-1 bg-indigo-50 px-3 py-1 rounded-xl">
            <span className="text-indigo-600 font-black text-sm">{data._count?.ees || 0}</span>
            <span className="text-indigo-400 text-[8px] font-bold uppercase">Campus</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
          {data.nom_tutelle}
        </h2>
        
        <div className="flex items-center gap-1.5 mt-3 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
          <MapPin className="h-3 w-3 text-rose-400" />
          {data.region || "Cameroun"}
        </div>
      </div>

      {/* 2. Divider Subtil */}
      <div className="px-8"><div className="h-px w-full bg-slate-50" /></div>

      {/* 3. Corps */}
      <div className="p-8 pt-6 space-y-6 grow flex flex-col">
        
        {/* Tutelle Technique (Style List Item) */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Autorité de tutelle</p>
            <p className="text-slate-700 font-bold text-sm truncate">{data.nom_tutelle_tech || "Ministère"}</p>
          </div>
        </div>

        {/* Bio (Style Typographique Pur) */}
        {data.tutelle_bio && (
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 font-medium italic">
            {data.tutelle_bio}
          </p>
        )}

        {/* 4. Actions (Style Floating Footer) */}
        <div className="mt-auto space-y-3 pt-4">
          <Link 
            href={`/getionnaireees/${data.id}?nom_tutelle=${encodeURIComponent(data.nom_tutelle)}`}
            className="flex items-center justify-between w-full p-2 pl-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl transition-all duration-300 group/link"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Gérer les campus</span>
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/link:bg-white/20 transition-colors">
              <ChevronRight size={18} />
            </div>
          </Link>

          <div className="flex gap-2">
            <Link 
              href={`/formupdatetutelle?id=${data.id}`}
              className="flex-1 py-3 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-500 hover:text-indigo-600 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <Edit3 size={14} />
              Éditer
            </Link>
            
            <button 
              onClick={handleDelete}
              className="px-4 border border-slate-100 hover:border-rose-100 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-xl transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
