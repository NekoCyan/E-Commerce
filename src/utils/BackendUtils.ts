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

export function isAdmin(session: Session | null): boolean {
	return session?.user?.role === 'ADMIN';
}

export async function ValidateForList(
	limit: any = 20,
	page: any = 1,
): Promise<{ limit: number; page: number }> {
	if (typeof limit !== 'number')
		throw new Error(ResponseText.InvalidType('limit', 'number'));
	if (limit < 1) throw new Error(ResponseText.InvalidPageNumber(limit));

	if (typeof page !== 'number')
		throw new Error(ResponseText.InvalidType('page', 'number'));
	if (page < 1) throw new Error(ResponseText.InvalidPageNumber(page));

	limit > 100 && (limit = 100);

	return { limit, page };
}
