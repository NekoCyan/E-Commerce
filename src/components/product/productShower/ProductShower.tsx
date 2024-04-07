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

// type ProductShowerTabsProps = {
// 	categoryName: string;
// }[];
// const testProducts = [
// 	{
// 		productName: 'Laptop GTX',
// 		categoryName: 'Laptops',
// 		imageURL: './img/product01.png',
// 		price: 1000,
// 		stock: 10,
// 		rating: 5,
// 		review: 1,
// 		isNew: true,
// 		salePercentage: 30,
// 	},
// 	{
// 		productName: 'Aprle 12 Pro Max',
// 		categoryName: 'Smartphones',
// 		imageURL: './img/product02.png',
// 		price: 998,
// 		stock: 10,
// 		rating: 4,
// 		review: 1,
// 		isNew: true,
// 		salePercentage: 0,
// 	},
// 	{
// 		productName: 'Laptop GTX',
// 		categoryName: 'Laptops',
// 		imageURL: './img/product01.png',
// 		price: 1000,
// 		stock: 10,
// 		rating: 5,
// 		review: 1,
// 		isNew: true,
// 		salePercentage: 30,
// 	},
// 	{
// 		productName: 'Aprle 12 Pro Max',
// 		categoryName: 'Smartphones',
// 		imageURL: './img/product02.png',
// 		price: 998,
// 		stock: 10,
// 		rating: 4,
// 		review: 1,
// 		isNew: true,
// 		salePercentage: 0,
// 	},
// 	{
// 		productName: 'Laptop GTX',
// 		categoryName: 'Laptops',
// 		imageURL: './img/product01.png',
// 		price: 1000,
// 		stock: 10,
// 		rating: 5,
// 		review: 1,
// 		isNew: true,
// 		salePercentage: 30,
// 	},
// 	{
// 		productName: 'Aprle 12 Pro Max',
// 		categoryName: 'Smartphones',
// 		imageURL: './img/product02.png',
// 		price: 998,
// 		stock: 10,
// 		rating: 4,
// 		review: 1,
// 		isNew: true,
// 		salePercentage: 0,
// 	},
// 	// {
// 	// 	productName: '',
// 	// 	categoryName: '',
// 	// 	imageURL: '',
// 	// 	price: 0,
// 	//  stock: 0,
// 	// 	rating: 0,
// 	// 	isNew: false,
// 	// 	salePercentage: 0,
// 	// },
// ];

export default function ProductShower({
	title,
	categories,
	customNavId,
}: Readonly<{
	title: string;
	categories: CategoryData[];
	customNavId: string;
}>) {	
	const [currentCategory, setCurrentCategory] = useState(categories[0]);
	const [currentProductList, setCurrentProductList] = useState<ProductData[]>(
		[],
	);
	const [isFetching, setIsFetching] = useState(true);

	const ProductShowerRef = useRef<{ component: React.ReactNode | null }>({
		component: (
			<ProductShowerList
				navId={customNavId}
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
			GET(API.ProductsList, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
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
				var $this = $(`div[data-nav="#${customNavId}"]`);
				($this as any)?.slick('unslick');
			} catch {}
			ProductShowerRef.current = {
				component: <Loading />,
			};
		} else {
			ProductShowerRef.current = {
				component: (
					<ProductShowerList
						navId={customNavId}
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
						categories={categories}
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
