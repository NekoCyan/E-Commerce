import Order from '@/app/models/Order';
import { PageProps } from '@/types';
import {
	ErrorResponse,
	RequiredResponse,
	Response,
	UnauthorizedResponse,
} from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: PageProps<{ id: string }>,
) {
	try {
		let { id } = params;
		if (!id) return RequiredResponse('Order ID');

		const session = await BEHandler({ req });

		const order = await Order.getOrder(parseInt(session!.user!.id), id);
		if (!order) return UnauthorizedResponse();
		const converted = order.toObject();
		delete converted._id;
		// @ts-ignore
		delete converted.userId;
		// @ts-ignore
		delete converted.orderId;

		return Response({ ...converted });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
