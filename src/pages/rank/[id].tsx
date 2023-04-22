import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function Ranking({ ranking }: { ranking: any }) {

	return (
		<>
			<Head>
				<title>Ranking {ranking?.id}</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='flex flex-col items-center justify-center min-h-screen py-2'>
				<main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
					<h1 className='text-6xl font-bold'>
						Ranking {ranking?.id}
					</h1>
					<p className='mt-3 text-2xl'>
						{ranking?.name}
					</p>
					<p className='mt-3 text-2xl'>
						{ranking?.description}
					</p>
				</main>
			</div>
		</>
	);

}

export async function getStaticPaths() {
	const rankings = await prisma.ranking.findMany();
	const paths = rankings.map((ranking) => ({
		params: { id: ranking.id.toString() },
	}));

	return { paths, fallback: false };
}


export async function getStaticProps({ params: { id } }: { params: { id: string } }) {
	const ranking = await prisma.ranking.findUnique({
		where: { id: id },
	});

	// Convert Date objects to strings
	const rankingWithSerializedDates = {
		...ranking,
		createdAt: ranking?.createdAt.toJSON(),
		updatedAt: ranking?.updatedAt.toJSON(),
	};

	return {
		props: {
			ranking: rankingWithSerializedDates,
		},
	};
}

