'use client';

import MultiStyles from '@/utils/ComponentUtils';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from '../HeaderMisc.module.css';

export default function HeaderMenu() {
	const [open, setOpen] = useState(false);
	// create a React ref for the dropdown element
	const dropdown = useRef(null);

	useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			console.log(dropdown.current);
			console.log(e.target);
			if (
				dropdown.current &&
				!(dropdown.current as any).contains(e.target)
			) {
				console.log('closing');
				setOpen(false);
			}
		}
		window.addEventListener('mousedown', handleClick);
		// clean up
		return () => window.removeEventListener('mousedown', handleClick);
	}, [open]);

	return (
		<div
			className={MultiStyles(styles['menu-toggle'], open ? 'active' : '')}
			onClick={() => setOpen(!open)}
		>
			<Link href='#'>
				<i className='fa fa-bars'></i>
				<span>Menu</span>
			</Link>
		</div>
	);
}
