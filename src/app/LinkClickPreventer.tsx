'use client';

import { useEffect } from 'react';

export default function LinkClickPreventer() {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLAnchorElement;
			if (
				target.tagName === 'A' &&
				target.getAttribute('href')?.startsWith('#')
			) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		};

		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	return null;
}
