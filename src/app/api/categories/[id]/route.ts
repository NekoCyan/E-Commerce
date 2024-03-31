import Category from '@/app/models/Category';
import { CategoryData } from '@/app/models/interfaces';
import dbConnect from '@/lib/dbConnect';
import { PageProps } from '@/types';
import { ErrorResponse, InvalidTypeResponse, Response } from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';
import { NextRequest } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: PageProps<{ id: string }>,
) {
	try {
		let { id } = params;
		if (isNaN(parseInt(id))) return InvalidTypeResponse('id', 'number');

		await dbConnect();

		const category = await Category.getCategory(parseInt(id));
		let { categoryId, name, description } = category;

		return Response({ categoryId, name, description });
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
		const body: Partial<Pick<CategoryData, 'name' | 'description'>> =
			await req.json();
		let { name, description } = body;

		const category = await Category.editCategory(parseInt(id), {
			name,
			description,
		});

		return Response({
			categoryId: id,
			name: category.name,
			description: category.description,
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

		const category = await Category.deleteCategory(parseInt(id));
		let { categoryId, name, description } = category;

		return Response({ categoryId, name, description });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
