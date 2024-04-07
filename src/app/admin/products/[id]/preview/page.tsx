import ProductDetails from '@/components/product/productDetails/ProductDetails';
import { PageProps } from '@/types';
import { API } from '@/utils';
import getUrl from '@/utils/getUrl';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import Component from './component';

export default async function Page(
	props: Readonly<PageProps<{ id: string }, {}>>,
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
	const product = (await fetchedProduct.json()).data;
	if (Object.keys(product).includes('name')) {
		product['productId'] = props.params.id;
		const fetchedCategories = await fetch(getUrl('/api/categories'), {
			cache: 'no-cache',
		});
		const categories = (await fetchedCategories.json()).data;

		return (
			<Fragment>
				<Component productData={product} />
				<ProductDetails
					productData={product}
					isPreview={true}
					categoriesList={categories.list}
				/>
			</Fragment>
		);
	} else {
		return notFound();
	}
}
