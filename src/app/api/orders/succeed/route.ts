import Order from '@/app/models/Order';
import { ErrorResponse, NotFoundResponse, Response } from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const session = await BEHandler({ req });

		const lastOrder = await Order.findOne({
			userId: parseInt(session!.user!.id),
		})
			.sort({ createdAt: -1 })
			.exec();

		if (
			!lastOrder ||
			lastOrder.createdAt.getTime() < Date.now() - 1000 * 30
		)
			return NotFoundResponse('Last order');
		else
			return Response({
				orderId: lastOrder.orderId,
			});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
