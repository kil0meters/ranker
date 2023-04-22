import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    items: z.array(z.string()).min(3)
});

export async function POST(res: Request) {
    const data = schema.parse(await res.json());

    const rankingItems: { text: string }[] = [];
    for (let i = 0; i < data.items.length; i++) {
        rankingItems.push({ text: data.items[i] });
    }

    const ranking = await prisma.ranking.create({
        data: {
            name: data.name,
            description: data.description,

            RankingItem: {
                createMany: {
                    data: rankingItems,
                }
            }
        },
    });

    return NextResponse.json(ranking);
}
