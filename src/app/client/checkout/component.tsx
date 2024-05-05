'use client';

import Loading from '@/app/loading';
import { ICartModel } from '@/app/models/interfaces';
import { TextInput } from '@/components/boostrap';
import BreadCrumb from '@/components/breadcrumb/BreadCrumb';
import { RootDispatch } from '@/redux/store';
import { NekoResponse } from '@/types';
import { API, FormatCurrency, MultiStyles, ROUTES, SYMBOLS } from '@/utils';
import { GET } from '@/utils/Request';
import { Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const breadcrumbNav = [
	{ name: 'Cart', url: ROUTES.Cart },
	{
		name: 'Checkout',
		url: '#',
	},
];

export interface CheckoutProps {
	session: Session | null;
}

export default function Component({ session }: Readonly<CheckoutProps>) {
	const router = useRouter();
	const [productCarts, setProductCarts] = useState<
		Awaited<ReturnType<ICartModel['getCart']>>[0]
	>([]);
	const dispatch: RootDispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	// State for the form fields
	const [error, setError] = useState<{ [key: string]: string }>({});
	const [fields, setFields] = useState<{
		fullName: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		country: string;
		zip: string;
		note: string;
		paymentMethod: string;
		ToS: boolean;
	}>({
		fullName: session?.user?.fullName ?? '',
		email: session?.user?.email ?? '',
		phone: session?.user?.phone ?? '',
		address: '',
		city: '',
		country: '',
		zip: '',
		note: '',
		paymentMethod: '',
		ToS: false,
	});
	const [submitable, setSubmitable] = useState(false);
	const [isRequesting, setIsRequesting] = useState(false);

	useEffect(() => {
		GET(API.CartList)
			.then((x) => {
				const data = x.data as NekoResponse<{
					isUnexpectedChange: boolean;
					data: Awaited<ReturnType<ICartModel['getCart']>>[0];
				}>;
				if (!data.success) throw new Error(data.message);

				if (data.data.isUnexpectedChange) {
					router.push(ROUTES.Cart + '?must_revalidate=true');
				} else {
					setProductCarts(data.data.data);
					setIsLoaded(true);
				}
			})
			.catch((err) => {
				toast.error(err.message);
				setIsLoaded(true);
			});
	}, []);

	// Validation before submit.
	useEffect(() => {
		const { fullName, phone, address, city, country, paymentMethod, ToS } =
			fields;

		if (
			fullName &&
			phone &&
			address &&
			city &&
			country &&
			paymentMethod &&
			ToS &&
			Object.values(error).filter((x) => x).length === 0
		) {
			setSubmitable(true);
		} else {
			setSubmitable(false);
		}
	}, [fields]);

	useEffect(() => {
		if (!isRequesting) return;

		// Revalidate.
		const { fullName, phone, address, city, country, paymentMethod, ToS } =
			fields;

		if (fullName === '') setError({ ...error, fullName: 'Required' });
		if (phone === '') setError({ ...error, phone: 'Required' });
		if (address === '') setError({ ...error, address: 'Required' });
		if (city === '') setError({ ...error, city: 'Required' });
		if (country === '') setError({ ...error, country: 'Required' });
		if (paymentMethod === '')
			setError({
				...error,
				paymentMethod: 'At least one payment method is required',
			});

		toast.error(`This feature is under development.`);
		setIsRequesting(false);
	}, [isRequesting]);

	const handleFocus = (e: any) => {
		setError({ ...error, [e.target.id]: '' });
	};

	return (
		<Fragment>
			<BreadCrumb navigation={breadcrumbNav} />
			<Container>
				<div className='py-5'>
					<h2 className='uppercase bold m-0'>Checkout</h2>
				</div>

				{isLoaded && productCarts && productCarts?.length > 0 && (
					<Row className='pt-10'>
						<div className='col-md-6 col-sm-12'>
							<h3 className='uppercase'>Billing Address</h3>

							<div className='form-group flex flex-col'>
								<label htmlFor='fullname'>
									Full Name*
									{error.fullName && (
										<i className='text-red-500'>
											{' '}
											{SYMBOLS.EN_DASH} {error.fullName}
										</i>
									)}
								</label>
								<TextInput
									id='fullname'
									placeholder='Full Name'
									className={
										error.fullName ? 'border-red-400' : ''
									}
									onChange={(e) =>
										setFields({
											...fields,
											fullName: e.target.value,
										})
									}
									value={fields.fullName}
									onFocus={handleFocus}
								/>
							</div>
							<div className='flex flex-col md:flex-row justify-between'>
								<div className='col-md-5 col-sm-5 p-0 form-group flex flex-col'>
									<label htmlFor='email'>
										Email
										{error.email && (
											<i className='text-red-500'>
												{' '}
												{SYMBOLS.EN_DASH} {error.email}
											</i>
										)}
									</label>
									<TextInput
										id='email'
										placeholder='Email'
										className={
											error.email ? 'border-red-400' : ''
										}
										onChange={(e) =>
											setFields({
												...fields,
												email: e.target.value,
											})
										}
										value={fields.email}
										onFocus={handleFocus}
									/>
								</div>
								<div className='col-md-5 col-sm-5 p-0 form-group flex flex-col'>
									<label htmlFor='phone'>
										Phone Number*
										{error.phone && (
											<i className='text-red-500'>
												{' '}
												{SYMBOLS.EN_DASH} {error.phone}
											</i>
										)}
									</label>
									<TextInput
										id='phone'
										placeholder='Phone'
										className={
											error.phone ? 'border-red-400' : ''
										}
										onChange={(e) =>
											setFields({
												...fields,
												phone: e.target.value,
											})
										}
										value={fields.phone}
										onFocus={handleFocus}
									/>
								</div>
							</div>
							<div className='form-group flex flex-col'>
								<label htmlFor='address'>
									Address*
									{error.address && (
										<i className='text-red-500'>
											{' '}
											{SYMBOLS.EN_DASH} {error.address}
										</i>
									)}
								</label>
								<TextInput
									id='address'
									placeholder='Address'
									className={
										error.address ? 'border-red-400' : ''
									}
									onChange={(e) =>
										setFields({
											...fields,
											address: e.target.value,
										})
									}
									value={fields.address}
									onFocus={handleFocus}
								/>
							</div>
							<div className='flex flex-col md:flex-row justify-between'>
								<div className='col-md-5 col-sm-5 p-0 form-group flex flex-col'>
									<label htmlFor='city'>
										City*
										{error.city && (
											<i className='text-red-500'>
												{' '}
												{SYMBOLS.EN_DASH} {error.city}
											</i>
										)}
									</label>
									<TextInput
										id='city'
										placeholder='City'
										className={
											error.city ? 'border-red-400' : ''
										}
										onChange={(e) =>
											setFields({
												...fields,
												city: e.target.value,
											})
										}
										value={fields.city}
										onFocus={handleFocus}
									/>
								</div>
								<div className='col-md-5 col-sm-5 p-0 form-group flex flex-col'>
									<label htmlFor='country'>
										Country*
										{error.country && (
											<i className='text-red-500'>
												{' '}
												{SYMBOLS.EN_DASH}{' '}
												{error.country}
											</i>
										)}
									</label>
									<TextInput
										id='country'
										placeholder='Country'
										className={
											error.country
												? 'border-red-400'
												: ''
										}
										onChange={(e) =>
											setFields({
												...fields,
												country: e.target.value,
											})
										}
										value={fields.country}
										onFocus={handleFocus}
									/>
								</div>
							</div>
							<div className='flex flex-col md:flex-row justify-between'>
								<div className='col-md-2 col-sm-2 p-0 form-group flex flex-col'>
									<label htmlFor='zip'>
										Zip Code
										{error.zip && (
											<i className='text-red-500'>
												{' '}
												{SYMBOLS.EN_DASH} {error.zip}
											</i>
										)}
									</label>
									<TextInput
										id='zip'
										placeholder='Zip Code'
										className={MultiStyles(
											error.zip ? 'border-red-400' : '',
										)}
										onChange={(e) =>
											setFields({
												...fields,
												zip: e.target.value,
											})
										}
										value={fields.zip}
										onFocus={handleFocus}
									/>
								</div>
								<div className='col-md-9 col-sm-9 p-0 form-group flex flex-col'>
									<label htmlFor='note'>
										Order Notes
										{error.note && (
											<i className='text-red-500'>
												{' '}
												{SYMBOLS.EN_DASH} {error.note}
											</i>
										)}
									</label>
									<TextInput
										id='note'
										placeholder='Order Notes'
										type='textarea'
										className={
											error.note ? 'border-red-400' : ''
										}
										onChange={(e) =>
											setFields({
												...fields,
												note: e.target.value,
											})
										}
										value={fields.note}
										onFocus={handleFocus}
									/>
								</div>
							</div>
						</div>
						<div className='col-md-6 col-sm-12 mt-14 lg:mt-0 order-details mb-10'>
							<div className='text-center'>
								<h3 className='title'>Your Order</h3>
							</div>
							<div className='order-summary'>
								<div className='order-col'>
									<div>
										<strong>PRODUCT</strong>
									</div>
									<div>
										<strong>TOTAL</strong>
									</div>
								</div>
								<div className='order-products'>
									{productCarts.map((x) => {
										const totalPrice =
											x.price *
											((100 - x.salePercentage) / 100) *
											x.quantity;

										return (
											<div
												key={x.productId}
												className='order-col mb-5'
											>
												<Link
													href={ROUTES.ProductDetails(
														x.productId.toString(),
													)}
													target='_blank'
													className='line-clamp-2'
												>
													<span className='font-bold'>
														x{x.quantity}
													</span>{' '}
													{x.name}
												</Link>
												<div>
													{FormatCurrency(totalPrice)}
												</div>
											</div>
										);
									})}
								</div>
								<div className='mt-10 order-col'>
									<div>Shiping</div>
									<div>
										<strong>FREE</strong>
									</div>
								</div>
								<div className='order-col p-0'>
									<div>
										<strong>TOTAL</strong>
									</div>
									<div>
										<strong className='order-total'>
											{FormatCurrency(
												productCarts.reduce(
													(acc, x) =>
														acc +
														x.price *
															((100 -
																x.salePercentage) /
																100) *
															x.quantity,
													0,
												),
											)}
										</strong>
									</div>
								</div>
							</div>
							<div className='payment-method'>
								<div className='input-radio'>
									<input
										type='radio'
										name='payment'
										id='payment-1'
										onChange={() => {
											setFields({
												...fields,
												paymentMethod: 'cod',
											});
										}}
									/>
									<label htmlFor='payment-1'>
										<span></span>
										Cash on Delivery (COD)
									</label>
									<div className='caption'></div>
								</div>
								<div className='input-radio'>
									<input
										type='radio'
										name='payment'
										id='payment-2'
										onChange={() => {
											setFields({
												...fields,
												paymentMethod: 'paypal',
											});
										}}
									/>
									<label htmlFor='payment-2'>
										<span></span>
										Paypal
									</label>
									<div className='caption'>
										<p>
											Pay via PayPal; you can pay with
											your credit card if you don't have a
											PayPal account.
										</p>
									</div>
								</div>
								<div className='input-radio'>
									<input
										type='radio'
										name='payment'
										id='payment-3'
										onChange={() => {
											setFields({
												...fields,
												paymentMethod: 'bank',
											});
										}}
									/>
									<label htmlFor='payment-3'>
										<span></span>
										Bank Directly
									</label>
									<div className='caption'>
										<p>Via Vietnam Bank.</p>
									</div>
								</div>
								{error.paymentMethod && (
									<i className='text-red-500'>
										{' '}
										{error.paymentMethod}
									</i>
								)}
							</div>
							<div className='input-checkbox'>
								<input
									type='checkbox'
									id='terms'
									onChange={(e) => {
										setFields({
											...fields,
											ToS: e.target.checked,
										});
									}}
									checked={fields.ToS}
								/>
								<label htmlFor='terms'>
									<span></span>
									I've read and accept the{' '}
									<a href='#'>terms & conditions</a>
								</label>
							</div>
							<button
								className={MultiStyles(
									'primary-btn order-submit w-full',
									submitable ? '' : 'disabled',
								)}
								onClick={(e) => {
									setIsRequesting(true);
								}}
								disabled={!submitable}
							>
								Place order
							</button>
						</div>
					</Row>
				)}
				{isLoaded && productCarts?.length === 0 && (
					<div className='text-center py-7'>
						<h3>Nothing to Checkout</h3>
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
			</Container>
		</Fragment>
	);
}
