'use client';

import { MultiStyles } from '@/utils/ComponentUtils';
import { ROUTES } from '@/utils/Constants';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import styles from './TopHeader.module.css';
import HeaderUserOptions, {
	HeaderUserOptionsProps,
} from './headerComponents/HeaderUserOptions';

const userOptions: (HeaderUserOptionsProps & {
	text: string;
	icon?: string;
	isAdminRequired?: boolean;
})[] = [
	{
		text: 'Admin Panel',
		icon: 'fa fa-user-o',
		href: '/admin',
		isAdminRequired: true,
	},
	{
		text: 'Profile',
		icon: 'fa fa-user-o',
		href: '/profile',
	},
	{
		text: 'Logout',
		icon: 'fa fa-sign-out',
		onClick: () => {
			signOut({
				// Dunno why it's not work.
				// callbackUrl: getUrl(ROUTES.Auth),
				// redirect: true,
			}).then((x) => {
				window.location.href = ROUTES.Auth;
			});
		},
	},
];

export const revalidate = 0;

export default function TopHeader() {
	const { data, status } = useSession();

	return (
		<div className={styles['top-header']}>
			<Container className={styles.container}>
				<ul
					className={MultiStyles(
						styles['header-links'],
						styles['pull_left'],
					)}
				>
					<li>
						<Link href='#'>
							<i className='fa fa-phone'></i>+021-95-51-84
						</Link>
					</li>
					<li>
						<Link href='#'>
							<i className='fa fa-envelope-o'></i>email@email.com
						</Link>
					</li>
					<li>
						<Link href='#'>
							<i className='fa fa-map-marker'></i>1734 Stonecoal
							Road
						</Link>
					</li>
				</ul>
				<ul
					className={MultiStyles(
						styles['header-links'],
						styles['pull_right'],
					)}
				>
					<li>
						<Link href='#'>
							<i className='fa fa-dollar'></i>USD
						</Link>
					</li>
					<li>
						{status === 'authenticated' ? (
							<div className='group relative cursor-pointer'>
								<Link
									href='#'
									onClick={(e) => e.preventDefault()}
								>
									<i className='fa fa-user-o'></i>
									{data.user?.fullName}
								</Link>
								<div className='absolute flex flex-col z-20 w-[150px] -right-10 bg-[#1E1F29] text-gray-800 border-red-500 border shadow-xl invisible group-hover:visible'>
									{userOptions.map((option, index) => {
										if (
											option.isAdminRequired &&
											data?.user?.role !== 'ADMIN'
										)
											return null;

										return (
											<HeaderUserOptions
												key={index}
												className='flex flex-row items-center justify-center gap-3'
												href={option.href ?? '#'}
												onClick={option.onClick}
											>
												{option.icon && (
													<i
														className={option.icon}
													></i>
												)}
												{option.text}
											</HeaderUserOptions>
										);
									})}
								</div>
							</div>
						) : (
							<Link href={ROUTES.Auth}>
								<i className='fa fa-user-o'></i>Login
							</Link>
						)}
					</li>
				</ul>
			</Container>
		</div>
	);
}
