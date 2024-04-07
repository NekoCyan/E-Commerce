'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import { Truncate } from '@/utils';
import { FormatCurrency, MultiStyles } from '@/utils/ComponentUtils';
import { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import styles from '../ProductShower.module.css';

export default function ProductShowerList({
	productList,
	categories,
	navId,
}: {
	productList: ProductData[];
	categories: CategoryData[];
	navId: string;
}) {
	useEffect(() => {
		try {
			var $this = $(`div[data-nav="#${navId}"]`),
				$nav = $this.attr('data-nav');

			($this as any)?.slick({
				slidesToShow: 4,
				slidesToScroll: 4,
				autoplay: true,
				infinite: true,
				speed: 2000,
				dots: false,
				arrows: true,
				appendArrows: $nav ? $nav : false,
				responsive: [
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
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
		} catch {}
	});

	return (
		<div className='col-md-12'>
			{productList.length > 0 ? (
				<Row>
					<div className={'products-tabs'}>
						<div
							id='tab1'
							className={MultiStyles('tab-pane', 'active')}
						>
							<div
								suppressHydrationWarning={true}
								data-nav={'#' + navId}
								className={MultiStyles('products-slick')}
							>
								{/* Product here */}
								{productList.map((productData, index) => {
									const salePrice = FormatCurrency(
										productData.price *
											(1 -
												(productData.salePercentage ??
													0) /
													100),
									);
									const isSale = !!(
										productData.salePercentage &&
										productData.salePercentage > 0
									);
									let rating = 5;
									// if (productData.rating > 5) rating = 5;
									// else if (productData.rating < 0) rating = 0;
									// else rating = productData.rating;

									return (
										<div
											key={productData.productId}
											className={'product'}
										>
											<div className={'product-img'}>
												<img
													src={
														productData.imageUrls[0]
													}
													alt={productData.name.toLowerCase()}
												/>
												<div
													className={'product-label'}
												>
													{isSale && (
														<span
															className={'sale'}
														>
															-
															{
																productData.salePercentage
															}
															%
														</span>
													)}
													{productData.isNewProduct ===
														true && (
														<span className={'new'}>
															NEW
														</span>
													)}
												</div>
											</div>
											<div className={'product-body'}>
												<p
													className={
														'product-category'
													}
												>
													{categories.find(
														(x) =>
															x.categoryId ===
															productData
																.categoryIds[0],
													)?.name ?? 'Unknown'}
												</p>
												<h3 className={'product-name'}>
													<a href='#'>
														{Truncate(
															productData.name,
															32,
														)}
													</a>
												</h3>
												<h4 className={'product-price'}>
													{salePrice}{' '}
													{isSale && (
														<del
															className={
																'product-old-price'
															}
														>
															{' '}
															{FormatCurrency(
																productData.price,
															)}{' '}
														</del>
													)}
												</h4>
												<div
													className={'product-rating'}
												>
													{[...Array(rating)].map(
														(_, index) => (
															<i
																key={index}
																className='fa fa-star'
															></i>
														),
													)}
													{[...Array(5 - rating)].map(
														(_, index) => (
															<i
																key={index}
																className='fa fa-star-o'
															></i>
														),
													)}
												</div>
												<div className={'product-btns'}>
													<button
														className={
															'add-to-wishlist'
														}
													>
														<i className='fa fa-heart-o'></i>
														<span
															className={
																'tooltipp'
															}
														>
															{' '}
															add to wishlist{' '}
														</span>
													</button>
													<button
														className='quick-view'
														onClick={() => {
															window.location.href =
																'/product-details/' +
																productData.productId +
																'#breadcrumb';
														}}
													>
														<i className='fa fa-th-list'></i>
														<span
															className={
																'tooltipp'
															}
														>
															{' '}
															more details{' '}
														</span>
													</button>
												</div>
											</div>
											<div className={'add-to-cart'}>
												<button
													className={
														'add-to-cart-btn'
													}
												>
													<i className='fa fa-shopping-cart'></i>{' '}
													add to cart
												</button>
											</div>
										</div>
									);
								})}
							</div>
							<div
								suppressHydrationWarning={true}
								id={navId}
								className={MultiStyles('products-slick-nav')}
								style={{
									display: 'none',
								}}
							></div>
						</div>
					</div>
				</Row>
			) : (
				<p className={styles['no-product']}>
					No product available in this category...
				</p>
			)}
		</div>
	);
}
