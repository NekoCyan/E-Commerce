import Link from 'next/link';

export default function ProductSearchPages({
	currentPage,
	totalPage,
}: Readonly<{
	currentPage: number;
	totalPage?: number;
}>) {
	totalPage = totalPage ?? 1;

	return (
		<div className='flex flex-row justify-end'>
			{currentPage > 1 && (
				<Link href={`/products?page=${currentPage - 1}`}>
					<a className='text-blue-500'>Previous</a>
				</Link>
			)}
			<span className='mx-3'>
				Page {currentPage} of {totalPage}
			</span>
		</div>
	);
}
