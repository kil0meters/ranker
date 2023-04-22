"use client";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



// type ApiResponse = {
//   title: string;
//   desc: string;
//   numberItem: number;
//   date: string;
//   url: string;
// }[];
//
//
// async function callApi(path: string, body:JSON ): Promise<ApiResponse> {
// 	const response = await fetch(path, {
// 		method: "POST",
// 		body: JSON.stringify(body),
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	});
//
// 	return response.json();
// }

const loadSize = 10;

export async function showEntries() {
	const entries = await prisma.ranking.findMany();


	return (
		<div className='grid grid-cols-1 grid-flow-row'>
			{entries.map((entry, index) => (
				<div className='border-b border-neutral-300 p-4 w-full mb-4' key={index}>
					<div className='font-bold text-lg hover:underline'>
						{entry.name}
					</div>
					<div className='text-sm text-neutral-500'>
						{entry.description}
					</div>
				</div>
			))}
		</div>
	);
}

