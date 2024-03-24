import { NextResponse, type NextRequest } from 'next/server';

import { ErrorResponse } from '@/utils';
import { BEHandler } from '@/utils/BackendUtils';

export const revalidate = 0; // revalidate data immediately.

export async function GET(req: NextRequest) {
	try {
		const session = await BEHandler({ req });

		return NextResponse.json(session);
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
