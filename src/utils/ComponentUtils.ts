import { Session } from 'next-auth';
import { NextRequest } from 'next/server';

export function MultiStyles(...styles: any[]) {
	return styles.filter((x) => x).join(' ');
}

export function FormatCurrency(
	price: number,
	prefix: string = '$',
	suffix: string = '',
) {
	return prefix + `${price.toFixed(2)}` + suffix;
}

export function Sleep(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function TransformClientPath(path: string, lastSlash: boolean = false) {
	if (path === '') return '/client';
	if (path.startsWith('#')) return '#';
	if (!path.startsWith('client') || !path.startsWith('/client')) {
		path = `/client${path.startsWith('/') ? path : `/${path}`}`;
	}

	return path + (lastSlash ? '/' : '');
}

export async function MiddlewareSession(
	req: NextRequest,
): Promise<Session | null> {
	try {
		const sessionCookie =
			process.env.NEXT_PUBLIC_URL?.startsWith('https://') ||
			process.env.NEXTAUTH_URL?.startsWith('https://')
				? '__Secure-next-auth.session-token'
				: 'next-auth.session-token';
		const authorizeCookie = req.cookies.get(sessionCookie)?.value ?? '';
		const headers = {
			'Content-Type': 'application/json',
			Cookie: `${sessionCookie}=${authorizeCookie}`,
			// Cookie: req.cookies.toString()
		};
		const res = await fetch(
			(process.env?.NEXT_PUBLIC_URL ?? process.env?.NEXTAUTH_URL) +
				'/api/auth/session',
			{
				headers,
				cache: 'no-store',
			},
		);
		const session = await res.json();
		if (
			typeof session === 'object' &&
			Object.keys(session?.user ?? {}).length > 0
		) {
			return session;
		}
		return null;
	} catch (e) {
		console.log('MiddlewareSession error', e);
		return null;
	}
}
