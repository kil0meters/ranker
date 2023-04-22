import { prisma } from "@/dbconfig";
import Link from "next/link";

async function ShowEntries() {
    const entries = await prisma.ranking.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    });

    return (
        <div className='grid grid-cols-1 grid-flow-row border-neutral-300 rounded border shadow-lg'>
            {entries.map((entry: any, index: number) => (
                <Link className='border-b last:border-b-0 border-neutral-300 p-4 w-full hover:bg-neutral-100 transition-all' key={index} href={"/rank/" + entry.id}>
                    <span className='font-bold text-lg'>
                        {entry.name}
                    </span>
                    <div className='text-sm text-neutral-500 mb-2'>
                        {entry.user.name}
                    </div>
                    {
                        entry.description.length > 180 ?
                            (
                                <div className='text text-neutral-700'>
                                    {entry.description.substring(0, 180) + '...'}
                                </div>
                            ) :
                            <div className='text text-neutral-700'>
                                {entry.description}
                            </div>
                    }
                </Link>
            ))}
        </div>
    );
}


export default function Home() {
    return (
        <main className="container mx-auto">
            <ShowEntries />
        </main>
    );
}
