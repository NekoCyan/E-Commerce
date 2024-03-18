import type { Metadata } from 'next';

import { MultiStyles } from '@/utils/ComponentUtils';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Montserrat } from 'next/font/google';
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

				<script src='/assets/js/jquery.min.js'></script>
				{/* <script src='/assets/js/bootstrap.min.js'></script> */}
				<script src='/assets/js/slick.min.js'></script>
				<script src='/assets/js/nouislider.min.js'></script>
				<script src='/assets/js/jquery.zoom.min.js'></script>
				<script src='/assets/js/main.js'></script>

				<link
					rel='stylesheet'
					href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
					integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u'
					crossOrigin='anonymous'
				/>
				<link
					rel='stylesheet'
					href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'
					integrity='sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp'
					crossOrigin='anonymous'
				/>
				<script
					src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
					integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa'
					crossOrigin='anonymous'
				></script>
			</head>

			<body className={montserrat.className}>
				<h5
					className={MultiStyles(styles.rainbow, 'text-center')}
					style={{ paddingTop: '10px', fontWeight: 'bold' }}
				>
					Frequently reminder: This website is just using for{' '}
					<u>EDUCATIONAL PURPOSE</u>, not for Commercial.
				</h5>
				{children}
				<LinkClickPreventer />
			</body>
		</html>
	);
}
