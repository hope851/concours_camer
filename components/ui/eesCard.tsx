"use client";
import { DeleteEes } from "@/app/action/newees";
import { MapPin, School, Globe, GraduationCap, ArrowRight, Building2, X, ExternalLink, Sparkles, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface EesData {
  id: string;
  nomEes?: string;
  nom_ees?: string;
  eesType?: string;
  ees_type?: string;
  ville?: string | { nomVille: string } | null;
  domaine: string;
  siteEes?: string | null;
  site_ees?: string | null;
  tutelleId?: string;
  tutelle_id?: string;
  tutelleInstitutionelle?: {
    nomTutelle: string;
  };
  tutelle?: {
    nom_tutelle?: string;
    nomTutelle?: string;
  };
  programme?: { nomProgramme?: string; nom_filiere?: string }[];
  filieres?: { nom_filiere?: string; nomProgramme?: string }[];
  _count?: {
    programme?: number;
    sessionAdmission?: number;
    filieres?: number;
    concours?: number;
  };
}

interface EesProps {
  data: EesData;
  onEdit?: (ees: EesData) => void;
}

export default function EesCard({ data, onEdit }: EesProps) {
  const [showFiliere, setShowFiliere] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const nomEes = data.nomEes ?? data.nom_ees ?? "";
  const eesType = data.eesType ?? data.ees_type ?? "";
  const siteEes = data.siteEes ?? data.site_ees;
  const tutelleId = data.tutelleId ?? data.tutelle_id ?? "";
  const villeName = typeof data.ville === "object" ? (data.ville?.nomVille ?? "") : (data.ville ?? "");
  const nomTutelle = data.tutelleInstitutionelle?.nomTutelle ?? data.tutelle?.nomTutelle ?? data.tutelle?.nom_tutelle ?? "N/A";
  const programmes = data.programme ?? data.filieres ?? [];
  const countProgrammes = data._count?.programme ?? data._count?.filieres ?? programmes.length;
  const countConcours = data._count?.sessionAdmission ?? data._count?.concours ?? 0;

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowFiliere(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (window.confirm(`Supprimer définitivement ${nomEes} ?`)) {
      setIsDeleting(true);
      await DeleteEes(data.id, tutelleId);
      setIsDeleting(false);
    }
  };

  if (!mounted) return <div className="h-125 w-full bg-slate-50 animate-pulse rounded-[2.5rem]" />;

  return (
    <div className={`group bg-white rounded-[2.8rem] shadow-sm border border-slate-100 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full relative overflow-visible ${isDeleting ? "opacity-50 grayscale" : ""}`}>

      {/* HEADER : Type, Ville + ACTIONS VISIBLES */}
      <div className="p-8 pb-0">
        <div className="flex justify-between items-start mb-5">
          <div className="flex flex-col gap-2">
            <span className="w-fit px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
              {eesType}
            </span>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-tighter bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              {villeName}
            </div>
          </div>

          {/* BOUTONS D'ACTION TOUJOURS VISIBLES */}
          <div className="flex gap-2">
            <Link
              href={`/formupdateees?id=${data.id}&tutelle_id=${tutelleId}`}
              className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-colors shadow-sm border border-amber-100"
              onClick={() => onEdit?.(data)}
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors shadow-sm border border-rose-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
          {nomEes}
        </h2>
      </div>

      {/* CONTENU (DOMAINE, TUTELLE, SITE) */}
      <div className="p-8 space-y-6 grow">
        <div className="flex items-start gap-4">
          <div className="bg-slate-100 p-3 rounded-2xl text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <School className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Domaine</p>
            <p className="text-[15px] font-bold text-slate-700">{data.domaine}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-1">Sous tutelle de</p>
            <p className="text-[14px] font-bold text-slate-700 leading-snug line-clamp-1">{nomTutelle}</p>
          </div>
        </div>

        {siteEes && (
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Site Web</p>
              <a href={siteEes} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                <span className="truncate">{siteEes.replace(/(^\w+:|^)\/\//, '')}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER : STATS & ACTIONS */}
      <div className="px-8 pb-8 mt-auto">
        <div className="flex items-center justify-between mb-8 p-4 bg-slate-50/80 rounded-[2rem] border border-slate-100 relative">
          <div ref={containerRef} className="relative">
            <button
              onClick={() => setShowFiliere(!showFiliere)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-xs ${showFiliere ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-600 shadow-sm border border-slate-100"
                }`}
            >
              <GraduationCap className={`h-4 w-4 ${showFiliere ? "text-white" : "text-indigo-500"}`} />
              {countProgrammes} Filières
            </button>

            {showFiliere && (
              <div className="absolute bottom-full left-0 mb-4 bg-white border border-slate-200 shadow-2xl w-72 rounded-[2rem] z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30 font-black text-[10px] text-indigo-600 uppercase tracking-widest">
                  Offre Académique
                  <X className="h-4 w-4 cursor-pointer" onClick={() => setShowFiliere(false)} />
                </div>
                <div className="p-3 max-h-64 overflow-y-auto">
                  {programmes.map((filiere, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-2xl transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-xs font-bold text-slate-700">{filiere.nomProgramme ?? filiere.nom_filiere}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-black text-emerald-700 uppercase tracking-tighter">
              {countConcours} Concours
            </span>
          </div>
        </div>

        <Link
          href={`/gestionnaireconcours/${data.id}?nom_ees=${encodeURIComponent(nomEes)}&tutelle_id=${tutelleId}`}
          className="group/btn block w-full"
        >
          <div className="w-full py-5 bg-indigo-600 text-white font-black text-sm rounded-[1.8rem] transition-all duration-300 flex justify-center items-center gap-3 group-hover/btn:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95">
            Gérer les Concours
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
