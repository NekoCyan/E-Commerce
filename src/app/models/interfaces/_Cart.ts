import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface CartData {
	userId: number;
	data: {
		productId: number;
		quantity: number;
	}[];
}
export interface ICart extends CartData, DocumentResult<CartData>, Document {}
export interface ICartMethods {}
export interface ICartModel extends Model<ICart, {}, ICartMethods> {
	// The second of return is whether the cart is modified or not.
	getCart(userId: number): Promise<
		[
			(
				| {
						productId: number;
						name: string;
						price: number;
						salePercentage: number;
						imageUrls: string[];
						quantity: number;
						stock: number;
				  }[]
				| null
			),
			boolean,
		]
	>;
	getCart(data: CartData['data']): Promise<
		[
			(
				| {
						productId: number;
						name: string;
						price: number;
						salePercentage: number;
						imageUrls: string[];
						quantity: number;
						stock: number;
				  }[]
				| null
			),
			boolean,
		]
	>;
	insertCart(
		userId: number,
		data: CartData['data'],
		type?: 'insert' | 'set', // set is to replace the cart product with the new data.
	): Promise<void>;
	deleteCart(userId: number): Promise<CartData['data'] | null>;
}
export type CartHydratedDocument = HydratedDocument<ICart, ICartMethods>;
