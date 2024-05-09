import { IsDecimal, IsNullOrUndefined, ResponseText } from '@/utils';
import { ValidateForList } from '@/utils/BackendUtils';
import mongoose from 'mongoose';
import Category from './Category';
import Counter from './Counter';
import Wishlist from './Wishlist';
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
	details: {
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
		default: false,
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
		if (await this.isValidProductName(data.name))
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
		if (
			data.name &&
			product.name.toLowerCase() !== data.name.toLowerCase() &&
			(await this.isValidProductName(data.name))
		)
			throw new Error(ResponseText.Invalid('name'));

		if (data.name) product.name = data.name;
		if (!IsNullOrUndefined(data.description))
			product.description = data.description!;
		if (!IsNullOrUndefined(data.details)) product.details = data.details!;
		if (!IsNullOrUndefined(data.price)) product.price = data.price!;
		if (!IsNullOrUndefined(data.stock)) product.stock = data.stock!;
		if (!IsNullOrUndefined(data.isNewProduct))
			product.isNewProduct = data.isNewProduct!;
		if (!IsNullOrUndefined(data.salePercentage))
			product.salePercentage = data.salePercentage!;
		if (Array.isArray(data.imageUrls)) product.imageUrls = data.imageUrls;
		if (Array.isArray(data.categoryIds))
			product.categoryIds = data.categoryIds;
		if (!IsNullOrUndefined(data.status)) product.status = data.status!;

		await product.save();

		return product;
	},
);
ProductSchema.static(
	'deleteProduct',
	async function (
		productId: number,
	): Promise<ReturnType<IProductModel['deleteProduct']>> {
		const product = await this.findOneAndDelete(
			{ productId },
			{ new: false },
		);
		if (!product)
			throw new Error(
				ResponseText.NotExists(`Product with ID ${productId}`),
			);

		await Wishlist.updateMany(
			{ productIds: product.productId },
			{ $pull: { productIds: product.productId } },
		);

		return product;
	},
);
ProductSchema.static(
	'getProductList',
	async function (
		_limit: string | number,
		_page: string | number,
		filter?: {
			name?: string;
			price?: {
				from: number;
				to: number;
			};
			inStock?: boolean;
			category?: {
				Ids: number[];
				Type: 'AND' | 'OR';
			};
			status?: -1 | 0 | 1;
		},
	): Promise<ReturnType<IProductModel['getProductList']>> {
		const { limit, page } = ValidateForList(_limit, _page, true);

		// Validation.
		if (filter?.category) {
			if (!Array.isArray(filter.category.Ids)) filter.category.Ids = [];
			if (filter.category.Ids.some((x) => isNaN(x)))
				throw new Error(ResponseText.CategoriesValidationFailed);
			filter.category.Ids = [
				...new Set(
					filter.category.Ids.map((x) => Math.floor(Number(x))),
				),
			]; // remove duplicated.
			if (filter.category.Type !== 'AND' && filter.category.Type !== 'OR')
				filter.category.Type = 'AND';
		}

		// Matching.
		const matcher: any = {};
		if (filter?.name) {
			matcher['name'] = {
				$regex: filter.name,
				$options: 'i',
			};
		}
		if (filter?.price) {
			matcher['price'] = {
				$gte: filter.price.from,
				$lte: filter.price.to,
			};
		}
		if (filter?.inStock === true) {
			matcher['stock'] = {
				$gt: 0,
			};
		}
		if (filter?.category && filter.category.Ids.length > 0) {
			if (filter.category.Type === 'AND') {
				matcher['categoryIds'] = {
					$all: filter.category.Ids,
				};
			} else {
				matcher['categoryIds'] = {
					$in: filter.category.Ids,
				};
			}
		}
		if (filter?.status !== undefined && [0, 1].includes(filter.status)) {
			matcher['status'] = !!filter.status;
		}

		const totalDocument = await this.countDocuments(matcher);
		const totalPage =
			limit === -1 ? limit : Math.ceil(totalDocument / limit);
		let listProducts = [];

		if (totalPage === -1 || page <= totalPage) {
			const _getProductList = this.aggregate().project({ _id: 0 });

			// #region Populate Products.
			if (Object.keys(matcher).length > 0) _getProductList.match(matcher);

			if (limit !== -1) {
				// Skip and Limit will works like the following:
				// Get array from {skipFromPage} to {limitNext}.
				const limitNext = page * limit;
				const skipFromPage = limitNext - limit;
				_getProductList.limit(limitNext).skip(skipFromPage);
			}
			// #endregion

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
	const product = this;
	if (product.isNew) {
		this.productId = await Counter.getNextSequence(Product, 'categoryId');
	}

	if (product.isModified('name')) {
		if (await Product.isValidProductName(product.name))
			throw new Error(ResponseText.Invalid('name'));
	}
	if (product.isModified('description')) {
		if (typeof product.description !== 'string')
			throw new Error(ResponseText.Invalid('description'));
	}
	if (product.isModified('details')) {
		if (typeof product.details !== 'string')
			throw new Error(ResponseText.Invalid('details'));
	}
	if (product.isModified('price')) {
		if (isNaN(product.price))
			throw new Error(ResponseText.Invalid('price'));
		product.price = Number(product.price.toFixed(2));

		if (product.price < 0) throw new Error(ResponseText.Min('price', 0));
	}
	if (product.isModified('stock')) {
		if (isNaN(product.stock))
			throw new Error(ResponseText.Invalid('stock'));
		if (IsDecimal(product.stock))
			throw new Error(ResponseText.DecimalNotAllowed('stock'));
		product.stock = Number(product.stock);
		if (product.stock < 0) throw new Error(ResponseText.Min('stock', 0));
	}
	if (product.isModified('sold')) {
		if (isNaN(product.sold)) throw new Error(ResponseText.Invalid('sold'));
		if (IsDecimal(product.sold))
			throw new Error(ResponseText.DecimalNotAllowed('sold'));
		product.sold = Number(product.sold);
		if (product.sold < 0) throw new Error(ResponseText.Invalid('sold'));
	}
	if (product.isModified('salePercentage')) {
		if (isNaN(product.salePercentage))
			throw new Error(ResponseText.Invalid('salePercentage'));
		product.salePercentage = Number(product.salePercentage.toFixed(2));
		if (product.salePercentage < 0 || product.salePercentage > 100)
			throw new Error(ResponseText.OutOfRange('salePercentage', 0, 100));
	}
	if (product.isModified('imageUrls')) {
		if (!Array.isArray(product.imageUrls))
			throw new Error(ResponseText.Invalid('imageUrls'));
		if (product.imageUrls.length === 0)
			throw new Error(ResponseText.Required('At least one Image URL'));
	}
	if (product.isModified('categoryIds')) {
		if (!Array.isArray(product.categoryIds))
			throw new Error(ResponseText.Invalid('categoryIds'));
		const categories = await Category.find({
			categoryId: { $in: product.categoryIds },
		})
			.select('categoryId')
			.lean()
			.exec();
		if (categories.length !== product.categoryIds.length)
			throw new Error(ResponseText.CategoriesValidationFailed);
	}
	if (product.isModified('status')) {
		if (typeof product.status !== 'boolean')
			throw new Error(ResponseText.Invalid('status'));
	}

	next();
});

const Product =
	(mongoose.models.Product as IProductModel) ||
	mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;
