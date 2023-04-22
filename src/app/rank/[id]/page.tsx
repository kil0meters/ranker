import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Ranking({ params }: { params: { id: string } }) {
    const ranking = await prisma.ranking.findFirst({
        where: {
            id: params.id
        }
    });

    return (
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
    );
}
