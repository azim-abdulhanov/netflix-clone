'use client'

import { createAccountSchema } from '@/lib/validation'
import { AccountProps, AccountResponse } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import PinInput from 'react-pin-input'
import * as z from 'zod'
import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { toast } from '../ui/use-toast'

interface Props {
	uid: string
	setOpen: Dispatch<SetStateAction<boolean>>
	setAccounts: Dispatch<SetStateAction<AccountProps[]>>
	accounts: AccountProps[]
}

const CreateAccountForm = ({ uid, setOpen, setAccounts, accounts }: Props) => {
	const form = useForm<z.infer<typeof createAccountSchema>>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: { name: '', pin: '' },
	})

	const { isSubmitting } = form.formState

	async function onSubmit(values: z.infer<typeof createAccountSchema>) {
		try {
			const { data } = await axios.post<AccountResponse>('/api/account', {
				...values,
				uid,
			})

			if (data.success) {
				setOpen(false)
				form.reset()
				setAccounts([...accounts, data.data as AccountProps])

				return toast({
					title: 'Account created successfully',
					description: 'Your account has been created successfully',
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
				description: 'An error occurred while creating your account',
				variant: 'destructive',
			})
		}
	}

	return (
		<>
			<h1 className='text-white text-center font-bold text-2xl'>
				Create your account
			</h1>

			<div className='w-full h-[2px] bg-slate-500/20 mb-4' />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
					<FormField
						name='name'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										autoComplete='off'
										className='h-14'
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormDescription>
									Your name is used to identify your account.
								</FormDescription>
								<FormMessage className='text-red-600' />
							</FormItem>
						)}
					/>

					<FormField
						name='pin'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>PIN Code</FormLabel>
								<FormControl>
									<PinInput
										length={4}
										initialValue={field.value}
										secret
										disabled={isSubmitting}
										secretDelay={100}
										onChange={value => field.onChange(value)}
										type='numeric'
										inputMode='number'
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(4, 1fr)',
											gap: '10px',
										}}
										inputStyle={{
											borderColor: 'RGBA(255, 255, 255, 0.16)',
											width: '100%',
											height: '50px',
											fontSize: '40px',
											borderRadius: '5px',
										}}
										inputFocusStyle={{
											borderColor: 'RGBA(255, 255, 255, 0.80)',
										}}
										autoSelect={true}
									/>
								</FormControl>
								<FormDescription>
									Your pin is used to identify your account.
								</FormDescription>
								<FormMessage className='text-red-600' />
							</FormItem>
						)}
					/>

					<Button
						className='w-full flex justify-center items-center bg-red-600	!text-white hover:bg-red-700 transition-all h-14 mt-4'
						disabled={isSubmitting}
						type='submit'
					>
						Create account
					</Button>
				</form>
			</Form>
		</>
	)
}

export default CreateAccountForm
