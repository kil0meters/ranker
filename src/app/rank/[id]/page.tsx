import { prisma } from "@/dbconfig";
import { notFound } from "next/navigation";
import { GuessButton } from "./guess-button";
import { EloRanking } from "./elo-ranking";
import { getServerSession } from "next-auth/next";
import { RankingItem } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function LocalLeaderboard({ rankingId }: { rankingId: string }) {

    const session = await getServerSession();


	if (!session || !session.user) {
		return (
			<div className="bg-neutral-300">
				You need to log in
			</div>
		);

    if (!session || !session.user) {
        return (
            <div className="bg-neutral-300">
                You need to log in
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

export default async function Ranking({ params }: { params: { id: string } }) {

    const ranking = await prisma.ranking.findUnique({
        select: {
            name: true,
            description: true,
            user: true,
            RankingItem: true
        },
        where: {
            id: params.id
        }
    });

    const session = await getServerSession(authOptions);
    console.log(session);

    if (!ranking) notFound();

    const options: RankingItem[] = await prisma.$queryRaw`SELECT * FROM RankingItem WHERE rankingId = ${params.id} ORDER BY RAND() LIMIT 2`;

	return (
		<div className='mx-auto container flex flex-col gap-4'>
			<aside className="w-auto w-max:10rem bg-blue-500 fixed top-16 right-2 mt-4">

						<EloRanking items={
							ranking.RankingItem.map(item => {
								return { elo: item.globalElo, name: item.text }
							})
						} />

			</aside>

            <div className="grid grid-cols-2 w-full gap-8 mb-4">
                <GuessButton rankingId={params.id} options={options} index={0} />
                <GuessButton rankingId={params.id} options={options} index={1} />
            </div>

				<p>
					{ranking.description}
				</p>

				<div className="grid grid-cols-2 w-full gap-8 mb-4">
					<GuessButton index={0} text={"C++"} />
					<GuessButton index={1} text={"Rust"} />
				</div>

				<div className="grid grid-cols-10 gap-4">
					<div className="col-start-3 col-end-6">
						<h2 className="text-lg font-bold">Personal Leaderboard</h2>

						<LocalLeaderboard rankingId={params.id} />
					</div>

					<div className="col-start-6 col-end-9">
						<h2 className="text-lg font-bold">Global Leaderboard</h2>

						<EloRanking items={
							ranking.RankingItem.map(item => {
								return { elo: item.globalElo, name: item.text }
							})
						} />
					</div>
				</div>


			</div>
		</div>
	);
}
