import Category from '@/app/models/Category';
import { CategoryData } from '@/app/models/interfaces';
import {
	ErrorResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
	SearchParamsToObject,
} from '@/utils';
import { BEHandler, isAdmin } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		let { limit, page } = SearchParamsToObject<{
			limit: string;
			page: string;
		}>(req.nextUrl.searchParams);

		const session = await BEHandler({ req, sessionRequired: false });
		if (!isAdmin(session) && limit === '-1') {
			limit = '';
		}

		const categoryList = await Category.getCategoryList(limit, page);
		const { list, currentPage, totalPage } = categoryList;

		return Response({
			list: list.map((x) => ({
				categoryId: x.categoryId,
				name: x.name,
				description: x.description,
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

		const body: Partial<Pick<CategoryData, 'name' | 'description'>> =
			await req.json();
		let { name, description } = body;

		if (IsNullOrUndefined(name)) return RequiredResponse('name');

		const category = await Category.createCategory({
			name: name?.trim() as string,
			description: description?.trim() ?? '',
		});
		let { categoryId } = category;

		return Response({ categoryId });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
