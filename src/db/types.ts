import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Ranking = {
    id: Generated<number>;
    userId: string;
    publicId: string;
    name: string;
    description: string | null;
    popularity: Generated<number>;
    private: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RankingItem = {
    id: Generated<number>;
    rankingId: number;
    publicId: string;
    text: string;
    imageUrl: string | null;
    globalElo: Generated<number>;
};
export type User = {
    id: string;
    name: string;
    username: string;
};
export type UserRankingItemChoiceIndex = {
    userId: string;
    rankingId: number;
    index: Generated<number>;
};
export type UserRankingItemElo = {
    userId: string;
    rankingItemId: number;
    elo: Generated<number>;
};
export type DB = {
    Ranking: Ranking;
    RankingItem: RankingItem;
    User: User;
    UserRankingItemChoiceIndex: UserRankingItemChoiceIndex;
    UserRankingItemElo: UserRankingItemElo;
};
