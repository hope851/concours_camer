"use client";
import { MapPin, Calendar, Clock, School, GraduationCap, BookOpen, Edit3, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DeleteConcours } from "@/app/action/newconcours";

interface ConcoursProps {
  data: {
    id: string;
    nomConcours?: string;
    nom_concours?: string;
    etat: boolean;
    concoursBio?: string | null;
    concours_bio?: string | null;
    diplomeRequis?: string;
    diplome_requis?: string;
    adressExam?: string | null;
    adress_exam?: string | null;
    dateOuverture?: Date | string;
    date_ouverture?: Date | string;
    limiteDepot?: Date | string;
    limite_depot?: Date | string;
    dateExamEcrit?: Date | string | null;
    date_exam_ecrit?: Date | string | null;
    eesId?: string;
    ees_id?: string;
    ees: {
      nomEes?: string;
      nom_ees?: string;
      ville: string | { nomVille: string };
      eesType?: string;
      ees_type?: string;
    };
  };
}

export default function ConcoursCard({ data }: ConcoursProps) {
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  const nomConcours = data.nomConcours ?? data.nom_concours ?? "";
  const concoursBio = data.concoursBio ?? data.concours_bio;
  const diplomeRequis = data.diplomeRequis ?? data.diplome_requis ?? "";
  const adressExam = data.adressExam ?? data.adress_exam;
  const rawLimiteDepot = data.limiteDepot ?? data.limite_depot ?? new Date();
  const rawDateExam = data.dateExamEcrit ?? data.date_exam_ecrit ?? new Date();
  const eesId = data.eesId ?? data.ees_id ?? "";
  const nomEes = data.ees.nomEes ?? data.ees.nom_ees ?? "";
  const eesType = data.ees.eesType ?? data.ees.ees_type ?? "";
  const villeName = typeof data.ees.ville === "object" ? data.ees.ville.nomVille : data.ees.ville;

  const now = new Date();
  const dateLimite = new Date(rawLimiteDepot);
  const dateExamVal = new Date(rawDateExam);
  const isDepotTermine = now > dateLimite;
  const isExamTermine = now > dateExamVal;

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));

  const handleDelete = async () => {
    if (window.confirm(`⚠️ Attention : Voulez-vous vraiment supprimer le concours "${nomConcours}" ?`)) {
      setIsDeleting(true);
      try {
        const result = await DeleteConcours(data.id, eesId);

        if (result?.error) {
          alert(result.error);
          setIsDeleting(false);
        }
      } catch (error) {
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
              {eesType}
            </span>
            <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-tight">
              <MapPin className="h-3.5 w-3.5 mr-1 text-rose-500" />
              {villeName}
            </div>
          </div>

          <h3 className="text-2xl font-black leading-tight text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {nomConcours}
          </h3>
          <p className="text-indigo-500 text-xs font-black uppercase tracking-widest opacity-80">{nomEes}</p>
        </div>

        {/* Bio/Description Box */}
        {concoursBio && (
          <div className="mb-6 p-5 bg-indigo-50/30 rounded-[1.8rem] border-l-4 border-indigo-500 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Aperçu du concours</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic relative z-10">
              &quot;{concoursBio}&quot;
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
              <p className="text-sm font-bold text-slate-800 leading-none mt-0.5">{diplomeRequis}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50">
              <p className="text-[9px] text-rose-500 font-black uppercase mb-1">Clôture Dépôt</p>
              <p className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDate(rawLimiteDepot)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
              <p className="text-[9px] text-blue-500 font-black uppercase mb-1">Date Épreuve</p>
              <p className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(rawDateExam)}
              </p>
            </div>
          </div>

          {adressExam && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/50">
              <School className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-emerald-600 font-black uppercase">Centre d&apos;examen</p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">{adressExam}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
          <Link
            href={`/formupdateconcours?id=${data.id}&ees_id=${eesId}&nom_ees=${encodeURIComponent(nomEes)}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
            Éditer le concours
          </Link>

          <button
            onClick={handleDelete}
            className="p-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl transition-colors border border-rose-100 shadow-sm flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
