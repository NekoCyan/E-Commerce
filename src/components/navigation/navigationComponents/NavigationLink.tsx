'use client';

import { TransformClientPath } from '@/utils/ComponentUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../Navigation.module.css';

export default function NavigationLink({
	title,
	path,
	alt,
}: Readonly<{ title: string; path: string; alt?: string[] }>) {
	const pathName = usePathname();
	const fullPath = TransformClientPath(path);
	alt = alt?.map((x) => TransformClientPath(x)) ?? [];

	return (
		<li
			className={
				((pathName === fullPath || alt?.includes(pathName)) &&
					styles.active) ||
				''
			}
		>
			<Link href={fullPath}>{title}</Link>
		</li>
	);
}
