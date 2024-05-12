'use client';

import Loading from '@/app/loading';
import { APIResponse, PageProps } from '@/types';
import { API, ROUTES } from '@/utils';
import { POST } from '@/utils/Request';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

export default function Component({
	props,
}: Readonly<{
	props: Readonly<
		PageProps<
			{
				id: string;
			},
			{ token: string; PlayerID: string }
		>
	>;
}>) {
	const { id } = props.params;
	const { token, PlayerID } = props.searchParams;

	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		POST(API.OrderPaypalCapture, {
			orderId: id,
			token: token,
		})
			.then((x) => {
				const data = x.data as APIResponse;
				if (!data.success) throw new Error(data.message);
			})
			.catch((e) => {
				setError(e.message);
			})
			.finally(() => {
				setIsLoaded(true);
			});
	}, []);

	useEffect(() => {
		if (!isLoaded || error) return;

		setTimeout(() => {
			window.location.href = ROUTES.Orders;
		}, 5000);
	}, [isLoaded]);

	return (
		<Container className='flex flex-col justify-center items-center text-center py-14'>
			{!isLoaded && (
				<div>
					<Loading width={250} />
					<h3>Please wait...</h3>
				</div>
			)}
			{isLoaded && error && (
				<div>
					<h2>Payment Failed</h2>
					<p className='text-3xl'>{error}</p>
				</div>
			)}
			{isLoaded && !error && (
				<div>
					<h2>Payment Succeed</h2>
					<p className='text-3xl'>Your order now being processing!</p>
					<br />
					<h4>You will be redirected to Orders in few seconds...</h4>
				</div>
			)}
		</Container>
	);
}
