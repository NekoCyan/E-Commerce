'use client';

import { configureStore } from '@reduxjs/toolkit';
import CartsCountSlice from './cartsCount/CartsCountSlice';
import WishlistSlice from './wishlistCount/WishlistSlice';

export const store = configureStore({
	reducer: {
		cartCount: CartsCountSlice,
		wishlist: WishlistSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
export default store;
