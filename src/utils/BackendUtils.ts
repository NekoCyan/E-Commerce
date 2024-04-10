import dbConnect from '@/lib/dbConnect';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { MiddlewareSession, ROUTES, ResponseText } from '.';

/**
 * @default
 * * req
 * * adminRequired: false
 * * sessionRequired: true
 */
export async function BEHandler(options: {
	req: NextRequest;
	adminRequired?: boolean;
	sessionRequired?: boolean;
}): Promise<Session | null> {
	options = {
		adminRequired: false,
		sessionRequired: true,
		...options,
	};
	await dbConnect();

	const session = await MiddlewareSession(options.req);
	if (options.sessionRequired && !session)
		throw NextResponse.redirect(
			new URL(ROUTES.Auth, options.req.nextUrl.origin),
		);

	if (options.adminRequired && !isAdmin(session)) {
		throw NextResponse.redirect(
			new URL(ROUTES.Auth, options.req.nextUrl.origin),
		);
	}

	return session;
}

export function isAdmin(session?: Session | null): boolean {
	return session?.user?.role === 'ADMIN';
}

export function ValidateForList(
	limit: any,
	page: any,
	allowUnlimited: boolean = false,
): { limit: number; page: number } {
	if (allowUnlimited && [-1, '-1'].some((x) => x === limit)) {
		return { limit: -1, page: 1 };
	}
	if (limit) {
		if (isNaN(limit))
			throw new Error(ResponseText.InvalidType('limit', 'number'));
		limit = Math.floor(Number(limit));
		if (limit < 1) throw new Error(ResponseText.InvalidPageNumber(limit));
	} else {
		limit = 20;
	}

	if (page) {
		if (isNaN(page))
			throw new Error(ResponseText.InvalidType('page', 'number'));
		page = Math.floor(Number(page));
		if (page < 1) throw new Error(ResponseText.InvalidPageNumber(page));
	} else {
		page = 1;
	}

	limit > 100 && (limit = 100);

	return { limit, page };
}
