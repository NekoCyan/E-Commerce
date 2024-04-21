'use client';

import { CategoryData, ProductData } from '@/app/models/interfaces';
import { DocumentList } from '@/app/models/interfaces/ExternalDocument';
import { TextInput } from '@/components/boostrap';
import Modal from '@/components/modal/Modal';
import ProductSearch from '@/components/product/productSearch/ProductSearch';
import ToolTip from '@/components/tooltip/ToolTip';
import { APIResponse, NekoResponse, PageProps } from '@/types';
import { API, LimitArray, MultiStyles, betweenResolveable } from '@/utils';
import { GET } from '@/utils/Request';
import debounce from 'lodash.debounce';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';

let antiReverseLoaded = false;
let availableCategories: { id: string; name: string }[] = [];
const initializedPriceRange = [1, 2999];

export default function Component({
	props,
	products,
	errorMsg,
	totalPage,
}: Readonly<{
	props: PageProps<
		{},
		Partial<{
			name: string;
			price: string;
			filterByCategories: string;
			inStock: string;
			page: string;
		}>
	>;
	products?: ProductData[];
	errorMsg?: string;
	totalPage?: number;
}>) {
	const router = useRouter();

	const [isRequesting, setIsRequesting] = useState(false);
	const [isLoadMore, setIsLoadMore] = useState(false);

	const debounceSearch = debounce(() => {
		setIsRequesting(true);
	}, 500);

	// State for the form fields
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<{ [key: string]: string }>({});
	const [fields, setFields] = useState<{
		name: string;
		price: string;
		filterByCategories: string;
		inStock: string;
		page: number;
	}>({
		name: props.searchParams.name ?? '',
		price: props.searchParams.price ?? '',
		filterByCategories: props.searchParams.filterByCategories ?? '',
		inStock: props.searchParams.inStock ?? '0',
		page: 1,
	});

	// Modal for selecting categories
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [categories, setCategories] = useState<string[]>(
		fields.filterByCategories
			.split(',')
			.map((x) => x.trim())
			.filter((x) => x && !isNaN(Number(x)))
			.map((x) => Math.floor(Number(x)).toString()),
	);
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

	// Loader (noUiSlider + fetchedCategories).
	useEffect(() => {
		if (loaded) antiReverseLoaded = false;

		if (antiReverseLoaded || loaded) return;
		antiReverseLoaded = true;
		setLoaded(true);
		let priceSlider = document.getElementById('price-slider');
		let inputDown = document.getElementById('price-min') as any;
		let inputUp = document.getElementById('price-max') as any;

		let priceRange: number[];
		if (
			fields.price &&
			betweenResolveable(fields.price, { checkOnly: true })
		) {
			priceRange = fields.price.split('-').map((x) => Number(x));
			if (priceRange.length !== 2)
				priceRange.unshift(Math.min(...initializedPriceRange));
		} else {
			priceRange = initializedPriceRange;
		}

		inputDown.value = priceRange[0];
		inputUp.value = priceRange[1];

		function updatePriceSlider(elem: any, value: any) {
			if (elem.hasClass('price-min')) {
				(priceSlider as any).noUiSlider.set([value, null]);
			} else if (elem.hasClass('price-max')) {
				(priceSlider as any).noUiSlider.set([null, value]);
			}
		}

		if (priceSlider) {
			fetchedCategories();

			(window as any).noUiSlider.create(priceSlider, {
				start: priceRange,
				connect: true,
				step: 1,
				range: {
					min: initializedPriceRange[0],
					max: initializedPriceRange[1],
				},
				behaviour: 'drag',
			});
			(priceSlider as any).noUiSlider.on(
				'update',
				function (values: any, handle: any) {
					var value = values[handle];
					if (handle === 0) {
						inputDown.value = parseInt(value);
					} else {
						inputUp.value = parseInt(value);
					}

					debounceSearch.cancel();
					debounceSearch();
				},
			);

			inputDown.addEventListener(
				'change',
				function (this: HTMLInputElement) {
					updatePriceSlider($(this).parent(), this.value);
				},
			);
			inputUp.addEventListener(
				'change',
				function (this: HTMLInputElement) {
					updatePriceSlider($(this).parent(), this.value);
				},
			);

			$('.input-number').each(function () {
				let $this = $(this),
					$input = $this.find('input[type="number"]'),
					up = $this.find('.qty-up'),
					down = $this.find('.qty-down');

				down.on('click', function () {
					var value = parseInt(($input as any).val()) - 1;
					value = value < 1 ? 1 : value;
					$input.val(value);
					$input.change();
					updatePriceSlider($this, value);
				});

				up.on('click', function () {
					var value = parseInt(($input as any).val()) + 1;
					$input.val(value);
					$input.change();
					updatePriceSlider($this, value);
				});
			});
		}
	}, [loaded]);

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

	useEffect(() => {
		const url = new URL(window.location.origin + window.location.pathname);
		const searchParams = url.searchParams;
		if (fields.name) searchParams.set('name', fields.name);
		if (categories.length > 0)
			searchParams.set('filterByCategories', categories.join(','));
		if (fields.inStock === '1') searchParams.set('inStock', '1');
		// price.
		let priceMin = document.getElementById('price-min') as any;
		let priceMax = document.getElementById('price-max') as any;
		searchParams.set('price', `${priceMin.value}-${priceMax.value}`);

		if (isRequesting) {
			router.push(url.toString());
			setFields({ ...fields, page: 1 });
			router.refresh();
			setIsRequesting(false);
		} else if (isLoadMore) {
			searchParams.set('page', (fields.page + 1).toString());
			GET(API.ProductsList + '?' + searchParams.toString(), {})
				.then((x) => {
					const data = x.data as NekoResponse<
						DocumentList<ProductData>
					>;
					if (!data.success) return;

					const newProducts = data.data.list;
					setFields({ ...fields, page: fields.page + 1 });
					products?.push(...newProducts);
				})
				.finally(() => {
					setIsLoadMore(false);
				});
		}
	}, [isRequesting, isLoadMore]);

	const handleFocus = (e: any) => {
		setError({ ...error, [e.target.id]: '' });
	};

	const toggleCategory = (category: string) => {
		if (categories.includes(category)) {
			setCategories(categories.filter((c) => c !== category));
		} else {
			setCategories([...categories, category]);
		}
	};

	const handleAddCategory = () => {
		setIsCategoryModalOpen(true);
	};

	const handleApplyCategories = () => {
		setIsCategoryModalOpen(false);
		setIsRequesting(true);
	};

	return (
		<Container className='my-5'>
			<div>
				<div className='flex flex-col justify-center gap-2 md:flex-row md:justify-start'>
					<div className='form-group col-md-6 col-sm-12 flex justify-center items-center gap-2'>
						<label htmlFor='search' className='m-0'>
							Search
						</label>
						<TextInput
							id='search'
							placeholder='Product name...'
							className={MultiStyles(
								'w-full h-[40px]',
								error.name ? 'border-red-400' : '',
							)}
							onChange={(e) => {
								setFields({
									...fields,
									name: e.target.value,
								});
								debounceSearch.cancel();
								debounceSearch();
							}}
							value={fields.name}
							onFocus={handleFocus}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									debounceSearch.cancel();
									setIsRequesting(true);
								}
							}}
						/>
					</div>
					<div className='form-group col-md-6 col-sm-12 flex justify-center items-center gap-5'>
						<label htmlFor='price' className='m-0 leading-10'>
							Price
						</label>
						<div>
							<div
								id='price-slider'
								className='mb-[15px] pl-2'
							></div>
							<div className='flex flex-row gap-5 justify-center items-center'>
								<div className='input-number price-min inline-block'>
									<input
										id='price-min'
										type='number'
										min={1}
									/>
									<button className='qty-up'>+</button>
									<button className='qty-down'>-</button>
								</div>
								<span className='text-5xl text-bold'>-</span>
								<div className='input-number price-max inline-block'>
									<input
										id='price-max'
										type='number'
										min={1}
									/>
									<button className='qty-up'>+</button>
									<button className='qty-down'>-</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-between gap-2 md:flex-row'>
					<div className='form-group col-md-9 mt-5 flex flex-col'>
						{/* <label htmlFor='categories'>
							Categories*
							{error.categories && (
								<i className='text-red-500'>
									{' '}
									{SYMBOLS.EN_DASH} {error.categories}
								</i>
							)}
						</label> */}
						<div className='flex flex-row items-center gap-3'>
							<div className='flex flex-row items-center gap-3'>
								<label
									htmlFor='categories'
									className='font-semibold m-0'
								>
									Categories
								</label>
								<ToolTip text='Refresh'>
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
								</ToolTip>
							</div>
							<div className='category-input flex flex-row items-center'>
								<div className='selected-categories flex items-center flex-wrap gap-2'>
									{categories.map((category) => (
										<div
											key={category}
											className='category-chip bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2'
										>
											{availableCategories.find(
												(x) => x.id === category,
											)?.name ?? 'Unknown'}
										</div>
									))}
								</div>
								<button
									className='add-category bg-gray-200 text-gray-800 px-3 py-1 rounded-full ml-2'
									onClick={handleAddCategory}
								>
									+
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
					<div className='flex flex-row col-sm-3 self-center items-center gap-2'>
						<label htmlFor='inStock' className='m-0'>
							In Stock
						</label>
						<input
							id='inStock'
							type='checkbox'
							className='m-0 w-10 h-10'
							checked={fields.inStock === '1'}
							onChange={(e) => {
								setFields({
									...fields,
									inStock: e.target.checked ? '1' : '0',
								});
								debounceSearch.cancel();
								setIsRequesting(true);
							}}
						/>
					</div>
				</div>
			</div>
			{errorMsg ? (
				<h4 className='text-center mt-14 text-red-500'>
					Error: {errorMsg}
				</h4>
			) : products && products?.length > 0 ? (
				<Fragment>
					<Row id='result' className='mb-10'>
						{products.map((product) => (
							<ProductSearch
								key={product.productId}
								productData={product}
								categories={exportCategories}
							/>
						))}
					</Row>
					<div className='pt-5 flex flex-col gap-4 text-center'>
						{totalPage &&
						totalPage > 1 &&
						fields.page < totalPage ? (
							<button
								className='btn btn-primary w-full p-5 uppercase'
								disabled={isLoadMore}
								onClick={() => {
									setIsLoadMore(true);
								}}
							>
								Load more
							</button>
						) : (
							<h4 className='m-0'>You catched all up ~</h4>
						)}
						<Link
							href='#'
							className='m-0 text-4xl text-red-400 w-auto'
							onClick={(e) => {
								e.preventDefault();
								window.scrollTo(0, 0);
							}}
						>
							BACK TO TOP
						</Link>
					</div>
				</Fragment>
			) : (
				<h3 className='text-center mt-14'>
					No product found as your filter, please try to use another
					keyword or filter type...
				</h3>
			)}
		</Container>
	);
}
