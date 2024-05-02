'use client';

import { ProductData } from '@/app/models/interfaces';
import { cartCountAction } from '@/redux/cartsCount/CartsCountSlice';
import { RootDispatch } from '@/redux/store';
import { NekoResponse } from '@/types';
import { API, LIMITER, MultiStyles, Truncate } from '@/utils';
import { POST } from '@/utils/Request';
import CartStorage from '@/utils/localStorage/CartStorage';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface AddToCartProps {
	className?: string;
	productData: ProductData;
	quantity?: number;
}

export default function AddToCart({
	productData,
	quantity,
	className,
}: Readonly<AddToCartProps>) {
	const { status } = useSession();
	if (typeof quantity !== 'number') quantity = 1;

	const [isRequesting, setIsRequesting] = useState(false);

	const dispatch: RootDispatch = useDispatch();

	const handleAdd = () => {
		if (isRequesting) return;
		setIsRequesting(true);

		if (status === 'authenticated') {
			// API Request
			toast
				.promise(
					new Promise<any>((res, rej) =>
						POST(API.CartInsert, {
							data: [
								{
									productId: parseInt(
										productData.productId as any,
									),
									quantity,
								},
							],
						})
							.then((x) => {
								const data = x.data as NekoResponse<{
									count: number;
								}>;
								if (!data.success)
									throw new Error(data.message);

								res(data);
							})
							.catch(rej),
					),
					{
						pending: {
							render() {
								return 'Adding to cart...';
							},
						},
						success: {
							render({
								data,
							}: {
								data: NekoResponse<{ count: number }>;
							}) {
								dispatch(cartCountAction.set(data.data.count));

								return `Added${
									quantity > 1 ? ` x${quantity} ` : ' '
								}${Truncate(
									productData.name,
									LIMITER.Cart.ProductName,
								)} to cart.`;
							},
						},
						error: {
							render({ data }: { data: any }) {
								// When the promise reject, data will contains the error
								return (
									data?.message ?? 'Failed to add to cart.'
								);
							},
						},
					},
				)
				.finally(() => {
					setIsRequesting(false);
				});
		} else {
			const cartStorage = new CartStorage(localStorage);
			cartStorage.addCartItem(productData.productId, quantity);
			dispatch(cartCountAction.set(cartStorage.getCartCount()));
			toast.success(
				`Added${quantity > 1 ? ` x${quantity} ` : ' '}${Truncate(
					productData.name,
					LIMITER.Cart.ProductName,
				)} to cart.`,
			);
			setIsRequesting(false);
		}
	};

	return (
		<button
			className={MultiStyles(
				'add-to-cart-btn',
				className,
				(isRequesting || productData.stock <= 0) && 'disabled',
			)}
			onClick={handleAdd}
			disabled={isRequesting || productData.stock <= 0}
		>
			<i className='fa fa-shopping-cart'></i>{' '}
			{isRequesting ? 'adding to cart...' : 'add to cart'}
		</button>
	);
}
