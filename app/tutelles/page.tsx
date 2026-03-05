"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, MapPin, Users, ArrowRight, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Tutelle {
  id: string;
  nom_tutelle: string;
  nom_tutelle_tech?: string | null;
  tutelle_bio?: string | null;
  _count?: { ees: number };
}

export default function TutellesPage() {
  const [tutelles, setTutelles] = useState<Tutelle[]>([]);
  const [filtered, setFiltered] = useState<Tutelle[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tutelles");
        const data = await res.json();
        setTutelles(data);
        setFiltered(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = tutelles;
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.nom_tutelle.toLowerCase().includes(term) ||
          (t.nom_tutelle_tech && t.nom_tutelle_tech.toLowerCase().includes(term))
      );
    }
    setFiltered(result);
  }, [search, tutelles]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navbar />
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-black text-white">Tutelles institutionnelles</h1>
          <p className="text-slate-400 mt-2">Liste des autorités de tutelle et nombre d'établissements rattachés</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une tutelle..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.slice(0, visibleCount).map((t) => (
                <Link
                  key={t.id}
                  href={`/tutelles/${t.id}`}
                  className="group block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-indigo-500/50 transition relative"
                >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t.nom_tutelle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{t.nom_tutelle_tech || "Ministère"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Établissements</p>
                    <p className="text-white font-black text-2xl">{t._count?.ees || 0}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span className="text-sm">{t.tutelle_bio ? t.tutelle_bio.slice(0, 80) : "—"}</span>
                </div>

                <ArrowRight className="w-5 h-5 text-indigo-400 absolute bottom-6 right-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 9)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
              >
                Charger plus
              </button>
            </div>
          )}
        </>
        ) : (
          <div className="text-center py-16 text-slate-300">
            Aucune tutelle trouvée.
          </div>
        )}
      </div>
    </div>
  );
}
