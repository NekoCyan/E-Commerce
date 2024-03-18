'use client';

import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
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
}: {
	title: string;
	categories: string[];
}) {
	// remove duplicate and empty string.
	categories = [...new Set(categories)].filter((x) => x);
	const [currentCategory, setCurrentCategory] = useState('');

	let filterProducts = allProducts;
	useEffect(() => {
		filterProducts = allProducts.filter(
			(x) => x.categoryName.toLowerCase() === currentCategory,
		);
		console.log(filterProducts);
	}, [currentCategory]);

	return (
		<div className='section'>
			<Container>
				<Row>
					{/* Categories Filter */}
					<ProductShowerTabs
						title={title}
						categories={categories}
						setCurrentCategory={setCurrentCategory}
					/>

					{/* Product Shower */}
					<ProductShowerList productList={filterProducts} />
					{/* Continue to fix the product shower list. */}
				</Row>
			</Container>
		</div>
	);
}
