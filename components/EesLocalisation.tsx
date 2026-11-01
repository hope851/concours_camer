"use client";

import dynamic from "next/dynamic";
import { LocateFixed, MapPin, Navigation } from "lucide-react";

const Carte = dynamic(() => import("@/components/Carte"), { ssr: false });

type LocalisationType = {
  id: string;
  nomVille: string;
  paysId: string;
};

type PaysType = {
  id: string;
  nomPays: string;
};

interface EesLocalisationProps {
  paysList: PaysType[];
  villes: LocalisationType[];
  selectedPaysId: string;
  selectedVilleId: string;
  coordinates: [number, number] | null;
  onPaysChange: (paysId: string) => void;
  onVilleChange: (villeId: string) => void;
  onCoordinatesChange: (coordinates: [number, number] | null) => void;
}

export default function EesLocalisation({
  paysList,
  villes,
  selectedPaysId,
  selectedVilleId,
  coordinates,
  onPaysChange,
  onVilleChange,
  onCoordinatesChange,
}: EesLocalisationProps) {
  return (
    <section className="space-y-6 rounded-[30px] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-slate-950/20 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/20">
            <MapPin size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">Localisation</p>
            <h2 className="text-xl font-black text-white">Pays, ville et coordonnées GPS</h2>
          </div>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Identique pour les deux formulaires
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="pays_id" className="text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            Pays de localisation
          </label>
          <select
            id="pays_id"
            name="pays_id"
            value={selectedPaysId}
            onChange={(event) => onPaysChange(event.target.value)}
            className="glass-input h-12 rounded-xl px-4 text-sm"
          >
            <option value="">Tous les pays</option>
            {paysList.map((pays) => (
              <option key={pays.id} value={pays.id}>{pays.nomPays}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="ville_id" className="text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            Ville de rattachement
          </label>
          <select
            id="ville_id"
            name="ville_id"
            value={selectedVilleId}
            onChange={(event) => onVilleChange(event.target.value)}
            className="glass-input h-12 rounded-xl px-4 text-sm"
          >
            <option value="">Sélectionner une ville existante</option>
            {villes.map((ville) => (
              <option key={ville.id} value={ville.id}>{ville.nomVille}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="posGeoLatitude" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            <Navigation size={14} className="text-cyan-300" /> Latitude GPS
          </label>
          <input
            id="posGeoLatitude"
            name="posGeoLatitude"
            type="number"
            step="any"
            value={coordinates?.[0] ?? ""}
            onChange={(event) => onCoordinatesChange([
              Number(event.target.value),
              coordinates?.[1] ?? 0,
            ])}
            placeholder="Ex. 3.8667"
            className="glass-input h-12 rounded-xl px-4 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="posGeoLongitude" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            <Navigation size={14} className="text-violet-300" /> Longitude GPS
          </label>
          <input
            id="posGeoLongitude"
            name="posGeoLongitude"
            type="number"
            step="any"
            value={coordinates?.[1] ?? ""}
            onChange={(event) => onCoordinatesChange([
              coordinates?.[0] ?? 0,
              Number(event.target.value),
            ])}
            placeholder="Ex. 11.5167"
            className="glass-input h-12 rounded-xl px-4 text-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <LocateFixed size={16} className="text-cyan-300" /> Carte interactive
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Cliquez pour placer le point
          </span>
        </div>
        <div className="p-2">
          <Carte
            initialPosition={coordinates}
            onChoisir={onCoordinatesChange}
          />
        </div>
      </div>
    </section>
  );
}
