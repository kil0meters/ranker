import { prisma } from '@/dbconfig'
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { updateRatings } from '@/elo';

const schema = z.object({
    rankingId: z.string(),
    choices: z.array(z.string()).min(2).max(2),
    index: z.number()
});

export async function POST(res: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.error();

    const data = schema.parse(await res.json());

    const rankingItems = await Promise.all([
        prisma.rankingItem.findUnique({
            where: {
                id: data.choices[0],
            }
        }),
        prisma.rankingItem.findUnique({
            where: {
                id: data.choices[1],
            }
        }),
    ]);

    if (!rankingItems[0] || !rankingItems[1]) return NextResponse.error();

    const userRankingItems = await Promise.all([
        prisma.userRankingItemElo.upsert({
            where: {
                userId_rankingItemId: {
                    userId: session.user.id,
                    rankingItemId: rankingItems[0].id
                },
            },
            update: {},
            create: {
                userId: session.user.id,
                rankingItemId: rankingItems[0].id
            }
        }),
        prisma.userRankingItemElo.upsert({
            where: {
                userId_rankingItemId: {
                    userId: session.user.id,
                    rankingItemId: rankingItems[1].id
                },
            },
            update: {},
            create: {
                userId: session.user.id,
                rankingItemId: rankingItems[1].id,
            }
        })
    ]);

    console.log(`comparing elo: ${rankingItems[0].globalElo}, ${rankingItems[1].globalElo}`);
    console.log(`comparing elo: ${userRankingItems[0].elo}, ${userRankingItems[1].elo}`);
    // something something update elo
    const newGlobalElos = updateRatings(rankingItems[0].globalElo, rankingItems[1].globalElo, data.index == 0);
    const newLocalElos = updateRatings(userRankingItems[0].elo, userRankingItems[1].elo, data.index == 0);

    console.log(`result: ${newGlobalElos}`);
    console.log(`result: ${newLocalElos}`);

    const updated = await prisma.$transaction(async (tx) => {
        return await Promise.all([
            tx.rankingItem.update({
                data: {
                    globalElo: newGlobalElos[0]
                },
                where: {
                    id: data.choices[0]
                }
            }),

            tx.userRankingItemElo.update({
                data: {
                    elo: newLocalElos[0]
                },
                where: {
                    userId_rankingItemId: {
                        rankingItemId: data.choices[0],
                        userId: session.user.id,
                    }
                }
            }),

            tx.rankingItem.update({
                data: {
                    globalElo: newGlobalElos[1]
                },
                where: {
                    id: data.choices[1]
                }
            }),

            tx.userRankingItemElo.update({
                data: {
                    elo: newLocalElos[1]
                },
                where: {
                    userId_rankingItemId: {
                        rankingItemId: data.choices[1],
                        userId: session.user.id,
                    }
                }
            }),
        ]);
    });

    return NextResponse.json(updated);
}
