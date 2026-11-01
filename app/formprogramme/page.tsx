"use client";

import { AddProgramme, GetProgrammeById, UpdateProgramme } from "@/app/action/location";
import { GetAllEes } from "@/app/action/user";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Loader2 } from "lucide-react";

function FormProgrammePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [eesList, setEesList] = useState<{ id: string; nomEes: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ eesId: "", nomProgramme: "", specialite: "", niveau: "Licence" });

  useEffect(() => {
    Promise.all([GetAllEes()]).then(([ees]) => {
      setEesList(ees);
      if (!id) {
        setLoading(false);
        return;
      }

      GetProgrammeById(id).then((programme) => {
        if (programme) {
          setForm({
            eesId: programme.eesId,
            nomProgramme: programme.nomProgramme,
            specialite: programme.specialite || "",
            niveau: programme.niveau,
          });
        }
        setLoading(false);
      });
    });
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (id) formData.append("id", id);

    const result = id ? await UpdateProgramme(formData) : await AddProgramme(formData);
    if (result?.error) {
      setStatus({ type: "error", message: result.error });
      return;
    }

    setStatus({
      type: "success",
      message: id ? "Le programme a bien été modifié." : "Le programme a bien été ajouté.",
    });

    if (!id) {
      form.reset();
      setForm({ eesId: "", nomProgramme: "", specialite: "", niveau: "Licence" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Administration</p>
            <h1 className="text-3xl font-black text-white">{id ? "Modifier" : "Ajouter"} un programme</h1>
          </div>
        </div>

        {status && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${status.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"}`}>
            {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            <span className="text-sm font-semibold">{status.message}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Établissement</label>
              <select
                name="ees_id"
                value={form.eesId}
                onChange={(e) => setForm({ ...form, eesId: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option value="">Sélectionner un établissement</option>
                {eesList.map((ees) => (
                  <option key={ees.id} value={ees.id}>{ees.nomEes}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Nom du programme</label>
              <input
                name="nom_programme"
                value={form.nomProgramme}
                onChange={(e) => setForm({ ...form, nomProgramme: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                placeholder="Informatique"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Spécialité</label>
                <input
                  name="specialite"
                  value={form.specialite}
                  onChange={(e) => setForm({ ...form, specialite: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                  placeholder="Réseaux"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Niveau</label>
                <select
                  name="niveau"
                  value={form.niveau}
                  onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
                >
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                  <option value="Doctorat">Doctorat</option>
                  <option value="Cycle Court">Cycle Court</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >
              {id ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function FormProgrammePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Chargement...</div>}>
      <FormProgrammePageContent />
    </Suspense>
  );
}
