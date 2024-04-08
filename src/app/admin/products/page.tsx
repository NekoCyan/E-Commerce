import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import Component from './component';

export default async function Page(props: any) {
	const Cookies = cookies();
	const fetchedProducts = await fetch(
		getUrl('/api/products') +
			'?' +
			new URLSearchParams({
				limit: '-1',
				status: '-1',
			}).toString(),
		{
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
		},
	);
	const { data } = await fetchedProducts.json();
	console.log(data);

	return <Component props={props} products={data.list} />;
}
