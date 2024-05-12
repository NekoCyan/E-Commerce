'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import BreadCrumb, {
	BreadCrumbProps,
} from '@/components/breadcrumb/BreadCrumb';
import ProductDetails from '@/components/product/productDetails/ProductDetails';
import { ROUTES } from '@/utils';
import { isAdmin } from '@/utils/ComponentUtils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';

export interface ProductDetailsProps {
	breadcrumbNavigation: BreadCrumbProps['navigation'];
	product: ProductData;
	categories: CategoryData[];
}

export default function Component({
	breadcrumbNavigation,
	product,
	categories,
}: Readonly<ProductDetailsProps>) {
	const { data } = useSession();

	return (
		<Fragment>
			<BreadCrumb navigation={breadcrumbNavigation} />
			{isAdmin(data) && (
				<Container>
					<div className='text-right'>
						<Link
							href={
								ROUTES.AdminProductsEdit(product.productId) +
								`?callbackUrl=${ROUTES.ProductDetails(
									product.productId,
								)}`
							}
							className='btn btn-primary'
						>
							Edit this Product
						</Link>
					</div>
				</Container>
			)}
			<ProductDetails productData={product} categoriesList={categories} />
		</Fragment>
	);
}
