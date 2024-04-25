'use client';

import { cartCountAction } from '@/redux/cartsCount/CartsCountSlice';
import { RootDispatch, RootState } from '@/redux/store';
import { NekoResponse } from '@/types';
import { API, ROUTES } from '@/utils';
import { GET } from '@/utils/Request';
import CartStorage from '@/utils/localStorage/CartStorage';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../HeaderMisc.module.css';

export default function HeaderCart() {
	const { status } = useSession();

	const cartCount = useSelector<RootState, number>(
		(state) => state.cartCount.value,
	);
	const dispatch: RootDispatch = useDispatch();

	useEffect(() => {
		if (status === 'authenticated') {
			GET(API.CartCount)
				.then((x) => {
					const data = x.data as NekoResponse<{ count: number }>;

					dispatch(cartCountAction.set(data.data.count));
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			const cartStorage = new CartStorage(localStorage);

			dispatch(cartCountAction.set(cartStorage.getCartCount()));
		}
	}, [status]);
	return (
		<div className='dropdown'>
			<Link href={ROUTES.Cart}>
				<i className='fa fa-shopping-cart'></i>
				<span>Your Cart</span>
				<div className={styles.qty}>
					{cartCount >= 10 ? '9+' : cartCount}
				</div>
			</Link>
		</div>
	);
}
