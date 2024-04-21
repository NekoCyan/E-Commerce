import LocalStorage from './LocalStorage';

export default class CartStorage extends LocalStorage {
	constructor(localStorage: Storage) {
		super(localStorage);
	}

	getCart(): { productId: number; quantity: number }[] {
		const cart = localStorage.getItem('cart');
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

	addCartItem(productId: number, quantity: number): void {
		const cart = this.getCart();
		const item = cart.find((x) => x.productId === productId);
		if (item) {
			item.quantity += quantity;
		} else {
			cart.push({ productId, quantity });
		}
		localStorage.setItem('cart', JSON.stringify(cart));
	}

	setCartItem(productId: number, quantity: number): void {
		const cart = this.getCart();
		const item = cart.find((x) => x.productId === productId);
		if (item) {
			item.quantity = quantity;
		} else {
			cart.push({ productId, quantity });
		}
		localStorage.setItem('cart', JSON.stringify(cart));
	}

	clearCart(): void {
		localStorage.removeItem('cart');
	}
}
