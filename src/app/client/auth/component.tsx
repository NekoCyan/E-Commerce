'use client';

import Loading from '@/app/loading';
import { APIResponse } from '@/types';
import { MultiStyles, PATTERN, ROUTES } from '@/utils';
import { POST } from '@/utils/Request';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './auth.module.css';

export default function Component() {
	const errorMSG = 'Something went wrong... try again later.';

	const router = useRouter();
	const { data, status } = useSession();

	if (status === 'authenticated') router.replace(ROUTES.Home);

	useEffect(() => {
		if (status === 'authenticated') {
			router.replace(ROUTES.Home);
		}
	}, [status, router]);

	// Initialize.
	const [isSecondForm, setIsSecondForm] = useState(false);
	const [isRequesting, setIsRequesting] = useState(false);
	const [route, setRoute] = useState(''); // ['login', 'register']

	// Request data.
	const [inputFields, setInputFields] = useState({
		fullName: '',
		email: '',
		password: '',
		repeatpassword: '',
	});

	// Missing/Wrong type or After Request.
	const [CBError, setCBError] = useState('');

	useEffect(() => {
		if (!isRequesting) return;

		if (CBError) setCBError('');
	}, [isRequesting]);

	useEffect(() => {
		if (CBError) setCBError('');
	}, [inputFields, isSecondForm]);

	useEffect(() => {
		if (!isRequesting) return;
		if (!inputFields.email) setCBError('Email is required.');
		else if (new RegExp(PATTERN.EMAIL).test(inputFields.email) === false)
			setCBError('Invalid type of Email.');
		else if (!inputFields.password) setCBError('Password is required.');
		else if (route === 'login') {
			signIn('credentials', {
				redirect: false,
				email: inputFields.email,
				password: inputFields.password,
			})
				.then((x) => {
					if (x?.ok) router.replace('/profile');
					else setCBError('Email or Password is invalid.');
				})
				.catch((err) => {
					setCBError(err.message);
				});
		} else {
			if (
				new RegExp(PATTERN.PASSWORD).test(inputFields.password) ===
				false
			)
				setCBError(
					'Password too weak or invalid (only accept and must match at 8 characters and at least: 1 uppercase, 1 lowercase, 1 number).',
				);
			else if (!inputFields.fullName)
				setCBError('Full Name is required.');
			else if (!inputFields.repeatpassword)
				setCBError('Repeat Password is required.');
			else if (inputFields.password !== inputFields.repeatpassword)
				setCBError('Passwords do not match.');
			else {
				// const fetched = fetch('/api/register', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 	},
				// 	body: JSON.stringify({
				// 		fullName: inputFields.fullName,
				// 		email: inputFields.email,
				// 		password: inputFields.password,
				// 		repeatpassword: inputFields.repeatpassword,
				// 	}),
				// });
				// fetched
				// 	.then((x: any) => {
				// 		const data = x as APIResponse;
				// 		if (!data.success) throw new Error(data.message);

				// 		console.log('isRequesting', isRequesting);
				// 		setRoute('login');
				// 		return;
				// 	})
				// 	.catch((err) => setCBError(err.message));
				POST(
					'/api/register',
					{
						fullName: inputFields.fullName,
						email: inputFields.email,
						password: inputFields.password,
						repeatpassword: inputFields.repeatpassword,
					},
					{},
				)
					.then((x: any) => {
						const data = x.data as APIResponse;
						if (!data.success) throw new Error(data.message);

						setRoute('login');
						return;
					})
					.catch((err) => {
						setCBError(err.message);
					});
			}
		}
	}, [isRequesting, route]);

	useEffect(() => {
		if (!CBError) return;
		if (!isRequesting) return;
		setIsRequesting(false);
	}, [CBError, isRequesting]);

	// Form.
	const handleButtonForm = (
		e: MouseEvent<HTMLButtonElement>,
		slideToSecondForm: boolean,
	) => {
		setIsSecondForm(slideToSecondForm);
	};
	const handleClickLinkForm = (
		e: MouseEvent<HTMLAnchorElement>,
		slideToSecondForm: boolean,
	) => {
		e.preventDefault();
		if (isRequesting) return;
		handleButtonForm(e as any, slideToSecondForm);
	};
	// Input.
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.currentTarget;
		setInputFields((prev) => ({ ...prev, [id]: value }));
	};
	// Submit.
	const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
		const defineRoute = e.currentTarget.parentElement?.id;
		if (!defineRoute) return setCBError(errorMSG);
		setIsRequesting(true);
		setRoute(defineRoute);
	};

	// Authenticated on loading to avoid appear auth form.
	if (status === 'loading' || status === 'authenticated') return <Loading />;

	return (
		<Container
			className={MultiStyles(
				styles['container'],
				isSecondForm && styles['right-panel-active'],
			)}
		>
			<div
				className={MultiStyles(
					styles['form-container'],
					styles['sign-up-container'],
				)}
			>
				<form id='register'>
					<h1>Create Account</h1>
					{/* <div className={styles['social-container']}>
						<Link href='#' className='social'>
							<i className='fa fa-facebook-f'></i>
						</Link>
						<Link href='#' className='social'>
							<i className='fa fa-google-plus-g'></i>
						</Link>
						<Link href='#' className='social'>
							<i className='fa fa-linkedin-in'></i>
						</Link>
					</div>regis
					<span>or use your email for tration</span> */}
					<input
						id='fullName'
						type='text'
						placeholder='Full Name (required)'
						required={true}
						onChange={handleInputChange}
					/>
					<input
						id='email'
						type='email'
						placeholder='Email (required)'
						required={true}
						onChange={handleInputChange}
						value={inputFields.email}
					/>
					<input
						id='password'
						type='password'
						placeholder='Password (required)'
						required={true}
						onChange={handleInputChange}
						value={inputFields.password}
					/>
					<input
						id='repeatpassword'
						type='password'
						placeholder='Repeat Password (required)'
						required={true}
						onChange={handleInputChange}
					/>
					<button disabled={isRequesting} onClick={handleSubmit}>
						Sign Up
					</button>

					<p>{CBError}</p>
					<p className={styles['responsive']}>
						Already a Member?{' '}
						<Link
							href='#'
							onClick={(e) => handleClickLinkForm(e, false)}
						>
							Sign In here!
						</Link>
					</p>
				</form>
			</div>
			<div
				className={MultiStyles(
					styles['form-container'],
					styles['sign-in-container'],
				)}
			>
				<form id='login'>
					<h1>Sign in</h1>
					{/* <div className={styles['social-container']}>
						<Link href='#' className='social'>
							<i className='fa fa-facebook-f'></i>
						</Link>
						<Link href='#' className='social'>
							<i className='fa fa-brands fa-google-plus-g'></i>
						</Link>
						<Link href='#' className='social'>
							<i className='fa fa-brands fa-linkedin-in'></i>
						</Link>
					</div>
					<span>or use your account</span> */}
					<input
						id='email'
						type='email'
						placeholder='Email (required)'
						required={true}
						onChange={handleInputChange}
						value={inputFields.email}
					/>
					<input
						id='password'
						type='password'
						placeholder='Password (required)'
						required={true}
						onChange={handleInputChange}
						value={inputFields.password}
					/>
					<Link href='#' onClick={(e) => e.preventDefault()}>
						Forgot your password?
					</Link>
					<button disabled={isRequesting} onClick={handleSubmit}>
						Sign In
					</button>

					<p>{CBError}</p>
					<p className={styles['responsive']}>
						New member?{' '}
						<Link
							href='#'
							onClick={(e) => handleClickLinkForm(e, true)}
						>
							Sign Up now!
						</Link>
					</p>
				</form>
			</div>
			<div className={styles['overlay-container']}>
				<div className={styles['overlay']}>
					<div
						className={MultiStyles(
							styles['overlay-panel'],
							styles['overlay-left'],
						)}
					>
						<h1>Welcome Back!</h1>
						<p>
							To keep connected with us please login with your
							personal info
						</p>
						<button
							className={styles['ghost']}
							onClick={(e) => {
								handleButtonForm(e, false);
							}}
							disabled={isRequesting}
						>
							Sign In
						</button>
					</div>
					<div
						className={MultiStyles(
							styles['overlay-panel'],
							styles['overlay-right'],
						)}
					>
						<h1>Hello, Friend!</h1>
						<p>
							Enter your personal details and start journey with
							us
						</p>
						<button
							className={styles['ghost']}
							onClick={(e) => handleButtonForm(e, true)}
							disabled={isRequesting}
						>
							Sign Up
						</button>
					</div>
				</div>
			</div>
		</Container>
	);
}
