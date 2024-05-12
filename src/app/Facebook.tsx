'use client';

import { CustomChat, FacebookProvider } from 'react-facebook';

export default function Facebook() {
	return (
		<FacebookProvider appId='1815788815556230' chatSupport>
			<CustomChat pageId='108989770470910' />
		</FacebookProvider>
	);
}
