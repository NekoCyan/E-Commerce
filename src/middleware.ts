import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
