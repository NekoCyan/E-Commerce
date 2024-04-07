import BreadCrumb from '@/components/breadcrumb/BreadCrumb';
import ProductDetails from '@/components/product/productDetails/ProductDetails';
import { PageProps } from '@/types';
import { API, ROUTES, Truncate } from '@/utils';
import getUrl from '@/utils/getUrl';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

export default async function Page(
	props: Readonly<PageProps<{ productId: string }>>,
) {
	const fetchedProduct = await fetch(
		getUrl(API.ProductsGet(props.params.productId)),
		{
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
	const product = (await fetchedProduct.json()).data;
	if (Object.keys(product).includes('name')) {
		product['productId'] = props.params.productId;
		const fetchedCategories = await fetch(getUrl('/api/categories'), {
			cache: 'no-cache',
		});
		const categories = (await fetchedCategories.json()).data;

		const breadcrumbNav = [
			{ name: 'Products', url: ROUTES.Products },
			{ name: Truncate(product.name, 150), url: '#' },
		];

		return (
			<Fragment>
				<BreadCrumb navigation={breadcrumbNav} />
				<ProductDetails
					productData={product}
					categoriesList={categories.list}
				/>
			</Fragment>
		);
	} else {
		return notFound();
	}
}
