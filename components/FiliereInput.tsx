"use client";

import { useState } from "react";
import { X, Plus, BookOpen, GraduationCap } from "lucide-react";

export interface ProgrammeItem {
  id?: string;
  nomProgramme: string;
  specialite?: string;
  niveau: string;
}

interface FiliereInputProps {
  initialFilieres?: (ProgrammeItem | { id?: string; nomProgramme?: string; nom_filiere?: string; niveau?: string; specialite?: string } | string)[];
}

const NIVEAUX_SUGGESTION = [
  "L1",
  "L2",
  "L3",
  "M1",
  "M2",
  "Doctorat",
  "BTS",
  "DUT",
  "Ingénieur",
  "License Pro",
  "Master Pro",
  "Capacité",
  "Certificat"
];

export default function FiliereInput({ initialFilieres = [] }: FiliereInputProps) {
  const [list, setList] = useState<ProgrammeItem[]>(() => {
    return initialFilieres.map((f) => {
      if (typeof f === "string") {
        return { nomProgramme: f, niveau: "Licence" };
      }
      return {
        id: f.id,
        nomProgramme: f.nomProgramme ?? (f as any).nom_filiere ?? "",
        specialite: f.specialite ?? "",
        niveau: f.niveau ?? "Licence",
      };
    }).filter((p) => p.nomProgramme.trim() !== "");
  });

  const [nom, setNom] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [niveau, setNiveau] = useState("Licence");

  const add = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    const trimmedNom = nom.trim();
    if (!trimmedNom) return;

    const newItem: ProgrammeItem = {
      nomProgramme: trimmedNom,
      specialite: specialite.trim() || undefined,
      niveau: niveau.trim() || "Licence",
    };

    setList((prev) => [...prev, newItem]);
    setNom("");
    setSpecialite("");
    setNiveau("Licence");
  };

  const remove = (index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  const filieresNames = list.map((item) => item.nomProgramme).join(",");
  const jsonString = JSON.stringify(list);

  return (
    <div className="space-y-6">
      {/* List of active programmes */}
      <div className="space-y-3">
        {list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {list.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 backdrop-blur-sm group transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div className="truncate">
                    <p className="text-white font-bold text-sm truncate">{p.nomProgramme}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {p.niveau}
                      </span>
                      {p.specialite && (
                        <span className="text-xs text-slate-400 truncate font-medium">
                          • {p.specialite}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all ml-2 shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic ml-2">Aucun programme ou filière ajouté pour le moment.</p>
        )}
      </div>

      {/* Add new programme form inline */}
      <div className="p-5 bg-white/3 border border-white/5 rounded-3xl space-y-4">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <GraduationCap size={16} className="text-indigo-400" /> Ajouter une nouvelle filière / programme
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add(e)}
            placeholder="Nom de la filière (ex: Informatique)"
            className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500/50 transition"
          />

          <input
            type="text"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add(e)}
            placeholder="Spécialité (ex: Génie Logiciel)"
            className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500/50 transition"
          />

          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50 transition [&>option]:bg-slate-900 [&>option]:text-white"
          >
            {NIVEAUX_SUGGESTION.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={add}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus size={16} /> Ajouter le programme
        </button>
      </div>

      {/* Hidden serialization inputs */}
      <input type="hidden" name="filieres" value={filieresNames} />
      <input type="hidden" name="programmes_json" value={jsonString} />
    </div>
  );
}
