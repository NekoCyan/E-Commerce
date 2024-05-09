import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';
import { ProductData } from './_Product';

export interface OrderData {
	orderId: string;
	userId: number;
	products: (Pick<
		ProductData,
		'productId' | 'name' | 'price' | 'salePercentage' | 'imageUrls'
	> & { quantity: number })[];
	shipping: {
		fullName: string;
		email: string;
		phone: string;
		address: string;
		country: string;
		city: string;
		zip: string;
		note: string;
	};
	paymentMethod: 'cod' | 'paypal';
	status: 'pending' | 'processing' | 'shipped' | 'delivered';
	createdAt: Date;
	updatedAt: Date;
	/**
	 * If string is not empty string, then this cancel is reason.
	 */
	cancel: string;
}
export interface IOrder
	extends OrderData,
		DocumentResult<OrderData>,
		Document {}
export interface IOrderMethods {
	getOrderPrice: () => number;
}
export interface IOrderModel extends Model<IOrder, {}, IOrderMethods> {
	createOrder: (
		userId: number,
		products: OrderData['products'],
		info: Partial<OrderData['shipping']> & {
			paymentMethod: OrderData['paymentMethod'];
		},
	) => Promise<OrderHydratedDocument>;
	getOrder: (
		userId: number,
		orderId: string,
	) => Promise<OrderHydratedDocument | null>;
	getOrdersFromUser: (
		userId: number,
		limit?: string | number,
		page?: string | number,
	) => Promise<DocumentList<OrderData>>;
	getOrdersIdFromUser: (
		userId: number,
		limit?: string | number,
		page?: string | number,
	) => Promise<
		DocumentList<
			Pick<
				OrderData,
				| 'orderId'
				| 'createdAt'
				| 'status'
				| 'cancel'
				| 'paymentMethod'
				| 'products'
			> & {
				products: {
					productId: string;
					name: string;
					quantity: number;
				}[];
			}
		>
	>;
	cancelOrder: (orderId: string, reason: string) => Promise<boolean>;
	updateOrderStatus: (
		orderId: string,
		status: OrderData['status'],
	) => Promise<OrderHydratedDocument>;
}
export type OrderHydratedDocument = HydratedDocument<IOrder, IOrderMethods>;
