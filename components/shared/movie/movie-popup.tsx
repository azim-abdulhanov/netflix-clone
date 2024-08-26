'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useGlobalContext } from '@/context'
import { getMovieDetails, getSimilarMovies } from '@/lib/api'
import { MovieDetailsProps, MovieProps } from '@/types'
import MovieItem from './movie-item'
import ReactStars from 'react-stars'
import ReactPlayer from 'react-player'
import { Skeleton } from '@/components/ui/skeleton'

const MoviePopup = () => {
	const [movieDetails, setMovieDetails] = useState<MovieDetailsProps | null>(null)
	const [similarMovies, setSimilarMovies] = useState<MovieProps[]>([])
	const [key, setKey] = useState<string>()
	const [isLoading, setIsLoading] = useState(false)

	const { open, setOpen, movie } = useGlobalContext()

	useEffect(() => {
		const getMovie = async () => {
			try {
				setIsLoading(true)
				const extractMovieDetails = await getMovieDetails(movie?.type, movie?.id)
				const similarMovies = await getSimilarMovies(movie?.type, movie?.id)

				const results = similarMovies.map((movie: MovieProps) => 
					({...movie, type: extractMovieDetails?.type, addedToFavorites: false})
				)

				setMovieDetails(extractMovieDetails?.data)
				setSimilarMovies(results)

				const findIndexOfTrailer = extractMovieDetails?.data?.videos?.results?.length
					? extractMovieDetails?.data?.videos?.results?.findIndex((item: {type: string}) => item.type === 'Trailer')
					: -1

				const findIndexOfClip = extractMovieDetails?.data?.videos?.results?.length
					? extractMovieDetails?.data?.videos?.results?.findIndex((item: {type: string}) => item.type === 'Clip')
					: -1

				const key = findIndexOfTrailer !== -1
					? extractMovieDetails?.data?.videos?.results[findIndexOfTrailer]?.key
					: findIndexOfClip !== -1
					? extractMovieDetails?.data?.videos?.results[findIndexOfClip]?.key
					: null

				setKey(key)
			} catch (error) {
				console.log(error)
			} finally {
				setIsLoading(false)
			}
		}

		if (movie !== null) {	
			getMovie()
		}
	}, [movie])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-5xl w-full max-h-[90vh] overflow-y-auto !scrollbar-thin !scrollbar-track-transparent !scrollbar-thumb-red-600'>
				{isLoading ? (
					<>
						<Skeleton className='w-full pt-[56.25%]' />

						<Skeleton className='w-1/2 h-8' />

						<Skeleton className='w-full h-4' />
						<Skeleton className='w-full h-4' />
						<Skeleton className='w-full h-4' />

						<div className='bg-black p-4 rounded-md shadow-2xl'>
							<Skeleton className='w-1/2 h-4' />

							<div className='grid grid-cols-3 mt-5 gap-3 items-center scrollbar-hide md:p-2'>
								{[1,2,3,4,5,6,7,8,9,10,11,12].map((_, i) => (
									<Skeleton key={i} className='w-full h-[150px]' />
								))}
							</div>
						</div>
					</>
				) : (
					<>
						<div className='relative pt-[56.25%]'>
							<ReactPlayer 
								url={`https://www.youtube.com/watch?v=${key}`}
								width={'100%'}
								height={'100%'}
								style={{ position: 'absolute', top: '0', left: '0' }}
								playing
								controls
							/>
						</div>

						<div className='flex flex-col space-y-4'>
							<h3 className='text-lg font-bold md:text-2xl lg:text-4xl line-clamp-1 mb-1'>
								{movie?.title || movie?.name || movie?.original_name}
							</h3>
							<p className='text-shadow-md text-sm text-gray-400'>
								{movie?.overview}
							</p>

							<div className='flex flex-row items-center flex-wrap gap-2'>
								<ReactStars
									value={movieDetails?.vote_average}
									count={10}
									edit={false}
								/>
								<p className='text-slate-300'>({movieDetails?.vote_count})</p>
								<span className='font-semibold'>
									{movieDetails?.release_date
										? movieDetails.release_date.split('-')[0]
										: '2024'}
								</span>
								<div className='inline-flex px-2 border-2 border-white/40 font-semibold rounded'>
									HD
								</div>
							</div>
						</div>

						<div className='bg-black p-4 rounded-md shadow-2xl'>
							<h3 className='mt-2 mb-6 test-sm font-semibold text-[#e5e5e5] cursor-pointer transition-colors duration-300 hover:text-white md:text-2xl'>
								More Like This
							</h3>

							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-center scrollbar-hide md:p-2'>
								{similarMovies && similarMovies.length && similarMovies
									.filter(item => item.backdrop_path !== null && item.poster_path !== null)
									.map(movie => <MovieItem movie={movie} key={movie.id} />)
								}
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default MoviePopup
