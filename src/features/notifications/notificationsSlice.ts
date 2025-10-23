import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCount: 3, // mock value, replace with real logic later
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount(state, action) {
      state.unreadCount = action.payload;
    },
    markAllRead(state) {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, markAllRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
