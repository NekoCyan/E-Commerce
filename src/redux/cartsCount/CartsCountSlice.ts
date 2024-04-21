import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface CartsCountState {
	value: number;
}

const cartCountSlice = createSlice({
	name: 'cartCount',
	initialState: {
		value: 0,
	} as CartsCountState,
	reducers: {
		set: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
		},
		increment: (state, action: PayloadAction<number>) => {
			state.value += action.payload;
		},
		decrement: (state, action: PayloadAction<number>) => {
			state.value -= action.payload;
		},
	},
});

export const cartCountAction = cartCountSlice.actions;
export default cartCountSlice.reducer;
