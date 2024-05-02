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
CartSchema.static(
	'getCart',
	async function (
		data: number | CartData['data'],
	): Promise<ReturnType<ICartModel['getCart']>> {
		let isChanged = false;
		let result: Awaited<ReturnType<ICartModel['getCart']>>[0] = [];

		let cart: CartData['data'] = [];
		let fetchedUser: any = null;
		if (typeof data === 'number') {
			fetchedUser = await this.findOne({ userId: data });
			if (!fetchedUser) return [null, isChanged];

			cart = fetchedUser.data;
		} else cart = data;

		// Create a deep copy of cart
		let beforeModify = JSON.parse(JSON.stringify(cart));

		const productIds = cart.map(({ productId }) => productId);
		const products = await Product.find({
			productId: { $in: productIds },
			status: true,
		})
			.select('productId name price salePercentage imageUrls stock')
			.lean()
			.exec();

		// Filter data that not in based.
		for (const data of cart) {
			const productIndex = products.findIndex(
				(x) => x.productId === data.productId,
			);
			const cartIndex = cart.indexOf(data);
			if (productIndex === -1) {
				cart.splice(cartIndex, 1);
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
				imageUrls: currentProduct.imageUrls,
				stock: currentProduct.stock,
			});
		}

		if (
			beforeModify.some((x: any) => {
				const checkCart = result.find(
					(y) => y.productId === x.productId,
				);
				if (!checkCart) return true;
				return checkCart.quantity !== x.quantity;
			})
		) {
			isChanged = true;

			if (fetchedUser) {
				fetchedUser.data = result.map((x) => ({
					productId: x.productId,
					quantity: x.quantity,
				}));
				fetchedUser.markModified('data');
				await fetchedUser.save();
			}
		}

		return [result, isChanged];
	},
);
CartSchema.static(
	'insertCart',
	async function (
		userId: string,
		data: CartData['data'],
		type: 'insert' | 'set' = 'insert',
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
			let isChanged = false;
			for (const { productId, quantity } of data) {
				const index = cart.data.findIndex(
					(x) => x.productId === productId,
				);
				if (index === -1) cart.data.push({ productId, quantity });
				else {
					if (type === 'insert')
						cart.data[index].quantity += quantity;
					else {
						if (quantity === 0) {
							cart.data.splice(index, 1);
						} else if (cart.data[index].quantity === quantity) {
							continue; // This will skip isChanged.
						} else {
							cart.data[index].quantity = quantity;
						}
					}
				}

				isChanged = true;
			}

			if (isChanged) await cart.save();
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
