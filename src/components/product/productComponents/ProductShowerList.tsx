import { FormatCurrency, MultiStyles } from '@/utils/ComponentUtils';
import { Row } from 'react-bootstrap';

type ProductDataProps = {
	productName: string;
	categoryName: string;
	imageURL: string;
	price: number;
	rating: number;
	isNew?: boolean;
	salePercentage?: number;
};
export default function ProductShowerList({
	productList,
}: {
	productList: ProductDataProps[];
}) {
	return (
		<div className='col-md-12'>
			<Row>
				<div className={'products-tabs'}>
					<div
						id='tab1'
						className={MultiStyles('tab-pane', 'active')}
					>
						<div
							data-nav='#slick-nav-1'
							className={MultiStyles('products-slick')}
						>
							{/* Product here */}
							{productList.map((productData, index) => {
								const salePrice = FormatCurrency(
									productData.price *
										(1 -
											(productData.salePercentage ?? 0) /
												100),
								);
								const isSale =
									productData.salePercentage &&
									productData.salePercentage > 0;
								let rating = 0;
								if (productData.rating > 5) rating = 5;
								else if (productData.rating < 0) rating = 0;
								else rating = productData.rating;

								return (
									<div key={index} className={'product'}>
										<div className={'product-img'}>
											<img
												src={productData.imageURL}
												alt={productData.productName.toLowerCase()}
											/>
											<div className={'product-label'}>
												{!!isSale && (
													<span className={'sale'}>
														-
														{
															productData.salePercentage
														}
														%
													</span>
												)}
												{productData.isNew === true && (
													<span className={'new'}>
														NEW
													</span>
												)}
											</div>
										</div>
										<div className={'product-body'}>
											<p className={'product-category'}>
												{productData.categoryName}
											</p>
											<h3 className={'product-name'}>
												<a href='#'>
													{productData.productName}
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
											<div className={'product-rating'}>
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
														className={'tooltipp'}
													>
														{' '}
														add to wishlist{' '}
													</span>
												</button>
												<button className='quick-view'>
													<i className='fa fa-eye'></i>
													<span
														className={'tooltipp'}
													>
														{' '}
														quick view{' '}
													</span>
												</button>
											</div>
										</div>
										<div className={'add-to-cart'}>
											<button
												className={'add-to-cart-btn'}
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
							id='slick-nav-1'
							className={MultiStyles('products-slick-nav')}
						></div>
					</div>
				</div>
			</Row>
		</div>
	);
}
