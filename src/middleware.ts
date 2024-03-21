import externalConfig from '@/../externalConfig.json';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: `/((?!${externalConfig.mainMatcher.toString()}).*)`,
};
