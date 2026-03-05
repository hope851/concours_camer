import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ees = await prisma.eES.findMany({
      include: {
        tutelle: true,
        _count: {
          select: {
            filieres: true,
            concours: true,
          },
        },
      },
      orderBy: { nom_ees: "asc" },
    });

    return NextResponse.json(ees);
  } catch (error) {
    console.error("Erreur API EES:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
