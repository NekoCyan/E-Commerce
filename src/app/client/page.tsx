import Collection from '@/components/collection/Collection';
import HotDeal from '@/components/hotdeal/HotDeal';
import ProductShower from '@/components/product/ProductShower';
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

export default function Home() {
	return (
		<div>
			<Collection collectionData={collections} />

			{/* Product Shower */}
			<ProductShower
				title='New Products'
				categories={['All', 'Laptops', 'Smartphones']}
				customNavId='new-products'
			/>
			<HotDeal />
		</div>
	);
}
