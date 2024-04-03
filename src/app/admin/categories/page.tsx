import getUrl from '@/utils/getUrl';
import Component from './component';

export default async function Page(props: any) {
	const fetchedCategories = await fetch(getUrl('/api/categories'), {
		cache: 'no-cache',
	});
	const { data } = await fetchedCategories.json();

	return <Component props={props} categories={data} />;
}