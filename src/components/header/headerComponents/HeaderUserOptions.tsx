import { MultiStyles } from '@/utils';
import Link from 'next/link';

export interface HeaderUserOptionsProps {
	href?: string;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	/**
	 * @default {className} 'p-3 block'
	 */
	className?: string;
	children?: React.ReactNode;
}

export default function HeaderUserOptions({
	href,
	onClick,
	className,
	children,
}: Readonly<HeaderUserOptionsProps>) {
	href = href ?? '#';

	return (
		<Link
			className={MultiStyles('p-3 block', className)}
			href={href}
			onClick={(e) => {
				if (href === '#') {
					e.preventDefault();
				}

				if (onClick) {
					onClick(e);
				}
			}}
		>
			{children}
		</Link>
	);
}
