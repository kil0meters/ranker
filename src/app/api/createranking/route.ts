import { prisma } from '@/dbconfig';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

const schema = z.object({
    name: z.string().nonempty(),
    description: z.string().optional(),
    items: z.array(z.string()).min(3)
});

export async function POST(res: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.error();

    const data = schema.parse(await res.json());

    const rankingItems: { text: string }[] = [];
    for (let i = 0; i < data.items.length; i++) {
        rankingItems.push({ text: data.items[i] });
    }

    const ranking = await prisma.ranking.create({
        data: {
            name: data.name,
            description: data.description,
            userId: session.user.id,

            RankingItem: {
                createMany: {
                    data: rankingItems,
                }
            }
        },
    });

    return NextResponse.json(ranking);
}
