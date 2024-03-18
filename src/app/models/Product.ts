import mongoose from 'mongoose';
import { IProduct, IProductMethods, IProductModel } from './interfaces';

const ProductSchema = new mongoose.Schema<IProduct, IProductModel, IProductMethods>({
	name: {
		type: String,
		required: [true, `name is required`],
	},
	description: {
		type: String,
		required: [true, `Email is required`],
	},
	price: {
		type: Number,
		default:0,
	},
	quantity: {
		type: Number,
		default: 0,
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
ProductSchema.statics.findProductsByCriteria = async function (value: number, category: string): Promise<IProduct[]> {
    let query: any = {};

    if (value !== null && value !== undefined) {
        query.quantity = { $gt: value };
    }

    if (category) {
        query.category = category;
    }

    return this.find(query);
};

const Product =
	(mongoose.models.Product as IProductModel) ||
	mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;
