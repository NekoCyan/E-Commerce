import { ResponseText } from '@/utils';
import mongoose from 'mongoose';
import Product from './Product';
import { IWishlist, IWishlistMethods, IWishlistModel } from './interfaces';

const WishlistSchema = new mongoose.Schema<
	IWishlist,
	IWishlistModel,
	IWishlistMethods
>({
	userId: {
		type: Number,
		required: true,
	},
	productIds: {
		type: [Number],
		default: [],
	},
});

// statics.
WishlistSchema.static(
	'toggleWishlist',
	async function (
		userId: number,
		productId: number,
	): Promise<ReturnType<IWishlistModel['toggleWishlist']>> {
		const isProductExists = await Product.exists({ productId });
		if (!isProductExists)
			throw new Error(ResponseText.NotExists(`Product Id ${productId}`));

		const wishlist = await this.findOne({ userId });
		if (!wishlist) {
			await this.create({ userId, productIds: [productId] });
			return true;
		}

		let isAvailableNow = false;
		const index = wishlist.productIds.indexOf(productId);
		if (index === -1) {
			wishlist.productIds.push(productId);
			isAvailableNow = true;
		} else {
			wishlist.productIds.splice(index, 1);
		}

		wishlist.markModified('productIds');
		await wishlist.save();

		return isAvailableNow;
	},
);
WishlistSchema.static('getWishlist', async function (userId: number): Promise<
	ReturnType<IWishlistModel['getWishlist']>
> {
	const wishlist = await this.findOne({ userId });
	if (!wishlist) return [];

	return wishlist.productIds;
});

const Wishlist =
	(mongoose.models.Wishlist as IWishlistModel) ||
	mongoose.model<IWishlist, IWishlistModel>('Wishlist', WishlistSchema);

export default Wishlist;
