import LocalStorage from './LocalStorage';

export default class CartStorage extends LocalStorage {
	constructor(localStorage: Storage) {
		super(localStorage);
	}

	getCart(): { productId: number; quantity: number }[] {
		const cart = this.localStorage.getItem('cart');
		if (!cart) {
			this.localStorage.setItem('cart', '[]');
			return [];
		}
		return JSON.parse(cart);
	}

	getCartCount(): number {
		const cart = this.getCart();
		return cart.length;
	}

	addCartItem(productId: number | string, quantity: number): void {
		productId = parseInt(productId as string);
		const cart = this.getCart();
		const item = cart.find((x) => x.productId === productId);
		if (item) {
			item.quantity += quantity;
		} else {
			cart.push({ productId, quantity });
		}
		this.localStorage.setItem('cart', JSON.stringify(cart));
	}

	setCart(data: { productId: number; quantity: number }[]): void {
		this.localStorage.setItem('cart', JSON.stringify(data));
		this.revalidateCart();
	}

	setProductQuantity(productId: number, quantity: number): void {
		const cart = this.getCart();
		const item = cart.find((x) => x.productId === productId);
		if (item) {
			item.quantity = quantity;
			this.localStorage.setItem('cart', JSON.stringify(cart));
			this.revalidateCart();
		}
	}

	deleteProduct(productId: number): void {
		// Set quantity to 0 to delete product from cart
		this.setProductQuantity(productId, 0);
	}

	revalidateCart(): void {
		const allCarts = this.getCart();

		this.localStorage.setItem(
			'cart',
			JSON.stringify(allCarts.filter((x) => x.quantity > 0)),
		);
	}

	clearCart(): void {
		this.localStorage.removeItem('cart');
	}
}
