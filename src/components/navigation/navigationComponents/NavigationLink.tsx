'use client';

import Link from 'next/link';
import styles from './NavLink.module.css';
import { usePathname } from 'next/navigation';

type LinkPath = {
	title: string;
	path: string;
};

export default function NavLink({ item }: Readonly<{ item: LinkPath }>) {
	const pathName = usePathname();

	return (
		<li className={(pathName === item.path && styles.active) || ''}>
			<Link href={item.path}>{item.title}</Link>
		</li>
	);
}
