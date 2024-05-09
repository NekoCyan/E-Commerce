'use client';

import { OrderData } from '@/app/models/interfaces';
import { TextInput } from '@/components/boostrap';
import COD from '@/components/paymentMethod/COD';
import Paypal from '@/components/paymentMethod/Paypal';
import { FormatCurrency, MultiStyles, ROUTES, SYMBOLS } from '@/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Row } from 'react-bootstrap';

export interface OrderDetailsProps {
	data: OrderData;
}

export default function Component({ data }: Readonly<OrderDetailsProps>) {
	const router = useRouter();

	const {
		orderId,
		userId,
		products,
		createdAt,
		updatedAt,
		paymentMethod,
		shipping,
		cancel,
		status,
	} = data;

	const isEditable = status === 'pending' || !cancel;

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
	}>({
		fullName: shipping.fullName,
		email: shipping.email,
		phone: shipping.phone,
		address: shipping.address,
		city: shipping.city,
		country: shipping.country,
		zip: shipping.zip,
		note: shipping.note,
		paymentMethod: paymentMethod,
	});

	const handleFocus = (e: any) => {
		setError({ ...error, [e.target.id]: '' });
	};

	return (
		<Container>
			<div className='py-5 flex flex-col sm:flex-row gap-5'>
				<button
					className='btn btn-primary w-[150px]'
					onClick={() => router.back()}
				>
					Back to Previous
				</button>
				<h2 className='uppercase bold m-0 text-center'>
					Order #{orderId}
				</h2>
			</div>
			<div>
				<h3>
					Order Status:{' '}
					<span className='uppercase'>
						{cancel ? 'Cancelled' : status}.
					</span>
				</h3>
				{cancel && <p className='text-3xl'>Order cancelled due to: {cancel}</p>}
			</div>

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
							className={error.fullName ? 'border-red-400' : ''}
							onChange={(e) =>
								setFields({
									...fields,
									fullName: e.target.value,
								})
							}
							value={fields.fullName}
							onFocus={handleFocus}
							disabled={true}
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
								className={error.email ? 'border-red-400' : ''}
								onChange={(e) =>
									setFields({
										...fields,
										email: e.target.value,
									})
								}
								value={fields.email}
								onFocus={handleFocus}
								disabled={true}
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
								className={error.phone ? 'border-red-400' : ''}
								onChange={(e) =>
									setFields({
										...fields,
										phone: e.target.value,
									})
								}
								value={fields.phone}
								onFocus={handleFocus}
								disabled={true}
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
							className={error.address ? 'border-red-400' : ''}
							onChange={(e) =>
								setFields({
									...fields,
									address: e.target.value,
								})
							}
							value={fields.address}
							onFocus={handleFocus}
							disabled={true}
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
								className={error.city ? 'border-red-400' : ''}
								onChange={(e) =>
									setFields({
										...fields,
										city: e.target.value,
									})
								}
								value={fields.city}
								onFocus={handleFocus}
								disabled={true}
							/>
						</div>
						<div className='col-md-5 col-sm-5 p-0 form-group flex flex-col'>
							<label htmlFor='country'>
								Country*
								{error.country && (
									<i className='text-red-500'>
										{' '}
										{SYMBOLS.EN_DASH} {error.country}
									</i>
								)}
							</label>
							<TextInput
								id='country'
								placeholder='Country'
								className={
									error.country ? 'border-red-400' : ''
								}
								onChange={(e) =>
									setFields({
										...fields,
										country: e.target.value,
									})
								}
								value={fields.country}
								onFocus={handleFocus}
								disabled={true}
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
								disabled={true}
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
								className={error.note ? 'border-red-400' : ''}
								onChange={(e) =>
									setFields({
										...fields,
										note: e.target.value,
									})
								}
								value={fields.note}
								onFocus={handleFocus}
								disabled={true}
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
							{products.map((x) => {
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
										<div>{FormatCurrency(totalPrice)}</div>
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
										products.reduce(
											(acc, x) =>
												acc +
												x.price *
													((100 - x.salePercentage) /
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
						{(function () {
							const id = 'payment';

							if (paymentMethod === 'paypal')
								return (
									<Paypal
										id={id}
										checked={true}
										disabled={true}
									/>
								);
							else
								return (
									<COD
										id={id}
										checked={true}
										disabled={true}
									/>
								);
						})()}
						{error.paymentMethod && (
							<i className='text-red-500'>
								{' '}
								{error.paymentMethod}
							</i>
						)}
					</div>
				</div>
			</Row>
		</Container>
	);
}
