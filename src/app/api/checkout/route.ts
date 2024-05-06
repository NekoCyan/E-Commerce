import Cart from '@/app/models/Cart';
import Order from '@/app/models/Order';
import {
	ErrorResponse,
	IsNullOrUndefined,
	PAYMENT_METHOD,
	RequiredResponse,
	Response,
} from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { Session } from 'next-auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body: Partial<{
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
		}> = await req.json();
		let {
			fullName,
			email,
			phone,
			address,
			city,
			country,
			zip,
			note,
			paymentMethod,
			ToS,
		} = body;

		if (IsNullOrUndefined(fullName, true))
			return RequiredResponse('fullName');
		if (IsNullOrUndefined(phone, true)) return RequiredResponse('phone');
		if (IsNullOrUndefined(address, true))
			return RequiredResponse('address');
		if (IsNullOrUndefined(city, true)) return RequiredResponse('city');
		if (IsNullOrUndefined(country, true))
			return RequiredResponse('country');
		if (IsNullOrUndefined(paymentMethod, true))
			return RequiredResponse('paymentMethod');
		if (IsNullOrUndefined(ToS, true)) return RequiredResponse('ToS');

		if (ToS !== true)
			return ErrorResponse(
				'You must agree Terms of Service before checkout.',
			);
		if (!PAYMENT_METHOD.includes(paymentMethod!))
			return ErrorResponse('Invalid payment method.');

		if (paymentMethod === 'paypal')
			throw new Error(`Paypal is under development.`);

		const session = (await BEHandler({
			req,
			sessionRequired: true,
		})) as Session;

		const UserCart = await Cart.getCart(parseInt(session.user!.id));
		const isUnexpectedChange = UserCart[1];
		if (isUnexpectedChange)
			return ErrorResponse(
				'Unexpected change in cart, please back to cart and review cart again.',
			);

		const result = await Order.createOrder(
			parseInt(session.user!.id),
			UserCart[0]?.map((x) => {
				return {
					productId: x.productId,
					name: x.name,
					price: x.price,
					salePercentage: x.salePercentage,
					imageUrls: x.imageUrls,
					quantity: x.quantity,
				};
			}) ?? [],
			{
				fullName,
				email,
				phone,
				address,
				city,
				country,
				zip,
				note,
				paymentMethod: paymentMethod as any,
			},
		);
		await Cart.deleteCart(parseInt(session.user!.id));

		return Response({
			orderId: result.orderId,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
