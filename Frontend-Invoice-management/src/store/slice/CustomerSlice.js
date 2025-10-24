import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customers: [],
    loading: false,
    error: null,
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        fetchCustomersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCustomersSuccess: (state, action) => {
            state.customers = action.payload;
            state.loading = false;
        },
        fetchCustomersFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addCustomer: (state, action) => {
            state.customers = [...action.payload];
        },
        updateCustomer: (state, action) => {
            state.customers = [...state.customers, action.payload]
        }
    },
});

export const {
    fetchCustomersStart,
    fetchCustomersSuccess,
    fetchCustomersFailure,
    addCustomer,
    updateCustomer
} = customerSlice.actions;

export default customerSlice.reducer;
