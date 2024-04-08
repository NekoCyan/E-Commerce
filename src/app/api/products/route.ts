import Product from '@/app/models/Product';
import { ProductData } from '@/app/models/interfaces';
import {
	CategoriesValidationFailedResponse,
	ErrorResponse,
	InvalidResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
	SearchParamsToObject,
} from '@/utils';
import { BEHandler, isAdmin } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		let {
			limit,
			page,
			filterByCategories,
			filterByCategoriesType,
			status,
		} = SearchParamsToObject<{
			limit: string;
			page: string;
			filterByCategories: string;
			filterByCategoriesType: string;
			status: string;
		}>(req.nextUrl.searchParams);

		const session = await BEHandler({ req, sessionRequired: false });
		if (!isAdmin(session) && limit === '-1') {
			limit = undefined;
		}
		
		let filter: any = {};

		if (filterByCategories) {
			const validateCategoriesNumber = filterByCategories
				?.split(',')
				.map((v) => v.trim())
				.every(
					(v) =>
						!isNaN(parseInt(v)) && // Check if the value is a number.
						!v.includes('.'), // Check if the value is not a float number.
				);
			if (!validateCategoriesNumber)
				return CategoriesValidationFailedResponse();

			filter.category = {
				Ids: filterByCategories.split(',').map((v) => parseInt(v)),
				Type: filterByCategoriesType as 'AND' | 'OR',
			};
		}
		if (status) {
			// Block user to get inactive products.
			if (!isAdmin(session)) filter.status = 1;
			else if (status === '0') filter.status = 0;
			else if (status === '1') filter.status = 1;
			else filter.status = -1;
		} else {
			filter.status = 1;
		}

		const productList = await Product.getProductList(limit, page, filter);
		const { list, currentPage, totalPage } = productList;

		return Response({
			list: list.map((x) => ({
				productId: x.productId,
				categoryIds: x.categoryIds,
				name: x.name,
				description: x.description,
				details: x.details,
				price: x.price,
				stock: x.stock,
				sold: x.sold,
				isNewProduct: x.isNewProduct,
				salePercentage: x.salePercentage,
				imageUrls: x.imageUrls,
				status: x.status,
			})),
			currentPage,
			totalPage,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function POST(req: NextRequest) {
	try {
		await BEHandler({ req, adminRequired: true });

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

		if (IsNullOrUndefined(name)) return RequiredResponse('name');
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

		const product = await Product.createProduct({
			name: name?.trim() as string,
			...obj,
		});
		let { productId } = product;

		return Response({ productId });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
