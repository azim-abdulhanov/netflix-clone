import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL

export const getTrendingMovies = async (type: string) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/trending/${type}/day?api_key=${API_KEY}&language=en-US`)
		return data && data.results
	} catch (error) {
		console.log('Error getting trending movies', error)
	}
}

export const getTopratedMovies = async (type: string) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&language=en-US`)
		return data && data.results
	} catch (error) {
		console.log('Error getting top rated movies', error)
	}
}

export const getPopularMovies = async (type: string) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=en-US`)
		return data && data.results
	} catch (error) {
		console.log('Error getting popular movies', error)
	}
}

export const getMoviesByGenre = async (type: string, id: number) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/discover/${type}?api_key=${API_KEY}&language=en-US&include_adult=false&sort_by=popularity.desc&with_genres=${id}`)
		return data && data.results
	} catch (error) {
		console.log('Error getting movies by genre', error)
	}
}

export const getMovieDetails = async (type?: string, id?: number) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`)
		return { data, type }
	} catch (error) {
		console.log('Error getting movie details', error)
	}
}

export const getSimilarMovies = async (type?: string, id?: number) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`)
		return data && data.results
	} catch (error) {
		console.log('Error getting similar movies', error)
	}
}

export const getFavourites = async (uid?: string, accountId?: string) => {
	try {
		const { data } = await axios.get(`/api/favourite?uid=${uid}&accountId=${accountId}`)
		return data
	} catch (error) {
		console.log('Error getting favourites', error)		
	}
}

export const getSearchResults = async (type: string, query: string) => {
	try {
		const { data } = await axios.get(`${BASE_URL}/search/${type}?api_key=${API_KEY}&include_adult=false&language=en-US&query=${query}`)
		return data && data.results
	} catch (error) {
		console.log('Error getting search', error)
	}
}