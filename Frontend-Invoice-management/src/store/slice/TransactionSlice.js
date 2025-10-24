import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions: [],
    loading: false,
    error: null,
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        fetchTransactionsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchTransactionsSuccess: (state, action) => {
            state.transactions = action.payload;
            state.loading = false;
        },
        fetchTransactionsFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addTransaction: (state, action) => {
            state.transactions.push(action.payload);
        },
    },
});

export const {
    fetchTransactionsStart,
    fetchTransactionsSuccess,
    fetchTransactionsFailure,
    addTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
