import { APIResponse, PageProps } from '@/types';
import { API, REVALIDATE, WEBSITE } from '@/utils';
import getUrl from '@/utils/getUrl';
import AuthConfig from '@/utils/nextAuth/NextAuthConfig';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Component from './component';

export async function generateMetadata(
	props: Readonly<PageProps<{ id: string }>>,
) {
	const Cookies = cookies();

	const fetchedOrder = await fetch(
		getUrl(API.OrderDetails(props.params.id)),
		{
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
			next: {
				revalidate: REVALIDATE.OrderDetails,
			},
		},
	);

	let title;
	try {
		const result = (await fetchedOrder.json()) as APIResponse;
		if (!result.success) throw new Error(result.message);
		title = WEBSITE.title(`Order #${props.params.id}`);
	} catch (e) {
		title = WEBSITE.title(`Not found`);
	}

	return {
		title,
	};
}

export default async function Page(props: Readonly<PageProps<{ id: string }>>) {
	const Cookies = cookies();
	const session = await getServerSession(AuthConfig);

	const fetchedOrder = await fetch(
		getUrl(API.OrderDetails(props.params.id)),
		{
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
			next: {
				revalidate: REVALIDATE.OrderDetails,
			},
		},
	);

	try {
		const result = (await fetchedOrder.json()) as APIResponse;
		if (!result.success) throw new Error(result.message);

		(result as any).data['orderId'] = props.params.id;
        (result as any).data['userId'] = parseInt(session?.user?.id ?? '0');

		return <Component data={result.data as any} />;
	} catch (e) {
		return notFound();
	}
}
