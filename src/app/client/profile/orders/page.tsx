import { WEBSITE } from '@/utils';
import { Metadata } from 'next';
import { Container } from 'react-bootstrap';

export const metadata: Metadata = {
	title: WEBSITE.title('Orders'),
};

export default async function Page() {
	return <Container>Orders</Container>;
}
