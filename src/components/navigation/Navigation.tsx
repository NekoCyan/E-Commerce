'use client';

import { MultiStyles } from '@/utils/ComponentUtils';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Navigation.module.css';
import NavigationLink from './navigationComponents/NavigationLink';

const allLinks = [
	{
		title: 'Home',
		path: '',
	},
	{
		title: 'Hot Deals',
		path: '/hot-deals',
	},
	{
		title: 'Categories',
		path: '/categories',
	},
	{
		title: 'Laptops',
		path: '/laptops',
	},
	{
		title: 'Smartphones',
		path: '/smartphones',
	},
	{
		title: 'Cameras',
		path: '/cameras',
	},
	{
		title: 'Accessories',
		path: '/accessories',
	},
];

export default function Navigation() {
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
							/>
						))}
					</ul>
				</div>
			</Container>
		</nav>
	);
}
