import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import TopHeader from '@/components/header/TopHeader';
import { MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import styles from './layout.module.css';

export const metadata: Metadata = {
	title: 'Ocean Electro | Admin',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<TopHeader />
			<Header excluded={['search', 'misc']} logoHref='/admin' />
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
