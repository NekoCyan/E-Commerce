import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface wishlistState {
	value: number[];
}

const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState: {
		value: [],
	} as wishlistState,
	reducers: {
		set(state, action: PayloadAction<number[]>) {
			state.value = action.payload;
		},
		add(state, action: PayloadAction<number>) {
			if (state.value.includes(action.payload)) return;

			state.value.push(action.payload);
		},
		remove(state, action: PayloadAction<number>) {
			state.value = state.value.filter((x) => x !== action.payload);
		},
		toggle(state, action: PayloadAction<number>) {
			if (state.value.includes(action.payload)) {
				state.value = state.value.filter((x) => x !== action.payload);
			} else {
				state.value.push(action.payload);
			}
		},
	},
});

export const wishlistAction = wishlistSlice.actions;
export default wishlistSlice.reducer;
