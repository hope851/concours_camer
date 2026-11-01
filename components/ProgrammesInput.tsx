"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  GraduationCap,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export interface ProgrammeItem {
  id?: string;
  nomProgramme: string;
  specialite?: string;
  niveau: string;
}

type ProgrammeInput =
  | ProgrammeItem
  | {
      id?: string;
      nomProgramme?: string;
      nom_filiere?: string;
      niveau?: string;
      specialite?: string;
    }
  | string;

interface ProgrammesInputProps {
  initialProgrammes?: ProgrammeInput[];
  mode?: "create" | "edit";
}

const niveauOptions = [
  "L1", "L2", "L3", "M1", "M2", "Doctorat", "BTS", "DUT",
  "Ingénieur", "Licence Pro", "Master Pro", "Capacité", "Certificat",
];

function normalizeProgramme(item: ProgrammeInput): ProgrammeItem | null {
  if (typeof item === "string") {
    const nomProgramme = item.trim();
    return nomProgramme ? { nomProgramme, niveau: "Licence" } : null;
  }

  const legacyNomFiliere = "nom_filiere" in item ? item.nom_filiere?.trim() : undefined;
  const nomProgramme = item.nomProgramme?.trim() || legacyNomFiliere || "";
  if (!nomProgramme) return null;

  return {
    id: item.id,
    nomProgramme,
    specialite: item.specialite?.trim() || undefined,
    niveau: item.niveau?.trim() || "Licence",
  };
}

export default function ProgrammesInput({
  initialProgrammes = [],
  mode = "create",
}: ProgrammesInputProps) {
  const [programmes, setProgrammes] = useState<ProgrammeItem[]>(() =>
    initialProgrammes.map(normalizeProgramme).filter((item): item is ProgrammeItem => item !== null),
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState({ nomProgramme: "", specialite: "", niveau: "Licence" });
  const [formError, setFormError] = useState("");

  const programmesJson = useMemo(() => JSON.stringify(programmes), [programmes]);
  const filieresNames = useMemo(
    () => programmes.map((programme) => programme.nomProgramme).join(","),
    [programmes],
  );

  const resetDraft = () => {
    setDraft({ nomProgramme: "", specialite: "", niveau: "Licence" });
    setEditingIndex(null);
    setFormError("");
  };

  const saveProgramme = () => {
    const nomProgramme = draft.nomProgramme.trim();
    if (!nomProgramme) {
      setFormError("Saisissez le nom d’un programme ou d’une filière.");
      return;
    }

    const duplicate = programmes.some(
      (programme, index) =>
        index !== editingIndex &&
        programme.nomProgramme.toLocaleLowerCase() === nomProgramme.toLocaleLowerCase() &&
        programme.specialite?.toLocaleLowerCase() === draft.specialite.trim().toLocaleLowerCase() &&
        programme.niveau === draft.niveau,
    );

    if (duplicate) {
      setFormError("Ce programme existe déjà avec les mêmes caractéristiques.");
      return;
    }

    const nextProgramme: ProgrammeItem = {
      nomProgramme,
      specialite: draft.specialite.trim() || undefined,
      niveau: draft.niveau,
    };

    if (editingIndex === null) {
      setProgrammes((current) => [...current, nextProgramme]);
    } else {
      setProgrammes((current) =>
        current.map((programme, index) =>
          index === editingIndex ? { ...programme, ...nextProgramme } : programme,
        ),
      );
    }

    resetDraft();
  };

  const editProgramme = (index: number) => {
    const programme = programmes[index];
    setEditingIndex(index);
    setDraft({
      nomProgramme: programme.nomProgramme,
      specialite: programme.specialite || "",
      niveau: programme.niveau,
    });
    setFormError("");
    window.requestAnimationFrame(() => document.getElementById("programme-nom")?.focus());
  };

  const removeProgramme = (index: number) => {
    setProgrammes((current) => current.filter((_, itemIndex) => itemIndex !== index));
    if (editingIndex === index) resetDraft();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            <Sparkles size={15} /> Liste des programmes
          </div>
          <p className="text-sm text-slate-400">
            {programmes.length} programme{programmes.length > 1 ? "s" : ""} sélectionné
            {programmes.length > 0 ? (mode === "edit" ? " · Données existantes" : " · Modifications locales") : ""}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Check size={13} className="text-emerald-400" />
          {mode === "edit" ? "Modification de l’EES" : "Finaliser avec le bouton EES"}
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.055] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
            <BookOpen size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Vous pouvez ajouter ou modifier plusieurs programmes</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Cliquez sur une carte pour la modifier, utilisez les actions de suppression, puis enregistrez l’établissement pour confirmer les changements.
            </p>
          </div>
        </div>
      </div>

      {programmes.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {programmes.map((programme, index) => {
            const isEditing = editingIndex === index;

            return (
              <article
                key={`${programme.nomProgramme}-${index}`}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] ${
                  isEditing
                    ? "border-cyan-400/60 bg-cyan-400/[0.09] shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-slate-950/30 hover:border-cyan-400/30"
                }`}
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 opacity-70" />
                <div className="flex items-start gap-3 pl-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-black text-white">{programme.nomProgramme}</h3>
                      {isEditing && (
                        <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-cyan-300">
                          Modifié
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-md border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-blue-300">
                        {programme.niveau}
                      </span>
                      {programme.specialite && (
                        <span className="max-w-full truncate rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-400">
                          {programme.specialite}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => editProgramme(index)}
                      aria-label={`Modifier ${programme.nomProgramme}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-cyan-300"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProgramme(index)}
                      aria-label={`Supprimer ${programme.nomProgramme}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] px-5 py-8 text-center">
          <GraduationCap className="mx-auto mb-3 text-slate-600" size={28} />
          <p className="text-sm font-semibold text-slate-400">Aucun programme n’est encore ajouté.</p>
          <p className="mt-1 text-xs text-slate-500">Ajoutez-en un ou plusieurs pour les rattacher à cet établissement.</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[24px] border border-indigo-400/20 bg-gradient-to-br from-indigo-500/[0.08] to-cyan-500/[0.04] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-400/10 p-2.5 text-indigo-300 ring-1 ring-indigo-400/20">
                <GraduationCap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  {editingIndex === null ? "Ajouter un programme" : "Modifier le programme"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingIndex === null ? "Saisissez une nouvelle filière ou une nouvelle spécialité." : "Modifiez les informations de cette ligne."}
                </p>
              </div>
            </div>
            {editingIndex !== null && (
              <button type="button" onClick={resetDraft} className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white" aria-label="Annuler la modification">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.9fr]">
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Nom du programme</span>
              <input
                id="programme-nom"
                value={draft.nomProgramme}
                onChange={(event) => setDraft((current) => ({ ...current, nomProgramme: event.target.value }))}
                onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), saveProgramme())}
                placeholder="Ex. Informatique"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Spécialité</span>
              <input
                value={draft.specialite}
                onChange={(event) => setDraft((current) => ({ ...current, specialite: event.target.value }))}
                placeholder="Ex. Génie logiciel"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Niveau</span>
              <select
                value={draft.niveau}
                onChange={(event) => setDraft((current) => ({ ...current, niveau: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 [&>option]:bg-slate-900"
              >
                {niveauOptions.map((niveau) => <option key={niveau} value={niveau}>{niveau}</option>)}
              </select>
            </label>
          </div>

          {formError && (
            <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
              {formError}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={saveProgramme}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.015] hover:shadow-cyan-500/30"
            >
              {editingIndex === null ? <Plus size={16} /> : <Check size={16} />}
              {editingIndex === null ? "Ajouter à la liste" : "Valider la modification"}
            </button>
          </div>
        </div>
      </div>

      <input type="hidden" name="filieres" value={filieresNames} />
      <input type="hidden" name="programmes_json" value={programmesJson} />
    </div>
  );
}
