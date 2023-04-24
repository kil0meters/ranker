import { db } from '@/dbconfig';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { auth } from '@clerk/nextjs/app-beta';

const schema = z.object({
    name: z.string().nonempty(),
    description: z.string().optional(),
    items: z.array(z.string()).min(3)
});

export const runtime = "edge";
export async function POST(res: Request) {
    const { userId } = auth();
    if (!userId) return NextResponse.error();

    const data = schema.parse(await res.json());

    const ranking = await db.transaction().execute(async (tx) => {
        const res = await tx
            .insertInto("Ranking")
            .values({
                name: data.name,
                publicId: nanoid(10),
                description: data.description,
                updatedAt: new Date(),
                userId
            }).executeTakeFirstOrThrow();

        const id = Number(res.insertId);

        const rankingItems: { text: string, publicId: string, rankingId: number }[] = [];
        for (let i = 0; i < data.items.length; i++) {
            rankingItems.push({ text: data.items[i], publicId: nanoid(12), rankingId: id });
        }

        await tx.insertInto("RankingItem").values(rankingItems).execute();

        const { publicId } = await tx.selectFrom("Ranking").select("publicId").where("id", "=", id).executeTakeFirstOrThrow();

        return { id: publicId };
    });

    return NextResponse.json(ranking);
}
