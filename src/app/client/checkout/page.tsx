import { WEBSITE } from '@/utils';
import AuthConfig from '@/utils/nextAuth/NextAuthConfig';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Component from './component';

export const metadata: Metadata = {
	title: WEBSITE.title('Checkout'),
}

export default async function Checkout() {
	const session = await getServerSession(AuthConfig);

	return <Component session={session} />;
}
