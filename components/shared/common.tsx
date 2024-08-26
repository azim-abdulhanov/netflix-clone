'use client'

import { MovieDataProps } from '@/types'
import Banner from './banner'
import MovieRow from './movie/movie-row'
import Navbar from './navbar'

interface Props {
	moviesData: MovieDataProps[]
}

const Common = ({ moviesData }: Props) => {
	return (
		<main className='flex flex-col min-h-screen'>
			<Navbar />

			<div className='relative px-4 space-y-5'>
				{/*@ts-ignore*/}
				<Banner movies={ moviesData && moviesData[0].data } />

				<section className='space-y-5 md:space-y-16'>
					{moviesData && moviesData.map(movie => (
						<MovieRow
							key={movie.title}
							title={movie.title}
							/*@ts-ignore*/
							data={movie.data}
						/>
					))}
				</section>
			</div>
		</main>
	)
}

export default Common
