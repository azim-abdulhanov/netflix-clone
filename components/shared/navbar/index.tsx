'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { menuItems } from '@/constants'
import { useGlobalContext } from '@/context'
import { AccountProps, AccountResponse, MenuItemProps } from '@/types'
import { cn } from '@/lib/utils'
import MoviePopup from '../movie/movie-popup'
import SearchBar from './search-bar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { AiOutlineSearch } from 'react-icons/ai'
import axios from 'axios'

const Navbar = () => {
	const [showSearchBar, setShowSearchBar] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const [accounts, setAccounts] = useState<AccountProps[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const { account, setAccount, setPageLoader } = useGlobalContext()
	const { data: session }: any = useSession()
 	const router = useRouter()

	useEffect(() => {
		const getAllAccounts = async () => {
			setIsLoading(true)
			try {
				const { data } = await axios.get<AccountResponse>(`/api/account?uid=${session.user.uid}`)

				data.success && setAccounts(data.data as AccountProps[])
			} catch (error) {
				return toast({
					title: 'Error',
					description: 'An error occurred while fetching your account',
					variant: 'destructive',
				})
			} finally {
				setIsLoading(false)
			}
		}

		const handleScroll = () => {
			if (window.scrollY > 100) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}

		getAllAccounts()

		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const logout = () => {
		sessionStorage.removeItem('account')
		signOut()
		setAccount(null)
	}

	const accountLogout = () => {
		setAccount(null)
		sessionStorage.removeItem('account')
	}

	return (
		<div className='relative'>
			<header
				className={cn(
					'header h-[60px] lg:h-[10vh] hover:bg-black duration-300 ease-in-out',
					isScrolled && 'bg-black'
				)}
			>
				<div className='flex items-center h-full space-x-2 md:space-x-10'>
					<Image
						src='https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
						alt='Netflix'
						width={120}
						height={120}
						className='object-contain cursor-pointer'
						onClick={() => {
							router.push('/browse')
							setPageLoader(true)
						}}
					/>
					<ul className='hidden md:flex md:space-x-4 cursor-pointer'>
						{menuItems.map((item: MenuItemProps) => (
							<li
								onClick={() => {
									router.push(item.path)
									setPageLoader(true)
								}}
								key={item.path}
								className='text-base font-light text-[#e5e5e5] transition duration-500 hover:text-[#b3b3b3] cursor-pointer'
							>
								{item.title}
							</li>
						))}
					</ul>
				</div>

				<MoviePopup />

				<div className='flex items-center space-x-4 font-light text-sm'>
					{showSearchBar ? (
						<SearchBar setShowSearchBar={setShowSearchBar} />
					) : (
						<AiOutlineSearch
							onClick={() => setShowSearchBar(prev => !prev)}
							className='hidden sm:inline sm:w-6 sm:h-6 cursor-pointer'
						/>
					)}
					<Popover>
						<PopoverTrigger>
							<div className='flex items-center gap-2 cursor-pointer'>
								<img
									src='https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4'
									alt='Current Profile'
									className='max-w-[30px] w-full rounded object-cover'
								/>
								<p className='text-md font-medium'>{account && account.name}</p>
							</div>
						</PopoverTrigger>
						<PopoverContent>
							{isLoading ? (
								<div className='flex flex-col space-y-2'>
									{[1, 2].map((_, i) => (
										<Skeleton key={i} className='w-full h-10' />
									))}
								</div>
							) : (
								accounts && accounts.map(account => (
									<div 
										key={account._id} 
										onClick={accountLogout}
										className='flex items-center gap-3 py-2 px-4 rounded-md hover:bg-slate-800 cursor-pointer'
									>
										<img 
											src='https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4' 
											alt='current profile'
											className='max-w-[30px] min-w-[20px] w-[30px] max-h-[30px] min-h-[20px] object-cover rounded'	
										/>
										<p>{account.name}</p>
									</div>
								))
							)}
							<Button
								onClick={logout}
								className='w-full mt-4 text-center text-sm font-medium outline-none border-none rounded-md py-2 hover:bg-slate-800 hover:text-white transition duration-300'
							>
								Sign out of Netflix
							</Button>
						</PopoverContent>
					</Popover>
				</div>
			</header>
		</div>
	)
}

export default Navbar
