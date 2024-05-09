import Product from '@/app/models/Product';
import {
	ErrorResponse,
	InvalidResponse,
	InvalidTypeResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
} from '@/utils';
import { NextRequest } from 'next/server';

// This route is design for wishlist post.
export async function POST(req: NextRequest) {
	try {
		const body: {
			productIds: number[];
		} = await req.json();
		let { productIds } = body;
		if (IsNullOrUndefined(productIds))
			return RequiredResponse('productIds');
		if (!Array.isArray(productIds))
			return InvalidTypeResponse('productIds', 'array');
		if (
			productIds.some(
				(x) => typeof x !== 'number' || x < 0 || !Number.isInteger(x),
			)
		)
			return InvalidResponse('productIds');

		const fetchedProducts = await Product.find({
			productId: { $in: productIds },
			status: true,
		}).exec();
		const products = fetchedProducts.map((x) => {
			return {
				productId: x.productId,
				name: x.name,
				stock: x.stock,
				images: x.imageUrls,
			};
		});

		return Response({ data: products });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
