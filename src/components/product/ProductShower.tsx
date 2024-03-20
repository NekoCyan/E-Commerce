'use client';

import { MultiStyles } from '@/utils/ComponentUtils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import styles from './ProductShower.module.css';
import ProductShowerList from './productComponents/ProductShowerList';
import ProductShowerTabs from './productComponents/ProductShowerTabs';

// type ProductShowerTabsProps = {
// 	categoryName: string;
// }[];
const allProducts = [
	{
		productName: 'Laptop GTX',
		categoryName: 'Laptops',
		imageURL: './img/product01.png',
		price: 1000,
		rating: 5,
		isNew: true,
		salePercentage: 30,
	},
	{
		productName: 'Aprle 12 Pro Max',
		categoryName: 'Smartphones',
		imageURL: './img/product02.png',
		price: 998,
		rating: 4,
		isNew: true,
		salePercentage: 0,
	},
	{
		productName: 'Laptop GTX',
		categoryName: 'Laptops',
		imageURL: './img/product01.png',
		price: 1000,
		rating: 5,
		isNew: true,
		salePercentage: 30,
	},
	{
		productName: 'Aprle 12 Pro Max',
		categoryName: 'Smartphones',
		imageURL: './img/product02.png',
		price: 998,
		rating: 4,
		isNew: true,
		salePercentage: 0,
	},
	{
		productName: 'Laptop GTX',
		categoryName: 'Laptops',
		imageURL: './img/product01.png',
		price: 1000,
		rating: 5,
		isNew: true,
		salePercentage: 30,
	},
	{
		productName: 'Aprle 12 Pro Max',
		categoryName: 'Smartphones',
		imageURL: './img/product02.png',
		price: 998,
		rating: 4,
		isNew: true,
		salePercentage: 0,
	},
	// {
	// 	productName: '',
	// 	categoryName: '',
	// 	imageURL: '',
	// 	price: 0,
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
	// remove duplicate and empty string.
	categories = [...new Set(categories)].filter((x) => x);
	if (categories.length === 0) {
		categories = ['All'];
	}
	const [currentCategory, setCurrentCategory] = useState(categories[0]);
	const [currentProductList, setCurrentProductList] = useState(allProducts);

	const ProductShowerRef = useRef<{ component: React.ReactNode | null }>({
		component: (
			<ProductShowerList
				navId={customNavId}
				productList={currentProductList}
			/>
		),
	});

	// When currentCategory changed.
	useEffect(() => {
		if (currentCategory.toLowerCase() === 'all') {
			setCurrentProductList(allProducts);
		} else {
			const filterProducts = allProducts.filter(
				(product) =>
					product.categoryName.toLowerCase() === currentCategory,
			);
			setCurrentProductList(filterProducts);
		}
	}, [currentCategory]);

	// When currentProductList changed.
	useMemo(() => {
		// Remove old slick.
		try {
			var $this = $(`div[data-nav="#${customNavId}"]`);
			($this as any)?.slick('unslick');
		} catch {}

		ProductShowerRef.current = {
			component: (
				<ProductShowerList
					navId={customNavId}
					productList={currentProductList}
				/>
			),
		};
	}, [currentProductList]);

	return (
		<div className={MultiStyles('section', styles['product-shower'])}>
			<Container>
				<Row>
					{/* Categories Filter */}
					<ProductShowerTabs
						title={title}
						categories={categories}
						setCurrentCategory={setCurrentCategory}
					/>

					{/* Product Shower */}
					{ProductShowerRef.current.component}
					{/* Continue to fix the product shower list. */}
				</Row>
			</Container>
		</div>
	);
}
