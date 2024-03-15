import styles from './HeaderMisc.module.css';
import HeaderCart from './headerMisc/HeaderCart';
import HeaderMenu from './headerMisc/HeaderMenu';
import HeaderWishlist from './headerMisc/HeaderWishlist';

export default function HeaderMisc() {
	return (
		<div className='col-md-3 clearfix'>
			<div className={styles['header-ctn']}>
				<HeaderWishlist />
				<HeaderCart />
				<HeaderMenu />
			</div>
		</div>
	);
}
