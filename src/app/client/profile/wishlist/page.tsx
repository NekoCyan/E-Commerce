import { WEBSITE } from '@/utils';
import { Metadata } from 'next';
import Component from './component';

export const metadata: Metadata = {
	title: WEBSITE.title('Wishlist'),
};

export default async function Page() {
	return <Component />;
}
