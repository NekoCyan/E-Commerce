import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import TopHeader from '@/components/header/TopHeader';
import Navigation from '@/components/navigation/Navigation';

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
