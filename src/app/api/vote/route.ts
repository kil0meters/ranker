import { db } from '@/dbconfig'
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { updateRatings } from '@/elo';
import { auth } from '@clerk/nextjs/app-beta';

const schema = z.object({
    rankingId: z.string(),
    choices: z.array(z.string()).min(2).max(2),
    index: z.number()
});

export const runtime = "edge";
export async function POST(res: Request) {
    const { userId } = auth();
    if (!userId) return NextResponse.error();

    const data = schema.parse(await res.json());

    let items = await db
        .selectFrom("RankingItem")
        .leftJoin("Ranking", "RankingItem.rankingId", "Ranking.id")
        .select("RankingItem.text as name")
        .select("RankingItem.globalElo as elo")
        .select("RankingItem.id as id")
        .select("RankingItem.publicId as publicId")
        .where("Ranking.publicId", "=", data.rankingId)
        .execute();

    const rankingItems = [
        items.find((x) => x.publicId == data.choices[0])!,
        items.find((x) => x.publicId == data.choices[1])!,
    ];

    if (!rankingItems[0] || !rankingItems[1]) return NextResponse.error();

    await db
        .insertInto("UserRankingItemElo")
        .ignore()
        .values([
            {
                userId: userId,
                rankingItemId: rankingItems[0].id,
            },
            {
                userId: userId,
                rankingItemId: rankingItems[1].id,
            },
        ])
        .execute();

    const userRankingItems = await db
        .selectFrom("UserRankingItemElo")
        .select("elo")
        .select("rankingItemId")
        .where("userId", "=", userId)
        .where((eb) => eb.or([
            eb.cmpr("rankingItemId", "=", rankingItems[0].id),
            eb.cmpr("rankingItemId", "=", rankingItems[1].id),
        ]))
        .execute();

    // sometimes the db will give us the items in the wrong order
    if (userRankingItems[0].rankingItemId != rankingItems[0].id) {
        let tmp = userRankingItems[0];
        userRankingItems[0] = userRankingItems[1];
        userRankingItems[1] = tmp;
    }

    // something something update elo
    const newGlobalElos = updateRatings(rankingItems[0].elo, rankingItems[1].elo, data.index == 0);
    const newLocalElos = updateRatings(userRankingItems[0].elo, userRankingItems[1].elo, data.index == 0);

    await Promise.all([
        db
            .updateTable("RankingItem")
            .set({ globalElo: newGlobalElos[0] })
            .where("publicId", "=", data.choices[0])
            .executeTakeFirstOrThrow(),

        db
            .updateTable("RankingItem")
            .set({ globalElo: newGlobalElos[1] })
            .where("publicId", "=", data.choices[1])
            .executeTakeFirstOrThrow(),

        db
            .updateTable("UserRankingItemElo")
            .set({ elo: newLocalElos[0] })
            .where("userId", "=", userId)
            .where((eb) => eb.cmpr("rankingItemId", "=", eb
                .selectFrom("RankingItem")
                .select("id")
                .where("publicId", "=", data.choices[0])))
            .executeTakeFirstOrThrow(),

        db
            .updateTable("UserRankingItemElo")
            .set({ elo: newLocalElos[1] })
            .where("userId", "=", userId)
            .where((eb) => eb.cmpr("rankingItemId", "=", eb
                .selectFrom("RankingItem")
                .select("id")
                .where("publicId", "=", data.choices[1])))
            .executeTakeFirstOrThrow(),

        db
            .updateTable("UserRankingItemChoiceIndex")
            .set(eb => ({ index: eb.bxp("index", "+", 1) }))
            .execute()
    ]);

    return NextResponse.json({ success: true });
}
