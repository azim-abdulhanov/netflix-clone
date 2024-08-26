'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FavouriteProps, MovieDataProps, MovieProps } from '@/types'
import {
	getFavourites, 
	getPopularMovies, 
	getTopratedMovies, 
	getTrendingMovies, 
} from '@/lib/api'
import { useGlobalContext } from '@/context'
import Common from '@/components/shared/common'
import Loader from '@/components/shared/loader'
import Login from '@/components/shared/login'
import ManageAccount from '@/components/shared/manage-account'

const Page = () => {
	const [moviesData, setMoviesData] = useState<MovieDataProps[]>([])

	const { account, pageLoader, setPageLoader } = useGlobalContext()
	const { data: session }: any = useSession()

	useEffect(() => {
		const getAllMovies = async () => {
			try {
				const [
					trendingTv,
					topRatedTv,
					popularTv,
					trendingMovie,
					topRatedMovie,
					popularMovie,
					favourites
				] = await Promise.all([
					getTrendingMovies('tv'),
					getTopratedMovies('tv'),
					getPopularMovies('tv'),

					getTrendingMovies('movie'),
					getTopratedMovies('movie'),
					getPopularMovies('movie'),

					getFavourites(session?.user?.uid, account?._id),
				])

				const tvShows: MovieDataProps[] = [
					{ title: 'Trending TV Shows', data: trendingTv },
					{ title: 'Top Rated TV Shows', data: topRatedTv },
					{ title: 'Popular TV Shows', data: popularTv },
				]
					.map(item => ({...item, data: item.data
					.map((movie: MovieProps) => ({...movie, type: 'tv', addedToFavorites: favourites.length ? favourites
					.map((item: FavouriteProps) => item.movieId).indexOf(movie.id) : false}))
				}))

				const moviesShows: MovieDataProps[] = [
					{ title: 'Trending Movies', data: trendingMovie },
					{ title: 'Top Rated Movies', data: topRatedMovie },
					{ title: 'Popular Movies', data: popularMovie },
				]
					.map(item => ({...item, data: item.data
					.map((movie: MovieProps) => ({...movie, type: 'movie', addedToFavorites: favourites.length ? favourites
					.map((item: FavouriteProps) => item.movieId).indexOf(movie.id) : false}))
				}))

				const allMovies = [...moviesShows, ...tvShows]
				setMoviesData(allMovies)
			} catch (error) {
				console.log(error)
			} finally {
				setPageLoader(false)
			}
		}

		getAllMovies()
	}, [session])

	if (session === null) return <Login />
	if (account === null) return <ManageAccount />
	if (pageLoader) return <Loader />

	return <Common moviesData={moviesData} />
}

export default Page
