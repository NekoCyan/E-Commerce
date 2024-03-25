import { NextRequest, NextResponse } from 'next/server';
import { BadRequestResponse, MiddlewareSession, ROUTES } from './utils';

const routePrefix = '/client';
const loginToAccess = ['/profile'];
const adminRoutePrefix = '/admin';
const adminAccess = ['/users'];

export async function middleware(req: NextRequest) {
	try {
		if (
			['POST', 'PUT', 'PATCH'].some((x) => x == req.method) &&
			!req.nextUrl.pathname.startsWith('/api/auth/')
		) {
			const reqText = await req.text();
			if (reqText.trim()) JSON.parse(reqText.trim());
			else throw new Error(`${req.method} must have body.`);
		}
	} catch (e) {
		return BadRequestResponse();
	}

	const pathName = req.nextUrl.pathname;
	// Idk why this is not working
	// const session = await getSession();
	const session = await MiddlewareSession(req);
	if (
		// In case no session.
		!session &&
		// Group all routes that require login.
		(loginToAccess.some((x) => pathName.startsWith(routePrefix + x)) ||
			adminAccess.some((x) => pathName.startsWith(adminRoutePrefix + x)))
	) {
		return NextResponse.redirect(new URL(ROUTES.Auth, req.nextUrl.origin));
	}

	if (
		// In case trying to access admin routes without admin role.
		session?.user?.role != 'ADMIN' &&
		adminAccess.some((x) => pathName.startsWith(adminRoutePrefix + x))
	) {
		return NextResponse.redirect(new URL('', req.nextUrl.origin));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/* https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|img/*|assets/*).*)',
		'/client/profile/:path*',
		'/admin/:path*',
	],
};
