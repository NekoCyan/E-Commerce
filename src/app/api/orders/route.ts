import Order from '@/app/models/Order';
import { ErrorResponse, Response, SearchParamsToObject } from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		let { limit, page } = SearchParamsToObject<{
			limit: string;
			page: string;
		}>(req.nextUrl.searchParams);

		const session = await BEHandler({ req });

		const ordersList = await Order.getOrdersIdFromUser(
			parseInt(session!.user!.id),
			limit,
			page,
		);
		const { list, currentPage, totalPage } = ordersList;

		return Response({
			list: list.map((x) => ({
				orderId: x.orderId,
				createdAt: x.createdAt,
				status: x.status,
				cancel: x.cancel,
				paymentMethod: x.paymentMethod,
			})),
			currentPage,
			totalPage,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
