'use client';

import { configureStore } from '@reduxjs/toolkit';
import CartsCountReducer from './cartsCount/CartsCountSlice';

export const store = configureStore({
	reducer: {
		cartCount: CartsCountReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
export default store;
