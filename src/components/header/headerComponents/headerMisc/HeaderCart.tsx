import Link from 'next/link';
import styles from '../HeaderMisc.module.css';

export default function HeaderCart() {
	return (
		<div className='dropdown'>
			<Link href='#'>
				<i className='fa fa-shopping-cart'></i>
				<span>Your Cart</span>
				<div className={styles.qty}>0</div>
			</Link>
		</div>
	);
}
