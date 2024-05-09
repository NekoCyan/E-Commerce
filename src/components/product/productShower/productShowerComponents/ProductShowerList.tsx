'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import AddToCartBtn from '@/components/cart/AddToCartBtn';
import ToolTip from '@/components/tooltip/ToolTip';
import { RootDispatch, RootState } from '@/redux/store';
import { wishlistAction } from '@/redux/wishlistCount/WishlistSlice';
import { APIResponse } from '@/types';
import { API, Truncate } from '@/utils';
import { FormatCurrency, MultiStyles } from '@/utils/ComponentUtils';
import { POST } from '@/utils/Request';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from '../ProductShower.module.css';

export default function ProductShowerList({
	productList,
	categories,
	navId,
}: Readonly<{
	productList: ProductData[];
	categories: CategoryData[];
	navId: string;
}>) {
	const wishlist = useSelector<RootState, number[]>(
		(state) => state.wishlist.value,
	);
	const dispatch: RootDispatch = useDispatch();

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
				dots: true,
				arrows: true,
				appendArrows: $nav ? $nav : false,
				waitForAnimate: false,
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
							dots: false,
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
									const productDetailsURL =
										'/product-details/' +
										productData.productId +
										'#breadcrumb';

									const [isSubmitting, setIsSubmitting] =
										useState(false);

									useEffect(() => {
										if (!isSubmitting) return;

										POST(API.Wishlist, {
											productId: parseInt(
												productData.productId as any,
											),
										})
											.then((x) => {
												const data =
													x.data as APIResponse<{
														status: boolean;
													}>;
												if (!data.success)
													throw new Error(
														data.message,
													);

												if (data.data.status === true) {
													dispatch(
														wishlistAction.add(
															parseInt(
																productData.productId as any,
															),
														),
													);
												} else {
													dispatch(
														wishlistAction.remove(
															parseInt(
																productData.productId as any,
															),
														),
													);
												}
											})
											.catch((err: any) => {
												toast.error(err.msg);
											})
											.finally(() => {
												setIsSubmitting(false);
											});
									}, [isSubmitting]);

									const isWishlist = wishlist.includes(
										parseInt(productData.productId as any),
									);

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
													<Link
														href={productDetailsURL}
													>
														{Truncate(
															productData.name,
															64,
														)}
													</Link>
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
														disabled={isSubmitting}
														onClick={() =>
															setIsSubmitting(
																true,
															)
														}
													>
														<ToolTip
															text={
																isWishlist
																	? 'Remove from Wishlist'
																	: 'Add to Wishlist'
															}
														>
															<i
																className={MultiStyles(
																	'text-red-500 fa',
																	isWishlist
																		? 'fa-heart'
																		: 'fa-heart-o',
																)}
															></i>
														</ToolTip>
													</button>
													<Link
														href={productDetailsURL}
														className='p-5'
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
													</Link>
												</div>
											</div>
											<div className='add-to-cart'>
												<AddToCartBtn
													productData={productData}
												/>
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
