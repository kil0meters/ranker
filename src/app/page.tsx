import { db } from "@/dbconfig";
import Link from "next/link";
import { Suspense } from "react";

function DescriptionDisplay({ description }: { description: string | null }) {
    if (!description) return null;
    if (description.length > 180) {
        return (
            <div className='text text-neutral-700'>
                {description.substring(0, 180) + '...'}
            </div>
        )
    } else {
        return (

            <div className='text text-neutral-700'>
                {description}
            </div >
        );
    }
}

export const runtime = "experimental-edge";
export const revalidate = 60;

async function ShowEntries() {
    const entries = await db
        .selectFrom("Ranking")
        .leftJoin("User", "User.id", "Ranking.userId")
        .select("Ranking.publicId")
        .select("Ranking.name")
        .select("Ranking.description")
        .select("User.name as username")
        .where("Ranking.private", "=", 0)
        .orderBy("createdAt", "desc")
        .limit(10)
        .execute();

    return (
        <div className='grid grid-cols-1 grid-flow-row border-neutral-300 rounded border shadow-lg'>
            {entries.map((entry, index: number) => (
                <Link className='border-b last:border-b-0 border-neutral-300 p-4 w-full hover:bg-neutral-100 transition-all' key={index} href={"/rank/" + entry.publicId}>
                    <span className='font-bold text-lg'>
                        {entry.name}
                    </span>
                    <div className='text-sm text-neutral-500 mb-2'>
                        {entry.username}
                    </div>

                    <DescriptionDisplay description={entry.description} />
                </Link>
            ))}
        </div>
    );
}


export default function Home() {
    return (
        <main className="container mx-auto">
            <Suspense>
                <ShowEntries />
            </Suspense>
        </main>
    );
}
