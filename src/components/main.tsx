"use-client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ApiResponse = {
  title: string;
  desc: string;
  numberItem: number;
  date: string;
  url: string;
}[];


async function callApi(path: string, body:JSON ): Promise<ApiResponse> {
	const response = await fetch(path, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response.json();
}

const loadSize = 10;

export async function showEntries() {
	const entries = await callApi("/api/entries", JSON.parse(JSON.stringify({ "numload":loadSize })));

	return (
		<div className='grid grid-cols-1 grid-flow-row'>
			{entries.map((entry, index) => (
				<div className='border-b border-neutral-300 p-4 w-full mb-4' key={index}>
					<div className='font-bold text-lg hover:underline'>
						{entry.title}
					</div>
					<div className='text-sm text-neutral-500'>
						{entry.desc}
					</div>
				</div>
			))}
		</div>
	);
}

