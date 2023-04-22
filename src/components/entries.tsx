import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ShowEntries() {
	const entries = await prisma.ranking.findMany();

	return (
		<div className='grid grid-cols-1 grid-flow-row'>
			{entries.map((entry, index) => (
				<div className='border-b border-neutral-300 p-4 w-full mb-4' key={index}>
					<a className='font-bold text-lg hover:underline' href={"/rank/"+entry.id}>
						{entry.name}
					</a>
					<div className='text-sm text-neutral-500'>
						{entry.description}
					</div>
				</div>
			))}
		</div>
	);
}

