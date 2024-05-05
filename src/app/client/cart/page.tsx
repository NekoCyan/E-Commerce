import { PageProps } from '@/types';
import { WEBSITE } from '@/utils';
import { Metadata } from 'next';
import Component from './component';

export const revalidate = 0;

export const metadata: Metadata = {
	title: WEBSITE.title('Cart'),
};

export default async function Cart({
	params,
	searchParams,
}: Readonly<PageProps<
	{},
	{
		must_revalidate?: string;
	}
>>) {
	// let fetchedProducts: CartProps['cart'] = null;
	// const session = await getServerSession(AuthConfig);
	// if (session) {
	// 	const Cookies = cookies();
	// 	const fetchedCart = await fetch(getUrl(API.CartList), {
	// 		cache: 'no-cache',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'Cache-Control':
	// 				'no-cache, no-store, max-age=0, must-revalidate',
	// 			Cookie: Cookies.toString(),
	// 		},
	// 		next: {
	// 			tags: [TAGS.Cart],
	// 		},
	// 	});
	// 	const { data } = await fetchedCart.json();
	// 	fetchedProducts = data;
	// 	console.log(fetchedProducts);
	// }

	return <Component params={params} searchParams={searchParams} />;
}
