import { prisma } from '@/dbconfig';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    items: z.array(z.string()).min(3)
});

export async function POST(res: Request) {
    const session = await getServerSession();
    if (!(session?.user?.email)) return NextResponse.error();

    const idres = await prisma.user.findUnique({
        select: {
            id: true,
        },
        where: {
            email: session.user.email
        }
    });

    if (!idres) return NextResponse.error();
    const { id } = idres;

    const data = schema.parse(await res.json());

    const rankingItems: { text: string }[] = [];
    for (let i = 0; i < data.items.length; i++) {
        rankingItems.push({ text: data.items[i] });
    }

    const ranking = await prisma.ranking.create({
        data: {
            name: data.name,
            description: data.description,
            userId: id,

            RankingItem: {
                createMany: {
                    data: rankingItems,
                }
            }
        },
    });

    return NextResponse.json(ranking);
}
