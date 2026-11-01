import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TutelleDetail({ params }: Props) {
  const { id } = await params;

  const tutelle = await prisma.tutelleInstitutionelle.findUnique({
    where: { id },
    include: {
      ees: {
        include: {
          ville: true,
          _count: { select: { programme: true, sessionAdmission: true } }
        }
      },
      _count: { select: { ees: true } }
    },
  });

  if (!tutelle) return notFound();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navbar />
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-black text-white">{tutelle.nomTutelle}</h1>
          <p className="text-slate-400 mt-2">{tutelle.tutelleBio || "Détails de la tutelle"}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl text-white font-black">Établissements rattachés ({tutelle._count?.ees || 0})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutelle.ees.map((e) => (
            <Link
              key={e.id}
              href={`/explore/${e.id}`}
              className="group relative block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-indigo-500/50 transition"
            >
              <div className="flex items-between justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{e.nomEes}</h3>
                  <p className="text-sm text-slate-400">{e.ville?.nomVille || 'N/A'} • {e.eesType}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Filières</p>
                  <p className="text-white font-black text-lg">{e._count?.programme || 0}</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-indigo-400 absolute bottom-6 right-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
