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
			const target = e.target as HTMLElement;
			if (
				(responsiveNav &&
					!responsiveNav.contains(e.target as Node) && // when click outside the responsive nav.
					dropdown.current &&
					!(dropdown.current as any).contains(e.target)) || // when click to Menu button.
				(target instanceof HTMLAnchorElement && // when click to active link.
					!target?.parentElement?.classList.contains(
						navigationStyles.active,
					)) // When <li> has active class.
			) {
				setOpen(false);
			}
		}
		window.addEventListener('mouseup', handleClick);
		// clean up
		return () => window.removeEventListener('mouseup', handleClick);
	}, [open]);

	return (
		<div
			className={styles['menu-toggle']}
			onClick={() => setOpen(!open)}
			ref={dropdown}
		>
			<Link href='#' onClick={(e) => e.preventDefault()}>
				<i className='fa fa-bars'></i>
				<span>Menu</span>
			</Link>
		</div>
	);
}
