'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../Navigation.module.css';

export default function NavigationLink({
	title,
	path,
}: Readonly<{ title: string; path: string }>) {
	const pathName = usePathname();

	return (
		<li className={(pathName === path && styles.active) || ''}>
			<Link href={path}>{title}</Link>
		</li>
	);
}
