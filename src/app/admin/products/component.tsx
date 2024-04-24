'use client';

import { ProductData } from '@/app/models/interfaces';
import { SearchInput } from '@/components/boostrap';
import ToolTip from '@/components/tooltip/ToolTip';
import { PageProps } from '@/types';
import { ROUTES } from '@/utils';
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

			<div className='overflow-x-auto'>
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
								<td className='min-w-[200px] sm:w-full'>
									<p className='line-clamp-3'>{data.name}</p>
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
									<ToolTip text='Edit'>
										<Link
											href={ROUTES.AdminProductsEdit(
												data.productId.toString(),
											)}
										>
											<i className='fa fa-edit'></i>
										</Link>
									</ToolTip>
									<ToolTip text='Preview'>
										<Link
											href={
												ROUTES.AdminProductsPreview(
													data.productId.toString(),
												) + '#preview'
											}
										>
											<i className='fa fa-solid fa-eye'></i>
										</Link>
									</ToolTip>
									<ToolTip text='Delete'>
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
									</ToolTip>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
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
