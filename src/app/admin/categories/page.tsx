import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import Component from './component';

export default async function Page(props: any) {
	const Cookies = cookies();
	const fetchedCategories = await fetch(
		getUrl('/api/categories') +
			'?' +
			new URLSearchParams({
				limit: '-1',
			}).toString(),
		{
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
		},
	);
	const { data } = await fetchedCategories.json();

	return <Component props={props} categories={data} />;
}
