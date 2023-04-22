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

    const now = performance.now();

    const data = schema.parse(await res.json());

    const rankingItems = await prisma.$transaction([
        prisma.rankingItem.findUnique({
            select: {
                id: true,
                globalElo: true,
                UserRankingItemElo: {
                    select: {
                        elo: true,
                    }
                }
            },
            where: {
                id: data.choices[0],
            }
        }),
        prisma.rankingItem.findUnique({
            select: {
                id: true,
                globalElo: true,
                UserRankingItemElo: {
                    select: {
                        elo: true,
                    }
                }
            },
            where: {
                id: data.choices[1],
            }
        }),
    ]);

    if (!rankingItems[0] || !rankingItems[1]) return NextResponse.error();

    console.log(`comparing elo: ${rankingItems[0].globalElo}, ${rankingItems[1].globalElo}`);
    console.log(`comparing elo: ${rankingItems[0].UserRankingItemElo[0].elo}, ${rankingItems[1].UserRankingItemElo[0].elo}`);
    // something something update elo
    const newGlobalElos = updateRatings(rankingItems[0].globalElo, rankingItems[1].globalElo, data.index == 0);
    const newLocalElos = updateRatings(rankingItems[0].UserRankingItemElo[0].elo, rankingItems[1].UserRankingItemElo[0].elo, data.index == 0);

    console.log(`result: ${newGlobalElos}`);
    console.log(`result: ${newLocalElos}`);

    const updated = await prisma.$transaction([
        prisma.rankingItem.update({
            data: {
                globalElo: newGlobalElos[0]
            },
            where: {
                id: data.choices[0]
            }
        }),

        prisma.userRankingItemElo.update({
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

        prisma.rankingItem.update({
            data: {
                globalElo: newGlobalElos[1]
            },
            where: {
                id: data.choices[1]
            }
        }),

        prisma.userRankingItemElo.update({
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

    await prisma.userRankingItemChoiceIndex.update({
        where: {
            userId_rankingId: {
                userId: session.user.id,
                rankingId: data.rankingId,
            }
        },
        data: { index: { increment: 1 } },
    });

    const end = performance.now();
    console.log(`time: ${end - now}`);

    return NextResponse.json(updated);
}
