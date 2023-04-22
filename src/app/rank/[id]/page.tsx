import { prisma } from "@/dbconfig";
import { notFound } from "next/navigation";
import { EloRanking } from "./elo-ranking";
import { getServerSession } from "next-auth/next";
import { RankingItem } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPairByIndex } from "@/order";
import { GuessButtonContainer } from "./guess-button";

async function LocalLeaderboard({ rankingId }: { rankingId: string }) {
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
        const ranking = await prisma.userRankingItemElo.findMany({
            select: {
                elo: true,
                rankingItem: true
            },
            where: {
                userId: session.user.id,
                rankingItem: {
                    rankingId
                }
            },
            orderBy: {
                elo: "desc"
            }
        });

        return (
            <EloRanking items={
                ranking.map(item => {
                    return { elo: item.elo, name: item.rankingItem.text }
                })
            } />
        );
    }
}

async function GuessButtons({ rankingId }: { rankingId: string }) {
    let index: number;

    const session = await getServerSession(authOptions);

    if (session) {
        let v = await prisma.userRankingItemChoiceIndex.upsert({
            where: {
                userId_rankingId: {
                    userId: session.user.id,
                    rankingId,
                }
            },
            update: {},
            create: {
                userId: session.user.id,
                rankingId,
                index: 0,
            }
        });

        index = v.index;
    } else {
        index = 0;
    }

    let count = await prisma.rankingItem.count({
        where: {
            rankingId
        }
    });

    try {
        const pair = getPairByIndex(count, index);

        let options = await prisma.$transaction([
            prisma.rankingItem.findFirst({
                skip: pair[0],
                where: {
                    rankingId
                },
                orderBy: {
                    id: "desc",
                }
            }),

            prisma.rankingItem.findFirst({
                skip: pair[1],
                where: {
                    rankingId
                },
                orderBy: {
                    id: "desc",
                }
            })
        ]) as unknown as RankingItem[];

        if (!options[0] || !options[1]) return null;

        return (
            <GuessButtonContainer options={options} rankingId={rankingId} />
        );
    } catch (e) {
        return (
            <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 max-w-lg rounded-lg mx-auto p-8 shadow-md">
                <span className="text-6xl font-bolder">You rated everything. 😊</span>
            </div>
        );
    }
}

export default async function Ranking({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const ranking = await prisma.ranking.findUnique({
        select: {
            name: true,
            description: true,
            user: true,
            RankingItem: {
                orderBy: {
                    globalElo: "desc"
                }
            }
        },
        where: {
            id: params.id
        }
    });

    if (!ranking) notFound();

    return (
        <div className='mx-auto container flex flex-col gap-4'>
            <div>
                <h1 className='text-2xl font-extrabold'>
                    {ranking.name}
                </h1>
                <span className='text-neutral-500'>
                    {ranking.user.name}
                </span>
            </div>

            <p>
                {ranking.description}
            </p>

            <GuessButtons rankingId={params.id} />

            <div className="grid grid-cols-10 w-full gap-4">
                <div className="col-start-3 col-end-6">
                    <h2 className="font-bold text-lg">Local Leaderboard</h2>

                    <LocalLeaderboard rankingId={params.id} />
                </div>

                <div className="col-start-6 col-end-9">
                    <h2 className="font-bold text-lg">Global Leaderboard</h2>

                    <EloRanking items={
                        ranking.RankingItem.map(item => {
                            return { elo: item.globalElo, name: item.text }
                        })
                    } />
                </div>
            </div>
        </div>
    );
}
