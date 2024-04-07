import Collection from '@/components/collection/Collection';
import HotDeal from '@/components/hotdeal/HotDeal';
import NewsLetter from '@/components/newsletter/NewsLetter';
import ProductShower from '@/components/product/productShower/ProductShower';
import { API } from '@/utils';
import getUrl from '@/utils/getUrl';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Ocean Electro Shop',
};

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
		cache: 'no-cache',
	});
	const { data } = await fetchedCategories.json();

	const theList = data.list;
	theList.unshift({ categoryId: 0, name: 'All', description: '' });

	return (
		<div>
			<Collection collectionData={collections} />

			{/* Product Shower */}
			<ProductShower
				title='New Products'
				categories={theList}
				customNavId='new-products'
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
