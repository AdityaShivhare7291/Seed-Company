import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    receipts: [],
    loading: false,
    error: null,
};

const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {
        fetchReceiptsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchReceiptsSuccess: (state, action) => {
            state.receipts = action.payload;
            state.loading = false;
        },
        fetchReceiptsFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addReceipt: (state, action) => {
            state.receipts.push(action.payload);
        },
    },
});

export const {
    fetchReceiptsStart,
    fetchReceiptsSuccess,
    fetchReceiptsFailure,
    addReceipt,
} = receiptSlice.actions;

export default receiptSlice.reducer;
