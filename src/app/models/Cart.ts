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
	let result: Awaited<ReturnType<ICartModel['getCart']>>[0] = [];

	const cart = await this.findOne({ userId });
	if (!cart) return [null, isChanged];

	let beforeModify = cart.data;

	const productIds = cart.data.map(({ productId }) => productId);
	const products = await Product.find({
		productId: { $in: productIds },
		status: true,
	})
		.select('productId name price salePercentage stock')
		.lean()
		.exec();

	// Filter data that not in based.
	for (const data of cart.data) {
		const productIndex = products.findIndex(
			(x) => x.productId === data.productId,
		);
		const cartIndex = cart.data.indexOf(data);
		if (productIndex === -1) {
			cart.data.splice(cartIndex, 1);
			isChanged = true;
			continue;
		}

		const currentProduct = products[productIndex];
		if (data.quantity > currentProduct.stock) {
			data.quantity = currentProduct.stock;
			isChanged = true;
		}

		result.push({
			productId: data.productId,
			name: currentProduct.name,
			price: currentProduct.price,
			quantity: data.quantity,
			salePercentage: currentProduct.salePercentage,
		});
	}

	if (
		beforeModify.some((x) => {
			const checkCart = result.find((y) => y.productId === x.productId);
			if (!checkCart) return true;
			return checkCart.quantity !== x.quantity;
		})
	) {
		isChanged = true;
		cart.markModified('data');
		await cart.save();
	}

	return [result, isChanged];
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
