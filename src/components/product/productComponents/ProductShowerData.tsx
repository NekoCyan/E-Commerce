import { FormatCurrency } from '@/utils/ComponentUtils';
import { nanoid } from 'nanoid';
import styles from './ProductShowerData.module.css';

type ProductDataProps = {
	productName: string;
	categoryName: string;
	imageURL: string;
	price: number;
	rating: number;
	isNew?: boolean;
	salePercentage?: number;
};
export default function ProductShowerData({
	productData,
}: {
	productData: ProductDataProps;
}) {
	const salePrice = FormatCurrency(
		productData.price * (1 - (productData.salePercentage ?? 0) / 100),
	);
	const isSale = productData.salePercentage && productData.salePercentage > 0;
	let rating = 0;
	if (productData.rating > 5) rating = 5;
	else if (productData.rating < 0) rating = 0;
	else rating = productData.rating;

	return (
		<div className={styles.product}>
			<div className={styles['product-img']}>
				<img
					src={productData.imageURL}
					alt={productData.productName.toLowerCase()}
				/>
				<div className={styles['product-label']}>
					{!!isSale && (
						<span className={styles.sale}>
							-{productData.salePercentage}%
						</span>
					)}
					{productData.isNew === true && (
						<span className={styles.new}>NEW</span>
					)}
				</div>
			</div>
			<div className={styles['product-body']}>
				<p className={styles['product-category']}>
					{productData.categoryName}
				</p>
				<h3 className={styles['product-name']}>
					<a href='#'>{productData.productName}</a>
				</h3>
				<h4 className={styles['product-price']}>
					{salePrice}{' '}
					{isSale && (
						<del className={styles['product-old-price']}>
							{' '}
							{FormatCurrency(productData.price)}{' '}
						</del>
					)}
				</h4>
				<div className={styles['product-rating']}>
					{[...Array(rating)].map(() => (
						<i key={nanoid()} className='fa fa-star'></i>
					))}
					{[...Array(5 - rating)].map(() => (
						<i key={nanoid()} className='fa fa-star-o'></i>
					))}
				</div>
				<div className={styles['product-btns']}>
					<button className={styles['add-to-wishlist']}>
						<i className='fa fa-heart-o'></i>
						<span className={styles['tooltipp']}>
							{' '}
							add to wishlist{' '}
						</span>
					</button>
					<button className='quick-view'>
						<i className='fa fa-eye'></i>
						<span className={styles['tooltipp']}> quick view </span>
					</button>
				</div>
			</div>
			<div className={styles['add-to-cart']}>
				<button className={styles['add-to-cart-btn']}>
					<i className='fa fa-shopping-cart'></i> add to cart
				</button>
			</div>
		</div>
	);
}
