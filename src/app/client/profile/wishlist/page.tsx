import { WEBSITE } from '@/utils';
import { Metadata } from 'next';
import { Container } from 'react-bootstrap';

export const metadata: Metadata = {
	title: WEBSITE.title('Wishlist'),
};

export default async function Page() {
	return <Container>Wishlist</Container>;
}
