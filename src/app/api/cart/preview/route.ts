import Cart from '@/app/models/Cart';
import {
	ErrorResponse,
	InvalidResponse,
	InvalidTypeResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
} from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body: {
			data: {
				productId: number;
				quantity: number;
			}[];
		} = await req.json();
		let { data } = body;
		if (IsNullOrUndefined(data)) return RequiredResponse('data');
		if (!Array.isArray(data)) return InvalidTypeResponse('data', 'array');
		if (data.length !== 0) {
			if (
				data.some(
					(x) =>
						typeof x.productId !== 'number' ||
						x.productId < 0 ||
						!Number.isInteger(x.productId),
				)
			)
				return InvalidResponse('productId in data');
			if (
				data.some(
					(x) =>
						typeof x.quantity !== 'number' ||
						x.quantity < 0 ||
						!Number.isInteger(x.quantity),
				)
			)
				return InvalidResponse('quantity in data');
		}

		await BEHandler({ req, sessionRequired: false });

		const result = await Cart.getCart(data);

		return Response({
			isUnexpectedChange: result[1],
			data: result[0] ?? [],
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
