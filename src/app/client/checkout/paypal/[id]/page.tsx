import { APIResponse, PageProps } from '@/types';
import { API } from '@/utils';
import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Component from './component';

export default async function Page(props: Readonly<PageProps<{ id: string }>>) {
	const Cookies = cookies();

	try {
		const fetchedPayment = await fetch(getUrl(API.OrderPaypalGenerate), {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
			body: JSON.stringify({ orderId: props.params.id }),
		});
		const resultPayment = (await fetchedPayment.json()) as APIResponse<{
			paymentId: string;
			href: string;
		}>;
		if (!resultPayment.success) throw new Error(resultPayment.message);

		return (
			<Component
				paymentId={resultPayment.data.paymentId}
				href={resultPayment.data.href}
			/>
		);
	} catch (e) {
		return notFound();
	}
}
