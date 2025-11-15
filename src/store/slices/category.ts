import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";

export interface CategoryTreeState {
  tree: Category[];
  expanded: Record<string, boolean>; // for UI handling (optional)
}

const initialState: CategoryTreeState = {
  tree: [],
  expanded: {},
};

export const categoryTreeSlice = createSlice({
  name: "categoryTree",
  initialState,
  reducers: {
    setCategoryTree: (state, action: PayloadAction<Category[]>) => {
      state.tree = action.payload || [];
    },

    toggleCategory: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.expanded[id] = !state.expanded[id];
    },

    expandCategory: (state, action: PayloadAction<string>) => {
      state.expanded[action.payload] = true;
    },

    collapseCategory: (state, action: PayloadAction<string>) => {
      state.expanded[action.payload] = false;
    },

    clearCategoryTree: (state) => {
      state.tree = [];
      state.expanded = {};
    },
  },
});

export const {
  setCategoryTree,
  toggleCategory,
  expandCategory,
  collapseCategory,
  clearCategoryTree,
} = categoryTreeSlice.actions;

export default categoryTreeSlice.reducer;
