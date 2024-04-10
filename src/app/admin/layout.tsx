import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import TopHeader from '@/components/header/TopHeader';
import Navigation from '@/components/navigation/Navigation';
import { WEBSITE } from '@/utils';
import { MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import styles from './layout.module.css';

export const metadata: Metadata = {
	title: WEBSITE.title('Admin'),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<TopHeader />
			<Header
				logoNavHref='/admin'
				excluded={['search']}
				miscExcluded={['wishlist', 'cart']}
			/>
			<Navigation />
			<p className={MultiStyles(styles.text, 'text-center')}>
				You are viewing in Admin Page.
				<br />
				<Link className={styles.link} href='/'>
					CLICK HERE TO BACK TO HOME
				</Link>
			</p>
			{children}
			<Footer />
		</div>
	);
}
