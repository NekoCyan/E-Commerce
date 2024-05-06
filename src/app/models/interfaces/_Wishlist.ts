import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface WishlistData {
	userId: number;
	/**
	 * Product Ids
	 */
	productIds: number[];
}
export interface IWishlist
	extends WishlistData,
		DocumentResult<WishlistData>,
		Document {}
export interface IWishlistMethods {}
export interface IWishlistModel extends Model<IWishlist, {}, IWishlistMethods> {
	/**
	 * @returns true if product is added to wishlist, false if removed.
	 */
	toggleWishlist: (userId: number, productId: number) => Promise<boolean>;
	getWishlist: (userId: number) => Promise<number[]>;
}
export type WishlistHydratedDocument = HydratedDocument<
	IWishlist,
	IWishlistMethods
>;
