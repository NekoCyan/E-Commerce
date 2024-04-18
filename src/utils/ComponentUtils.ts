import { Session } from 'next-auth';
import { NextRequest } from 'next/server';
import getUrl, { BASE_URL } from './getUrl';

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
	if (['', '/', '/client'].some((x) => x === path)) return '/client';
	if (path.startsWith('#')) return '#';
	if (!path.startsWith('client') || !path.startsWith('/client')) {
		path = `/client${path.startsWith('/') ? path : `/${path}`}`;
	}

	return path + (lastSlash ? '/' : '');
}

export function TransformAdminPath(path: string, lastSlash: boolean = false) {
	if (['', '/', '/admin'].some((x) => x === path)) return '/admin';
	if (path.startsWith('#')) return '#';
	if (!path.startsWith('admin') || !path.startsWith('/admin')) {
		path = `/admin${path.startsWith('/') ? path : `/${path}`}`;
	}

	return path + (lastSlash ? '/' : '');
}

export async function MiddlewareSession(
	req: NextRequest,
): Promise<Session | null> {
	try {
		const sessionCookie = BASE_URL.startsWith('https://')
			? '__Secure-next-auth.session-token'
			: 'next-auth.session-token';
		const authorizeCookie = req?.cookies?.get(sessionCookie)?.value ?? '';
		const headers = {
			'Content-Type': 'application/json',
			Cookie: `${sessionCookie}=${authorizeCookie}`,
			// Cookie: req.cookies.toString()
		};
		const res = await fetch(getUrl('/api/auth/session'), {
			headers,
			cache: 'no-store',
		});
		const session = (await res.json()) as Session;
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

export function MarkupHTML(markup: string) {
	markup = markup.replace(/(?:\r\n|\r|\n)/g, '<br />');

	return { __html: markup };
}

export function RehypeMarkdown(html: string) {
	html = html.replace(/(?:\r\n|\r|\n)/g, '\n&nbsp;');

	return html;
}
