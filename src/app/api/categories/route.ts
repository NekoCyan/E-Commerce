import Category from '@/app/models/Category';
import { CategoryData } from '@/app/models/interfaces';
import dbConnect from '@/lib/dbConnect';
import {
    ErrorResponse,
    IsNullOrUndefined,
    RequiredResponse,
    Response,
    SearchParamsToObject,
} from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const { limit, page } = SearchParamsToObject<{
			limit: string;
			page: string;
		}>(req.nextUrl.searchParams);

		await dbConnect();

		const categoryList = await Category.getCategoryList(
			limit ? parseInt(limit) : 20,
			page ? parseInt(page) : 1,
		);
		const { list, currentPage, totalPage } = categoryList;

		return Response({ list, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function POST(req: NextRequest) {
	try {
		await BEHandler({ req, adminRequired: true });

		const body: Partial<Pick<CategoryData, 'name' | 'description'>> =
			await req.json();
		let { name, description } = body;

		if (IsNullOrUndefined(name)) return RequiredResponse('name');

		const category = await Category.createCategory({
			name: name as string,
			description: description ?? '',
		});
		let { categoryId } = category;

		return Response({ categoryId });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
