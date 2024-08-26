import Image from 'next/image'
import { Button } from '../ui/button'
import { FaGithub } from 'react-icons/fa'
import { signIn } from 'next-auth/react'

const Login = () => {
	return (
		<div className='w-full h-screen'>
			<div className='absolute inset-0'>
				<Image 
					src='https://repository-images.githubusercontent.com/299409710/b42f7780-0fe1-11eb-8460-e459acd20fb4' 
					alt='bg'
					fill
				/>
			</div>
			<div className='relative z-10 py-4 px-8 max-w-[500px] w-full h-[100vh] md:h-[300px] rounded-md bg-black/60 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
				<div className='flex flex-col items-center justify-center h-full'>
					<h1 className='text-4xl font-bold'>Login</h1>

					<Button 
						className='flex items-center gap-2 mt-5 w-full bg-red-600 !text-white hover:bg-red-500 transition-all'
						onClick={() => signIn('github')}
					>
						<FaGithub className='w-7 h-7' />
						Sign in with Github
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Login