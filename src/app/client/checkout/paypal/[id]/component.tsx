'use client';

import { useEffect } from 'react';
import { Container } from 'react-bootstrap';

export default function Component({
	paymentId,
	href,
}: Readonly<{ paymentId: string; href: string }>) {
	useEffect(() => {
		if (typeof window === 'undefined') return;

		setTimeout(() => {
			window.location.href = href;
		}, 3000);
	}, []);

	return (
		<Container className='flex flex-col justify-center items-center text-center py-14'>
			<h2>You are being redirected to payment...</h2>
			<p>
				Payment ID
				<br />
				<span className='underline'>{paymentId}</span>
			</p>
		</Container>
	);
}
