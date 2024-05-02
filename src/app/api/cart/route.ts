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
import { Session } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const session = (await BEHandler({
			req: req,
		})) as Session;

		const result = await Cart.getCart(parseInt(session.user!.id));
		return Response({
			isUnexpectedChange: result[1],
			data: result[0] ?? [],
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

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

		const session = (await BEHandler({
			req: req,
		})) as Session;
		await Cart.insertCart(parseInt(session.user!.id), data);

		const count = await Cart.findOne({
			userId: parseInt(session.user!.id),
		});
		return Response({ count: count?.data.length ?? 0 });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body: {
			productId: number;
			quantity: number;
		} = await req.json();
		let { productId, quantity } = body;
		if (IsNullOrUndefined(productId)) return RequiredResponse('productId');
		if (IsNullOrUndefined(quantity)) return RequiredResponse('quantity');
		if (
			typeof productId !== 'number' ||
			productId <= 0 ||
			!Number.isInteger(productId)
		)
			return InvalidResponse('productId');
		if (
			typeof quantity !== 'number' ||
			quantity < 0 ||
			!Number.isInteger(quantity)
		)
			return InvalidResponse('quantity');

		// Avoid input frontend wrong data type.
		productId = Math.floor(productId);
		quantity = Math.floor(quantity);

		const session = (await BEHandler({
			req: req,
		})) as Session;
		await Cart.insertCart(
			parseInt(session.user!.id),
			[{ productId, quantity }],
			'set',
		);

		const count = await Cart.findOne({
			userId: parseInt(session.user!.id),
		});
		return Response({ count: count?.data.length ?? 0 });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
