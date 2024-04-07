import Product from '@/app/models/Product';
import { ProductData } from '@/app/models/interfaces';
import { PageProps } from '@/types';
import {
	ErrorResponse,
	InvalidResponse,
	InvalidTypeResponse,
	IsNullOrUndefined,
	Response,
	ResponseText
} from '@/utils';
import { BEHandler, isAdmin } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: PageProps<{ id: string }>,
) {
	try {
		let { id } = params;
		if (isNaN(parseInt(id))) return InvalidTypeResponse('id', 'number');
		const session = await BEHandler({ req, sessionRequired: false });

		const product = await Product.getProduct(parseInt(id));
		const {
			productId,
			name,
			description,
			details,
			price,
			stock,
			sold,
			isNewProduct,
			salePercentage,
			imageUrls,
			categoryIds,
			status,
		} = product;
		if (!isAdmin(session) && status === false) {
			throw ResponseText.NotExists(`Product with ID ${productId}`);
		}

		return Response({
			name,
			description,
			details,
			price,
			stock,
			sold,
			isNewProduct,
			salePercentage,
			imageUrls,
			categoryIds,
			status,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: PageProps<{ id: string }>,
) {
	try {
		await BEHandler({ req, adminRequired: true });

		let { id } = params;
		if (isNaN(parseInt(id))) return InvalidTypeResponse('id', 'number');
		const body: Partial<
			Pick<
				ProductData,
				| 'name'
				| 'description'
				| 'details'
				| 'price'
				| 'stock'
				| 'sold'
				| 'isNewProduct'
				| 'salePercentage'
				| 'imageUrls'
				| 'categoryIds'
				| 'status'
			>
		> = await req.json();
		let {
			name,
			description,
			details,
			price,
			stock,
			sold,
			isNewProduct,
			salePercentage,
			imageUrls,
			categoryIds,
			status,
		} = body;

		let obj: any = {};

		if (!IsNullOrUndefined(name)) {
			obj.name = name?.toString().trim();
		}
		if (!IsNullOrUndefined(description)) {
			obj.description = description?.toString().trim();
		}
		if (!IsNullOrUndefined(details)) {
			obj.details = details?.toString().trim();
		}
		if (!IsNullOrUndefined(price)) {
			obj.price = price;
		}
		if (!IsNullOrUndefined(stock)) {
			obj.stock = stock;
		}
		if (!IsNullOrUndefined(sold)) {
			obj.sold = sold;
		}
		if (!IsNullOrUndefined(isNewProduct)) {
			obj.isNewProduct = isNewProduct;
		}
		if (!IsNullOrUndefined(salePercentage)) {
			obj.salePercentage = salePercentage;
		}
		if (!IsNullOrUndefined(imageUrls)) {
			if (!Array.isArray(imageUrls)) return InvalidResponse('imageUrls');
			obj.imageUrls = imageUrls;
		}
		if (!IsNullOrUndefined(categoryIds)) {
			if (!Array.isArray(categoryIds))
				return InvalidResponse('categoryIds');
			obj.categoryIds = categoryIds;
		}
		if (!IsNullOrUndefined(status)) {
			obj.status = status;
		}

		const product = await Product.editProduct(parseInt(id), {
			...obj,
		});

		return Response({
			name: product.name,
			description: product.description,
			details: product.details,
			price: product.price,
			stock: product.stock,
			sold: product.sold,
			isNewProduct: product.isNewProduct,
			salePercentage: product.salePercentage,
			imageUrls: product.imageUrls,
			categoryIds: product.categoryIds,
			status: product.status,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: PageProps<{ id: string }>,
) {
	try {
		await BEHandler({ req, adminRequired: true });

		let { id } = params;
		if (isNaN(parseInt(id))) return InvalidTypeResponse('id', 'number');

		const product = await Product.deleteProduct(parseInt(id));
		const {
			name,
			description,
			details,
			price,
			stock,
			sold,
			isNewProduct,
			salePercentage,
			imageUrls,
			categoryIds,
			status,
		} = product;

		return Response({
			name,
			description,
			details,
			price,
			stock,
			sold,
			isNewProduct,
			salePercentage,
			imageUrls,
			categoryIds,
			status,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
