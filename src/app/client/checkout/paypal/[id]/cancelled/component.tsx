'use client';

import { PageProps } from '@/types';
import { ROUTES } from '@/utils';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';

export default function Component({
	props,
}: Readonly<{
	props: Readonly<
		PageProps<
			{
				id: string;
			},
			{ token: string }
		>
	>;
}>) {
	const { id } = props.params;
	const { token } = props.searchParams;

	useEffect(() => {
		if (typeof window === 'undefined') return;

		setTimeout(() => {
			window.location.href = ROUTES.Orders;
		}, 5000);
	}, []);

	return (
		<Container className='flex flex-col justify-center items-center text-center py-14'>
			<h2>Payment Cancelled</h2>
			<p className='text-3xl'>You had cancelled your order!</p>
			<br />
			<h4>You will be redirected to Orders in few seconds...</h4>
		</Container>
	);
}
