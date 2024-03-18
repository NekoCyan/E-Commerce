'use client';

import { MultiStyles } from '@/utils/ComponentUtils';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import styles from './ProductShower.module.css';
import ProductShowerData from './productComponents/ProductShowerData';

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
		categoryName: 'Category',
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
		categoryName: 'Category',
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
		categoryName: 'Category',
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

	const [activeTab, setActiveTab] = useState(
		categories[0]?.toLowerCase() || '',
	);
	const ProductShowerRef = useRef<HTMLDivElement>(null);

	// Check if the document is loaded (and there's slick in page).
	const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
	// this is for check is document is loaded.
	useEffect(() => {
		if (isDocumentLoaded) return;

		const handleDocumentReadyState = () => {
			if (document.readyState === 'complete') {
				setIsDocumentLoaded(true);
			}
		};

		window.addEventListener('load', handleDocumentReadyState);
		handleDocumentReadyState(); // Check initial readyState

		return () => {
			window.removeEventListener('load', handleDocumentReadyState);
		};
	}, []);
	useEffect(() => {
		console.log(ProductShowerRef.current);
		if (!isDocumentLoaded) return;

		$('.products-slick').each(function () {
			var $this = $(this),
				$nav = $this.attr('data-nav');

			($this as any).slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				autoplay: true,
				infinite: true,
				speed: 300,
				dots: false,
				arrows: true,
				appendArrows: $nav ? $nav : false,
				responsive: [
					{
						breakpoint: 991,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
						},
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
						},
					},
				],
			});
		});
	}, [isDocumentLoaded]);

	return (
		<div className='section'>
			<Container>
				<Row>
					{/* Categories Filter */}
					<div className='col-md-12'>
						<div className={styles['section-title']}>
							<h3 className={styles.title}>{title}</h3>
							{categories.length > 0 && (
								<div className={styles['section-nav']}>
									<ul
										className={MultiStyles(
											styles['section-tab-nav'],
											'tab-nav',
										)}
									>
										{categories.map((tab, index) => {
											const theTab = tab.toLowerCase();

											return (
												<li
													key={index}
													className={''}
													onClick={(e) => {
														e.preventDefault();
														if (
															activeTab === theTab
														)
															return;
														setActiveTab(theTab);
													}}
												>
													<Link
														date-toggle='tab'
														href='#'
													>
														{tab}
													</Link>
												</li>
											);
										})}
									</ul>
								</div>
							)}
						</div>
					</div>

					{/* Product Shower */}
					<div className='col-md-12' ref={ProductShowerRef}>
						<Row>
							<div className={styles['products-tabs']}>
								<div
									id='tab1'
									className={MultiStyles(
										styles['tab-pane'],
										styles.active,
									)}
								>
									<div
										className={MultiStyles(
											styles['products-slick'],
											'products-slick',
										)}
										data-nav='#slick-nav-1'
									>
										{/* Product here */}
										{allProducts.map(
											(productData, index) => (
												<ProductShowerData
													key={nanoid()}
													productData={productData}
												/>
											),
										)}
									</div>
									<div
										id='slick-nav-1'
										className={MultiStyles(
											styles['products-slick-nav'],
											'products-slick-nav',
										)}
									></div>
								</div>
							</div>
						</Row>
					</div>
				</Row>
			</Container>
		</div>
	);
}
