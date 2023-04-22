import { prisma } from '@/dbconfig'
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const fillerData = () => Math.floor(Math.random() * 1000);

const schema = z.object({
    rankingId: z.string(),
    choices: z.array(z.string()).min(2).max(2),
    index: z.number()
});

export async function POST(res: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.error();

    const data = schema.parse(await res.json());

    const rankingItems = await prisma.rankingItem.findMany({
        where: {
            OR: [
                { id: data.choices[0] },
                { id: data.choices[1] },
            ],
            rankingId: data.rankingId
        }
    });

    if (rankingItems.length != 2) return NextResponse.error();

    const userRankingItems = [
        await prisma.userRankingItemElo.upsert({
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
        await prisma.userRankingItemElo.upsert({
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
    ];

    // something something update elo
    const newGlobalElos = [fillerData(), fillerData()];
    const newLocalElos = [fillerData(), fillerData()];

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
