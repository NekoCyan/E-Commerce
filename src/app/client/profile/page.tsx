import { WEBSITE } from '@/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: WEBSITE.title('Checkout'),
};

export default async function Page() {
	return <>Hello Profile</>;
}
