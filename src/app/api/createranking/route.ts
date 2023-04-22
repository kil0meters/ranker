import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
    title: z.string(),
    description: z.string().optional(),
    items: z.array(z.object({
        text: z.string(),
    })).min(3)
});

export async function POST(request: Request) {
    const data = schema.parse(await request.json());

    return await prisma.ranking.create({
        data: {
            name: data.title,
            description: data.description,

            RankingItem: {
                createMany: {
                    data: data.items
                }
            }
        },
    });
}
