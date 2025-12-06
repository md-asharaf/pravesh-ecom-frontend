import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cart";
import wishlistReducer from "./slices/wishlist";
import addressReducer from "./slices/address";
import categoryTreeReducer from "./slices/category";
import settingsReducer from "./slices/settings";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    categoryTree: categoryTreeReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
