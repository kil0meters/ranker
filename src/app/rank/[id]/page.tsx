import { db } from "@/dbconfig";
import { notFound } from "next/navigation";
import { EloRanking } from "./elo-ranking";
import { getPairByIndex } from "@/order";
import { GuessButtonContainer } from "./guess-button";
import { Suspense, cache } from "react";
import { LoadingGuessButtons } from "./loading-guess-buttons";
import { Metadata } from "next";
import { getRankingItems, hashString } from "@/util";
import { auth } from "@clerk/nextjs/app-beta";

async function LocalLeaderboard({ rankingId }: { rankingId: number }) {
    const { userId } = auth();

    if (!userId) {
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
            .select("text")
            .select("UserRankingItemElo.elo as elo")
            .where("rankingId", "=", rankingId)
            .where("UserRankingItemElo.userId", "=", userId)
            .orderBy("elo", "desc")
            .execute();

        return (
            <EloRanking items={ranking} />
        );
    }
}

async function GlobalLeaderboard({ rankingId }: { rankingId: number }) {
    const globalLeaderboard = await getRankingItems(rankingId);
    console.log(globalLeaderboard);
    return <EloRanking items={globalLeaderboard} />
}

async function GuessButtons({ rankingId, publicRankingId }: { rankingId: number, publicRankingId: string }) {
    let index: number;

    const { userId } = auth();

    if (userId) {
        await db
            .insertInto("UserRankingItemChoiceIndex")
            .ignore()
            .values({
                userId,
                rankingId,
            })
            .execute();

        let v = await db
            .selectFrom("UserRankingItemChoiceIndex")
            .select("index")
            .where("userId", "=", userId)
            .where("rankingId", "=", rankingId)
            .executeTakeFirstOrThrow();

        index = v.index;
    } else {
        index = 0;
    }

    let choices = [...await getRankingItems(rankingId)];
    choices.sort((a, b) => a.text > b.text ? 1 : -1); // required to make ordering consistent

    try {
        const pair = getPairByIndex(choices.length, index, userId ? hashString(userId) : 0);
        return (
            <GuessButtonContainer options={[choices[pair[0]], choices[pair[1]]]} rankingId={publicRankingId} />
        );
    } catch (e) {
        console.log(e);
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
        .leftJoin("User", "User.id", "Ranking.userId")
        .select("Ranking.id")
        .select("Ranking.publicId")
        .select("Ranking.name")
        .select("Ranking.description")
        .select("User.name as username")
        .where("Ranking.publicId", "=", id)
        .executeTakeFirst();
});

export const revalidate = 60;
export const runtime = "experimental-edge";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const ranking = await getRanking(params.id);

    if (!ranking) notFound();

    return {
        title: ranking.name,
        description: ranking.description
    };
}

async function RankingInner({ id }: { id: string }) {
    const ranking = await getRanking(id);

    if (!ranking) notFound();

    return <>
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
            <GuessButtons rankingId={ranking.id} publicRankingId={id} />
        </Suspense>

        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto flex flex-col md:flex-row gap-4">
            <div className="col-start-3 col-end-6 flex-grow">
                <h2 className="font-bold text-lg">Local Leaderboard</h2>

                <Suspense>
                    <LocalLeaderboard rankingId={ranking.id} />
                </Suspense>
            </div>

            <div className="col-start-6 col-end-9 flex-grow">
                <h2 className="font-bold text-lg">Global Leaderboard</h2>

                <Suspense>
                    <GlobalLeaderboard rankingId={ranking.id} />
                </Suspense>
            </div>
        </div>
    </>;
}

export default async function Ranking({ params }: { params: { id: string } }) {

    return (
        <div className='mx-auto container flex flex-col gap-4'>
            <Suspense>
                <RankingInner id={params.id} />
            </Suspense>
        </div>
    );
}
