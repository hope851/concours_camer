"use client";
import { MapPin, Calendar, Clock, School, GraduationCap, BookOpen, Edit3, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DeleteConcours } from "@/app/action/newconcours";

interface ConcoursProps {
  data: {
    id: string;
    nom_concours: string;
    etat: boolean;
    concours_bio?: string | null;
    diplome_requis: string;
    adress_exam?: string | null;
    date_ouverture: Date | string;
    limite_depot: Date | string;
    date_exam: Date | string;
    ees_id: string;
    ees: {
      nom_ees: string;
      ville: string;
      ees_type: string;
    };
  };
}

export default function ConcoursCard({ data }: ConcoursProps) {
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  const now = new Date();
  const dateLimite = new Date(data.limite_depot);
  const dateExam = new Date(data.date_exam);
  const isDepotTermine = now > dateLimite;
  const isExamTermine = now > dateExam;

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));

  const handleDelete = async () => {
    if (window.confirm(`⚠️ Attention : Voulez-vous vraiment supprimer le concours "${data.nom_concours}" ?`)) {
      setIsDeleting(true);
      try {
        const result = await DeleteConcours(data.id, data.ees_id);

        // MODIFICATION ICI : Vérifiez strictement la présence d'une erreur
        if (result?.error) {
          alert(result.error);
          setIsDeleting(false);
        }
        // Si pas d'erreur, on ne fait rien, la redirection Next.js va s'occuper du reste
      } catch (error) {
        // On ne met pas d'alerte ici car la redirection lève une exception côté client aussi
        console.log("Navigation après suppression...");
      }
    }
  };

  if (!mounted) return <div className="h-125 w-full bg-slate-50 animate-pulse rounded-[2.8rem]" />;

  return (
    <div className={`group bg-white rounded-[2.8rem] shadow-sm border transition-all duration-500 flex flex-col h-full relative overflow-visible ${isDeleting ? "opacity-50 grayscale scale-95" : "hover:shadow-2xl hover:border-indigo-200"
      } ${!data.etat || isExamTermine ? "bg-slate-50/50" : ""} ${isDepotTermine && !isExamTermine ? "border-amber-200" : "border-slate-100"
      }`}>

      {/* Badge de Statut Dynamique */}
      <div className="absolute -top-3 right-8 z-10 scale-100 group-hover:scale-110 transition-transform">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest border ${!data.etat ? "bg-rose-500 text-white border-rose-400" :
            isExamTermine ? "bg-slate-800 text-white border-slate-700" :
              isDepotTermine ? "bg-amber-500 text-white border-amber-400" :
                "bg-emerald-500 text-white border-emerald-400 animate-pulse"
          }`}>
          {!data.etat ? "Désactivé" : isExamTermine ? "Terminé" : isDepotTermine ? "Dépôts Clos" : "● En cours"}
        </div>
      </div>

      <div className="p-8 flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg font-black uppercase shadow-sm">
              {data.ees.ees_type}
            </span>
            <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-tight">
              <MapPin className="h-3.5 w-3.5 mr-1 text-rose-500" />
              {data.ees.ville}
            </div>
          </div>

          <h3 className="text-2xl font-black leading-tight text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {data.nom_concours}
          </h3>
          <p className="text-indigo-500 text-xs font-black uppercase tracking-widest opacity-80">{data.ees.nom_ees}</p>
        </div>

        {/* Bio/Description Box */}
        {data.concours_bio && (
          <div className="mb-6 p-5 bg-indigo-50/30 rounded-[1.8rem] border-l-4 border-indigo-500 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Aperçu du concours</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic relative z-10">
              &quot;{data.concours_bio}&quot;
            </p>
          </div>
        )}

        {/* Technical Data Grid */}
        <div className="space-y-4 grow">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-indigo-100 transition-colors">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-100">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Niveau / Diplôme</p>
              <p className="text-sm font-bold text-slate-800 leading-none mt-0.5">{data.diplome_requis}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50">
              <p className="text-[9px] text-rose-500 font-black uppercase mb-1">Clôture Dépôt</p>
              <p className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDate(data.limite_depot)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
              <p className="text-[9px] text-blue-500 font-black uppercase mb-1">Date Épreuve</p>
              <p className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(data.date_exam)}
              </p>
            </div>
          </div>

          {data.adress_exam && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/50">
              <School className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-emerald-600 font-black uppercase">Centre d&apos;examen</p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">{data.adress_exam}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
          <Link
            href={`/formupdateconcours?id=${data.id}&ees_id=${data.ees_id}&nom_ees=${encodeURIComponent(data.ees.nom_ees)}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
            Éditer le concours
          </Link>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl border border-rose-100 transition-all duration-300 active:scale-90"
            title="Supprimer définitivement"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
