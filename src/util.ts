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


export function hashString(str: string) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
