'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import navigationStyles from '../../../navigation/Navigation.module.css';
import styles from '../HeaderMisc.module.css';

export default function HeaderMenu() {
	const [open, setOpen] = useState(false);
	// create a React ref for the dropdown element
	const dropdown = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) {
			$('#responsive-nav').removeClass(navigationStyles.active);
			return;
		} else {
			$('#responsive-nav').addClass(navigationStyles.active);
		}
		function handleClick(e: MouseEvent) {
			const responsiveNav = $('#responsive-nav')[0];
			if (
				responsiveNav &&
				!responsiveNav.contains(e.target as Node) && // when click outside the responsive nav.
				dropdown.current &&
				!(dropdown.current as any).contains(e.target) // when click to Menu button.
			) {
				setOpen(false);
			}
		}
		window.addEventListener('mousedown', handleClick);
		// clean up
		return () => window.removeEventListener('mousedown', handleClick);
	}, [open]);

	return (
		<div
			className={styles['menu-toggle']}
			onClick={() => setOpen(!open)}
			ref={dropdown}
		>
			<Link href='#'>
				<i className='fa fa-bars'></i>
				<span>Menu</span>
			</Link>
		</div>
	);
}
