'use client'

import { Dispatch, KeyboardEvent, SetStateAction, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AiOutlineSearch } from 'react-icons/ai'
import { useGlobalContext } from '@/context'

interface Props {
	setShowSearchBar: Dispatch<SetStateAction<boolean>>
}

const SearchBar = ({ setShowSearchBar }: Props) => {
	const [query, setQuery] = useState('')

	const { setPageLoader } = useGlobalContext()
	const router = useRouter()
	const pathname = usePathname()

	const handleKeySubmit = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && query && query.trim() !== '') {
			setPageLoader(true)

			if (pathname !== '/search') {
				router.replace(`/search/${query}`)
			} else {
				router.push(`/search/${query}`)
			}
		}
	}

	return (
		<div className='hidden md:flex justify-center items-center text-center'>
			<div className='flex items-center text-center bg-[rgba(0,0,0,0.75)] border border-[rgba(255,255,255,0.5)] rounded-sm'>
				<div className='order-2'>
					<input 
						placeholder='Search Movies and TV...' 
						className='w-50 h-9 py-2 rounded bg-transparent text-sm font-medium font-md text-white placeholder:text-sm outline-none'
						value={query}
						onChange={e => setQuery(e.target.value)}
						onKeyUp={handleKeySubmit}
					/>
				</div>
				<button className='px-3'>
					<AiOutlineSearch 
						onClick={() => setShowSearchBar(false)}
						className='hidden sm:inline sm:w-6 sm:h-6 cursor-pointer'
					/>
				</button>
			</div>
		</div>
	)
}

export default SearchBar