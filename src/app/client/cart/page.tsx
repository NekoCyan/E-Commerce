import { API } from '@/utils';
import getUrl from '@/utils/getUrl';
import AuthConfig from '@/utils/nextAuth/NextAuthConfig';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import Component, { CartProps } from './component';

export default async function Cart() {
	let fetchedProducts: CartProps['cart'] = null;
	const session = await getServerSession(AuthConfig);
	if (session) {
		const Cookies = cookies();
		const fetchedCart = await fetch(getUrl(API.CartList), {
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
		});
		const { data } = await fetchedCart.json();
		fetchedProducts = data;
	}

	return <Component cart={fetchedProducts} />;
}
