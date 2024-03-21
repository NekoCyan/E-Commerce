'use client';

import { FormatCurrency, MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import styles from '../ProductDetails.module.css';

type ProductDetailsDataProps = {
	productData: {
		productName: string;
		categoryName: string;
		imageURL: string;
		price: number;
		stock: number;
		rating: number;
		review: number;
		isNew?: boolean;
		salePercentage?: number;
	};
};

export default function ProductDetailsData({
	productData,
}: ProductDetailsDataProps) {
	const salePrice = FormatCurrency(
		productData.price * (1 - (productData.salePercentage ?? 0) / 100),
	);
	const isSale = !!(
		productData.salePercentage && productData.salePercentage > 0
	);

	return (
		<div className='col-md-5'>
			<div className={styles['product-details']}>
				<h2 className={styles['product-name']}>
					{productData.productName}
				</h2>
				<div>
					<div className={styles['product-rating']}>
						{[...Array(productData.rating)].map((_, index) => (
							<i
								key={index}
								className={MultiStyles(
									styles['fa-star'],
									'fa fa-star',
								)}
							></i>
						))}
						{[...Array(5 - productData.rating)].map((_, index) => (
							<i key={index} className='fa fa-star-o'></i>
						))}
					</div>
					<Link
						className={styles['review-link']}
						href='#'
						onClick={(e) => e.preventDefault()}
					>
						{productData.review} Review(s)
					</Link>
				</div>
				<div>
					<h3 className={styles['product-price']}>
						{salePrice}{' '}
						{isSale && (
							<del className={styles['product-old-price']}>
								{' '}
								{FormatCurrency(productData.price)}{' '}
							</del>
						)}
					</h3>
					{productData.stock > 0 ? (
						<span className={styles['product-available']}>
							In Stock
						</span>
					) : (
						<span className={styles['product-unavailable']}>
							Out of Stock
						</span>
					)}
				</div>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit,
					sed do eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>

				<div className={styles['product-options']}>
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
				</div>

				<div className={styles['add-to-cart']}>
					{productData.stock > 0 && (
						<div className={styles['qty-label']}>
							Quantity{' '}
							<div
								className={MultiStyles(
									styles['input-number'],
									'input-number',
								)}
							>
								<input type='number' defaultValue={1} min={1} />
								<span
									className={MultiStyles(
										styles['qty-up'],
										'qty-up',
									)}
									onClick={(e) => {
										e.currentTarget.parentElement
											?.querySelector('input')
											?.stepUp(1);
									}}
								>
									+
								</span>
								<span
									className={MultiStyles(
										styles['qty-down'],
										'qty-down',
									)}
									onClick={(e) => {
										e.currentTarget.parentElement
											?.querySelector('input')
											?.stepDown(1);
									}}
								>
									-
								</span>
							</div>
						</div>
					)}
					<button
						className={MultiStyles(
							styles['add-to-cart-btn'],
							productData.stock <= 0 && styles['disabled'],
						)}
					>
						<i className='fa fa-shopping-cart'></i> add to cart
					</button>
				</div>

				<ul className={styles['product-btns']}>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							<i className='fa fa-heart-o'></i> add to wishlist
						</Link>
					</li>
				</ul>

				<ul className={styles['product-links']}>
					<li>Category:</li>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							Headphones
						</Link>
					</li>
					<li>
						<Link href='#' onClick={(e) => e.preventDefault()}>
							Accessories
						</Link>
					</li>
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
