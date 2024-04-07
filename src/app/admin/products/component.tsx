'use client';

import { ProductData } from '@/app/models/interfaces';
import { SearchInput } from '@/components/boostrap';
import { PageProps } from '@/types';
import { ROUTES } from '@/utils';
import { Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Row, Table } from 'react-bootstrap';

export default function Component({
	props,
	products,
}: Readonly<{
	props: PageProps<{}, { action?: string; categoryId?: string }>;
	products: ProductData[];
}>) {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState('');
	const [exportProductFilter, setExportProductFilter] = useState(products);

	useEffect(() => {
		setExportProductFilter(
			products.filter((product) =>
				product.name.toLowerCase().includes(searchInput.toLowerCase()),
			),
		);
	}, [searchInput]);

	return (
		<Container className='h-auto'>
			<Row className='flex-1 flex-row items-baseline align-baseline justify-between pb-2'>
				<div className='col-md-6 col-sm-12'>
					<h3>Products Management</h3>
				</div>
				<div className='col-md-6 col-sm-12 flex flex-row justify-end gap-3'>
					<SearchInput
						id='search'
						placeholder='Search a product...'
						className='sm:w-[250px] md:w-[300px]'
						value={searchInput}
						onSearch={setSearchInput}
					/>
					<Link
						href={ROUTES.AdminProductsNew}
						className='btn btn-primary'
					>
						Add Product
					</Link>
				</div>
			</Row>

			<Table className='w-full'>
				<thead>
					<tr>
						<th className='text-center'>#</th>
						<th>Product Name</th>
						<th>Published?</th>
						<th className='text-center'>Action</th>
					</tr>
				</thead>
				<tbody>
					{exportProductFilter.map((data, index) => (
						<tr key={data.productId}>
							<td width={'1%'}>{index + 1}</td>
							<td className='w-full'>
								{data.name}
							</td>
							<td className='text-center'>
								<input
									key={data.productId}
									type='checkbox'
									className='w-[15px] h-[15px]'
									checked={data.status}
									readOnly={true}
								/>
							</td>
							<td className='flex flex-row gap-5'>
								<Tooltip
									className='bg-red-500 p-2 px-5 rounded-lg text-white'
									content='Edit'
									closeDelay={0}
								>
									<Link
										href={ROUTES.AdminProductsEdit(
											data.productId.toString(),
										)}
									>
										<i className='fa fa-edit'></i>
									</Link>
								</Tooltip>
								<Tooltip
									className='bg-red-500 p-2 px-5 rounded-lg text-white'
									content='Preview'
									closeDelay={0}
								>
									<Link
										href={
											ROUTES.AdminProductsPreview(
												data.productId.toString(),
											) + '#preview'
										}
									>
										<i className='fa fa-solid fa-eye'></i>
									</Link>
								</Tooltip>
								<Tooltip
									className='bg-red-500 p-2 px-5 rounded-lg text-white'
									content='Delete'
									closeDelay={0}
								>
									<Link
										href='#'
										onClick={(e) => {
											e.preventDefault();
											// router.push(
											// 	`?action=delete&categoryId=${data.categoryId}`,
											// );
										}}
									>
										<i className='fa fa-solid fa-trash'></i>
									</Link>
								</Tooltip>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{exportProductFilter.length === 0 && products.length !== 0 && (
				<h3 className='text-center py-10'>
					No product found with the keyword "{searchInput}"
				</h3>
			)}
			{exportProductFilter.length === 0 && products.length === 0 && (
				<h3 className='text-center py-10'>
					Product is empty, go add first
				</h3>
			)}
		</Container>
	);
}
