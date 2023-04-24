import { db } from "@/dbconfig";
import { notFound } from "next/navigation";
import { EloRanking } from "./elo-ranking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPairByIndex } from "@/order";
import { GuessButtonContainer } from "./guess-button";
import { Suspense, cache } from "react";
import { LoadingGuessButtons } from "./loading-guess-buttons";
import { Metadata } from "next";
import { getRankingItems } from "@/util";

async function LocalLeaderboard({ rankingId }: { rankingId: number }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return (
            <div className="bg-neutral-300 h-72 rounded flex">
                <span className="mx-auto my-auto">
                    You need to log in
                </span>
            </div>
        );
    } else {
        const ranking = await db
            .selectFrom("RankingItem")
            .innerJoin("UserRankingItemElo", "UserRankingItemElo.rankingItemId", "RankingItem.id")
            .select("text as name")
            .select("UserRankingItemElo.elo as elo")
            .where("rankingId", "=", rankingId)
            .where("UserRankingItemElo.userId", "=", session.user.id)
            .orderBy("elo", "desc")
            .execute();

        return (
            <EloRanking items={ranking} />
        );
    }
}

async function GlobalLeaderboard({ rankingId }: { rankingId: number }) {
    const globalLeaderboard = await getRankingItems(rankingId);
    return <EloRanking items={globalLeaderboard} />
}

async function GuessButtons({ rankingId, publicRankingId }: { rankingId: number, publicRankingId: string }) {
    let index: number;

    const session = await getServerSession(authOptions);

    if (session && session.user && session.user.id) {
        await db
            .insertInto("UserRankingItemChoiceIndex")
            .ignore()
            .values({
                userId: session.user.id,
                rankingId,
            })
            .execute();

        let v = await db
            .selectFrom("UserRankingItemChoiceIndex")
            .select("index")
            .where("userId", "=", session.user.id)
            .where("rankingId", "=", rankingId)
            .executeTakeFirstOrThrow();

        index = v.index;
    } else {
        index = 0;
    }

    let choices = await getRankingItems(rankingId);
    choices.sort((a, b) => a.name > b.name ? 1 : -1); // required to make ordering consistent

    try {
        const pair = getPairByIndex(choices.length, index);
        return (
            <GuessButtonContainer options={[choices[pair[0]], choices[pair[1]]]} rankingId={publicRankingId} />
        );
    } catch (e) {
        return (
            <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 max-w-lg rounded-lg mx-auto p-8 shadow-md">
                <span className="text-6xl font-bolder">You rated everything. 😊</span>
            </div>
        );
    }
}

const getRanking = cache(async (id: string) => {
    return await db
        .selectFrom("Ranking")
        .innerJoin("User", "User.id", "Ranking.userId")
        .select("Ranking.id")
        .select("Ranking.publicId")
        .select("Ranking.name")
        .select("Ranking.description")
        .select("User.name as username")
        .where("Ranking.publicId", "=", id)
        .executeTakeFirst();
});

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const ranking = await getRanking(params.id);

    if (!ranking) notFound();

    return {
        title: ranking.name,
        description: ranking.description
    };
}

export default async function Ranking({ params }: { params: { id: string } }) {
    const ranking = await getRanking(params.id);

    if (!ranking) notFound();

    return (
        <div className='mx-auto container flex flex-col gap-4'>
            <div>
                <h1 className='text-2xl font-extrabold'>
                    {ranking.name}
                </h1>
                <span className='text-neutral-500'>
                    {ranking.username}
                </span>
            </div>

            <p>
                {ranking.description}
            </p>

            <Suspense fallback={<LoadingGuessButtons />}>
                <GuessButtons rankingId={ranking.id} publicRankingId={params.id} />
            </Suspense>

            <div className="grid grid-cols-10 w-full gap-4">
                <div className="col-start-3 col-end-6">
                    <h2 className="font-bold text-lg">Local Leaderboard</h2>

                    <Suspense>
                        <LocalLeaderboard rankingId={ranking.id} />
                    </Suspense>
                </div>

                <div className="col-start-6 col-end-9">
                    <h2 className="font-bold text-lg">Global Leaderboard</h2>

                    <Suspense>
                        <GlobalLeaderboard rankingId={ranking.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
