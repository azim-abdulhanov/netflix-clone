'use client'

import CreateAccountForm from '@/components/form/create-account-form'
import LoginAccountForm from '@/components/form/login-account-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { AccountProps, AccountResponse } from '@/types'
import axios from 'axios'
import { LockKeyhole, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Loader from './loader'

const ManageAccount = () => {
	const [isDelete, setIsDelete] = useState<boolean>(false)
	const [open, setOpen] = useState(false)
	const [state, setState] = useState<'login' | 'create'>('create')
	const [accounts, setAccounts] = useState<AccountProps[]>([])
	const [currentAccount, setCurrentAccount] = useState<AccountProps | null>(
		null
	)
	const [isLoading, setIsLoading] = useState(true)

	const { data: session }: any = useSession()

	useEffect(() => {
		const getAllAccounts = async () => {
			try {
				const { data } = await axios.get<AccountResponse>(
					`/api/account?uid=${session.user.uid}`
				)

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

		getAllAccounts()
	}, [session])

	const onDelete = async (id: string) => {
		try {
			const isConfirmed = confirm(
				'Are you sure you want to delete this account?'
			)

			if (isConfirmed) {
				const { data } = await axios.delete<AccountResponse>(
					`/api/account?id=${id}`
				)

				if (data.success) {
					setAccounts(accounts.filter(account => account._id !== id))

					return toast({
						title: 'Account deleted successfully',
						description: 'Your account has been deleted successfully',
					})
				} else {
					return toast({
						title: 'Error',
						description: data.message,
						variant: 'destructive',
					})
				}
			}
		} catch (error) {
			return toast({
				title: 'Error',
				description: 'An error occurred while deleting your account',
				variant: 'destructive',
			})
		}
	}

	if (isLoading) return <Loader />

	return (
		<div className='min-h-screen flex flex-col justify-center items-center py-10 relative'>
			<div className='flex flex-col justify-center items-center'>
				<h1 className='text-white font-bold text-lg sm:text-3xl md:text-5xl'>
					Who's Watching?
				</h1>

				<ul className='flex flex-col items-center md:flex-row md:items-start p-0 my-5 md:my-10 gap-y-7 gap-x-5'>
					{isLoading ? null : (
						<>
							{accounts &&
								accounts.map(account => (
									<li
										key={account._id}
										onClick={() => {
											if (isDelete) return
											setOpen(true)
											setState('login')
											setCurrentAccount(account)
										}}
										className='max-w-[200px] min-w-[84px] w-[155px] max-h-[200px] min-h-[84px] h-[155px] flex flex-col items-center gap-0 md:gap-2'
									>
										<div className='relative cursor-pointer'>
											<div className='max-w-[200px] min-w-[84px] w-[155px] max-h-[200px] min-h-[84px] h-[155px] object-cover rounded relative'>
												<Image
													src='https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4'
													alt='account'
													fill
													className='rounded'
												/>
											</div>
											{isDelete ? (
												<div
													className='absolute bottom-0 z-10 transform cursor-pointer'
													onClick={() => onDelete(account._id)}
												>
													<Trash2 className='w-8 h-8 text-red-600' />
												</div>
											) : null}
										</div>

										<div className='flex items-center gap-y-2 gap-x-2'>
											<span className='font-mono text-xl font-bold'>
												{account.name}
											</span>
											<LockKeyhole />
										</div>
									</li>
								))}
							{accounts && accounts.length < 4 ? (
								<li
									onClick={() => {
										setOpen(true)
										setState('create')
									}}
									className='flex justify-center items-center bg-[#e5b109] text-xl font-bold max-w-[200px] min-w-[84px] w-[155px] max-h-[200px] min-h-[84px] h-[155px] rounded cursor-pointer'
								>
									Add Account
								</li>
							) : null}
						</>
					)}
				</ul>

				<Button
					onClick={() => setIsDelete(prev => !prev)}
					className='border border-gray-100 cursor-pointer tracking-wide inline-flex text-sm py-[0.5em] px-[1.5em] mt-3 bg-transparent hover:bg-transparent !text-white rounded-none'
				>
					Manage Profiles
				</Button>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					{state === 'login' && (
						<LoginAccountForm currentAccount={currentAccount} />
					)}
					{state === 'create' && (
						<CreateAccountForm
							uid={session?.user?.uid}
							setOpen={setOpen}
							setAccounts={setAccounts}
							accounts={accounts}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default ManageAccount
