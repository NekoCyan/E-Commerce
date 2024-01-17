import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';

import Counter from '@/app/models/Counter';

export const revalidate = 0; // revalidate data immediately.

export async function GET(req: NextRequest) {
	try {
		await dbConnect();

		const testCounter = await Counter.getNextSequence('test', 'hihi');

		return NextResponse.json({ data: testCounter });
	} catch (e: any) {
		return NextResponse.json({ error: e.message });
	}
}
