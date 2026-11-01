"use client";

import { AddVille, GetPays, GetVilleById, UpdateVille } from "@/app/action/location";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";

function FormVillePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [paysList, setPaysList] = useState<{ id: string; nomPays: string; region: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nomVille: "", paysId: "" });

  useEffect(() => {
    Promise.all([GetPays()]).then(([pays]) => {
      setPaysList(pays);
      if (!id) {
        setLoading(false);
        return;
      }

      GetVilleById(id).then((ville) => {
        if (ville) {
          setForm({ nomVille: ville.nomVille, paysId: ville.paysId });
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

    const result = id ? await UpdateVille(formData) : await AddVille(formData);
    if (result?.error) {
      setStatus({ type: "error", message: result.error });
      return;
    }

    setStatus({
      type: "success",
      message: id ? "La ville a bien été modifiée." : "La ville a bien été ajoutée.",
    });

    if (!id) {
      form.reset();
      setForm({ nomVille: "", paysId: "" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Administration</p>
            <h1 className="text-3xl font-black text-white">{id ? "Modifier" : "Ajouter"} une ville</h1>
          </div>
        </div>

        {status && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${status.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"}`}>
            {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
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
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Nom de la ville</label>
              <input
                name="nom_ville"
                value={form.nomVille}
                onChange={(e) => setForm({ ...form, nomVille: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                placeholder="Yaoundé"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Pays associé</label>
              <select
                name="pays_id"
                value={form.paysId}
                onChange={(e) => setForm({ ...form, paysId: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                <option value="">Sélectionner un pays</option>
                {paysList.map((pays) => (
                  <option key={pays.id} value={pays.id}>{pays.nomPays}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >
              {id ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function FormVillePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Chargement...</div>}>
      <FormVillePageContent />
    </Suspense>
  );
}
