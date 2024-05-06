'use client';

import { ROUTES } from '@/utils';
import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';

export default function Component({ orderId }: Readonly<{ orderId: string }>) {
	useEffect(() => {
		if (typeof window === 'undefined') return;

		setTimeout(() => {
			window.location.href = ROUTES.Orders;
		}, 6000); // idk why I put 6 while 5 is better xd.
	}, []);

	return (
		<Container className='flex flex-col justify-center items-center text-center py-14'>
			<h2>Your order has been placed and pending to process!</h2>
			<h4>
				You will be{' '}
				<Link
					href={ROUTES.Orders}
					className='text-red-500 font-bold underline hover:underline'
				>
					Redirected to Order
				</Link>{' '}
				in a short time...
			</h4>
			<p>
				Order ID
				<br />
				<span className='underline'>{orderId}</span>
			</p>
		</Container>
	);
}
