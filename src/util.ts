import { cache } from "react";
import { db } from "./dbconfig";

export const getRankingItems = cache(async (rankingId: number) => {
    return await db
        .selectFrom("RankingItem")
        .select("text as name")
        .select("globalElo as elo")
        .select("publicId")
        .where("rankingId", "=", rankingId)
        .orderBy("globalElo", "desc")
        .execute();
});

