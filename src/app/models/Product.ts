import { IsDecimal, ResponseText } from '@/utils';
import { ValidateForList } from '@/utils/BackendUtils';
import mongoose from 'mongoose';
import Category from './Category';
import Counter from './Counter';
import { IProduct, IProductMethods, IProductModel } from './interfaces';

const ProductSchema = new mongoose.Schema<
	IProduct,
	IProductModel,
	IProductMethods
>({
	productId: {
		type: Number,
		unique: true,
	},
	name: {
		type: String,
		required: [true, ResponseText.Required('name')],
	},
	description: {
		type: String,
		default: '',
	},
	price: {
		type: Number,
		default: 0,
		min: [0, ResponseText.Min('price', 0)],
	},
	stock: {
		type: Number,
		default: 0,
		min: [0, ResponseText.Min('stock', 0)],
	},
	sold: {
		type: Number,
		default: 0,
		min: [0, ResponseText.Min('sold', 0)],
	},
	isNewProduct: {
		type: Boolean,
		default: false,
	},
	salePercentage: {
		type: Number,
		default: 0,
		min: [0, ResponseText.Min('salePercentage', 0)],
		max: [100, ResponseText.Max('salePercentage', 100)],
	},
	imageUrls: {
		type: [String],
		default: [],
	},
	categoryIds: {
		type: [Number],
		default: [],
	},
	status: {
		type: Boolean,
		default: true,
	},
});

// statics.
ProductSchema.static(
	'isValidProductName',
	async function (this: IProductModel, name: string): Promise<boolean> {
		return !!(await this.exists({
			name: { $regex: `^${name}$`, $options: 'i' },
		}));
	},
);
ProductSchema.static('getProduct', async function (productId: number): Promise<
	ReturnType<IProductModel['getProduct']>
> {
	const product = await this.findOne({ productId });
	if (!product)
		throw new Error(ResponseText.NotExists(`Product with ID ${productId}`));

	return product;
});
ProductSchema.static(
	'createProduct',
	async function (
		data: Omit<Partial<IProduct> & Pick<IProduct, 'name'>, 'productId'>,
	): Promise<ReturnType<IProductModel['createProduct']>> {
		if (await this.isValidProductName(data.name!))
			throw new Error(ResponseText.Invalid('name'));

		return this.create(data);
	},
);
ProductSchema.static(
	'editProduct',
	async function (
		productId: number,
		data: Omit<Partial<IProduct>, 'productId'>,
	): Promise<ReturnType<IProductModel['editProduct']>> {
		const product = await this.findOne({ productId });
		if (!product)
			throw new Error(
				ResponseText.NotExists(`Product with ID ${productId}`),
			);
		if (data.name && (await this.isValidProductName(data.name)))
			throw new Error(ResponseText.Invalid('name'));

		if (data.name) product.name = data.name;
		if (data.description) product.description = data.description;
		if (data.price) product.price = data.price;
		if (data.stock) product.stock = data.stock;
		if (typeof data.isNewProduct === 'boolean' && 'isNewProduct' in data)
			product.isNewProduct = data.isNewProduct;
		if (
			typeof data.salePercentage === 'boolean' &&
			'salePercentage' in data
		)
			product.salePercentage = data.salePercentage;
		if (
			Array.isArray(data.imageUrls) &&
			JSON.stringify(product.imageUrls) !== JSON.stringify(data.imageUrls)
		) {
			product.imageUrls = data.imageUrls;
			product.markModified('imageUrls');
		}
		if (
			Array.isArray(data.categoryIds) &&
			JSON.stringify(product.categoryIds) !==
				JSON.stringify(data.categoryIds)
		) {
			product.categoryIds = data.categoryIds;
			product.markModified('categoryIds');
		}
		if (typeof data.status === 'boolean' && 'status' in data)
			product.status = data.status;

		await product.save();

		return product;
	},
);
ProductSchema.static(
	'deleteProduct',
	async function (
		productId: number,
	): Promise<ReturnType<IProductModel['deleteProduct']>> {
		const product = await this.findOneAndDelete({ productId });
		if (!product)
			throw new Error(
				ResponseText.NotExists(`Product with ID ${productId}`),
			);

		return product;
	},
);
ProductSchema.static(
	'getProductList',
	async function (
		_limit: number = 20,
		_page: number = 1,
		filter?: {
			category?: {
				Ids: number[];
				Type: 'AND' | 'OR';
			};
			status?: -1 | 0 | 1;
		},
	): Promise<ReturnType<IProductModel['getProductList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		// Filter by categories.
		if (filter?.category) {
			if (!Array.isArray(filter.category.Ids)) filter.category.Ids = [];
			filter.category.Ids = [...new Set(filter.category.Ids)]; // remove duplicated.
			if (filter.category.Type !== 'AND' && filter.category.Type !== 'OR')
				filter.category.Type = 'AND';
		}

		const totalDocument = await this.countDocuments();
		const totalPage = Math.ceil(totalDocument / limit);
		let listProducts;

		if (page > totalPage) {
			listProducts = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const _getProductList = this.aggregate()
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0 });

			let match: any = {};

			if (filter?.category && filter.category.Ids.length > 0) {
				if (filter.category.Type === 'AND') {
					match.categoryIds = {
						$all: filter.category.Ids,
					};
				} else {
					match.categoryIds = {
						$in: filter.category.Ids,
					};
				}
			}
			if (
				filter?.status !== undefined &&
				[0, 1].includes(filter.status)
			) {
				match.status = !!filter.status;
			}

			if (Object.keys(match).length > 0) _getProductList.match(match);
			const getProductList = await _getProductList.exec();

			listProducts = getProductList;
		}

		return {
			list: listProducts,
			currentPage: page,
			totalPage,
		};
	},
);

// middlewares.
ProductSchema.pre('save', async function (this: IProduct, next) {
	const product = this as IProduct;
	if (product.isNew) {
		this.productId = await Counter.getNextSequence(Product, 'categoryId');
	}

	if (product.isModified('price')) {
		if (product.price < 0) throw new Error(ResponseText.Invalid('price'));
		product.price = Number(product.price.toFixed(2));
	}
	if (product.isModified('stock')) {
		if (product.stock < 0) throw new Error(ResponseText.Invalid('stock'));
		if (IsDecimal(product.stock))
			throw new Error(ResponseText.DecimalNotAllowed('stock'));
	}
	if (product.isModified('sold')) {
		if (product.sold < 0) throw new Error(ResponseText.Invalid('sold'));
		if (IsDecimal(product.sold))
			throw new Error(ResponseText.DecimalNotAllowed('sold'));
	}
	if (product.isModified('salePercentage')) {
		if (product.salePercentage < 0 || product.salePercentage > 100)
			throw new Error(ResponseText.OutOfRange('salePercentage', 0, 100));
		product.salePercentage = Number(product.salePercentage.toFixed(2));
	}
	if (product.isModified('categoryIds')) {
		const categories = await Category.find({
			categoryId: { $in: product.categoryIds },
		})
			.lean()
			.exec();
		if (categories.length !== product.categoryIds.length)
			throw new Error(ResponseText.CategoriesValidationFailed);
	}

	next();
});

const Product =
	(mongoose.models.Product as IProductModel) ||
	mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;
