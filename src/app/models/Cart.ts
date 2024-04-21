import { ResponseText } from '@/utils';
import mongoose from 'mongoose';
import Product from './Product';
import { CartData, ICart, ICartMethods, ICartModel } from './interfaces';

const CartSchema = new mongoose.Schema<ICart, ICartModel, ICartMethods>({
	userId: {
		type: Number,
		required: [true, ResponseText.Required('userId')],
	},
	data: [
		{
			productId: {
				type: Number,
				required: [true, ResponseText.Required('productId')],
			},
			quantity: {
				type: Number,
				default: 0,
			},
		},
	],
});

// statics.
CartSchema.static('getCart', async function (userId: string): Promise<
	ReturnType<ICartModel['getCart']>
> {
	let isChanged = false;

	const cart = await this.findOne({ userId });
	if (!cart) return [null, isChanged];

	let beforeModify = cart.data;

	const productIds = cart.data.map(({ productId }) => productId);
	const products = await Product.find({
		productId: { $in: productIds },
		status: true,
	})
		.select('productId stock')
		.lean()
		.exec();

	cart.data = cart.data.filter((x) => {
		return products.find((y) => y.productId === x.productId);
	}) as any;
	cart.data = cart.data.map((x) => {
		const product = products.find((y) => y.productId === x.productId)!;
		if (x.quantity > product.stock) x.quantity = product.stock;
		return x;
	}) as any;

	if (JSON.stringify(beforeModify) !== JSON.stringify(cart.data)) {
		isChanged = true;
		await cart.save();
	}

	return [cart.data, isChanged];
});
CartSchema.static(
	'insertCart',
	async function (
		userId: string,
		data: CartData['data'],
	): Promise<ReturnType<ICartModel['insertCart']>> {
		if (
			data.some(
				(x) =>
					typeof x.productId !== 'number' ||
					x.productId < 0 ||
					!Number.isInteger(x.productId),
			)
		)
			throw new Error(ResponseText.Invalid('productId'));
		if (
			data.some(
				(x) =>
					typeof x.quantity !== 'number' ||
					x.quantity < 0 ||
					!Number.isInteger(x.quantity),
			)
		)
			throw new Error(ResponseText.Invalid('quantity'));

		const cart = await this.findOne({ userId });
		if (!cart) {
			await this.create({ userId, data });
		} else {
			for (const { productId, quantity } of data) {
				const index = cart.data.findIndex(
					(x) => x.productId === productId,
				);
				if (index === -1) cart.data.push({ productId, quantity });
				else cart.data[index].quantity += quantity;
			}

			await cart.save();
		}
	},
);
CartSchema.static('deleteCart', async function (userId: string): Promise<
	ReturnType<ICartModel['deleteCart']>
> {
	const cart = await this.findOneAndDelete({ userId }, { new: false });
	if (!cart) return null;

	return cart.data;
});

// middlewares.
CartSchema.pre('save', async function (this: ICart, next) {
	next();
});

const Cart =
	(mongoose.models.Cart as ICartModel) ||
	mongoose.model<ICart, ICartModel>('Cart', CartSchema);

export default Cart;
