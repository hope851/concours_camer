'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, BookOpen, Filter, X, ChevronDown, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface EES {
  id: string;
  nom_ees: string;
  ees_type: string;
  ville: string;
  domaine: string;
  tutelle: { nom_tutelle: string };
  _count?: { filieres: number; concours: number };
}

export default function ExplorePage() {
  const [eesData, setEesData] = useState<EES[]>([]);
  const [filteredEES, setFilteredEES] = useState<EES[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterVille, setFilterVille] = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchEES = async () => {
      try {
        const res = await fetch('/api/ees');
        const data = await res.json();
        setEesData(data);
        setFilteredEES(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement EES:', error);
        setLoading(false);
      }
    };
    fetchEES();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = eesData;

    if (searchTerm) {
      result = result.filter(ees =>
        ees.nom_ees.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ees.domaine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      result = result.filter(ees => ees.ees_type === filterType);
    }

    if (filterVille) {
      result = result.filter(ees => ees.ville === filterVille);
    }

    if (filterDomaine) {
      result = result.filter(ees => ees.domaine === filterDomaine);
    }

    setFilteredEES(result);
  }, [searchTerm, filterType, filterVille, filterDomaine, eesData]);

  const types = [...new Set(eesData.map(e => e.ees_type))];
  const villes = [...new Set(eesData.map(e => e.ville))];
  const domaines = [...new Set(eesData.map(e => e.domaine))];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterVille('');
    setFilterDomaine('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Navbar />

      {/* Header - REFINED PREMIUM LOOK */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-150 h-150 bg-indigo-600/10 rounded-full blur-[120px] -top-48 -right-48 animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5 pb-12 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} /> Répertoire Académique
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">Explorez les <span className="bg-linear-to-r from-indigo-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">Établissements</span></h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl italic">Accédez à l'excellence. Découvrez tous les établissements d'enseignement supérieur disponibles sur la plateforme.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar - PREMIUM */}
        <div className="mb-12 animate-scale-in delay-100">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un établissement, une ville, un domaine d'expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-14 pr-6 py-6 rounded-3xl"
            />
          </div>
        </div>

        {/* Filters Toggle - PREMIUM */}
        <div className="mb-10 flex gap-4 flex-wrap items-center animate-scale-in delay-150">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Filter size={14} />
            <span>Filtres Avancés</span>
            {showFilters ? <ChevronDown size={14} className="transform rotate-180 transition-transform" /> : <ChevronDown size={14} className="transition-transform" />}
          </button>

          {(filterType || filterVille || filterDomaine) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-3 px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-rose-500/30 transition-all active:scale-95"
            >
              <X size={14} /> Réinitialiser
            </button>
          )}

          <div className="ml-auto flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <span className="text-indigo-400">{filteredEES.length}</span> Établissement{filteredEES.length !== 1 ? 's' : ''} Trouvé{filteredEES.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Type d'établissement</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition [&>option]:bg-slate-900 [&>option]:text-white"
                >
                  <option value="">Tous les types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Ville Filter */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Ville</label>
                <select
                  value={filterVille}
                  onChange={(e) => setFilterVille(e.target.value)}
                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition [&>option]:bg-slate-900 [&>option]:text-white"
                >
                  <option value="">Toutes les villes</option>
                  {villes.map(ville => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>

              {/* Domaine Filter */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Domaine</label>
                <select
                  value={filterDomaine}
                  onChange={(e) => setFilterDomaine(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition [&>option]:bg-slate-900 [&>option]:text-white"
                >
                  <option value="">Tous les domaines</option>
                  {domaines.map(domaine => (
                    <option key={domaine} value={domaine}>
                      {domaine}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredEES.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in delay-200">
            {filteredEES.map(ees => (
              <Link
                key={ees.id}
                href={`/explore/${ees.id}`}
                className="group relative overflow-hidden rounded-[32px] glass-card border-white/5 p-10 hover:border-indigo-500/30 transition-all duration-500 shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    {ees.ees_type === 'PUBLIC' ? '🏤 Public' : '🏢 Privé'}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-6 group-hover:text-indigo-300 transition-colors line-clamp-2 tracking-tight leading-tight">{ees.nom_ees}</h3>

                  <div className="space-y-4 mb-8">
                    <p className="text-slate-400 text-sm font-bold flex items-center gap-3">
                      <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <MapPin size={16} className="text-pink-400" />
                      </div>
                      {ees.ville}
                    </p>
                    <p className="text-slate-400 text-sm font-bold flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <BookOpen size={16} className="text-blue-400" />
                      </div>
                      {ees.domaine}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filières</p>
                      <p className="text-white font-black text-xl">{ees._count?.filieres || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Concours</p>
                      <p className="text-white font-black text-xl">{ees._count?.concours || 0}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-4">Aucun établissement ne correspond à votre recherche</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
