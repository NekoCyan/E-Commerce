import { PageProps } from '@/types';
import { API, WEBSITE } from '@/utils';
import getUrl from '@/utils/getUrl';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Component from './component';

export const metadata: Metadata = {
	title: WEBSITE.title('Orders'),
};

export default async function Page({
	searchParams,
}: Readonly<
	PageProps<
		{},
		{
			page?: string;
			limit?: string;
		}
	>
>) {
	const Cookies = cookies();

	const URLParams = new URLSearchParams();
	if (searchParams.page) URLParams.append('page', searchParams.page);
	if (searchParams.limit) URLParams.append('limit', searchParams.limit);

	const fetchedOrders = await fetch(
		getUrl(API.OrdersList) +
			(URLParams.toString().length > 0 ? `?${URLParams.toString()}` : ''),
		{
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
		},
	);
	const { data } = await fetchedOrders.json();

	return (
		<Component
			orders={data.list}
			currentPage={data.currentPage}
			totalPage={data.totalPage}
		/>
	);
}
