import Cart from '@/app/models/Cart';
import { ErrorResponse, Response, UnauthorizedResponse } from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { Session } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const session = (await BEHandler({
			req: req,
		})) as Session;
		if (!session.user) return UnauthorizedResponse();

		const data = await Cart.getCart(parseInt(session.user.id));
		return Response({
			isUnexpectedChange: data[1],
			data: data[0] ?? [],
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
