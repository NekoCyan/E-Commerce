import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import TopHeader from '@/components/header/TopHeader';
import Link from 'next/link';

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
			<Header excluded={['search', 'misc']} logoHref='/admin' />
			<p className='p-2 text-center'>
				You are viewing in Admin Page,{' '}
				<Link href='/'>CLICK HERE TO BACK TO HOME</Link>.
			</p>
			{children}
			<Footer />
		</div>
	);
}
