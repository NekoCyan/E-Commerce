import Order from '@/app/models/Order';
import { capturePayment } from '@/lib/Paypal';
import {
	ErrorResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
} from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body: Partial<{
			orderId: string;
			token: string;
		}> = await req.json();
		let { orderId, token } = body;
		if (IsNullOrUndefined(orderId)) return RequiredResponse('orderId');
		if (IsNullOrUndefined(token)) return RequiredResponse('token');

		const session = await BEHandler({ req });

		const order = await Order.getOrderFromPaypalPaymentId(
			parseInt(session!.user!.id),
			token!,
		);
		if (!order || order.orderId !== orderId)
			throw new Error(`Invalid Payment ID.`);
		if (order.cancel !== '') return ErrorResponse('Order is cancelled');
		if (order.status !== 'pending') return Response();

		const capture = await capturePayment(token!);
		if (
			capture?.status === 'COMPLETED' ||
			capture?.details[0]?.issue === 'ORDER_ALREADY_CAPTURED'
		) {
			order.status = 'processing';
			order.updatedAt = new Date();
			order.paypal.expireAt = new Date();
			order.paypal.url = '';
			
			order.markModified('paypal');

			await order.save();
			return Response();
		} else
			throw new Error(`Unable to process this payment, try again later.`);
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
