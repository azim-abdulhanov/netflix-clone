'use client'

import { useGlobalContext } from '@/context'
import { AccountProps, AccountResponse } from '@/types'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import PinInput from 'react-pin-input'
import { toast } from '../ui/use-toast'

interface Props {
	currentAccount: AccountProps | null
}

const LoginAccountForm = ({ currentAccount }: Props) => {
	const [error, setError] = useState(false)
	const [pin, setPin] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const { setAccount } = useGlobalContext()
	const pathname = usePathname()
	const router = useRouter()

	const onSubmit = async (value: string) => {
		setIsLoading(true)

		try {
			const { data } = await axios.post<AccountResponse>('/api/account/login', {
				uid: currentAccount?.uid,
				accountId: currentAccount?._id,
				pin: value,
			})

			if (data.success) {
				setAccount(data.data as AccountProps)
				sessionStorage.setItem('account', JSON.stringify(data.data))
				router.push(pathname)

				return toast({
					title: 'Account unlocked',
					description: 'Your account has been unlocked successfully',
				})
			} else {
				setError(true)
			}
		} catch (error) {
			return toast({
				title: 'Error',
				description: 'An error occurred while logging in',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<h1 className='text-gray-400 font-bold text-base mb-4'>
				Profile Lock is currently ON
			</h1>
			{error ? (
				<h2 className='text-red-500 font-bold text-center text-xl'>
					Whoops, wrong PIN. Please try again
				</h2>
			) : (
				<h2 className='text-red-500 font-bold text-center text-xl'>
					Error your PIN to access this profile
				</h2>
			)}

			<div className='flex justify-center items-center'>
				<PinInput
					length={4}
					initialValue={pin}
					secret
					secretDelay={100}
					onChange={value => setPin(value)}
					type='numeric'
					inputMode='number'
					style={{ padding: '20px', display: 'flex', gap: '10px' }}
					inputStyle={{
						borderColor: 'white',
						width: '70px',
						height: '70px',
						fontSize: '40px',
						borderRadius: '5px',
					}}
					disabled={isLoading}
					inputFocusStyle={{ borderColor: 'white' }}
					onComplete={value => onSubmit(value)}
					autoSelect={true}
				/>
				{isLoading && <Loader2 className='animate-spin' />}
			</div>
		</>
	)
}

export default LoginAccountForm
