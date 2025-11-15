import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@/types";

export interface AddressState {
  items: Address[];
}

const initialState: AddressState = {
  items: [],
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.items = action.payload || [];
    },

    addAddress: (state, action: PayloadAction<Address>) => {
      state.items.unshift(action.payload);
    },

    updateAddress: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Address> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.items.findIndex((addr) => addr._id === id);

      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...data };
      }
    },

    deleteAddress: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((addr) => addr._id !== action.payload);
    },

    clearAddresses: (state) => {
      state.items = [];
    },
  },
});

export const {
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;
