import { prisma } from "@/dbconfig";
import { notFound } from "next/navigation";
import { GuessButton } from "./guess-button";
import { getServerSession } from "next-auth/next";
import { RankingItem } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RankingSide from "./show-ranking";

export default async function Ranking({ params }: { params: { id: string } }) {
	const global_ranking = await prisma.ranking.findUnique({
		select: {
			name: true,
			user: true,
			description: true,
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
	let local_ranking = null;
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		local_ranking = null;
	}
	else {
		 local_ranking = await prisma.userRankingItemElo.findMany({
			select: {
				elo: true,
				rankingItem: true
			},
			where: {
				userId: session.user.id,
				rankingItem: {
					rankingId: params.id
				}
			},
			orderBy: {
				elo: "desc"
			}
		});
	}

	if (!global_ranking) notFound();


	const options: RankingItem[] = await prisma.$queryRaw`SELECT * FROM RankingItem WHERE rankingId = ${params.id} ORDER BY RAND() LIMIT 2`;

	return (
		<div className='mx-auto container flex flex-col gap-4'>
			<RankingSide global_rankings={global_ranking.RankingItem} local_rankings={local_ranking?.map((val, index)=>{
				return val.rankingItem;
			})}/>

			<div className="mr-40">
				<div className='pb-4'>
					<h1 className='text-2xl font-extrabold'>
						{global_ranking.name}
					</h1>
					<span className='text-neutral-500'>
						{global_ranking.user.name}
					</span>
				</div>

				<div className="grid grid-cols-2 w-full gap-8 mb-4">
					<GuessButton rankingId={params.id} options={options} index={0} />
					<GuessButton rankingId={params.id} options={options} index={1} />
				</div>
				<p>
					{global_ranking.description}
				</p>
			</div>

		</div>
	);
}
