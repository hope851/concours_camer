"use client";

import { AddPays, GetPaysById, UpdatePays } from "@/app/action/location";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Globe2, Loader2, MapPin } from "lucide-react";

function FormPaysPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [form, setForm] = useState({ nomPays: "", region: "" });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    GetPaysById(id).then((pays) => {
      if (pays) {
        setForm({
          nomPays: pays.nomPays,
          region: pays.region,
        });
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (id) formData.append("id", id);

    const result = id ? await UpdatePays(formData) : await AddPays(formData);
    if (result?.error) {
      setStatus({ type: "error", message: result.error });
      return;
    }

    setStatus({
      type: "success",
      message: id ? "Le pays a bien été modifié." : "Le pays a bien été ajouté.",
    });

    if (!id) {
      form.reset();
      setForm({ nomPays: "", region: "" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <Globe2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Administration</p>
            <h1 className="text-3xl font-black text-white">{id ? "Modifier" : "Ajouter"} un pays</h1>
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
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Nom du pays</label>
              <input
                name="nom_pays"
                value={form.nomPays}
                onChange={(e) => setForm({ ...form, nomPays: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-0 focus:border-indigo-500"
                placeholder="Cameroun"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Région</label>
              <input
                name="region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-0 focus:border-indigo-500"
                placeholder="Afrique Centrale"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >
              {id ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function FormPaysPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Chargement...</div>}>
      <FormPaysPageContent />
    </Suspense>
  );
}
