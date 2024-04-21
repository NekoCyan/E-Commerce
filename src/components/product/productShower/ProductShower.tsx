'use client';

import Loading from '@/app/loading';
import { CategoryData, ProductData } from '@/app/models/interfaces';
import { DocumentList } from '@/app/models/interfaces/ExternalDocument';
import { NekoResponse } from '@/types';
import { API } from '@/utils';
import { MultiStyles } from '@/utils/ComponentUtils';
import { GET } from '@/utils/Request';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import styles from './ProductShower.module.css';
import ProductShowerList from './productShowerComponents/ProductShowerList';
import ProductShowerTabs from './productShowerComponents/ProductShowerTabs';

export default function ProductShower({
	title,
	categories,
	limitCategoriesTabs,
	customNavId,
}: Readonly<{
	title: string;
	categories: CategoryData[];
	limitCategoriesTabs?: CategoryData[];
	customNavId?: string;
}>) {
	const navId = customNavId ?? title.toLowerCase().replace(/ +/g, '-');

	const [currentCategory, setCurrentCategory] = useState(
		limitCategoriesTabs?.[0] ?? categories[0],
	);
	const [currentProductList, setCurrentProductList] = useState<ProductData[]>(
		[],
	);
	const [isFetching, setIsFetching] = useState(true);

	const ProductShowerRef = useRef<{ component: React.ReactNode | null }>({
		component: (
			<ProductShowerList
				navId={navId}
				productList={currentProductList}
				categories={categories}
			/>
		),
	});

	// When currentCategory changed, do change fetch state to true.
	useEffect(() => {
		setIsFetching(true);
	}, [currentCategory]);

	// When in fetching, do fetch products.
	useEffect(() => {
		if (!isFetching) return;

		if (currentCategory.name.toLowerCase() === 'all') {
			GET(
				API.ProductsList +
					'?' +
					new URLSearchParams({
						inStock: '',
					}),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
				.then((x) => {
					const data = x.data as NekoResponse<
						DocumentList<ProductData>
					>;

					setCurrentProductList(data.data.list);
				})
				.catch((err) => {
					console.log(err);
					setCurrentProductList([]);
				})
				.finally(() => {
					setIsFetching(false);
				});
		} else {
			GET(
				API.ProductsList +
					'?' +
					new URLSearchParams({
						filterByCategories:
							currentCategory.categoryId.toString(),
						inStock: '',
					}),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
				.then((x) => {
					const data = x.data as NekoResponse<
						DocumentList<ProductData>
					>;

					setCurrentProductList(data.data.list);
				})
				.catch((err) => {
					console.log(err);
					setCurrentProductList([]);
				})
				.finally(() => {
					setIsFetching(false);
				});
		}
	}, [isFetching]);

	// When not in fetch, remove old slick and change to loading.
	// When in fetch, deploy new product.
	useMemo(() => {
		if (isFetching) {
			// Remove old slick when in fetch state.
			try {
				var $this = $(`div[data-nav="#${navId}"]`);
				($this as any)?.slick('unslick');
			} catch {}
			ProductShowerRef.current = {
				component: <Loading />,
			};
		} else {
			ProductShowerRef.current = {
				component: (
					<ProductShowerList
						navId={navId}
						productList={currentProductList}
						categories={categories}
					/>
				),
			};
		}
	}, [isFetching]);

	return (
		<div className={MultiStyles('section', styles['product-shower'])}>
			<Container>
				<Row>
					{/* Categories Filter */}
					<ProductShowerTabs
						title={title}
						categories={limitCategoriesTabs ?? categories}
						setCurrentCategory={setCurrentCategory}
						isDisabled={isFetching}
					/>

					{/* Product Shower */}
					{ProductShowerRef.current.component}
				</Row>
			</Container>
		</div>
	);
}
