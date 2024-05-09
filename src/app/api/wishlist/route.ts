import Wishlist from '@/app/models/Wishlist';
import {
	ErrorResponse,
	InvalidTypeResponse,
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

		// const count = await Cart.aggregate([
		// 	{ $match: { userId: parseInt(session.user!.id) } },
		// 	{ $unwind: '$data' },
		// 	{ $group: { _id: null, dataCount: { $sum: 1 } } },
		// ]);
		// if (count.length === 0) return Response({ count: 0 });
		// else return Response({ count: count[0]?.dataCount ?? 0 });

		const wishlist = await Wishlist.findOne({
			userId: parseInt(session.user!.id),
		});
		return Response({ data: wishlist?.productIds ?? [] });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body: {
			productId: number;
		} = await req.json();
		let { productId } = body;
		if (!productId) return RequiredResponse('productId');
		if (isNaN(productId)) return InvalidTypeResponse('productId', 'number');

		const session = (await BEHandler({
			req: req,
		})) as Session;

		const wishlist = await Wishlist.toggleWishlist(
			parseInt(session.user!.id),
			parseInt(productId as any),
		);

		return Response({
			status: wishlist,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
