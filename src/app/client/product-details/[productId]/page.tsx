import BreadCrumb from '@/components/breadcrumb/BreadCrumb';
import { PageProps } from '@/types';

const breadcrumbNav = [
	{
		name: 'Home',
		url: '#',
	},
	{
		name: 'Products',
		url: '#',
	},
	{
		name: 'Laptop GTX',
		url: '#',
	},
];
export default function Page({
	params,
	searchParams,
}: PageProps<{ productId: string }>) {
	// if (isNaN(Number(params.productId))) notFound();
	return (
		<div>
			<BreadCrumb navigation={breadcrumbNav} />
			{/* <ProductDetails productId={params.productId} /> */}
		</div>
	);
}
