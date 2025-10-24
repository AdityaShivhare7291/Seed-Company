import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accounts: [],
    loading: false,
    error: null,
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        fetchAccountsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAccountsSuccess: (state, action) => {
            state.accounts = action.payload;
            state.loading = false;
        },
        fetchAccountsFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addAccount: (state, action) => {
            state.accounts = [...action.payload];
        },
    },
});

export const {
    fetchAccountsStart,
    fetchAccountsSuccess,
    fetchAccountsFailure,
    addAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
