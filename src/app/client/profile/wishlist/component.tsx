'use client';

import Loading from '@/app/loading';
import { ProductData } from '@/app/models/interfaces';
import BreadCrumb from '@/components/breadcrumb/BreadCrumb';
import { RootDispatch } from '@/redux/store';
import { wishlistAction } from '@/redux/wishlistCount/WishlistSlice';
import { APIResponse } from '@/types';
import { API, LIMITER, ROUTES, Truncate } from '@/utils';
import { GET, POST } from '@/utils/Request';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const breadcrumbNav = [
	{
		name: 'Profile',
		url: ROUTES.Profile,
	},
	{
		name: 'Wishlist',
		url: '#',
	},
];

export default function Component() {
	const [products, setProducts] = useState<
		Pick<ProductData, 'productId' | 'name' | 'stock' | 'imageUrls'>[]
	>([]);

	const dispatch: RootDispatch = useDispatch();

	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		GET(API.Wishlist)
			.then((x) => {
				const data = x.data as APIResponse<{ data: number[] }>;

				dispatch(wishlistAction.set(data.data.data));
				const wishlist = data.data.data;

				POST(API.ProductListIds, {
					productIds: wishlist,
				})
					.then((x) => {
						const data = x.data as APIResponse<
							Pick<
								ProductData,
								'productId' | 'name' | 'stock' | 'imageUrls'
							>[]
						>;
						if (!data.success) throw new Error(data.message);

						setProducts(data.data);
					})
					.catch((err) => {
						toast.error(err.message);
					})
					.finally(() => {
						setIsLoaded(true);
					});
			})
			.catch((err) => {
				console.error(err);
				setIsLoaded(true);
			});
	}, []);

	const handleRemoveWishlist = (productId: number) => {
		if (!products) return;
		const newProducts = products.filter((x) => x.productId !== productId);
		setProducts(newProducts);
	};

	return (
		<Fragment>
			<BreadCrumb navigation={breadcrumbNav} />
			<Container>
				{isLoaded && products && products.length > 0 && (
					<div className='overflow-x-auto mb-2 sm:mb-0'>
						<Table className='table-auto'>
							<thead>
								<tr>
									<th className='text-center'>#</th>
									<th className='text-center'>Image</th>
									<th>Product Name</th>
									<th className='text-center'>
										Stock available
									</th>
								</tr>
							</thead>
							<tbody>
								{products.map((data, index) => {
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
															handleRemoveWishlist(
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
												{data.stock}
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</div>
				)}
				{isLoaded && products.length === 0 && (
					<div className='text-center py-7'>
						<h3>Nothing in Wishlist</h3>
						<Link
							href={ROUTES.Products}
							className='uppercase underline text-5xl'
						>
							go Shopping and find some
						</Link>
					</div>
				)}
				{!isLoaded && (
					<Loading className='py-5' width={300} height={100} />
				)}
			</Container>
		</Fragment>
	);
}
