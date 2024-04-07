'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import { FormatCurrency, MarkupHTML, MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import styles from '../ProductDetails.module.css';

export default function ProductDetailsData({
	props,
	isPreview,
	categories,
}: Readonly<{ props: ProductData; isPreview?: boolean, categories: CategoryData[] }>) {
	const salePrice = FormatCurrency(
		props.price * (1 - (props.salePercentage ?? 0) / 100),
	);
	const isSale = !!(props.salePercentage && props.salePercentage > 0);
	let rating = 5;
	let review = 0;

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
							In Stock
						</span>
					) : (
						<span className={styles['product-unavailable']}>
							Out of Stock
						</span>
					)}
				</div>
				<p dangerouslySetInnerHTML={MarkupHTML(props.description)} />

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
							props.stock <= 0 && styles['disabled'],
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
					{props.categoryIds.map((id) => (
						<li key={id}>
							<Link href='#' onClick={(e) => e.preventDefault()}>
								{categories.find((c) => c.categoryId === id)
									?.name ?? 'Unknown'}
							</Link>
						</li>
					))}
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
