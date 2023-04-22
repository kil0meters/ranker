import Link from 'next/link'
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import './globals.css'
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const metadata = {
	title: 'Ranker',
	description: 'Rank things',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<body>
				<nav className='border-b border-neutral-300 p-4 w-full mb-4 fixed backdrop-blur shadow-white'>
					<div className='container mx-auto flex justify-between items-center'>
						<Link href={"/"} className='font-bold text-lg hover:underline'>
								Ranker
						</Link>

						<div>
							{session
								? (
									<div className='inline space-x-5'>
										<div className='inline'>Welcome! {session.user?.name} </div>
										<Link href={"/api/auth/signout"} className='font-bold text-lg hover:underline'>
											Sign out
										</Link>
									</div>
								)
								: (
									<Link href={"/signin"} className='font-bold text-lg hover:underline'>
										Sign in
									</Link>
								)
							}
						</div>
					</div>
				</nav>
				{/*place holder*/}
				<div style={{paddingTop:"5rem"}}>
				</div>
				{children}
			</body>
		</html>
	)
}
