import { ResponseText, randomString } from '@/utils';
import { ValidateForList } from '@/utils/BackendUtils';
import mongoose from 'mongoose';
import { IOrder, IOrderMethods, IOrderModel, OrderData } from './interfaces';

const OrderSchema = new mongoose.Schema<IOrder, IOrderModel, IOrderMethods>({
	orderId: {
		type: String,
	},
	userId: {
		type: Number,
		required: true,
	},
	products: {
		type: [
			{
				productId: Number,
				name: String,
				price: Number,
				salePercentage: Number,
				imageUrls: [String],
				quantity: Number,
			},
		],
		required: true,
	},
	shipping: {
		fullName: String,
		email: String,
		phone: String,
		address: String,
		country: String,
		city: String,
		zip: String,
		note: String,
	},
	paymentMethod: {
		type: String,
		enum: ['cod', 'paypal'],
		required: true,
	},
	status: {
		type: String,
		enum: ['pending', 'processing', 'shipped', 'delivered'],
		default: 'pending',
	},
	cancel: {
		type: String,
		default: '',
	},
	createdAt: {
		type: Date,
	},
	updatedAt: {
		type: Date,
	},
});

// methods.
OrderSchema.methods = {
	getOrderPrice() {
		return this.products.reduce((acc, cur) => {
			return (
				acc +
				cur.price * ((100 - cur.salePercentage) / 100) * cur.quantity
			);
		}, 0);
	},
};

// statics.
OrderSchema.statics = {
	async createOrder(
		userId: number,
		products: OrderData['products'],
		info: Partial<OrderData['shipping']> & {
			paymentMethod: OrderData['paymentMethod'];
		},
	): Promise<ReturnType<IOrderModel['createOrder']>> {
		if (products?.length === 0)
			throw new Error(`Products when checkout cannot be empty.`);

		return this.create({
			userId,
			products,
			shipping: {
				fullName: info?.fullName ?? '',
				email: info?.email ?? '',
				phone: info?.phone ?? '',
				address: info?.address ?? '',
				country: info?.country ?? '',
				city: info?.city ?? '',
				zip: info?.zip ?? '',
				note: info?.note ?? '',
			},
			paymentMethod: info.paymentMethod,
		});
	},
	async getOrder(
		userId: number,
		orderId: string,
	): Promise<ReturnType<IOrderModel['getOrder']>> {
		return this.findOne({ userId, orderId });
	},
	async getOrdersFromUser(
		userId: number,
		_limit?: string | number,
		_page?: string | number,
	): Promise<ReturnType<IOrderModel['getOrdersFromUser']>> {
		const { limit, page } = ValidateForList(_limit, _page, false);

		const matcher = {
			userId: parseInt(userId.toString()),
		};

		const totalDocument = await this.countDocuments(matcher);
		const totalPage =
			limit === -1 ? limit : Math.ceil(totalDocument / limit);
		let listOrders: OrderData[] = [];

		if (totalPage === -1 || page <= totalPage) {
			const _getOrderList = this.aggregate().project({ _id: 0 });

			// #region Populate Products.
			if (Object.keys(matcher).length > 0) _getOrderList.match(matcher);

			if (limit !== -1) {
				// Skip and Limit will works like the following:
				// Get array from {skipFromPage} to {limitNext}.
				const limitNext = page * limit;
				const skipFromPage = limitNext - limit;
				_getOrderList.limit(limitNext).skip(skipFromPage);
			}
			// #endregion

			const getProductList = await _getOrderList.exec();
			listOrders = getProductList;
		}

		return {
			list: listOrders,
			currentPage: page,
			totalPage,
		};
	},
	async getOrdersIdFromUser(
		userId: number,
		_limit?: string | number,
		_page?: string | number,
	): Promise<ReturnType<IOrderModel['getOrdersFromUser']>> {
		const { limit, page } = ValidateForList(_limit, _page, false);

		const matcher = {
			userId: parseInt(userId.toString()),
		};

		const totalDocument = await this.countDocuments(matcher);
		const totalPage =
			limit === -1 ? limit : Math.ceil(totalDocument / limit);
		let listOrders: OrderData[] = [];

		if (totalPage === -1 || page <= totalPage) {
			const _getOrderList = this.aggregate().project({
				_id: 0,
				orderId: 1,
				createdAt: 1,
				status: 1,
				cancel: 1,
				paymentMethod: 1,
			});

			// #region Populate Products.
			if (Object.keys(matcher).length > 0) _getOrderList.match(matcher);

			if (limit !== -1) {
				// Skip and Limit will works like the following:
				// Get array from {skipFromPage} to {limitNext}.
				const limitNext = page * limit;
				const skipFromPage = limitNext - limit;
				_getOrderList.limit(limitNext).skip(skipFromPage);
			}
			// #endregion

			const getProductList = await _getOrderList.exec();
			listOrders = getProductList;
		}

		return {
			list: listOrders,
			currentPage: page,
			totalPage,
		};
	},
	async cancelOrder(
		orderId: string,
		reason: string,
	): Promise<ReturnType<IOrderModel['cancelOrder']>> {
		const order = await this.findOne({ orderId });
		if (!order)
			throw new Error(ResponseText.NotFound(`Order Id ${orderId}`));

		order.cancel = reason;
		order.updatedAt = new Date();

		order.markModified('cancel');
		order.markModified('updatedAt');

		await order.save();
		return true;
	},
	async updateOrderStatus(
		orderId: string,
		status: OrderData['status'],
	): Promise<ReturnType<IOrderModel['updateOrderStatus']>> {
		const order = await this.findOne({ orderId });
		if (!order)
			throw new Error(ResponseText.NotFound(`Order Id ${orderId}`));

		order.status = status;
		order.updatedAt = new Date();

		order.markModified('status');
		order.markModified('updatedAt');

		await order.save();
		return order;
	},
};

// middlewares.
OrderSchema.pre<IOrder>('save', async function (next) {
	if (this.isNew) {
		this.createdAt = new Date();
		this.updatedAt = new Date();

		let newOrderId = '';
		for (let i = 0; i < 5; i++) {
			newOrderId =
				randomString(3, {
					lowercase: false,
					numbers: false,
					specialChars: false,
					uppercase: true,
				}) + this.createdAt.getTime();

			if (await Order.exists({ orderId: newOrderId })) {
				newOrderId = '';
				continue;
			} else {
				break;
			}
		}

		if (!newOrderId) {
			throw new Error('Failed to generate orderId.');
		} else this.orderId = newOrderId;
	}

	if (this.shipping.fullName)
		this.shipping.fullName = this.shipping.fullName.trim();
	if (this.shipping.email) this.shipping.email = this.shipping.email.trim();
	if (this.shipping.phone) this.shipping.phone = this.shipping.phone.trim();
	if (this.shipping.address)
		this.shipping.address = this.shipping.address.trim();
	if (this.shipping.country)
		this.shipping.country = this.shipping.country.trim();
	if (this.shipping.city) this.shipping.city = this.shipping.city.trim();
	if (this.shipping.zip) this.shipping.zip = this.shipping.zip.trim();
	if (this.shipping.note) this.shipping.note = this.shipping.note.trim();

	if (this.cancel) this.cancel = this.cancel.trim();

	next();
});

const Order =
	(mongoose.models.Order as IOrderModel) ||
	mongoose.model<IOrder, IOrderModel>('Order', OrderSchema);

export default Order;
