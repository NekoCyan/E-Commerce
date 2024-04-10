import Collection from '@/components/collection/Collection';
import HotDeal from '@/components/hotdeal/HotDeal';
import NewsLetter from '@/components/newsletter/NewsLetter';
import ProductShower from '@/components/product/productShower/ProductShower';
import { API, LimitArray, ShuffleArray } from '@/utils';
import getUrl from '@/utils/getUrl';

const collections: {
	name: string;
	imageURL: string;
	destinationHref: string;
}[] = [
	{
		name: 'Laptop',
		imageURL: '/img/shop01.png',
		destinationHref: '#',
	},
	{
		name: 'Accessories',
		imageURL: '/img/shop03.png',
		destinationHref: '#',
	},
	{
		name: 'Cameras',
		imageURL: '/img/shop02.png',
		destinationHref: '#',
	},
];

export default async function Home() {
	const fetchedCategories = await fetch(getUrl(API.CategoriesList), {
		next: {
			revalidate: 60,
		},
	});
	const { data } = await fetchedCategories.json();

	const categories = data.list;

	const limitCategoriesTabs =
		categories.length > 4
			? LimitArray(ShuffleArray(categories), 4)
			: categories;
	limitCategoriesTabs.unshift({
		categoryId: 0,
		name: 'All',
		description: '',
	});

	return (
		<div>
			<Collection collectionData={collections} />

			{/* Product Shower */}
			<ProductShower
				title='Featured Products'
				categories={categories}
				limitCategoriesTabs={limitCategoriesTabs}
			/>
			<HotDeal />
			{/* <ProductShower
				title='Top Selling'
				categories={data.list}
				customNavId='top-selling'
			/> */}
			<NewsLetter />
		</div>
	);
}
