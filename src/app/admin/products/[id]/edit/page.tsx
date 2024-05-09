import { PageProps } from '@/types';
import { API } from '@/utils';
import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Component from '../../new/component';

export default async function Page(
	props: Readonly<PageProps<{ id: string }, { callbackUrl: string }>>,
) {
	const Cookies = cookies();
	const fetchedProduct = await fetch(
		getUrl(API.ProductsEdit(props.params.id)),
		{
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				Cookie: Cookies.toString(),
			},
		},
	);
	const { data } = await fetchedProduct.json();
	if (Object.keys(data).includes('name')) {
		data['productId'] = props.params.id;
		return <Component productData={data} props={props} />;
	} else {
		return notFound();
	}
}
