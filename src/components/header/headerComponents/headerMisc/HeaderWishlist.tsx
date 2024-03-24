import { ROUTES } from '@/utils';
import Link from 'next/link';
import styles from '../HeaderMisc.module.css';

export default function HeaderWishlist() {
	return (
		<div>
			<Link href={ROUTES.Wishlist}>
				<i className='fa fa-heart-o'></i>
				<span>Your Wishlist</span>
				<div className={styles.qty}>0</div>
			</Link>
		</div>
	);
}
