import mongoose from 'mongoose';
import { ICategory, ICategoryMethods, ICategoryModel } from './interfaces';

const CategorySchema = new mongoose.Schema<ICategory, ICategoryModel, ICategoryMethods>({
	name: {
		type: String,
		required: [true, `name is required`],
	},
	description: {
		type: String,
		required: [true, `description is required`],
	},
    imageUrl: {
		type: String,
		required: [true, `Link`],
	},
	createdAt: {
		type: Date,
		Default: Date.now,
	},
});
// statics.


const Category =
	(mongoose.models.Category as ICategoryModel) ||
	mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);

export default Category;