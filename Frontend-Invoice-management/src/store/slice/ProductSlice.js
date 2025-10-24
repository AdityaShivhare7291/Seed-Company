import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [], // Array to store product data
    status: 'idle', // To track loading, success, or failure states
    error: null, // To store any errors during fetch
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = [...action.payload] ?? []; // Set products array in the state
        },
        updateProducts: (state, action) => {
            state.products = [...state.products, action.payload]
        },
        setLoading: (state) => {
            state.status = 'loading'; // Set status to loading when fetching
        },
        setError: (state, action) => {
            state.status = 'failed'; // Set status to failed if there is an error
            state.error = action.payload; // Store error message
        },
    },
});

// Export the actions to be dispatched
export const { setProducts, setLoading, setError, updateProducts } = productSlice.actions;

// Export the reducer to be added to the store
export default productSlice.reducer;
