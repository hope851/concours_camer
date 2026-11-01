import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ees = await prisma.ees.findMany({
      include: {
        tutelleInstitutionelle: true,
        ville: true,
        _count: {
          select: {
            programme: true,
            sessionAdmission: true,
          },
        },
      },
      orderBy: { nomEes: "asc" },
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

