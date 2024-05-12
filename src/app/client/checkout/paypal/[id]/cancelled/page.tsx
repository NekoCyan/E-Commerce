import { PageProps } from '@/types';
import Component from './component';

export default async function Page(
	props: Readonly<
		PageProps<
			{
				id: string;
			},
			{ token: string }
		>
	>,
) {
	return <Component props={props} />;
}
