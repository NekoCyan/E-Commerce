'use client';

import { ROUTES } from '@/utils';
import { MultiStyles, isAdmin } from '@/utils/ComponentUtils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Navigation.module.css';
import NavigationLink from './navigationComponents/NavigationLink';

function getNavLink(navFor: 'client' | 'admin') {
	let allLinks = [];
	if (navFor === 'client') {
		allLinks.push(
			{
				title: 'Home',
				path: '',
				alt: [],
				isLoginRequired: false,
				isAdminRequired: false,
			},
			{
				title: 'Products',
				path: ROUTES.Products,
				alt: ['/product-details'],
				isLoginRequired: false,
				isAdminRequired: false,
			},
			{
				title: '-',
				path: '#',
				alt: [],
				isLoginRequired: true,
				isAdminRequired: false,
			},
			{
				title: 'Orders',
				path: ROUTES.Orders,
				alt: ['/order-details'],
				isLoginRequired: true,
				isAdminRequired: false,
			},
		);
	} else {
		allLinks.push(
			{
				title: 'Orders',
				path: '',
				alt: [],
				isLoginRequired: true,
				isAdinRequired: true,
			},
			{
				title: 'Users',
				path: '/users',
				alt: [],
				isLoginRequired: true,
				isAdinRequired: true,
			},
			{
				title: 'Categories',
				path: '/categories',
				alt: [],
				isLoginRequired: true,
				isAdinRequired: true,
			},
			{
				title: 'Products',
				path: '/products',
				alt: [],
				isLoginRequired: true,
				isAdinRequired: true,
			},
		);
	}

	return allLinks;
}

export default function Navigation() {
	const pathForName = usePathname();
	const { data, status } = useSession();

	const isClient = pathForName.startsWith('/client');
	const allLinks = getNavLink(
		pathForName.startsWith('/client') ? 'client' : 'admin',
	).filter((x) => {
		if (
			(x.isLoginRequired && status === 'authenticated') ||
			(x.isAdminRequired && isAdmin(data)) ||
			(x.isLoginRequired === false && x.isAdminRequired === false)
		) {
			return true;
		} else {
			return false;
		}
	});

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check if window is available (client-side)
		if (typeof window !== 'undefined') {
			const handleResize = () => {
				setIsMobile(window.innerWidth <= 991);
			};

			handleResize(); // Set initial isMobile value

			window.addEventListener('resize', handleResize);

			// Clean up the event listener on component unmount
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	}, []); // Empty dependency array to run the effect only once on client-side

	return (
		<nav className={styles.navigation}>
			<Container>
				<div
					id='responsive-nav'
					className={MultiStyles(styles['responsive-nav'])}
				>
					<ul
						className={MultiStyles(
							styles['main-nav'],
							!isMobile && 'navbar-nav',
							'nav',
						)}
					>
						{allLinks.map((item, index) => (
							<NavigationLink
								key={index}
								title={item.title}
								path={item.path}
								alt={item.alt}
							/>
						))}

						{!isClient && (
							<li>
								<Link href='/'>BACK TO HOME</Link>
							</li>
						)}
					</ul>
				</div>
			</Container>
		</nav>
	);
}
