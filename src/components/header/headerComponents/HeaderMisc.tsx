'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import navigationStyles from '../../navigation/Navigation.module.css';
import styles from './HeaderMisc.module.css';
import HeaderCart from './headerMisc/HeaderCart';
import HeaderMenu from './headerMisc/HeaderMenu';
import HeaderWishlist from './headerMisc/HeaderWishlist';

type HeaderMiscProps = {
	isDisabled?: boolean;
	miscExcluded?: Array<'wishlist' | 'cart' | 'menu'>;
};

export default function HeaderMisc({
	isDisabled,
	miscExcluded,
}: Readonly<HeaderMiscProps>) {
	const navigationClassName = navigationStyles['navigation'];
	const { status } = useSession();

	// Check if the document is loaded (and there's navigation in page).
	const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
	const [isNavigationLoaded, setIsNavigationLoaded] = useState(false);
	useEffect(() => {
		if (isDocumentLoaded) return;

		const handleDocumentReadyState = () => {
			if (document.readyState === 'complete') {
				setIsDocumentLoaded(true);
			}
		};

		window.addEventListener('load', handleDocumentReadyState);
		handleDocumentReadyState(); // Check initial readyState

		return () => {
			window.removeEventListener('load', handleDocumentReadyState);
		};
	}, []);
	useEffect(() => {
		if (!isDocumentLoaded) return;

		const navigation = document.querySelector(`.${navigationClassName}`);
		if (navigation) {
			setIsNavigationLoaded(true);
			console.log(`Navigation is loaded.`);
		} else {
			setIsNavigationLoaded(false);
		}
	}, [isDocumentLoaded]);

	return (
		<div className='col-md-3 clearfix'>
			{!isDisabled && (
				<div className={styles['header-ctn']}>
					{!miscExcluded?.includes('wishlist') &&
						status === 'authenticated' && <HeaderWishlist />}
					{!miscExcluded?.includes('cart') && <HeaderCart />}
					{!miscExcluded?.includes('menu') && isNavigationLoaded && (
						<HeaderMenu />
					)}
				</div>
			)}
		</div>
	);
}
