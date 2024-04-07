import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import Component from './component';

export default async function Page(props: any, req: any) {
	const Cookies = cookies();
	const fetchedProducts = await fetch(
		getUrl('/api/products') +
			'?' +
			new URLSearchParams({
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

	return <Component props={props} products={data.list} />;
}
