'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MovieProps } from '@/types'
import { useGlobalContext } from '@/context'
import { getSearchResults } from '@/lib/api'
import MovieItem from '@/components/shared/movie/movie-item'
import Loader from '@/components/shared/loader'
import Login from '@/components/shared/login'
import ManageAccount from '@/components/shared/manage-account'
import Navbar from '@/components/shared/navbar'
import { toast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'

const Page = () => {
	const [movies, setMovies] = useState<MovieProps[]>([])

	const { account, pageLoader, setPageLoader } = useGlobalContext()
	const { data: session }: any = useSession()
	const params = useParams()

	useEffect(() => {
		const getData = async () => {
			try {
				const [movies, tv] = await Promise.all([
					getSearchResults('movie', params.query as string),
					getSearchResults('tv', params.query as string),
				])

				const moviesShow = movies 
					.filter((item: MovieProps) => item.backdrop_path !== null && item.poster_path !== null)
					.map((movie: MovieProps) => ({ ...movie, type: 'movie' }))

				const tvShows = tv
					.filter((item: MovieProps) => item.backdrop_path !== null && item.poster_path !== null)
					.map((movie: MovieProps) => ({ ...movie, type: 'tv' }))

				setMovies([...moviesShow, ...tvShows])
			} catch (error) {
				return toast({
					title: 'Error',
					description: 'Something went wrong',
					variant: 'destructive'
				})
			} finally {
				setPageLoader(false)
			}
		}

		getData()
	}, [])

	if (session === null) return <Login />
	if (account === null) return <ManageAccount />
	if (pageLoader) return <Loader />

	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
		>
			<Navbar />
			<div className='mt-[100px] space-y-0.5 md:space-y-2 px-4'>
				<h3 className='text-sm font-semibold text-[#e5e5e5] md:text-2xl'>
					Showing Results for {decodeURI(params.query as string)}
				</h3>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center scrollbar-hide py-5 lg:py-10'>
					{movies && movies.length ? movies
						.map(movie => (
							<MovieItem key={movie.id} movie={movie} />
						)) : null}
				</div>
			</div>
		</motion.div>
	)
}

export default Page