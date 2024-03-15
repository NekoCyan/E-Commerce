import styles from '../HeaderMisc.module.css';
import Link from 'next/link';

export default function HeaderCart() {
	return (
		<div className='dropdown'>
			<Link href='#'>
				<i className='fa fa-shopping-cart'></i>
				<span>Your Cart</span>
				<div className={styles.qty}>3</div>
			</Link>
		</div>
	);
}
