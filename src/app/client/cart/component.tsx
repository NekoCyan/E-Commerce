'use client';

import { RevalidateCart } from '@/app/action';
import Loading from '@/app/loading';
import { ICartModel } from '@/app/models/interfaces';
import { TextInput } from '@/components/boostrap';
import BreadCrumb from '@/components/breadcrumb/BreadCrumb';
import { cartCountAction } from '@/redux/cartsCount/CartsCountSlice';
import { RootDispatch } from '@/redux/store';
import { NekoResponse, PageProps } from '@/types';
import {
	API,
	AuthHrefCallback,
	FormatCurrency,
	IsNullOrUndefined,
	LIMITER,
	ROUTES,
	Truncate,
} from '@/utils';
import { GET, POST, PUT } from '@/utils/Request';
import getUrl from '@/utils/getUrl';
import CartStorage from '@/utils/localStorage/CartStorage';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const breadcrumbNav = [{ name: 'Cart', url: '#' }];

export default function Component({
	searchParams,
}: Readonly<
	PageProps<
		{},
		{
			must_revalidate?: string;
		}
	>
>) {
	const { status } = useSession();
	const [productCarts, setProductCarts] = useState<
		Awaited<ReturnType<ICartModel['getCart']>>[0]
	>([]);
	const dispatch: RootDispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (status === 'authenticated') {
			GET(API.CartList)
				.then((x) => {
					const data = x.data as NekoResponse<{
						isUnexpectedChange: boolean;
						data: Awaited<ReturnType<ICartModel['getCart']>>[0];
					}>;
					if (!data.success) throw new Error(data.message);

					if (
						data.data.isUnexpectedChange ||
						!IsNullOrUndefined(searchParams.must_revalidate)
					) {
						toast.warning(
							`Your cart data was revalidated, so some of your cart data was changed/remove about quantity or product.`,
							{
								autoClose: 7000,
							},
						);
					}
					setProductCarts(data.data.data);
					dispatch(cartCountAction.set(data.data.data?.length ?? 0));
				})
				.catch((err) => {
					toast.error(err.message);
				})
				.finally(() => {
					setIsLoaded(true);
				});
		} else {
			const cartStorage = new CartStorage(localStorage);
			if (!cartStorage.getCartCount()) {
				setIsLoaded(true);
				return;
			}

			POST(API.CartPreview, {
				data: cartStorage.getCart(),
			})
				.then((x) => {
					const data = x.data as NekoResponse<{
						isUnexpectedChange: boolean;
						data: Awaited<ReturnType<ICartModel['getCart']>>[0];
					}>;
					if (!data.success) throw new Error(data.message);

					if (data.data.isUnexpectedChange) {
						toast.warning(
							`Your cart data was revalidated, so some of your cart data was changed/remove about quantity or product.`,
							{
								autoClose: 7000,
							},
						);
					}
					setProductCarts(data.data.data);
					cartStorage.setCart(
						data.data.data?.map((x) => ({
							productId: x.productId,
							quantity: x.quantity,
						})) ?? [],
					);
					dispatch(cartCountAction.set(cartStorage.getCartCount()));
				})
				.catch((err) => {
					toast.error(err.message);
				})
				.finally(() => {
					setIsLoaded(true);
				});
		}
	}, []);

	// Return number after validate.
	const validateQuantity = (productId: number, input: number) => {
		if (!productCarts) return 1;

		const product = productCarts.find((x) => x.productId === productId);
		if (!product || input < 1) return 1;
		if (input > product.stock) return product.stock;
		return input;
	};

	// Input handler.
	const handleAddQuantityUp = (productId: number) => {
		if (!productCarts) return;

		const product = productCarts.find((x) => x.productId === productId);
		if (!product) return;

		const newQuantity = validateQuantity(
			productId,
			(product.quantity ?? 0) + 1,
		);

		const newProductCarts = productCarts.map((x) =>
			x.productId === productId ? { ...x, quantity: newQuantity } : x,
		);
		quantityChange(productId, newQuantity);
		setProductCarts(newProductCarts);
	};
	const handleAddQuantityDown = (productId: number) => {
		if (!productCarts) return;

		const product = productCarts.find((x) => x.productId === productId);
		if (!product) return;

		const newQuantity = validateQuantity(
			productId,
			(product.quantity ?? 0) - 1,
		);

		const newProductCarts = productCarts.map((x) =>
			x.productId === productId ? { ...x, quantity: newQuantity } : x,
		);
		quantityChange(productId, newQuantity);
		setProductCarts(newProductCarts);
	};
	const handleInputQuantityChange = (
		productId: number,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!productCarts) return;

		const newQuantity = validateQuantity(
			productId,
			parseInt(e.target.value),
		);

		const newProductCarts = productCarts.map((x) =>
			x.productId === productId
				? { ...x, quantity: isNaN(newQuantity) ? 1 : newQuantity }
				: x,
		);
		quantityChange(productId, newQuantity);
		setProductCarts(newProductCarts);
	};

	// Quantity change for specific data.
	const quantityChange = (productId: number, quantity: number) => {
		// Check if authenticated or not, then update the cart.
		if (status === 'authenticated') {
			PUT(API.CartUpdate, {
				productId: productId,
				quantity: quantity,
			})
				.then((x) => {
					const data = x.data as NekoResponse<{ count: number }>;
					if (!data.success) throw new Error(data.message);

					dispatch(cartCountAction.set(data.data.count));
				})
				.catch((err) => {
					toast.error(err.message);
				})
				.finally(() => {
					RevalidateCart();
				});
		} else {
			const cartStorage = new CartStorage(localStorage);
			cartStorage.setProductQuantity(productId, quantity);
			dispatch(cartCountAction.set(cartStorage.getCartCount()));
		}
	};
	const handleRemoveProduct = (productId: number) => {
		if (!productCarts) return;

		quantityChange(productId, 0);
		const newProductCarts = productCarts.filter(
			(x) => x.productId !== productId,
		);
		setProductCarts(newProductCarts);
	};

	return (
		<Fragment>
			<BreadCrumb navigation={breadcrumbNav} />
			<Container>
				<div className='py-5'>
					<h2 className='uppercase bold m-0'>Cart</h2>
				</div>

				{isLoaded && productCarts && productCarts.length > 0 && (
					<div className='overflow-x-auto mb-2 sm:mb-0'>
						<Table className='table-auto'>
							<thead>
								<tr>
									<th className='text-center'>#</th>
									<th className='text-center'>Image</th>
									<th>Product Name</th>
									<th className='text-center'>Price</th>
									<th className='text-center'>Quantity</th>
								</tr>
							</thead>
							<tbody>
								{productCarts.map((data, index) => {
									const salePrice = FormatCurrency(
										data.price *
											(1 -
												(data.salePercentage ?? 0) /
													100),
									);
									const isSale = !!(
										data.salePercentage &&
										data.salePercentage > 0
									);

									return (
										<tr key={data.productId}>
											<td
												width={'1%'}
												className='align-middle'
											>
												<div className='flex flex-col justify-center items-center'>
													{index + 1}
													<Link
														href='#'
														onClick={(e) => {
															e.preventDefault();
															handleRemoveProduct(
																data.productId,
															);
														}}
													>
														<i className='fa fa-trash text-danger cursor-pointer text-3xl' />
													</Link>
												</div>
											</td>
											<td className='min-w-[100px] sm:w-[150px]'>
												<Image
													width={150}
													height={150}
													src={data.imageUrls?.[0]}
													alt={Truncate(
														data.name,
														LIMITER.Cart
															.ProductName,
													)}
												/>
											</td>
											<td className='min-w-[200px] sm:w-full'>
												<Link
													href={ROUTES.ProductDetails(
														data.productId.toString(),
													)}
													className='line-clamp-3'
												>
													{data.name}
												</Link>
											</td>
											<td className='text-center'>
												{!isSale ? (
													<b>
														{FormatCurrency(
															data.price,
														)}
													</b>
												) : (
													<div className='flex flex-col justify-center items-center'>
														<b className='text-red-500'>
															{salePrice}
														</b>
														<del>
															{FormatCurrency(
																data.price,
															)}
														</del>
													</div>
												)}
											</td>
											<td>
												<div>
													<div className='flex justify-center items-center'>
														<button
															onClick={() =>
																handleAddQuantityDown(
																	data.productId,
																)
															}
															className='btn btn-sm btn-outline-primary'
														>
															<i className='fa fa-minus'></i>
														</button>
														<TextInput
															className='w-[40px] text-center'
															value={data.quantity.toString()}
															onChange={(e) =>
																handleInputQuantityChange(
																	data.productId,
																	e as any,
																)
															}
														/>
														<button
															onClick={() =>
																handleAddQuantityUp(
																	data.productId,
																)
															}
															className='btn btn-sm btn-outline-primary'
														>
															<i className='fa fa-plus'></i>
														</button>
													</div>
													<div className='text-center'>
														<small className='text-muted'>
															Max: {data.stock}
														</small>
													</div>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</div>
				)}
				{isLoaded && productCarts?.length === 0 && (
					<div className='text-center py-7'>
						<h3>Nothing in Cart</h3>
						<Link
							href={ROUTES.Products}
							className='uppercase underline text-5xl'
						>
							go Shopping
						</Link>
					</div>
				)}
				{!isLoaded && (
					<Loading className='py-5' width={300} height={100} />
				)}
				{productCarts && productCarts.length > 0 && (
					<div className='flex flex-col gap-3 sm:flex-row text-center sm:text-right justify-center sm:justify-end sm:items-center mb-5'>
						<h4 className='m-0'>
							Estimate products cost:{' '}
							<span className='text-red-500'>
								{FormatCurrency(
									productCarts.reduce(
										(acc, x) =>
											acc +
											x.price *
												((100 - x.salePercentage) /
													100) *
												x.quantity,
										0,
									),
								)}
							</span>
						</h4>
						<Link
							href={
								status === 'authenticated'
									? ROUTES.Checkout + '#breadcrumb'
									: AuthHrefCallback(getUrl(ROUTES.Cart))
							}
							className='btn btn-primary uppercase'
						>
							{status === 'authenticated'
								? 'Checkout'
								: 'Login to Checkout'}
						</Link>
					</div>
				)}
			</Container>
		</Fragment>
	);
}
