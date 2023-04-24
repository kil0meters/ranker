import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Account = {
    id: Generated<string>;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
};
export type Ranking = {
    id: Generated<number>;
    userId: string;
    publicId: string;
    name: string;
    description: string | null;
    popularity: Generated<number>;
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
    id: Generated<string>;
    name: string | null;
    email: string | null;
    emailVerified: Timestamp | null;
    image: string | null;
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
    Account: Account;
    Ranking: Ranking;
    RankingItem: RankingItem;
    User: User;
    UserRankingItemChoiceIndex: UserRankingItemChoiceIndex;
    UserRankingItemElo: UserRankingItemElo;
};
