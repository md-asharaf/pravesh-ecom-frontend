import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem, Product } from "@/types";

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateSummary = (state: CartState) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.quantity * (item.product as any).finalPrice,
    0
  );
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.items = action.payload.items || [];
      calculateSummary(state);
    },

    addItem: (state, action: PayloadAction<Partial<Product>>) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      calculateSummary(state);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
      calculateSummary(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);

      if (item) {
        item.quantity = quantity < 1 ? 1 : quantity;
      }
      calculateSummary(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { setCart, addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
