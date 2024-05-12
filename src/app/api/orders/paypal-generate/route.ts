import Order from '@/app/models/Order';
import { createOrder } from '@/lib/Paypal';
import {
	ErrorResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
	SomethingWentWrongResponse,
	UnauthorizedResponse,
} from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body: Partial<{
			orderId: string;
		}> = await req.json();
		let { orderId } = body;
		if (IsNullOrUndefined(orderId)) return RequiredResponse('orderId');

		const session = await BEHandler({ req });

		const order = await Order.getOrder(
			parseInt(session!.user!.id),
			orderId!,
		);
		if (!order) return UnauthorizedResponse();
		if (order.cancel !== '') return ErrorResponse('Order is cancelled');
		if (order.status !== 'pending')
			return ErrorResponse('Order not pending');
		if (order.paymentMethod !== 'paypal')
			return ErrorResponse('Payment method not supported for this route');

		if (!order?.paypal?.expireAt || order.paypal.expireAt < new Date()) {
			const newOrder = await createOrder(order);
			if (!newOrder?.id) return SomethingWentWrongResponse();

			order.paypal = {
				paymentId: newOrder.id,
				expireAt: new Date(new Date().getTime() + 30 * 60 * 1000),
				url:
					newOrder.links.find((l) => l.rel === 'approve')?.href ?? '',
			};

			order.markModified('paypal');
			await order.save();
		}

		return Response({
			paymentId: order.paypal.paymentId,
			href: order.paypal.url,
		});
	} catch (e: any) {
		console.log(e);
		return ErrorResponse(e);
	}
}
