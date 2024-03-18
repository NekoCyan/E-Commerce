import mongoose from 'mongoose';
import { ISearch, ISearchMethods, ISearchModel } from './interfaces';

const SearchSchema = new mongoose.Schema<ISearch, ISearchModel, ISearchMethods>({
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
SearchSchema.statics.findSearchsByCriteria = async function (value: number, category: string): Promise<ISearch[]> {
    let query: any = {};

    if (value !== null && value !== undefined) {
        query.quantity = { $gt: value };
    }

    if (category) {
        query.category = category;
    }

    return this.find(query);
};

const Search =
	(mongoose.models.Search as ISearchModel) ||
	mongoose.model<ISearch, ISearchModel>('Search', SearchSchema);

export default Search;
