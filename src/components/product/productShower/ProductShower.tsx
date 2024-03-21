'use client';

import Loading from '@/app/loading';
import { MultiStyles, Sleep } from '@/utils/ComponentUtils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import styles from './ProductShower.module.css';
import ProductShowerList from './productShowerComponents/ProductShowerList';
import ProductShowerTabs from './productShowerComponents/ProductShowerTabs';

// type ProductShowerTabsProps = {
// 	categoryName: string;
// }[];
const testProducts = [
	{
		productName: 'Laptop GTX',
		categoryName: 'Laptops',
		imageURL: './img/product01.png',
		price: 1000,
		stock: 10,
		rating: 5,
		review: 1,
		isNew: true,
		salePercentage: 30,
	},
	{
		productName: 'Aprle 12 Pro Max',
		categoryName: 'Smartphones',
		imageURL: './img/product02.png',
		price: 998,
		stock: 10,
		rating: 4,
		review: 1,
		isNew: true,
		salePercentage: 0,
	},
	{
		productName: 'Laptop GTX',
		categoryName: 'Laptops',
		imageURL: './img/product01.png',
		price: 1000,
		stock: 10,
		rating: 5,
		review: 1,
		isNew: true,
		salePercentage: 30,
	},
	{
		productName: 'Aprle 12 Pro Max',
		categoryName: 'Smartphones',
		imageURL: './img/product02.png',
		price: 998,
		stock: 10,
		rating: 4,
		review: 1,
		isNew: true,
		salePercentage: 0,
	},
	{
		productName: 'Laptop GTX',
		categoryName: 'Laptops',
		imageURL: './img/product01.png',
		price: 1000,
		stock: 10,
		rating: 5,
		review: 1,
		isNew: true,
		salePercentage: 30,
	},
	{
		productName: 'Aprle 12 Pro Max',
		categoryName: 'Smartphones',
		imageURL: './img/product02.png',
		price: 998,
		stock: 10,
		rating: 4,
		review: 1,
		isNew: true,
		salePercentage: 0,
	},
	// {
	// 	productName: '',
	// 	categoryName: '',
	// 	imageURL: '',
	// 	price: 0,
	//  stock: 0,
	// 	rating: 0,
	// 	isNew: false,
	// 	salePercentage: 0,
	// },
];

export default function ProductShower({
	title,
	categories,
	customNavId,
}: {
	title: string;
	categories: string[];
	customNavId: string;
}) {
	const allProducts = title !== 'Top Selling' ? testProducts : [];

	// remove duplicate and empty string.
	categories = [...new Set(categories)].filter((x) => x);
	if (categories.length === 0) {
		categories = ['All'];
	}
	const [currentCategory, setCurrentCategory] = useState(categories[0]);
	const [currentProductList, setCurrentProductList] = useState(allProducts);
	const [isFetching, setIsFetching] = useState(true);

	const ProductShowerRef = useRef<{ component: React.ReactNode | null }>({
		component: (
			<ProductShowerList
				navId={customNavId}
				productList={currentProductList}
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

		if (currentCategory.toLowerCase() === 'all') {
			Sleep(2000).then(() => {
				setCurrentProductList(allProducts);
				setIsFetching(false);
			});
		} else {
			const filterProducts = allProducts.filter(
				(product) =>
					product.categoryName.toLowerCase() === currentCategory,
			);
			setCurrentProductList(filterProducts);
			setIsFetching(false);
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
