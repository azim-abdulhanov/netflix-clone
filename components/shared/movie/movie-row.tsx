'use client'

import { MovieProps } from '@/types'
import MovieItem from './movie-item'

interface Props {
	title: string
	data: MovieProps[]
}

const MovieRow = ({ title, data }: Props) => {
	return (
		<div className='h-40 space-y-1 md:space-y-2 px-0 md:px-4'>
			<h2 className='text-md font-semibold text-white md:text-2xl'>
				{title}
			</h2>

			<div className='group relative md:-ml-2 pb-5'>
				<div className='flex items-center scrollbar-hide space-x-2 overflow-x-scroll md:space-x-3 md:p-2'>
					{data && data
						.filter(item => item.backdrop_path !== null && item.poster_path !== null)
						.map(movie => <MovieItem key={movie.id} movie={movie} />)
					}
				</div>
			</div>
		</div>
	)
}

export default MovieRow
