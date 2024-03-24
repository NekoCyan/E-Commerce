import dbConnect from '@/lib/dbConnect';
import { type NextRequest } from 'next/server';

import Counter from '@/app/models/Counter';
import { ErrorResponse, Response } from '@/utils';
import { BASE_URL } from '@/utils/getUrl';

export const revalidate = 0; // revalidate data immediately.

export async function GET(req: NextRequest) {
	try {
		await dbConnect();

		const testCounter = await Counter.getNextSequence('test', 'hihi');

		return Response({ data: testCounter, base_url: BASE_URL });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
