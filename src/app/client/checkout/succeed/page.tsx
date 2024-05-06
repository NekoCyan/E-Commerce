import { API, REVALIDATE, WEBSITE } from '@/utils';
import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Component from './component';

export const revalidate = 10;

export async function generateMetadata() {
	let Cookies = cookies();
	const fetchedLastOrder = await fetch(getUrl(API.OrderSucceed), {
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			Cookie: Cookies.toString(),
		},
		next: {
			revalidate: REVALIDATE.OrderSucceed,
		},
	});
	let title = '';

	try {
		const result = await fetchedLastOrder.json();
		console.log(result);
		if (!result?.success) throw new Error('notFound');

		title = WEBSITE.title('Order placed successfully');
	} catch (e) {
		title = WEBSITE.title('Not found');
	}

	return {
		title,
	};
}

export default async function Checkout() {
	let Cookies = cookies();
	const fetchedLastOrder = await fetch(getUrl(API.OrderSucceed), {
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			Cookie: Cookies.toString(),
		},
		next: {
			revalidate: REVALIDATE.OrderSucceed,
		},
	});
	try {
		const result = await fetchedLastOrder.json();
		console.log(result);
		if (!result?.success) throw new Error('notFound');
		const { data } = result;

		return <Component orderId={data.orderId} />;
	} catch (e) {
		return notFound();
	}
}
