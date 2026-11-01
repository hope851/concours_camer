"use client";
import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet"; // Import du type pour l'événement du clic
import "leaflet/dist/leaflet.css";

interface CarteProps {
  initialPosition?: [number, number] | null;
  onChoisir: (coordonnees: [number, number]) => void;
}

function ClicSurCarte({ onChoisir }: CarteProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onChoisir([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Carte({ initialPosition, onChoisir }: CarteProps) {
  const [point, setPoint] = useState<[number, number] | null>(initialPosition ?? null);

  function choisir(coordonnees: [number, number]) {
    setPoint(coordonnees);
    onChoisir(coordonnees);
  }

  return (
    <MapContainer
      center={initialPosition ?? [46.6, 2.5]}
      zoom={initialPosition ? 12 : 6}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />
      <ClicSurCarte onChoisir={choisir} />
      {point && <CircleMarker center={point} radius={10} />}
    </MapContainer>
  );
}
