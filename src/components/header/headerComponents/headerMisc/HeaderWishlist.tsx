import styles from '../HeaderMisc.module.css';
import Link from 'next/link';

export default function HeaderWishlist() {
	return (
		<div>
			<Link href='#'>
				<i className='fa fa-heart-o'></i>
				<span>Your Wishlist</span>
				<div className={styles.qty}>2</div>
			</Link>
		</div>
	);
}
