"use client";
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface FiliereInputProps {
  // On accepte un tableau d'objets (format Prisma) ou de strings
  initialFilieres?: { nom_filiere: string }[] | string[];
}

export default function FiliereInput({ initialFilieres = [] }: FiliereInputProps) {
  // 1. Initialisation de l'état avec les données existantes
  const [list, setList] = useState<string[]>(() => {
    return initialFilieres.map(f => typeof f === 'string' ? f : f.nom_filiere);
  });

  const [val, setVal] = useState("");

  const add = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault(); // Empêche la soumission du formulaire entier
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setVal("");
    }
  };

  const remove = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Affichage des badges existants et nouveaux */}
      <div className="flex flex-wrap gap-2">
        {list.length > 0 ? (
          list.map((f, i) => (
            <span key={i} className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight border border-indigo-500/20 animate-in zoom-in-95 duration-200">
              {f}
              <X
                size={14}
                className="cursor-pointer hover:text-rose-500 transition-colors"
                onClick={() => remove(i)}
              />
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic ml-2">Aucune filière ajoutée pour le moment.</p>
        )}
      </div>

      {/* Saisie avec gestion de la touche Entrée */}
      <div className="flex gap-2">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add(e)}
          placeholder="Ex: Génie Logiciel, Marketing..."
          className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-sm"
        />
        <button
          type="button"
          onClick={add}
          className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Champ caché : C'est CE champ que ta Server Action lira via formData.get("filieres") */}
      <input type="hidden" name="filieres" value={list.join(",")} />
    </div>
  );
}
