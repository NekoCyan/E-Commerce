import type { Metadata } from 'next';

import { ROUTES } from '@/utils';
import { MultiStyles } from '@/utils/ComponentUtils';
import NextAuthProvider from '@/utils/nextAuth/NextAuthProvider';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { getServerSession } from 'next-auth';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import 'nouislider/dist/nouislider.min.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import LinkClickPreventer from './LinkClickPreventer';
import './globals.css';
import styles from './layout.module.css';

const montserrat = Montserrat({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
	title: 'Ocean Electro Shop',
	description: 'An eCommerce website (template) use for educational purposes',
	keywords:
		'ecommerce, electronic commercial, template, shop, educational, educational purpose, dntu, ocean, assignment',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	return (
		<html lang='en'>
			<head>
				<meta httpEquiv='X-UA-Compatible' content='IE=edge' />

				<script src='/assets/js/jquery.min.js'></script>
				<script src='/assets/js/bootstrap.min.js'></script>
				<script src='/assets/js/slick.min.js'></script>
				<script src='/assets/js/nouislider.min.js'></script>
				<script src='/assets/js/jquery.zoom.min.js'></script>
				<script src='/assets/js/main.js'></script>
			</head>

			<body className={montserrat.className}>
				<h5
					className={MultiStyles(
						styles.warning,
						styles.rainbow,
						'text-center',
					)}
				>
					Frequently reminder: This website is just using for{' '}
					<u>
						<Link href={ROUTES.Educational}>
							EDUCATIONAL PURPOSE
						</Link>
					</u>
					, not for Commercial.
				</h5>
				<NextAuthProvider session={session}>
					{children}
				</NextAuthProvider>
				<LinkClickPreventer />
			</body>
		</html>
	);
}
