import type { Metadata } from 'next';

import Header from '@/components/header/Header';
import TopHeader from '@/components/header/TopHeader';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Montserrat } from 'next/font/google';
import 'nouislider/dist/nouislider.min.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './globals.css';

const montserrat = Montserrat({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
	title: 'Ocean Electro Shop',
	description: 'An eCommerce website (template) use for educational purposes',
	keywords: 'ecommerce, electro commerce, template, shop, educational',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<meta httpEquiv='X-UA-Compatible' content='IE=edge' />

				<script src='/assets/js/main.js'></script>
				<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>
			</head>

			<body className={montserrat.className}>
				<TopHeader />
				<Header />
				{children}
			</body>
		</html>
	);
}
