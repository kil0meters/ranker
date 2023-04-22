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
            },
            where: {
                id: data.choices[0],
            }
        }),
        prisma.rankingItem.findUnique({
            select: {
                id: true,
                globalElo: true,
            },
            where: {
                id: data.choices[1],
            }
        }),
    ]);

    if (!rankingItems[0] || !rankingItems[1]) return NextResponse.error();

    const userRankingItems = await prisma.$transaction([
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


    // something something update elo
    const newGlobalElos = updateRatings(rankingItems[0].globalElo, rankingItems[1].globalElo, data.index == 0);
    const newLocalElos = updateRatings(userRankingItems[0].elo, userRankingItems[1].elo, data.index == 0);

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
