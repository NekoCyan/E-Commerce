'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import { DocumentList } from '@/app/models/interfaces/ExternalDocument';
import { DragDrop, TextInput } from '@/components/boostrap';
import Modal from '@/components/modal/Modal';
import { APIResponse, PageProps } from '@/types';
import {
	API,
	IsDecimal,
	LimitArray,
	MultiStyles,
	ROUTES,
	SYMBOLS,
} from '@/utils';
import { GET, POST, PUT } from '@/utils/Request';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

let availableCategories: { id: string; name: string }[] = [];

export interface AdminProductsInsertProps {
	productData?: ProductData;
	props?: PageProps<
		{
			id?: string;
		},
		{
			callbackUrl?: string;
		}
	>;
}

export default function Component({
	productData,
	props,
}: Readonly<AdminProductsInsertProps>) {
	const router = useRouter();

	const [isLoaded, setIsLoaded] = useState(false);

	// State for the form fields
	const [error, setError] = useState<{ [key: string]: string }>({});
	const [fields, setFields] = useState<{
		name: string;
		description: string;
		details: string;
		price: string | number;
		stock: string | number;
		sale_percentage: string | number;
		is_new_product: boolean;
		publish: boolean;
	}>(
		productData
			? {
					name: productData.name,
					description: productData.description,
					details: productData.details,
					price: productData.price,
					stock: productData.stock,
					sale_percentage: productData.salePercentage,
					is_new_product: productData.isNewProduct,
					publish: productData.status,
			  }
			: ({} as any),
	);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [categories, setCategories] = useState<string[]>(
		productData ? productData.categoryIds.map((x) => x.toString()) : [],
	);
	const [linkInput, setLinkInput] = useState<string[]>(
		productData ? productData.imageUrls : [''],
	);

	// Modal for selecting categories
	const [searchingCategories, setSearchingCategories] = useState<string>('');
	const [exportCategories, setExportCategories] = useState<
		typeof availableCategories
	>([]);
	useEffect(() => {
		setExportCategories(
			availableCategories.filter((category) =>
				category.name
					.toLowerCase()
					.includes(searchingCategories.toLowerCase()),
			),
		);
	}, [searchingCategories]);

	// Action.
	const [isRequesting, setIsRequesting] = useState(false);
	const [isConfirmCancel, setIsConfirmCancel] = useState(false);
	const [isBlockButton, setIsBlockButton] = useState(false);

	// Validation.
	useEffect(() => {
		if (!isRequesting) return;
		setError({});

		let {
			name,
			description,
			details,
			price,
			stock,
			sale_percentage,
			is_new_product,
			publish,
		} = fields;

		let errorStacks: any = {};

		if (!name) errorStacks.name = 'Name is required';
		if (!price) errorStacks.price = 'Price is required';
		else if (isNaN(Number(price))) errorStacks.price = 'Invalid type';
		else if (Number(price) < 0) errorStacks.price = 'Must be positive';
		if (stock) {
			if (isNaN(Number(stock))) errorStacks.stock = 'Invalid type';
			else if (Number(stock) < 0 || IsDecimal(stock))
				errorStacks.stock = 'Invalid number';
		}
		if (sale_percentage) {
			if (isNaN(Number(sale_percentage)))
				errorStacks.sale_percentage = 'Invalid type';
			else if (Number(sale_percentage) < 0)
				errorStacks.sale_percentage = 'Must be positive';
			else if (Number(sale_percentage) > 100)
				errorStacks.sale_percentage = 'Must be less than 100';
		}
		if (Object.keys(errorStacks).length > 0) {
			setError(errorStacks);
			setIsRequesting(false);
			return;
		}

		if (productData) {
			PUT(API.ProductsEdit(productData.productId.toString()), {
				name,
				description,
				details,
				categories,
				price: price,
				stock: stock,
				isNewProduct: is_new_product,
				salePercentage: sale_percentage ?? 0,
				imageUrls: [...new Set(linkInput)].filter((x) => x),
				categoryIds: categories,
				status: publish,
			})
				.then((x) => {
					const data = x.data as APIResponse;
					if (!data.success) throw new Error(data.message);

					setIsBlockButton(true);
					const cb = props?.searchParams.callbackUrl;
					if (cb) {
						if (cb.startsWith('http')) window.location.href = cb;
						else router.push(cb);
					} else {
						router.push(ROUTES.AdminProducts);
					}
					router.refresh();
				})
				.catch((err) => {
					setError({ requested: err.message });
				})
				.finally(() => {
					setIsRequesting(false);
				});
		} else {
			POST(API.ProductsNew, {
				name,
				description,
				details,
				categories,
				price: price,
				stock: stock,
				isNewProduct: is_new_product,
				salePercentage: sale_percentage ?? 0,
				imageUrls: [...new Set(linkInput)].filter((x) => x),
				categoryIds: categories,
				status: publish,
			})
				.then((x) => {
					const data = x.data as APIResponse;
					if (!data.success) throw new Error(data.message);

					setIsBlockButton(true);
					router.push(ROUTES.AdminProducts);
					router.refresh();
				})
				.catch((err) => {
					setError({ requested: err.message });
				})
				.finally(() => {
					setIsRequesting(false);
				});
		}
	}, [isRequesting]);

	// Load the categories.
	useEffect(() => {
		if (isLoaded) return;
		setIsLoaded(true);

		fetchedCategories();
	}, []);

	const [isRefreshCategories, setIsRefreshCategories] = useState(false);
	const fetchedCategories = () => {
		if (isRefreshCategories) return;
		setIsRefreshCategories(true);

		GET(API.CategoriesList, {})
			.then((x) => {
				const data = x.data as APIResponse;
				if (!data.success) throw new Error(data.message);

				const transformer = (list: DocumentList<CategoryData>) => {
					return list.list.map((x) => {
						return {
							id: x.categoryId.toString(),
							name: x.name,
						};
					});
				};

				availableCategories = transformer(data.data as any);
				setExportCategories(availableCategories);

				const newFilterCategories = [...categories].filter((c) =>
					availableCategories.some((ac) => ac.id === c),
				);
				setCategories(newFilterCategories);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setIsRefreshCategories(false);
			});
	};

	const toggleCategory = (category: string) => {
		if (categories.includes(category)) {
			setCategories(categories.filter((c) => c !== category));
		} else {
			setCategories([...categories, category]);
		}
	};

	const onDragEnd = (result: any, type: 'categories' | 'link') => {
		if (!result.destination) return;
		if (['categories', 'link'].indexOf(type) === -1) return;

		const items = type === 'categories' ? categories : linkInput;

		const newItems = Array.from(items);
		const [reorderedItem] = newItems.splice(result.source.index, 1);
		newItems.splice(result.destination.index, 0, reorderedItem);

		if (type === 'categories') setCategories(newItems);
		else setLinkInput(newItems);
	};

	const handleAddCategory = () => {
		setIsCategoryModalOpen(true);
	};

	const handleApplyCategories = () => {
		setIsCategoryModalOpen(false);
	};

	// Function to handle change in input field
	const handleInputChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const { value } = event.target;
		const list = [...linkInput];
		list[index] = value;
		setLinkInput(list);
	};

	// Function to handle the addition of a new input field
	const handleAddClick = () => {
		setLinkInput([...linkInput, '']);
	};

	// Function to handle the removal of an input field
	const handleRemoveClick = (index: number) => {
		const list = [...linkInput];
		list.splice(index, 1);
		setLinkInput(list);
	};

	const handleFocus = (e: any) => {
		setError({ ...error, [e.target.id]: '' });
	};

	return (
		<Container>
			<div>
				<h3 className='m-0'>
					{productData
						? `Editing Product ID ${productData.productId}`
						: `New Product`}
				</h3>
			</div>
			<hr />
			<div className='flex md:flex-row flex-col pt-5 md:gap-10 gap-2'>
				<div className='col-md-6 col-sm-12 p-0'>
					<div className='form-group flex flex-col'>
						<label htmlFor='name'>
							Name*
							{error.name && (
								<i className='text-red-500'>
									{' '}
									{SYMBOLS.EN_DASH} {error.name}
								</i>
							)}
						</label>
						<TextInput
							id='name'
							placeholder='New product name...'
							className={error.name ? 'border-red-400' : ''}
							onChange={(e) =>
								setFields({ ...fields, name: e.target.value })
							}
							value={fields.name}
							onFocus={handleFocus}
						/>
					</div>
					<div className='form-group flex flex-col'>
						<label htmlFor='description'>
							Description
							{error.description && (
								<i className='text-red-500'>
									{' '}
									{SYMBOLS.EN_DASH} {error.description}
								</i>
							)}
						</label>
						<TextInput
							id='description'
							type='textarea'
							placeholder='Little about the product...'
							className={
								error.description ? 'border-red-400' : ''
							}
							onChange={(e) =>
								setFields({
									...fields,
									description: e.target.value,
								})
							}
							value={fields.description}
							onFocus={handleFocus}
						/>
					</div>
					<div className='form-group flex flex-col'>
						<label htmlFor='details'>
							Details
							{error.details && (
								<i className='text-red-500'>
									{' '}
									{SYMBOLS.EN_DASH} {error.details}
								</i>
							)}
						</label>
						<TextInput
							id='details'
							type='textarea'
							placeholder='Little about the product...'
							className={error.details ? 'border-red-400' : ''}
							onChange={(e) =>
								setFields({
									...fields,
									details: e.target.value,
								})
							}
							value={fields.details}
							onFocus={handleFocus}
						/>
					</div>
					<div className='form-group flex flex-col'>
						{/* <label htmlFor='categories'>
							Categories*
							{error.categories && (
								<i className='text-red-500'>
									{' '}
									{SYMBOLS.EN_DASH} {error.categories}
								</i>
							)}
						</label> */}
						<div className='categories'>
							<div className='flex flex-row gap-3'>
								<label
									htmlFor='categories'
									className='font-semibold'
								>
									Categories
								</label>
								<Link
									href='#'
									className={MultiStyles(
										isRefreshCategories
											? 'cursor-not-allowed opacity-50'
											: 'cursor-pointer',
									)}
									onClick={(e) => {
										e.preventDefault();
										fetchedCategories();
									}}
								>
									<i className='fa fa-refresh'></i>
								</Link>
							</div>
							<div className='category-input flex items-end'>
								{categories.length > 0 && (
									<DragDrop
										droppableId='categories'
										dropableClassName='flex flex-wrap self-center gap-2 rounded-xl p-1'
										draggableClassName='px-3 py-1 rounded-full inline-block'
										data={categories}
										direction='horizontal'
										onDragEnd={(e) =>
											onDragEnd(e, 'categories')
										}
									>
										{(
											provided,
											snapshot,
											providedDrop,
											snapshotDrop,
											item,
										) => (
											<Fragment>
												{availableCategories.find(
													(x) => x.id === item,
												)?.name ?? 'Unknown'}
												{!snapshotDrop.isDraggingOver && (
													<Link
														href='#'
														className='ml-2 cursor-pointer text-2xl'
														onClick={(e) => {
															e.preventDefault();
															toggleCategory(
																item,
															);
														}}
													>
														x
													</Link>
												)}
											</Fragment>
										)}
									</DragDrop>
								)}
								<button
									className='add-category bg-gray-200 text-gray-800 px-4 py-2 rounded-full ml-2'
									onClick={handleAddCategory}
								>
									{categories.length > 0 ? (
										<i className='fa fa-pencil'></i>
									) : (
										<i className='fa fa-plus'></i>
									)}
								</button>
							</div>
							{isCategoryModalOpen && (
								<Modal
									title='Categories Selection'
									className={
										exportCategories.length > 0
											? 'h-[400px]'
											: 'h-auto'
									}
									onClose={() => handleApplyCategories()}
								>
									<TextInput
										id='search-categories'
										placeholder='Search for specific categories...'
										className='mb-5'
										onChange={(e) =>
											setSearchingCategories(
												e.target.value,
											)
										}
									/>
									<hr />
									{exportCategories.length > 0 && (
										<ul className='flex flex-row flex-wrap justify-center items-center gap-8 h-[300px] overflow-y-scroll my-2'>
											{LimitArray(
												exportCategories,
												15,
											).map((category) => (
												<li
													key={category.id}
													className='p-auto m-0'
												>
													<label>
														<input
															type='checkbox'
															checked={categories.includes(
																category.id,
															)}
															onChange={() =>
																toggleCategory(
																	category.id,
																)
															}
														/>{' '}
														{category.name}
													</label>
												</li>
											))}
										</ul>
									)}
									{exportCategories.length > 15 && (
										<>
											<hr className='pt-2' />
											<h4 className='-mb-2'>
												And more{' '}
												{availableCategories.length -
													15}{' '}
												categories...
											</h4>
										</>
									)}
									{availableCategories.length === 0 &&
										exportCategories.length === 0 && (
											<h3 className='pt-10 text-center'>
												No categories found, go add
												first or refresh the list.
											</h3>
										)}
									{availableCategories.length !== 0 &&
										exportCategories.length === 0 && (
											<h3 className='pt-10 text-center'>
												No categories found with the
												search
											</h3>
										)}
								</Modal>
							)}
						</div>
					</div>
				</div>
				<div className='col-md-6 col-sm-12 p-0'>
					<div className='flex flex-row justify-between lg:justify-evenly'>
						<div className='form-group flex flex-col'>
							<label htmlFor='price'>
								Price*
								{error.price && (
									<i className='text-red-500'>
										{' '}
										{SYMBOLS.EN_DASH} {error.price}
									</i>
								)}
							</label>
							<div className='flex flex-row'>
								<TextInput
									id='price'
									type='number'
									placeholder='100'
									className={MultiStyles(
										'w-[140px] text-center',
										error.price ? 'border-red-400' : '',
									)}
									onChange={(e) =>
										setFields({
											...fields,
											price: e.target.value,
										})
									}
									value={fields.price?.toString()}
									onFocus={handleFocus}
									min={0}
								/>
								<p className='justify-self-center self-center border-gray-300 bg-gray-300 border-solid border-2 p-2 w-[30px] text-center rounded-r-md'>
									$
								</p>
							</div>
						</div>
						<div className='form-group flex flex-col'>
							<label htmlFor='stock'>
								Stock
								{error.stock && (
									<i className='text-red-500'>
										{' '}
										{SYMBOLS.EN_DASH} {error.stock}
									</i>
								)}
							</label>
							<div className='flex flex-row'>
								<TextInput
									id='stock'
									type='number'
									placeholder='0'
									className={MultiStyles(
										'w-[140px] text-center',
										error.stock ? 'border-red-400' : '',
									)}
									onChange={(e) =>
										setFields({
											...fields,
											stock: e.target.value,
										})
									}
									value={fields.stock?.toString()}
									onFocus={handleFocus}
									min={0}
								/>
							</div>
						</div>
					</div>
					<div className='flex flex-row justify-between lg:justify-evenly items-end lg:items-center'>
						<div className='col-sm-6 form-group flex flex-col'>
							<label htmlFor='sale_percentage'>
								% Sale
								{error.sale_percentage && (
									<i className='text-red-500'>
										{' '}
										{SYMBOLS.EN_DASH}{' '}
										{error.sale_percentage}
									</i>
								)}
							</label>
							<div className='flex flex-row'>
								<TextInput
									id='sale_percentage'
									type='number'
									placeholder='0'
									min={0}
									max={100}
									className={MultiStyles(
										'w-[80px] text-center',
										error.sale_percentage
											? 'border-red-400'
											: '',
									)}
									onChange={(e) =>
										setFields({
											...fields,
											sale_percentage: e.target.value,
										})
									}
									value={fields.sale_percentage?.toString()}
									onFocus={handleFocus}
								/>
								<p className='justify-self-center self-center border-gray-300 bg-gray-300 border-solid border-2 p-2 w-[30px] text-center rounded-r-md'>
									%
								</p>
							</div>
						</div>
						<div className='col-sm-3 form-group flex flex-col justify-center items-center text-center'>
							<label htmlFor='is_new_product'>New Product?</label>
							<input
								id='is_new_product'
								type='checkbox'
								className='w-[20px] h-[20px]'
								onChange={(e) =>
									setFields({
										...fields,
										is_new_product: e.target.checked,
									})
								}
								checked={!!fields.is_new_product}
							/>
						</div>
						<div className='col-sm-3 form-group flex flex-col justify-center items-center'>
							<label htmlFor='publish'>Publish?</label>
							<input
								id='publish'
								type='checkbox'
								className='w-[20px] h-[20px]'
								onChange={(e) =>
									setFields({
										...fields,
										publish: e.target.checked,
									})
								}
								checked={!!fields.publish}
							/>
						</div>
					</div>
					<div className='flex flex-col gap-1'>
						<label htmlFor='link'>
							Image Urls*
							{error.link && (
								<i className='text-red-500'>
									{' '}
									{SYMBOLS.EN_DASH} {error.link}
								</i>
							)}
						</label>
						<DragDrop
							droppableId='link'
							data={linkInput.map((_, index) => index)}
							direction='vertical'
							dropableClassName='flex flex-col w-full self-center gap-2 rounded-xl p-1'
							draggableClassName='flex flex-row items-center gap-2'
							onDragEnd={(e) => onDragEnd(e, 'link')}
						>
							{(
								provided,
								snapshot,
								providedDrop,
								snapshotDrop,
								item,
								itemIndex,
							) => (
								<Fragment>
									<i className='fa fa-bars cursor-move text-black text-3xl pl-3'></i>{' '}
									<TextInput
										placeholder='https://...'
										className=' p-1 w-full'
										onChange={(event) =>
											handleInputChange(
												itemIndex,
												event as any,
											)
										}
										value={linkInput[itemIndex]}
									/>
									{linkInput.length - 1 === itemIndex && (
										<button
											className='btn btn-success font-bold'
											onClick={handleAddClick}
										>
											+
										</button>
									)}
									{linkInput.length !== 1 && (
										<button
											className='btn btn-danger font-bold'
											onClick={() =>
												handleRemoveClick(itemIndex)
											}
										>
											{SYMBOLS.EN_DASH}
										</button>
									)}
								</Fragment>
							)}
						</DragDrop>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-5 my-5'>
				<div className='flex flex-row-reverse gap-4 sm:flex-col'>
					<button
						className={MultiStyles(
							'btn btn-primary w-[300px] mx-auto uppercase',
						)}
						disabled={isRequesting || isBlockButton}
						onClick={() => {
							setIsRequesting(true);
						}}
					>
						{productData
							? isRequesting
								? 'Updating...'
								: 'Update'
							: isRequesting
							? 'Creating...'
							: 'Create'}
					</button>
					<button
						className='btn btn-danger w-[300px] mx-auto uppercase'
						disabled={isRequesting || isBlockButton}
						onClick={() => {
							if (!isConfirmCancel) {
								setIsConfirmCancel(true);
							} else {
								const cb = props?.searchParams.callbackUrl;
								if (cb) {
									if (cb.startsWith('http'))
										window.location.href = cb;
									else router.push(cb);
								} else {
									router.back();
								}
							}
						}}
					>
						{isConfirmCancel ? `Press again to Cancel` : 'Cancel'}
					</button>
				</div>
				{error.requested && (
					<p className='text-red-500 text-2xl font-medium text-center'>
						Error: {error.requested}
					</p>
				)}
			</div>
		</Container>
	);
}
