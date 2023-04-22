"use client";

import { useState } from "react";
import Image from "next/image";
import { RankingItem} from "@prisma/client";

const highlightColor = {
	first : "yellow-400",
	second: "orange-400",
	third : "red-400",
	others: "gray-400"
}

function GEloRanking({ items }: {items: RankingItem[]} ) {
	return (
		<div className="grid grid-cols-1 grid-flex-row pl-4">
			{
				items.map((val, index) => {
					return (
						<span key={index} className={`text-${index < 3 ? highlightColor.first : index < 6 ? highlightColor.second : index < 9 ? highlightColor.third : highlightColor.others}`}>
							{val.text}
						</span>

					)
				})
			}
		</div>
	)
}

function LEloRanking({ items }: { items: RankingItem[] | null | undefined}) {
	if (items === null || items === undefined) {
		return (
			<div>
				<span>
					You need to log in
				</span>
			</div>
		)
	}
	return (
		<div className="grid grid-cols-1 grid-flex-row pl-4">
			{
				items.map((val, index) => {
					return (
						<span key={index} className={`text-${index < 3 ? highlightColor.first : index < 6 ? highlightColor.second : index < 9 ? highlightColor.third : highlightColor.others}`}>
							{val.text}
						</span>
					)
				})
			}
		</div>
	)
}

export default function RankingSide({global_rankings, local_rankings}:{global_rankings:RankingItem[], local_rankings: RankingItem[]|null|undefined} ) {
	const [isGlobal, setIsGlobal] = useState(true);

	return (
		<aside className="w-40 rounded border-neutral-400 border-2 fixed top-16 right-2 mt-4">
			<div className="grid grid-cols-5 items-center gap-2 text-center">

				<h1 className="inline col-span-4 font-bold">
					{isGlobal ? "Global Ranking" : "Local Ranking"}
				</h1>
				<Image
					src="/toggle.svg"
					alt="toggle"
					width={20}
					height={20}
					onClick={() => setIsGlobal(!isGlobal)}
				/>
			</div>
			{isGlobal ? (
				<GEloRanking items={global_rankings} />
			) : (
				<LEloRanking items={local_rankings} />
			)

			}

		</aside>
	);
}

