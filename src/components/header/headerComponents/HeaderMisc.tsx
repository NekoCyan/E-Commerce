'use client';

import { useEffect, useState } from 'react';
import navigationStyles from '../../navigation/Navigation.module.css';
import styles from './HeaderMisc.module.css';
import HeaderCart from './headerMisc/HeaderCart';
import HeaderMenu from './headerMisc/HeaderMenu';
import HeaderWishlist from './headerMisc/HeaderWishlist';

export default function HeaderMisc() {
	const navigationClassName = navigationStyles['navigation'];

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
			<div className={styles['header-ctn']}>
				<HeaderWishlist />
				<HeaderCart />
				{isDocumentLoaded && isNavigationLoaded && <HeaderMenu />}
			</div>
		</div>
	);
}
