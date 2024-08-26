'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGlobalContext } from '@/context'
import { FavouriteProps, MovieProps } from '@/types'
import { ChevronDown, Loader2, MinusIcon, PlusIcon } from 'lucide-react'
import CustomImage from '../custom-image'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'

interface Props {
	movie: MovieProps
	favouriteId?: string 
	setFavourites?: Dispatch<SetStateAction<FavouriteProps[]>>
}

const MovieItem = ({ movie, favouriteId = '', setFavourites }: Props) => {
	const [isLoading, setIsLoading] = useState(false)

	const { setOpen, setMovie, account } = useGlobalContext()
	const { data: session }: any = useSession()

	const onHandlerPopup = () => {
		setMovie(movie)
		setOpen(true)
	}

	const onAdd = async () => {
		try {
			setIsLoading(true)

			const { data } = await axios.post('/api/favourite', {
				uid: session?.user?.uid,
				accountId: account?._id,
				backdrop_path: movie?.backdrop_path,
				poster_path: movie?.poster_path,
				movieId: movie?.id, 
				type: movie?.type,
				title: movie?.title || movie?.name,
				overview: movie?.overview,
			})

			if (data?.success) {
				return toast({
					title: 'Success',
					description: 'Movie added to your favourite list',
				})
			} else {
				return toast({
					title: 'Error',
					description: data.message,
					variant: 'destructive',
				})
			}
		} catch (error) {
			return toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const onRemove = async () => {
		try {
			setIsLoading(true)

			const { data } = await axios.delete(`/api/favourite?id=${favouriteId}`)

			if (data?.success) {
				if (setFavourites) {
					setFavourites((prev: FavouriteProps[]) => prev
						.filter((item: FavouriteProps) => item._id !== favouriteId)
					)
				}

				return toast({
					title: 'Success',
					description: 'Movie removed from your favourite list',
				})	
			} else {
				return toast({
					title: 'Error',
					description: data.message,
					variant: 'destructive',
				})	
			}
		} catch (error) {
			return toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)	
		}
	}

	return (
		<div className='cardWrapper relative min-w-[180px] h-28 md:min-w-[260px] md:h-36 transform transition duration-500 cursor-pointer rounded-md overflow-hidden'>
			<CustomImage 
				onClick={onHandlerPopup}
				image={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie?.backdrop_path || movie?.poster_path}`} 
				alt='image'
				className='rounded-md object-cover md:rounded-md overflow-hidden hover:scale-110'
			/>

			<div className='buttonWrapper absolute hidden p-2 bottom-0 space-x-3'>
				<button className='flex items-center p-2 border border-white gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 bg-black opacity-75 text-black cursor-pointer'>
					{isLoading ? <Loader2 className='w-7 h-7 animate-spin text-red-600'/> 
					: favouriteId?.length ? (
						<MinusIcon
							onClick={onRemove} 
							color='white'	
							className='w-3 h-3 sm:w-7 sm:h-7' 
						/>
					) : (
						<PlusIcon 
							onClick={onAdd} 
							color='white' 
							className='w-3 h-3 sm:w-7 sm:h-7' 
						/>
					)}
				</button>
				<button className='flex items-center p-2 border border-white gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 bg-black opacity-75 cursor-pointer'>
					<ChevronDown
						color='white'
						className='w-3 h-3 sm:w-7 sm:h-7'
						onClick={onHandlerPopup}
					/>
				</button>
			</div>
		</div>
	)
}

export default MovieItem
