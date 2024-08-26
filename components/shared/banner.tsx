'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useGlobalContext } from '@/context'
import { MovieProps } from '@/types'
import { AiFillPlayCircle } from 'react-icons/ai'
import { IoMdInformationCircleOutline } from 'react-icons/io'

interface Props {
	movies: MovieProps[]
}

const Banner = ({ movies }: Props) => {
	const [randomMovie, setRandomMovie] = useState<MovieProps | null>(null)

	const { setOpen, setMovie } = useGlobalContext()

	useEffect(() => {
		const movie = movies[Math.floor(Math.random() * movies.length)]
		setRandomMovie(movie)
	}, [])

	const onHandlerPopup = () => {
		setMovie(randomMovie)
		setOpen(true)
	}

	return (
		<div className='flex flex-col h-[90vh] md:h-[80vh] justify-center pl-0 lg:pl-16'>
			<div className='absolute top-0 left-0 h-[100vh] w-full -z-10'>
				<Image
					src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${randomMovie?.backdrop_path || randomMovie?.poster_path}`}
					alt='banner'
					fill
					objectFit='cover'
				/>
				<div className='absolute w-full h-full sm:h-56 bg-gradient-to-t from-white to-transparent bottom-0 z-20' />
				<div className='absolute w-full h-full bg-gradient-to-r from-slate-800 to-transparent bottom-0 z-20' />
			</div>

			<div className='flex flex-col gap-y-2 md:gap-y-2.5'>
				<h1 className='text-3xl font-bold sm:text-4xl md:text-5xl lg:text-7xl leading-none'>
					{randomMovie?.title || randomMovie?.name || randomMovie?.original_name}
				</h1>
				<p className='max-w-sm text-xs sm:max-w-md sm:text-xl md:text-lg lg:max-w-2xl line-clamp-3 md:line-clamp-4 leading-snug'>
					{randomMovie?.overview}
				</p>

				<div className='flex gap-x-1 md:gap-x-3'>
					<button
						onClick={onHandlerPopup}	 
						className='flex items-center gap-x-1 md:gap-x-2 rounded py-1 px-2 text-xs font-semibold cursor-pointer transition duration-200 hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black'
					>
						<AiFillPlayCircle className='w-4 h-4 text-black md:w-7 md:h-7' />
						Play
					</button>
					<button 
						onClick={onHandlerPopup}	 
						className='flex items-center gap-x-1 md:gap-x-2 rounded py-1 px-2 text-xs font-semibold cursor-pointer transition duration-200 hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-[gray]/70'
					>
						<IoMdInformationCircleOutline className='w-4 h-4 md:w-8 md:h-8' />
						More Info
					</button>
				</div>
			</div>
		</div>
	)
}

export default Banner
