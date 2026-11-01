import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const [ees, concours] = await Promise.all([
      prisma.ees.findMany({
        where: {
          OR: [
            { nomEes: { contains: query, mode: "insensitive" } },
            { ville: { nomVille: { contains: query, mode: "insensitive" } } },
            { domaine: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          nomEes: true,
          ville: { select: { nomVille: true } },
        },
      }),
      prisma.sessionAdmission.findMany({
        where: {
          OR: [
            { nomConcours: { contains: query, mode: "insensitive" } },
            { diplomeRequis: { contains: query, mode: "insensitive" } },
          ],
          etat: true,
        },
        take: 5,
        select: { id: true, nomConcours: true },
      }),
    ]);

    const formattedResults = [
      ...ees.map((e) => ({
        id: e.id,
        name: e.nomEes,
        type: "ees" as const,
        ville: e.ville.nomVille,
      })),
      ...concours.map((c) => ({
        id: c.id,
        name: c.nomConcours,
        type: "concours" as const,
      })),
    ];

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("API Search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
