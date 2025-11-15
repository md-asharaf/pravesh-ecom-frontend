import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wishlist, Product } from "@/types";

export interface WishlistState {
  items: Partial<Product>[];
  totalItems: number;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<Wishlist>) => {
      state.items = action.payload.items || [];
      state.totalItems = state.items.length;
    },

    addToWishlist: (state, action: PayloadAction<Partial<Product>>) => {
      const exists = state.items.find((p) => p._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        state.totalItems = state.items.length;
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
      state.totalItems = state.items.length;
    },

    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
