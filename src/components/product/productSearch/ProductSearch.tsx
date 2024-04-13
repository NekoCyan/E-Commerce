import { ProductData } from '@/app/models/interfaces';
import { FormatCurrency, Truncate } from '@/utils';
import Link from 'next/link';

export default function ProductSearch({
	productData,
	categories,
}: Readonly<{
	productData: ProductData;
	categories: { id: string; name: string }[];
}>) {
	const salePrice = FormatCurrency(
		productData.price * (1 - (productData.salePercentage ?? 0) / 100),
	);
	const isSale = !!(
		productData.salePercentage && productData.salePercentage > 0
	);
	let rating = 5;
	const productDetailsURL =
		'/product-details/' + productData.productId + '#breadcrumb';

	return (
		<div className='py-10 col-lg-3 col-sm-4 col-xs-6'>
			<div key={productData.productId} className={'product'}>
				<div className={'product-img'}>
					<img
						src={productData.imageUrls[0]}
						alt={productData.name.toLowerCase()}
					/>
					<div className={'product-label'}>
						{isSale && (
							<span className={'sale'}>
								-{productData.salePercentage}%
							</span>
						)}
						{productData.isNewProduct === true && (
							<span className={'new'}>NEW</span>
						)}
					</div>
				</div>
				<div className={'product-body'}>
					<p className={'product-category'}>
						{categories.find(
							(x) =>
								x.id === productData.categoryIds[0].toString(),
						)?.name ?? 'Unknown'}
					</p>
					<h3 className={'product-name'}>
						<Link href={productDetailsURL}>
							{Truncate(productData.name, 64)}
						</Link>
					</h3>
					<h4 className={'product-price'}>
						{salePrice}{' '}
						{isSale && (
							<del className={'product-old-price'}>
								{' '}
								{FormatCurrency(productData.price)}{' '}
							</del>
						)}
					</h4>
					<div className={'product-rating'}>
						{[...Array(rating)].map((_, index) => (
							<i key={index} className='fa fa-star'></i>
						))}
						{[...Array(5 - rating)].map((_, index) => (
							<i key={index} className='fa fa-star-o'></i>
						))}
					</div>
					<div className={'product-btns'}>
						<button className={'add-to-wishlist'}>
							<i className='fa fa-heart-o'></i>
							<span className={'tooltipp'}>
								{' '}
								add to wishlist{' '}
							</span>
						</button>
						<Link href={productDetailsURL} className='p-5'>
							<i className='fa fa-th-list'></i>
							<span className={'tooltipp'}> more details </span>
						</Link>
					</div>
				</div>
				<div className={'add-to-cart'}>
					<button className={'add-to-cart-btn'}>
						<i className='fa fa-shopping-cart'></i> add to cart
					</button>
				</div>
			</div>
		</div>
	);
}
