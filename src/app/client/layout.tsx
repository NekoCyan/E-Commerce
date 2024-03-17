import type { Metadata } from 'next';

import styles from '../layout.module.css';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import TopHeader from '@/components/header/TopHeader';
import Navigation from '@/components/navigation/Navigation';
import MultiStyles from '@/utils/ComponentUtils';

export const metadata: Metadata = {
	title: 'Ocean Electro Shop | Admin',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<TopHeader />
			<Header />
			<Navigation />
			{children}
			<Footer />
		</div>
	);
}
