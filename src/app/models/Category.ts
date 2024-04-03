import { ResponseText } from '@/utils';
import { ValidateForList } from '@/utils/BackendUtils';
import mongoose from 'mongoose';
import Counter from './Counter';
import {
	CategoryData,
	ICategory,
	ICategoryMethods,
	ICategoryModel,
} from './interfaces';

const CategorySchema = new mongoose.Schema<
	ICategory,
	ICategoryModel,
	ICategoryMethods
>(
	{
		categoryId: {
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
	},
	{
		timestamps: true,
	},
);

// statics.
CategorySchema.static(
	'isValidCategoryName',
	async function (this: ICategoryModel, name: string): Promise<boolean> {
		return !!(await this.exists({
			name: { $regex: `^${name}$`, $options: 'i' },
		}));
	},
);
CategorySchema.static(
	'getCategory',
	async function (
		categoryId: number,
	): Promise<ReturnType<ICategoryModel['getCategory']>> {
		const category = await this.findOne({ categoryId });
		if (!category)
			throw new Error(
				ResponseText.NotExists(`Category with ID ${categoryId}`),
			);

		return category;
	},
);
CategorySchema.static(
	'createCategory',
	async function (
		data: Omit<
			Partial<CategoryData> & Pick<CategoryData, 'name'>,
			'categoryId'
		>,
	): Promise<ReturnType<ICategoryModel['createCategory']>> {
		if (await this.isValidCategoryName(data.name!))
			throw new Error(ResponseText.Invalid('name'));

		return this.create(data);
	},
);
CategorySchema.static(
	'editCategory',
	async function (
		categoryId: number,
		data: Omit<Partial<CategoryData>, 'categoryId'>,
	): Promise<ReturnType<ICategoryModel['editCategory']>> {
		const category = await this.findOne({ categoryId: categoryId });
		if (!category)
			throw new Error(
				ResponseText.NotExists(`Category with ID ${categoryId}`),
			);
		if (data.name && (await this.isValidCategoryName(data.name)))
			throw new Error(ResponseText.Invalid('name'));

		if (data.name) category.name = data.name;
		if (data.description) category.description = data.description;

		await category.save();

		return category;
	},
);
CategorySchema.static(
	'deleteCategory',
	async function (
		categoryId: number,
	): Promise<ReturnType<ICategoryModel['deleteCategory']>> {
		const deletedCategory = await this.findOneAndDelete(
			{ categoryId },
			{ new: false },
		);
		if (!deletedCategory)
			throw new Error(
				ResponseText.NotExists(`Category with ID ${categoryId}`),
			);

		return deletedCategory;
	},
);
CategorySchema.static(
	'getCategoryList',
	async function (
		_limit: number = 20,
		_page: number = 1,
	): Promise<ReturnType<ICategoryModel['getCategoryList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		const totalDocument = await this.countDocuments();
		const totalPage = Math.ceil(totalDocument / limit);
		let listCategories;

		if (page > totalPage) {
			listCategories = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const getCategoryList = await this.aggregate()
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0 })
				.exec();

			listCategories = getCategoryList;
		}

		return {
			list: listCategories,
			currentPage: page,
			totalPage,
		};
	},
);

// middlewares.
CategorySchema.pre('save', async function (next) {
	const category = this as ICategory;
	if (category.isNew) {
		this.categoryId = await Counter.getNextSequence(Category, 'categoryId');
	}

	next();
});

const Category =
	(mongoose.models.Category as ICategoryModel) ||
	mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);

export default Category;
