import { RootDispatch, RootState } from '@/redux/store';
import { wishlistAction } from '@/redux/wishlistCount/WishlistSlice';
import { NekoResponse } from '@/types';
import { API, ROUTES } from '@/utils';
import { GET } from '@/utils/Request';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../HeaderMisc.module.css';

export default function HeaderWishlist() {
	const { status } = useSession();

	const wishlistCount = useSelector<RootState, number>(
		(state) => state.wishlist.value.length,
	);
	const dispatch: RootDispatch = useDispatch();

	useEffect(() => {
		if (status === 'authenticated') {
			GET(API.Wishlist)
				.then((x) => {
					const data = x.data as NekoResponse<{ data: number[] }>;

					dispatch(wishlistAction.set(data.data.data));
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [status]);

	return (
		<div>
			<Link href={ROUTES.Wishlist}>
				<i className='fa fa-heart-o'></i>
				<span>Your Wishlist</span>
				<div className={styles.qty}>
					{wishlistCount >= 10 ? '9+' : wishlistCount}
				</div>
			</Link>
		</div>
	);
}
