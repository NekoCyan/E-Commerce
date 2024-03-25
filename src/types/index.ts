import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface User {
		id: string;
		fullName: string;
		keySession: string;
		role: ROLES;
		[key: string]: string;
	}

	interface Session extends DefaultSession {
		user?: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		fullName: string;
		keySession: string;
		role: ROLES;
		[key: string]: string;
	}
}

export type PageProps<
	T extends { [key: string]: string } = {},
	U extends URLSearchParams = URLSearchParams,
> = {
	params: T;
	searchParams: U;
};

export type DateTimeInput = Date | string | number;

export type APIResponse<T extends { [key: string]: any } = {}> = {
	message: string;
	code: number;
	success: boolean;
	data: T;
};

export type NekoResponse<T> = {
	message: string;
	code: number;
	success: boolean;
	data: T;
};

export type ROLES = 'ADMIN' | 'USER';
