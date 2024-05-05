import AuthConfig from '@/utils/nextAuth/NextAuthConfig';
import { getServerSession } from 'next-auth';
import Component from './component';

export default async function Checkout() {
	const session = await getServerSession(AuthConfig);

	return <Component session={session} />;
}
