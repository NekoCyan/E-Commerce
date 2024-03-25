import { PageProps } from '@/types';
import { ROUTES } from '@/utils';
import { Metadata } from 'next';
import Component from './component';

export const metadata: Metadata = {
	title: 'Ocean Electro | Credentials',
};

export default function Page({
	params,
	searchParams,
}: PageProps<{}, { callbackUrl: string; refresh: string }>) {
	const isRefresh =
		searchParams?.refresh === 'true' && searchParams?.callbackUrl
			? true
			: false;
	let callbackUrl: string | URL = ROUTES.Home;

	// When refresh, user will force to refresh app.
	if (searchParams?.callbackUrl) {
		callbackUrl = new URL(searchParams.callbackUrl);
		if (isRefresh) {
			callbackUrl.pathname = ROUTES.Auth;
			callbackUrl.searchParams.set(
				'callbackUrl',
				searchParams.callbackUrl,
			);
		} else {
			callbackUrl = searchParams.callbackUrl;
		}
	}

	return (
		<Component
			callbackUrl={callbackUrl.toString()}
			isRefresh={searchParams?.refresh === 'true' ? true : false}
		/>
	);
}
