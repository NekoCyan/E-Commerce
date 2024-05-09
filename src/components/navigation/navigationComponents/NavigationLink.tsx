'use client';

import {
	TransformAdminPath,
	TransformClientPath
} from '@/utils/ComponentUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../Navigation.module.css';

export default function NavigationLink({
	title,
	path,
	alt,
}: Readonly<{ title: string; path: string; alt?: string[] }>) {
	const pathName = usePathname();

	const fullPath = pathName.startsWith('/client')
		? TransformClientPath(path)
		: TransformAdminPath(path);

	const isDefaultPath = ['/client', '/admin'].some((x) => x === fullPath);
	const IsInDefaultPath = isDefaultPath && fullPath === pathName;

	const matchPath = [path, ...(alt ?? [])].map((x) => {
		if (pathName.startsWith('/client')) {
			return TransformClientPath(x);
		} else {
			return TransformAdminPath(x);
		}
	});

	return (
		<li
			className={
				(!isDefaultPath &&
					matchPath.some((x) => pathName.startsWith(x)) &&
					styles.active) ||
				(IsInDefaultPath && styles.active) ||
				''
			}
		>
			<Link href={fullPath}>{title}</Link>
		</li>
	);
}
