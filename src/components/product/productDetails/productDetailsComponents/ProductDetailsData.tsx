'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import AddToCartBtn from '@/components/cart/AddToCartBtn';
import { RootDispatch, RootState } from '@/redux/store';
import { wishlistAction } from '@/redux/wishlistCount/WishlistSlice';
import { APIResponse } from '@/types';
import { API, ROUTES } from '@/utils';
import {
	FormatCurrency,
	MultiStyles,
	RehypeMarkdown,
} from '@/utils/ComponentUtils';
import { POST } from '@/utils/Request';
import { BASE_URL } from '@/utils/getUrl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import remarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import styles from '../ProductDetails.module.css';

export default function ProductDetailsData({
	props,
	isPreview,
	categories,
}: Readonly<{
	props: ProductData;
	isPreview?: boolean;
	categories: CategoryData[];
}>) {
	props.productId = parseInt(props.productId.toString());

	const dispatch: RootDispatch = useDispatch();
	const wishlist = useSelector<RootState, number[]>(
		(state) => state.wishlist.value,
	);

	const [quantity, setQuantity] = useState(1);

	const salePrice = FormatCurrency(
		props.price * (1 - (props.salePercentage ?? 0) / 100),
	);
	const isSale = !!(props.salePercentage && props.salePercentage > 0);
	let rating = 5;
	let review = 0;

	const [isSubmittingWhishlist, setIsSubmittingWhishlist] = useState(false);
	const isInWishlist = wishlist.includes(props.productId);

	useEffect(() => {
		if (!isSubmittingWhishlist) return;

		POST(API.Wishlist, {
			productId: parseInt(props.productId as any),
		})
			.then((x) => {
				const data = x.data as APIResponse<{
					status: boolean;
				}>;
				if (!data.success) throw new Error(data.message);

				if (data.data.status === true) {
					dispatch(
						wishlistAction.add(parseInt(props.productId as any)),
					);
				} else {
					dispatch(
						wishlistAction.remove(parseInt(props.productId as any)),
					);
				}
			})
			.catch((err: any) => {
				toast.error(err.msg);
			})
			.finally(() => {
				setIsSubmittingWhishlist(false);
			});
	}, [isSubmittingWhishlist]);

	const validateQuantity = (input: number) => {
		if (input < 1) return 1;
		if (input > props.stock) return props.stock;
		return input;
	};

	const handleAddQuantityUp = () => {
		setQuantity(validateQuantity(quantity + 1));
	};

	const handleAddQuantityDown = () => {
		setQuantity(validateQuantity(quantity - 1));
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuantity(validateQuantity(parseInt(e.target.value)));
	};

	return (
		<div className='col-md-5'>
			<div className={styles['product-details']}>
				<h2 className={styles['product-name']}>{props.name}</h2>
				<div>
					<div className={styles['product-rating']}>
						{[...Array(rating)].map((_, index) => (
							<i
								key={index}
								className={MultiStyles(
									styles['fa-star'],
									'fa fa-star',
								)}
							></i>
						))}
						{[...Array(5 - rating)].map((_, index) => (
							<i key={index} className='fa fa-star-o'></i>
						))}
					</div>
					<Link
						className={styles['review-link']}
						href='#'
						onClick={(e) => e.preventDefault()}
					>
						{review} Review(s)
					</Link>
				</div>
				<div>
					<h3 className={styles['product-price']}>
						{salePrice}{' '}
						{isSale && (
							<del className={styles['product-old-price']}>
								{' '}
								{FormatCurrency(props.price)}{' '}
							</del>
						)}
					</h3>
					{props.stock > 0 ? (
						<span className={styles['product-available']}>
							In Stock ({props.stock} Available)
						</span>
					) : (
						<span className={styles['product-unavailable']}>
							Out of Stock
						</span>
					)}
				</div>
				<ReactMarkdown
					remarkPlugins={[RemarkGfm, remarkBreaks]}
					components={{
						a: (props) => {
							return (
								<a href={props.href} target='_blank'>
									{props.children}
								</a>
							);
						},
					}}
				>
					{RehypeMarkdown(props.description)}
				</ReactMarkdown>

				{/* <div className={styles['product-options']}>
					<label>
						Size{' '}
						<select
							className={MultiStyles(
								styles['input-select'],
								'input-select',
							)}
						>
							<option value='0'>X</option>
						</select>
					</label>
					<label>
						Color{' '}
						<select
							className={MultiStyles(
								styles['input-select'],
								'input-select',
							)}
						>
							<option value='0'>Red</option>
						</select>
					</label>
				</div> */}
				<br />

				<div className={styles['add-to-cart']}>
					{props.stock > 0 && (
						<div className={styles['qty-label']}>
							Quantity{' '}
							<div
								className={MultiStyles(
									styles['input-number'],
									'input-number',
								)}
							>
								<input
									type='number'
									min={1}
									max={props.stock}
									onChange={handleQuantityChange}
									value={quantity}
								/>
								<span
									className={MultiStyles(
										styles['qty-up'],
										'qty-up',
									)}
									onClick={handleAddQuantityUp}
								>
									+
								</span>
								<span
									className={MultiStyles(
										styles['qty-down'],
										'qty-down',
									)}
									onClick={handleAddQuantityDown}
								>
									-
								</span>
							</div>
						</div>
					)}
					<AddToCartBtn
						quantity={quantity}
						className={styles['add-to-cart-btn']}
						productData={props}
					/>
				</div>

				<ul className={styles['product-btns']}>
					<li>
						<button
							onClick={() => setIsSubmittingWhishlist(true)}
							disabled={isSubmittingWhishlist}
							className='uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-none'
						>
							{isInWishlist ? (
								<div className='text-2xl'>
									<i className='text-red-500 fa fa-heart'></i>{' '}
									Remove from wishlist
								</div>
							) : (
								<div className='text-2xl'>
									<i className='text-red-500 fa fa-heart-o'></i>{' '}
									Add to wishlist
								</div>
							)}
						</button>
					</li>
				</ul>

				<ul className={styles['product-links']}>
					<li>Category:</li>
					{props.categoryIds.map((id) => {
						const url = new URL(BASE_URL);
						url.pathname = ROUTES.Products;
						url.searchParams.set(
							'filterByCategories',
							id.toString(),
						);

						return (
							<li key={id}>
								<Link
									href={isPreview ? '#' : url.toString()}
									target='_blank'
									onClick={(e) =>
										e.currentTarget.href === '#' &&
										e.preventDefault()
									}
								>
									{categories.find((c) => c.categoryId === id)
										?.name ?? 'Unknown'}
								</Link>
							</li>
						);
					})}
				</ul>

				<ul className={styles['product-links']}>
					<li>Share:</li>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							<i className='fa fa-facebook'></i>
						</Link>
					</li>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							<i className='fa fa-twitter'></i>
						</Link>
					</li>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							<i className='fa fa-google-plus'></i>
						</Link>
					</li>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							<i className='fa fa-envelope'></i>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
