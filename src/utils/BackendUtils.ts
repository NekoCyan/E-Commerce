import dbConnect from '@/lib/dbConnect';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { MiddlewareSession, ROUTES } from '.';

/**
 * @default
 * * req
 * * sessionRequired: true
 */
export async function BEHandler(options: {
	req: NextRequest;
	sessionRequired?: boolean;
}): Promise<Session | null> {
	options = {
		sessionRequired: true,
		...options,
	};
	await dbConnect();

	const session = await MiddlewareSession(options.req);
	if (options.sessionRequired && !session)
		throw NextResponse.redirect(
			new URL(ROUTES.Auth, options.req.nextUrl.origin),
		);
    
    return session;
}
