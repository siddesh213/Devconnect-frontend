import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [], // ✅ Empty array — prevents null.filter crash
  reducers: {
    addFeed: (state, action) => {
      // ✅ Always return array safely
      return Array.isArray(action.payload) ? action.payload : [];
    },

    removeUserFromFeed: (state, action) => {
      // ✅ Defensive guard
      if (!Array.isArray(state)) return [];
      return state.filter((user) => user._id !== action.payload);
    },

    removeFeed: () => {
      // ✅ Works like clearFeed, but same old name
      return [];
    },
  },
});

export const { addFeed, removeUserFromFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
