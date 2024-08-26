'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FavouriteProps, MovieProps } from '@/types'
import { useGlobalContext } from '@/context'
import { getFavourites } from '@/lib/api'
import MovieItem from '@/components/shared/movie/movie-item'
import Login from '@/components/shared/login'
import ManageAccount from '@/components/shared/manage-account'
import Loader from '@/components/shared/loader'
import Navbar from '@/components/shared/navbar'
import Banner from '@/components/shared/banner'
import { toast } from '@/components/ui/use-toast'

const Page = () => {
	const [favourites, setFavourites] = useState<FavouriteProps[]>([])

	const { account, setPageLoader, pageLoader } = useGlobalContext()
	const { data: session }: any = useSession()
	const router = useRouter()

	useEffect(() => {
		const getData = async () => {
			try {	
				const { data } = await getFavourites(session?.user?.uid, account?._id)
				setFavourites(data)
			} catch (error) {
				return toast({
					title: 'Error',
					description: 'Something went wrong, please try again later',
					variant: 'destructive',
				})
			} finally {
				setPageLoader(false)
			}
		}

		if (session && account) {
			getData()
		}
	}, [account, session])

	if (session === null) return <Login />
	if (account === null) return <ManageAccount />
	if (pageLoader) return <Loader />

	return (
		<main className='flex flex-col min-h-screen'>
			<Navbar />

			<div className='px-4 md:px-12'>
				{favourites && favourites.length === 0 ? (
					<div className='lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16'>
						<div className='xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0'>
							<div className='relative'>
								<div>
									<h1 className='my-2 text-gray-100 font-bold text-2xl'>
										Looks like you don`t have any favourites yet!
									</h1>
									<p className='my-2 text-gray-300'>
										Sorry about that! Please visit our hompage to get where you need to go.
									</p>
									<button
										className='sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-red-600 text-white hover:bg-red-700 transition-all duration-300 border-none outline-none'
										onClick={() => {
											setPageLoader(true)
											router.push('/')
										}}
									>
										Back to Homepage
									</button>
								</div>
							</div>
						</div>
					 <div>
						 <img src='https://i.ibb.co/ck1SGFJ/Group.png' alt='bg' />
					 </div>
				 	</div>
				) : (
					<>
						{/*@ts-ignore*/}
						<Banner movies={favourites as MovieProps[]} />

						<div className='h-40 space-y-0.5 md:space-y-4 px-4'>
							<h2 className='text-md font-semibold text-white md:text-2xl mb-4'>
								My List
							</h2>

							<div className='group relative md:-ml-2 pb-10'>
								<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
									{favourites && favourites.map(((favourite: FavouriteProps) => (
										<MovieItem
											key={favourite.movieId}
											movie={{
												id: +favourite.movieId as number,
												backdrop_path: favourite.backdrop_path,
												poster_path: favourite.poster_path,
												type: favourite.type,
												title: favourite.title,
												overview: favourite.overview,
											} as MovieProps} 
											favouriteId={favourite?._id}
											setFavourites={setFavourites}
										/>
									))).reverse()}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	)
}

export default Page