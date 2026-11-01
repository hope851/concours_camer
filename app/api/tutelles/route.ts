import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tutelles = await prisma.tutelleInstitutionelle.findMany({
      include: {
        pays: { select: { nomPays: true, region: true } },
        _count: { select: { ees: true } },
      },
      orderBy: { nomTutelle: "asc" },
    });
    return NextResponse.json(tutelles);
  } catch (error) {
    console.error("Erreur API tutelles:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des tutelles" }, { status: 500 });
  }
}