import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json([]);
    }

    try {
        const [ees, concours] = await Promise.all([
            prisma.eES.findMany({
                where: {
                    OR: [
                        { nom_ees: { contains: query, mode: 'insensitive' } },
                        { ville: { contains: query, mode: 'insensitive' } },
                        { domaine: { contains: query, mode: 'insensitive' } },
                    ],
                },
                take: 5,
                select: { id: true, nom_ees: true, ville: true },
            }),
            prisma.concours.findMany({
                where: {
                    OR: [
                        { nom_concours: { contains: query, mode: 'insensitive' } },
                        { diplome_requis: { contains: query, mode: 'insensitive' } },
                    ],
                    etat: true,
                },
                take: 5,
                select: { id: true, nom_concours: true },
            }),
        ]);

        const formattedResults = [
            ...ees.map((e) => ({ id: e.id, name: e.nom_ees, type: 'ees' as const, ville: e.ville })),
            ...concours.map((c) => ({ id: c.id, name: c.nom_concours, type: 'concours' as const })),
        ];

        return NextResponse.json(formattedResults);
    } catch (error) {
        console.error('API Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
