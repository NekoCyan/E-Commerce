'use client';

import { ProductData } from '@/app/models/interfaces';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from 'react-bootstrap';

export default function Component({
	productData,
}: Readonly<{ productData: ProductData }>) {
	const router = useRouter();
	return (
		<Container id='preview' className='flex flex-col gap-2'>
			<div className='flex flex-col md:flex-row items-center justify-between gap-3'>
				<h3 className='m-0'>
					Preview Product ID {productData.productId}
				</h3>
				<Link
					href='#'
					className='btn btn-primary'
					onClick={(e) => {
						e.preventDefault();
						router.back();
					}}
				>
					Back to Previous Page
				</Link>
			</div>
			<hr />
			{productData.status === false && (
				<h4 className='text-center'>
					This page will not be found by User because{' '}
					<span className='text-red-500'>No Published</span>.
				</h4>
			)}
		</Container>
	);
}
