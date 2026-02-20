"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function FiliereInput() {
  const [list, setList] = useState<string[]>([]);
  const [val, setVal] = useState("");

  const add = () => {
    if (val.trim() && !list.includes(val.trim())) {
      setList([...list, val.trim()]);
      setVal("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Affichage des badges */}
      <div className="flex flex-wrap gap-2">
        {list.map((f, i) => (
          <span key={i} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
            {f} <X size={14} className="cursor-pointer" onClick={() => setList(list.filter((_, idx) => idx !== i))} />
          </span>
        ))}
      </div>
      {/* Saisie */}
      <div className="flex gap-2">
        <input 
          type="text" value={val} onChange={(e) => setVal(e.target.value)}
          placeholder="Ajouter une filière..." 
          className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-blue-500"
        />
        <button type="button" onClick={add} className="p-3 bg-blue-600 text-white rounded-xl"><Plus size={20}/></button>
      </div>
      {/* Champ caché pour envoyer à la Server Action */}
      <input type="hidden" name="filieres" value={list.join(",")} />
    </div>
  );
}
