import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface OfflineRequest {
  type: string;
  payload?: any;
}

interface OfflineState {
  queue: OfflineRequest[];
}

const initialState: OfflineState = { queue: [] };

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    enqueue: (state, action: PayloadAction<OfflineRequest>) => {
      state.queue.push(action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
  },
});

export const { enqueue, clearQueue } = offlineSlice.actions;
export default offlineSlice.reducer;
