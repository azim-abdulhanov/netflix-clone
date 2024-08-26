'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MovieDataProps, MovieProps } from '@/types'
import { useGlobalContext } from '@/context'
import { getMoviesByGenre } from '@/lib/api'
import Common from '@/components/shared/common'
import Loader from '@/components/shared/loader'
import Login from '@/components/shared/login'
import ManageAccount from '@/components/shared/manage-account'

const Page = () => {
	const [moviesData, setMoviesData] = useState<MovieDataProps[]>([])

	const { account, pageLoader, setPageLoader } = useGlobalContext()
	const { data: session } = useSession()

	useEffect(() => {
		const getAllMovies = async () => {
			try {
				const [
					action,
					adventure,
					animation,
					comedy,
					crime,
					documentary,
					drama,
					family,
					fantasy,
					horror,
					war,
				] = await Promise.all([
					getMoviesByGenre('movie', 28),
					getMoviesByGenre('movie', 12),
					getMoviesByGenre('movie', 16),
					getMoviesByGenre('movie', 35),
					getMoviesByGenre('movie', 80),
					getMoviesByGenre('movie', 99),
					getMoviesByGenre('movie', 18),
					getMoviesByGenre('movie', 10751),
					getMoviesByGenre('movie', 14),
					getMoviesByGenre('movie', 27),
					getMoviesByGenre('movie', 10752),
				])

				const allResult: MovieDataProps[] = [
					{ title: 'Action', data: action },
					{ title: 'Adventure', data: adventure },
					{ title: 'Animation', data: animation },
					{ title: 'Comedy', data: comedy },
					{ title: 'Crime', data: crime },
					{ title: 'Documentary', data: documentary },
					{ title: 'Drama', data: drama },
					{ title: 'Family', data: family },
					{ title: 'Fantasy', data: fantasy },
					{ title: 'Horror', data: horror },
					{ title: 'War', data: war },
				]
					.map(item => ({...item, data: item.data
					.map((movie: MovieProps) => ({...movie, type: 'movie', addedToFavorites: false})),
				}))

				setMoviesData(allResult)
			} catch (error) {
				console.log(error)
			} finally {
				setPageLoader(false)
			}
		}

		getAllMovies()
	}, [])

	if (session === null) return <Login />
	if (account === null) return <ManageAccount />
	if (pageLoader) return <Loader />

	return <Common moviesData={moviesData} />
}

export default Page
